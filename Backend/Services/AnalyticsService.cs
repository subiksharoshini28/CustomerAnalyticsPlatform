using CustomerAnalytics.Api.DTOs;
using CustomerAnalytics.Api.Repositories;

namespace CustomerAnalytics.Api.Services;

public interface IAnalyticsService
{
    Task<CustomerJourneyDto> GetCustomerJourneyAsync(int customerId);
    Task<IEnumerable<ChurnPredictionDto>> GetChurnPredictionsAsync();
    Task<IEnumerable<CustomerSegmentDto>> GetCustomerSegmentsAsync();
    Task<IEnumerable<CohortAnalysisDto>> GetCohortAnalysisAsync();
    Task<Dictionary<string, decimal>> GetConversionFunnelAsync();
    Task<IEnumerable<ChannelPerformanceDto>> GetChannelPerformanceAsync();
    Task<IEnumerable<HeatmapDataDto>> GetHeatmapDataAsync();
    Task<IEnumerable<ActivityTimelineDto>> GetRecentActivityAsync(int count);
}

public class AnalyticsService : IAnalyticsService
{
    private readonly ICustomerRepository _customerRepository;
    private readonly IEventRepository _eventRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly ICampaignRepository _campaignRepository;

    public AnalyticsService(
        ICustomerRepository customerRepository,
        IEventRepository eventRepository,
        IOrderRepository orderRepository,
        ICampaignRepository campaignRepository)
    {
        _customerRepository = customerRepository;
        _eventRepository = eventRepository;
        _orderRepository = orderRepository;
        _campaignRepository = campaignRepository;
    }

    public async Task<CustomerJourneyDto> GetCustomerJourneyAsync(int customerId)
    {
        var interactions = await _eventRepository.GetByCustomerIdAsync(customerId, 200);

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

        return new CustomerJourneyDto
        {
            Steps = journeySteps,
            ConversionRate = interactions.Any() 
                ? (decimal)interactions.Count(i => i.Action == "Purchase") / interactions.Count() * 100 
                : 0
        };
    }

    public async Task<IEnumerable<ChurnPredictionDto>> GetChurnPredictionsAsync()
    {
        var customers = await _customerRepository.GetAllAsync(1, 100);

        return customers.Select(c => new ChurnPredictionDto
        {
            CustomerId = c.Id,
            CustomerName = c.FullName,
            ChurnScore = CalculateChurnScore(c),
            RiskLevel = GetRiskLevel(c),
            RiskFactors = GetRiskFactors(c),
            Recommendation = GetChurnRecommendation(c)
        }).OrderByDescending(c => c.ChurnScore);
    }

    public async Task<IEnumerable<CustomerSegmentDto>> GetCustomerSegmentsAsync()
    {
        var customers = await _customerRepository.GetAllAsync(1, 1000);

        return customers
            .GroupBy(c => c.Segment ?? "Unknown")
            .Select(g => new CustomerSegmentDto
            {
                Segment = g.Key,
                CustomerCount = g.Count(),
                AverageLifetimeValue = g.Average(c => c.LifetimeValue),
                AverageChurnScore = g.Average(c => c.ChurnScore),
                TotalRevenue = g.Sum(c => c.TotalSpent)
            });
    }

    public async Task<IEnumerable<CohortAnalysisDto>> GetCohortAnalysisAsync()
    {
        var customers = await _customerRepository.GetAllAsync(1, 1000);

        return customers
            .GroupBy(c => new { c.CreatedAt.Year, c.CreatedAt.Month })
            .Select(g => new CohortAnalysisDto
            {
                Cohort = $"{g.Key.Year}-{g.Key.Month:D2}",
                InitialCustomers = g.Count(),
                Retention = new List<CohortRetentionDto>
                {
                    new() { Month = 0, Customers = g.Count(), RetentionRate = 100 },
                    new() { Month = 1, Customers = (int)(g.Count() * 0.85m), RetentionRate = 85 },
                    new() { Month = 2, Customers = (int)(g.Count() * 0.72m), RetentionRate = 72 },
                    new() { Month = 3, Customers = (int)(g.Count() * 0.65m), RetentionRate = 65 }
                }
            })
            .Take(6);
    }

    public async Task<Dictionary<string, decimal>> GetConversionFunnelAsync()
    {
        return await _eventRepository.GetConversionFunnelAsync();
    }

    public async Task<IEnumerable<ChannelPerformanceDto>> GetChannelPerformanceAsync()
    {
        var startDate = DateTime.UtcNow.AddDays(-30);
        var endDate = DateTime.UtcNow;

        var channelCounts = await _eventRepository.GetChannelCountsAsync(startDate, endDate);
        var orders = await _orderRepository.GetRecentOrdersAsync(1000);

        return channelCounts.Select(cc => new ChannelPerformanceDto
        {
            Channel = cc.Key,
            Interactions = cc.Value,
            Conversions = orders.Count(o => o.Status == "Delivered"),
            ConversionRate = cc.Value > 0 ? (decimal)orders.Count(o => o.Status == "Delivered") / cc.Value * 100 : 0,
            Revenue = orders.Sum(o => o.TotalAmount),
            AverageOrderValue = orders.Any() ? orders.Average(o => o.TotalAmount) : 0
        });
    }

    public async Task<IEnumerable<HeatmapDataDto>> GetHeatmapDataAsync()
    {
        var interactions = await _eventRepository.GetRecentInteractionsAsync(1000);

        return interactions
            .Where(i => i.Action == "View Product" || i.Action == "Add To Cart")
            .GroupBy(i => i.Metadata ?? "Unknown")
            .Select(g => new HeatmapDataDto
            {
                Page = g.Key,
                Clicks = g.Count(),
                AverageX = 50,
                AverageY = 50,
                Points = g.Select(i => new HeatmapPointDto
                {
                    X = Random.Shared.NextDouble() * 100,
                    Y = Random.Shared.NextDouble() * 100,
                    Intensity = 1
                }).ToList()
            });
    }

    public async Task<IEnumerable<ActivityTimelineDto>> GetRecentActivityAsync(int count)
    {
        var interactions = await _eventRepository.GetRecentInteractionsAsync(count);

        return interactions.Select(i => new ActivityTimelineDto
        {
            Timestamp = i.Timestamp,
            Action = i.Action,
            Channel = i.Channel,
            Details = i.Metadata,
            ProductName = i.ProductId?.ToString()
        });
    }

    private static decimal CalculateChurnScore(Models.Customer customer)
    {
        var daysSinceLastLogin = customer.LastLoginAt.HasValue 
            ? (DateTime.UtcNow - customer.LastLoginAt.Value).Days 
            : 365;

        var score = 0m;

        if (daysSinceLastLogin > 30) score += 0.3m;
        else if (daysSinceLastLogin > 14) score += 0.15m;

        if (customer.TotalOrders < 3) score += 0.2m;
        if (customer.TotalSpent < 100) score += 0.15m;
        if (customer.SupportTickets?.Any() == true) score += 0.1m;

        return Math.Min(score, 1m);
    }

    private static string GetRiskLevel(Models.Customer customer)
    {
        var score = CalculateChurnScore(customer);
        if (score >= 0.7m) return "High";
        if (score >= 0.4m) return "Medium";
        return "Low";
    }

    private static List<string> GetRiskFactors(Models.Customer customer)
    {
        var factors = new List<string>();
        var daysSinceLastLogin = customer.LastLoginAt.HasValue 
            ? (DateTime.UtcNow - customer.LastLoginAt.Value).Days 
            : 365;

        if (daysSinceLastLogin > 30) factors.Add("Inactive for 30+ days");
        if (customer.TotalOrders < 3) factors.Add("Low purchase frequency");
        if (customer.TotalSpent < 100) factors.Add("Low spending");
        if (customer.SupportTickets?.Any() == true) factors.Add("Has support tickets");

        return factors;
    }

    private static string GetChurnRecommendation(Models.Customer customer)
    {
        var daysSinceLastLogin = customer.LastLoginAt.HasValue 
            ? (DateTime.UtcNow - customer.LastLoginAt.Value).Days 
            : 365;

        if (daysSinceLastLogin > 30) return "Send re-engagement email with special offer";
        if (customer.TotalOrders < 3) return "Offer first-purchase discount";
        return "Continue regular engagement";
    }
}
