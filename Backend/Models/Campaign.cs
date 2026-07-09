using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CustomerAnalytics.Api.Models;

public class Campaign
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Channel { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Budget { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Spend { get; set; }

    public int Impressions { get; set; }

    public int Clicks { get; set; }

    public int Conversions { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [NotMapped]
    public decimal ROI => Spend > 0 ? ((decimal)Conversions * 50 - Spend) / Spend * 100 : 0;

    [NotMapped]
    public decimal CTR => Impressions > 0 ? (decimal)Clicks / Impressions * 100 : 0;

    [NotMapped]
    public decimal ConversionRate => Clicks > 0 ? (decimal)Conversions / Clicks * 100 : 0;
}
