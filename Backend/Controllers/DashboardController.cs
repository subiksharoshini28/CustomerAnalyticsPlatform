using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CustomerAnalytics.Api.DTOs;
using CustomerAnalytics.Api.Services;

namespace CustomerAnalytics.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;
    private readonly IRecommendationService _recommendationService;

    public DashboardController(IDashboardService dashboardService, IRecommendationService recommendationService)
    {
        _dashboardService = dashboardService;
        _recommendationService = recommendationService;
    }

    [HttpGet]
    public async Task<ActionResult<DashboardDto>> GetDashboard()
    {
        try
        {
            var dashboard = await _dashboardService.GetDashboardAsync();
            return Ok(dashboard);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching dashboard" });
        }
    }

    [HttpGet("stats")]
    public async Task<ActionResult<DashboardStatsDto>> GetStats()
    {
        try
        {
            var stats = await _dashboardService.GetStatsAsync();
            return Ok(stats);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching stats" });
        }
    }

    [HttpGet("revenue")]
    public async Task<ActionResult<IEnumerable<RevenueChartDto>>> GetRevenueChart([FromQuery] int days = 30)
    {
        try
        {
            var chart = await _dashboardService.GetRevenueChartAsync(days);
            return Ok(chart);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching revenue chart" });
        }
    }

    [HttpGet("top-products")]
    public async Task<ActionResult<IEnumerable<TopProductDto>>> GetTopProducts([FromQuery] int count = 10)
    {
        try
        {
            var products = await _dashboardService.GetTopProductsAsync(count);
            return Ok(products);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching top products" });
        }
    }

    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<TopCategoryDto>>> GetTopCategories()
    {
        try
        {
            var categories = await _dashboardService.GetTopCategoriesAsync();
            return Ok(categories);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching categories" });
        }
    }

    [HttpGet("attribution")]
    public async Task<ActionResult<IEnumerable<MarketingAttributionDto>>> GetMarketingAttribution()
    {
        try
        {
            var attribution = await _dashboardService.GetMarketingAttributionAsync();
            return Ok(attribution);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching marketing attribution" });
        }
    }

    [HttpGet("recommendations")]
    public async Task<ActionResult<IEnumerable<RecommendationDto>>> GetRecommendations()
    {
        try
        {
            var recommendations = await _recommendationService.GetPopularProductsAsync(10);
            return Ok(recommendations);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching recommendations" });
        }
    }
}
