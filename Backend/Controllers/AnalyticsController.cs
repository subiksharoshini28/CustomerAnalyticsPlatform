using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CustomerAnalytics.Api.DTOs;
using CustomerAnalytics.Api.Services;

namespace CustomerAnalytics.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;

    public AnalyticsController(IAnalyticsService analyticsService)
    {
        _analyticsService = analyticsService;
    }

    [HttpGet("customerjourney")]
    public async Task<ActionResult<CustomerJourneyDto>> GetCustomerJourney([FromQuery] int customerId)
    {
        try
        {
            var journey = await _analyticsService.GetCustomerJourneyAsync(customerId);
            return Ok(journey);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching customer journey" });
        }
    }

    [HttpGet("churn")]
    public async Task<ActionResult<IEnumerable<ChurnPredictionDto>>> GetChurnPredictions()
    {
        try
        {
            var predictions = await _analyticsService.GetChurnPredictionsAsync();
            return Ok(predictions);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching churn predictions" });
        }
    }

    [HttpGet("segments")]
    public async Task<ActionResult<IEnumerable<CustomerSegmentDto>>> GetCustomerSegments()
    {
        try
        {
            var segments = await _analyticsService.GetCustomerSegmentsAsync();
            return Ok(segments);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching customer segments" });
        }
    }

    [HttpGet("cohort")]
    public async Task<ActionResult<IEnumerable<CohortAnalysisDto>>> GetCohortAnalysis()
    {
        try
        {
            var cohort = await _analyticsService.GetCohortAnalysisAsync();
            return Ok(cohort);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching cohort analysis" });
        }
    }

    [HttpGet("funnel")]
    public async Task<ActionResult<Dictionary<string, decimal>>> GetConversionFunnel()
    {
        try
        {
            var funnel = await _analyticsService.GetConversionFunnelAsync();
            return Ok(funnel);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching conversion funnel" });
        }
    }

    [HttpGet("channels")]
    public async Task<ActionResult<IEnumerable<ChannelPerformanceDto>>> GetChannelPerformance()
    {
        try
        {
            var performance = await _analyticsService.GetChannelPerformanceAsync();
            return Ok(performance);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching channel performance" });
        }
    }

    [HttpGet("heatmap")]
    public async Task<ActionResult<IEnumerable<HeatmapDataDto>>> GetHeatmapData()
    {
        try
        {
            var heatmap = await _analyticsService.GetHeatmapDataAsync();
            return Ok(heatmap);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching heatmap data" });
        }
    }

    [HttpGet("activity")]
    public async Task<ActionResult<IEnumerable<ActivityTimelineDto>>> GetRecentActivity([FromQuery] int count = 20)
    {
        try
        {
            var activity = await _analyticsService.GetRecentActivityAsync(count);
            return Ok(activity);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching recent activity" });
        }
    }
}
