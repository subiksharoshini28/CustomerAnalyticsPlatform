using System.ComponentModel.DataAnnotations;

namespace CustomerAnalytics.Api.Models;

public class CartItem
{
    [Key]
    public int Id { get; set; }

    public int CustomerId { get; set; }

    public int ProductId { get; set; }

    public int Quantity { get; set; }

    public DateTime AddedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    public Customer Customer { get; set; } = null!;
    public Product Product { get; set; } = null!;
}
