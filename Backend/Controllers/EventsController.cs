using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using CustomerAnalytics.Api.DTOs;
using CustomerAnalytics.Api.Services;

namespace CustomerAnalytics.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EventsController : ControllerBase
{
    private readonly IEventTrackingService _eventTrackingService;

    public EventsController(IEventTrackingService eventTrackingService)
    {
        _eventTrackingService = eventTrackingService;
    }

    [HttpPost]
    public async Task<IActionResult> TrackEvent([FromBody] TrackEventDto dto)
    {
        try
        {
            var customerId = GetCustomerId();
            await _eventTrackingService.TrackEventAsync(dto, customerId);
            return Ok(new { message = "Event tracked successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while tracking event" });
        }
    }

    [HttpGet("timeline")]
    public async Task<ActionResult<IEnumerable<ActivityTimelineDto>>> GetTimeline()
    {
        try
        {
            var customerId = GetCustomerId();
            var timeline = await _eventTrackingService.GetCustomerTimelineAsync(customerId);
            return Ok(timeline);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching timeline" });
        }
    }

    [HttpGet("journey")]
    public async Task<ActionResult<CustomerJourneyDto>> GetJourney()
    {
        try
        {
            var customerId = GetCustomerId();
            var journey = await _eventTrackingService.GetCustomerJourneyAsync(customerId);
            return Ok(journey);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching journey" });
        }
    }

    private int GetCustomerId()
    {
        return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
    }
}
