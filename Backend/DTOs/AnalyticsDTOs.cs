namespace CustomerAnalytics.Api.DTOs;

public class TrackEventDto
{
    public string Action { get; set; } = string.Empty;
    public string Channel { get; set; } = "Website";
    public string? Device { get; set; }
    public string? Browser { get; set; }
    public string? Location { get; set; }
    public int? ProductId { get; set; }
    public string? Metadata { get; set; }
    public string? SessionId { get; set; }
    public string? Referrer { get; set; }
}

public class CustomerJourneyDto
{
    public List<JourneyStepDto> Steps { get; set; } = new();
    public decimal ConversionRate { get; set; }
    public TimeSpan AverageDuration { get; set; }
}

public class JourneyStepDto
{
    public string Action { get; set; } = string.Empty;
    public string Channel { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string? Device { get; set; }
    public int Count { get; set; }
    public decimal DropoffRate { get; set; }
}

public class ChurnPredictionDto
{
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public decimal ChurnScore { get; set; }
    public string RiskLevel { get; set; } = string.Empty;
    public List<string> RiskFactors { get; set; } = new();
    public string? Recommendation { get; set; }
}

public class CustomerSegmentDto
{
    public string Segment { get; set; } = string.Empty;
    public int CustomerCount { get; set; }
    public decimal AverageLifetimeValue { get; set; }
    public decimal AverageChurnScore { get; set; }
    public decimal TotalRevenue { get; set; }
}

public class CohortAnalysisDto
{
    public string Cohort { get; set; } = string.Empty;
    public int InitialCustomers { get; set; }
    public List<CohortRetentionDto> Retention { get; set; } = new();
}

public class CohortRetentionDto
{
    public int Month { get; set; }
    public int Customers { get; set; }
    public decimal RetentionRate { get; set; }
}

public class ChannelPerformanceDto
{
    public string Channel { get; set; } = string.Empty;
    public int Interactions { get; set; }
    public int Conversions { get; set; }
    public decimal ConversionRate { get; set; }
    public decimal Revenue { get; set; }
    public decimal AverageOrderValue { get; set; }
}

public class HeatmapDataDto
{
    public string Page { get; set; } = string.Empty;
    public int Clicks { get; set; }
    public double AverageX { get; set; }
    public double AverageY { get; set; }
    public List<HeatmapPointDto> Points { get; set; } = new();
}

public class HeatmapPointDto
{
    public double X { get; set; }
    public double Y { get; set; }
    public int Intensity { get; set; }
}

public class ActivityTimelineDto
{
    public DateTime Timestamp { get; set; }
    public string Action { get; set; } = string.Empty;
    public string Channel { get; set; } = string.Empty;
    public string? Details { get; set; }
    public string? ProductName { get; set; }
}
