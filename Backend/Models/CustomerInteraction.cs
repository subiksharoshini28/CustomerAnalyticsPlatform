using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CustomerAnalytics.Api.Models;

public class CustomerInteraction
{
    [Key]
    public int Id { get; set; }

    public int CustomerId { get; set; }

    [Required]
    [MaxLength(50)]
    public string Channel { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Action { get; set; } = string.Empty;

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    [MaxLength(100)]
    public string? Device { get; set; }

    [MaxLength(100)]
    public string? Browser { get; set; }

    [MaxLength(200)]
    public string? Location { get; set; }

    public int? ProductId { get; set; }

    public string? Metadata { get; set; }

    public string? SessionId { get; set; }

    public string? Referrer { get; set; }

    // Navigation Properties
    public Customer Customer { get; set; } = null!;
}
