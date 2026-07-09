using System.ComponentModel.DataAnnotations;

namespace CustomerAnalytics.Api.Models;

public class UserSession
{
    [Key]
    public int Id { get; set; }

    public int CustomerId { get; set; }

    public string SessionId { get; set; } = string.Empty;

    public DateTime StartTime { get; set; } = DateTime.UtcNow;

    public DateTime? EndTime { get; set; }

    [MaxLength(100)]
    public string? Device { get; set; }

    [MaxLength(100)]
    public string? Browser { get; set; }

    [MaxLength(50)]
    public string? IpAddress { get; set; }

    public string? Location { get; set; }

    public int PagesViewed { get; set; }

    public bool IsConverted { get; set; }

    // Navigation Property
    public Customer Customer { get; set; } = null!;

    public TimeSpan Duration => (EndTime ?? DateTime.UtcNow) - StartTime;
}
