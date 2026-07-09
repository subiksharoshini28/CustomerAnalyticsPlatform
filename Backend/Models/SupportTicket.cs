using System.ComponentModel.DataAnnotations;

namespace CustomerAnalytics.Api.Models;

public class SupportTicket
{
    [Key]
    public int Id { get; set; }

    public int CustomerId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Subject { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? Description { get; set; }

    [Required]
    [MaxLength(50)]
    public string Channel { get; set; } = string.Empty;

    public string Status { get; set; } = "Open";

    public string Priority { get; set; } = "Medium";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ResolvedAt { get; set; }

    public int? SatisfactionRating { get; set; }

    // Navigation Property
    public Customer Customer { get; set; } = null!;
}
