namespace CustomerAnalytics.Api.DTOs;

public class DashboardDto
{
    public DashboardStatsDto Stats { get; set; } = new();
    public List<RevenueChartDto> RevenueChart { get; set; } = new();
    public List<TopProductDto> TopProducts { get; set; } = new();
    public List<TopCategoryDto> TopCategories { get; set; } = new();
    public List<ChannelPerformanceDto> ChannelPerformance { get; set; } = new();
    public List<CustomerSegmentDto> CustomerSegments { get; set; } = new();
    public List<RecentActivityDto> RecentActivity { get; set; } = new();
}

public class DashboardStatsDto
{
    public int TotalCustomers { get; set; }
    public int DailyActiveUsers { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal TodayRevenue { get; set; }
    public int TotalOrders { get; set; }
    public int TodayOrders { get; set; }
    public decimal AverageOrderValue { get; set; }
    public decimal ConversionRate { get; set; }
    public decimal ChurnRate { get; set; }
    public decimal CustomerSatisfaction { get; set; }
}

public class RevenueChartDto
{
    public string Date { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int Orders { get; set; }
}

public class TopProductDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int TotalSold { get; set; }
    public decimal TotalRevenue { get; set; }
    public string? ImageUrl { get; set; }
}

public class TopCategoryDto
{
    public string Category { get; set; } = string.Empty;
    public int ProductCount { get; set; }
    public int TotalSold { get; set; }
    public decimal TotalRevenue { get; set; }
}

public class RecentActivityDto
{
    public DateTime Timestamp { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Channel { get; set; } = string.Empty;
    public string? Details { get; set; }
}

public class RecommendationDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal Score { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public decimal Price { get; set; }
}

public class MarketingAttributionDto
{
    public string Source { get; set; } = string.Empty;
    public int Customers { get; set; }
    public decimal Revenue { get; set; }
    public int Conversions { get; set; }
    public decimal ROI { get; set; }
}
