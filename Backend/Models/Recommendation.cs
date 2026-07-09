using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CustomerAnalytics.Api.Models;

public class Recommendation
{
    [Key]
    public int Id { get; set; }

    public int CustomerId { get; set; }

    public int ProductId { get; set; }

    [Column(TypeName = "decimal(5,4)")]
    public decimal Score { get; set; }

    public string Reason { get; set; } = string.Empty;

    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;

    public bool IsClicked { get; set; }

    public bool IsPurchased { get; set; }

    // Navigation Properties
    public Customer Customer { get; set; } = null!;
    public Product Product { get; set; } = null!;
}
