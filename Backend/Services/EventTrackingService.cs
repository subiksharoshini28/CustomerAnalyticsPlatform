using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using CustomerAnalytics.Api.DTOs;
using CustomerAnalytics.Api.Models;
using CustomerAnalytics.Api.Repositories;
using CustomerAnalytics.Api.Azure;

namespace CustomerAnalytics.Api.Services;

public interface IEventTrackingService
{
    Task TrackEventAsync(TrackEventDto dto, int customerId);
    Task<IEnumerable<ActivityTimelineDto>> GetCustomerTimelineAsync(int customerId);
    Task<CustomerJourneyDto> GetCustomerJourneyAsync(int customerId);
}

public class EventTrackingService : IEventTrackingService
{
    private readonly IEventRepository _eventRepository;
    private readonly IAzureEventHubService _eventHubService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public EventTrackingService(
        IEventRepository eventRepository,
        IAzureEventHubService eventHubService,
        IHttpContextAccessor httpContextAccessor)
    {
        _eventRepository = eventRepository;
        _eventHubService = eventHubService;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task TrackEventAsync(TrackEventDto dto, int customerId)
    {
        var httpContext = _httpContextAccessor.HttpContext;

        var interaction = new CustomerInteraction
        {
            CustomerId = customerId,
            Channel = dto.Channel,
            Action = dto.Action,
            Timestamp = DateTime.UtcNow,
            Device = dto.Device ?? GetDeviceFromUserAgent(httpContext?.Request.Headers["User-Agent"].ToString()),
            Browser = dto.Browser ?? GetBrowserFromUserAgent(httpContext?.Request.Headers["User-Agent"].ToString()),
            Location = dto.Location,
            ProductId = dto.ProductId,
            Metadata = dto.Metadata,
            SessionId = dto.SessionId,
            Referrer = dto.Referrer
        };

        await _eventRepository.CreateAsync(interaction);

        // Send event to Azure Event Hub for real-time processing
        await _eventHubService.SendEventAsync(dto, customerId);
    }

    public async Task<IEnumerable<ActivityTimelineDto>> GetCustomerTimelineAsync(int customerId)
    {
        var interactions = await _eventRepository.GetByCustomerIdAsync(customerId, 50);

        return interactions.Select(i => new ActivityTimelineDto
        {
            Timestamp = i.Timestamp,
            Action = i.Action,
            Channel = i.Channel,
            Details = i.Metadata,
            ProductName = i.ProductId?.ToString()
        });
    }

    public async Task<CustomerJourneyDto> GetCustomerJourneyAsync(int customerId)
    {
        var interactions = await _eventRepository.GetByCustomerIdAsync(customerId, 100);

        var journeySteps = interactions
            .OrderBy(i => i.Timestamp)
            .GroupBy(i => new { i.Action, i.Channel })
            .Select(g => new JourneyStepDto
            {
                Action = g.Key.Action,
                Channel = g.Key.Channel,
                Timestamp = g.Min(i => i.Timestamp),
                Count = g.Count()
            })
            .ToList();

        // Calculate dropoff rates
        for (int i = 0; i < journeySteps.Count - 1; i++)
        {
            var currentCount = journeySteps[i].Count;
            var nextCount = journeySteps[i + 1].Count;
            journeySteps[i].DropoffRate = currentCount > 0 
                ? (decimal)(currentCount - nextCount) / currentCount * 100 
                : 0;
        }

        var purchases = interactions.Count(i => i.Action == "Purchase");
        var totalInteractions = interactions.Count();

        return new CustomerJourneyDto
        {
            Steps = journeySteps,
            ConversionRate = totalInteractions > 0 ? (decimal)purchases / totalInteractions * 100 : 0,
            AverageDuration = interactions.Count() > 1 
                ? interactions.Last().Timestamp - interactions.First().Timestamp 
                : TimeSpan.Zero
        };
    }

    private static string GetDeviceFromUserAgent(string? userAgent)
    {
        if (string.IsNullOrEmpty(userAgent)) return "Unknown";
        
        if (userAgent.Contains("Mobile") || userAgent.Contains("Android") || userAgent.Contains("iPhone"))
            return "Mobile";
        if (userAgent.Contains("Tablet") || userAgent.Contains("iPad"))
            return "Tablet";
        return "Desktop";
    }

    private static string GetBrowserFromUserAgent(string? userAgent)
    {
        if (string.IsNullOrEmpty(userAgent)) return "Unknown";
        
        if (userAgent.Contains("Chrome")) return "Chrome";
        if (userAgent.Contains("Firefox")) return "Firefox";
        if (userAgent.Contains("Safari")) return "Safari";
        if (userAgent.Contains("Edge")) return "Edge";
        return "Other";
    }
}
