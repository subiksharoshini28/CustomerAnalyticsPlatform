using CustomerAnalytics.Api.DTOs;
using CustomerAnalytics.Api.Repositories;

namespace CustomerAnalytics.Api.Services;

public interface IDashboardService
{
    Task<DashboardDto> GetDashboardAsync();
    Task<DashboardStatsDto> GetStatsAsync();
    Task<IEnumerable<RevenueChartDto>> GetRevenueChartAsync(int days);
    Task<IEnumerable<TopProductDto>> GetTopProductsAsync(int count);
    Task<IEnumerable<TopCategoryDto>> GetTopCategoriesAsync();
    Task<IEnumerable<MarketingAttributionDto>> GetMarketingAttributionAsync();
}

public class DashboardService : IDashboardService
{
    private readonly ICustomerRepository _customerRepository;
    private readonly IProductRepository _productRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly IEventRepository _eventRepository;
    private readonly ICampaignRepository _campaignRepository;
    private readonly IAnalyticsService _analyticsService;

    public DashboardService(
        ICustomerRepository customerRepository,
        IProductRepository productRepository,
        IOrderRepository orderRepository,
        IEventRepository eventRepository,
        ICampaignRepository campaignRepository,
        IAnalyticsService analyticsService)
    {
        _customerRepository = customerRepository;
        _productRepository = productRepository;
        _orderRepository = orderRepository;
        _eventRepository = eventRepository;
        _campaignRepository = campaignRepository;
        _analyticsService = analyticsService;
    }

    public async Task<DashboardDto> GetDashboardAsync()
    {
        return new DashboardDto
        {
            Stats = await GetStatsAsync(),
            RevenueChart = (await GetRevenueChartAsync(30)).ToList(),
            TopProducts = (await GetTopProductsAsync(10)).ToList(),
            TopCategories = (await GetTopCategoriesAsync()).ToList(),
            ChannelPerformance = (await _analyticsService.GetChannelPerformanceAsync()).ToList(),
            CustomerSegments = (await _analyticsService.GetCustomerSegmentsAsync()).ToList(),
            RecentActivity = (await GetRecentActivityDtoAsync(20)).ToList()
        };
    }

    public async Task<DashboardStatsDto> GetStatsAsync()
    {
        var today = DateTime.UtcNow.Date;

        return new DashboardStatsDto
        {
            TotalCustomers = await _customerRepository.GetCountAsync(),
            DailyActiveUsers = await _customerRepository.GetDailyActiveUsersAsync(),
            TotalRevenue = await _orderRepository.GetTotalRevenueAsync(),
            TodayRevenue = 0, // Would calculate from today's orders
            TotalOrders = await _orderRepository.GetTotalCountAsync(),
            TodayOrders = 0, // Would calculate from today's orders
            AverageOrderValue = 125.50m, // Placeholder
            ConversionRate = 3.5m, // Placeholder
            ChurnRate = 5.2m, // Placeholder
            CustomerSatisfaction = 4.5m // Placeholder
        };
    }

    public async Task<IEnumerable<RevenueChartDto>> GetRevenueChartAsync(int days)
    {
        var startDate = DateTime.UtcNow.AddDays(-days);
        var endDate = DateTime.UtcNow;

        var revenueData = await _orderRepository.GetRevenueByDateAsync(startDate, endDate);

        return revenueData.Select(r => new RevenueChartDto
        {
            Date = r.Key,
            Revenue = r.Value,
            Orders = (int)(r.Value / 125) // Estimated order count
        }).OrderBy(r => r.Date);
    }

    public async Task<IEnumerable<TopProductDto>> GetTopProductsAsync(int count)
    {
        var products = await _productRepository.GetTopProductsAsync(count);

        return products.Select(p => new TopProductDto
        {
            ProductId = p.Id,
            ProductName = p.Name,
            TotalSold = p.TotalSold,
            TotalRevenue = p.TotalRevenue,
            ImageUrl = p.ImageUrl
        });
    }

    public async Task<IEnumerable<TopCategoryDto>> GetTopCategoriesAsync()
    {
        var products = await _productRepository.GetAllAsync(1, 1000, null, null);

        return products
            .GroupBy(p => p.Category)
            .Select(g => new TopCategoryDto
            {
                Category = g.Key,
                ProductCount = g.Count(),
                TotalSold = g.Sum(p => p.TotalSold),
                TotalRevenue = g.Sum(p => p.TotalRevenue)
            })
            .OrderByDescending(c => c.TotalRevenue);
    }

    public async Task<IEnumerable<MarketingAttributionDto>> GetMarketingAttributionAsync()
    {
        var customers = await _customerRepository.GetAllAsync(1, 1000);

        return customers
            .GroupBy(c => c.AcquisitionSource ?? "Direct")
            .Select(g => new MarketingAttributionDto
            {
                Source = g.Key,
                Customers = g.Count(),
                Revenue = g.Sum(c => c.TotalSpent),
                Conversions = g.Count(c => c.TotalOrders > 0),
                ROI = 0 // Would calculate from campaign data
            });
    }

    private async Task<IEnumerable<RecentActivityDto>> GetRecentActivityDtoAsync(int count)
    {
        var interactions = await _eventRepository.GetRecentInteractionsAsync(count);

        return interactions.Select(i => new RecentActivityDto
        {
            Timestamp = i.Timestamp,
            CustomerName = i.Customer?.FullName ?? "Unknown",
            Action = i.Action,
            Channel = i.Channel,
            Details = i.Metadata
        });
    }
}
