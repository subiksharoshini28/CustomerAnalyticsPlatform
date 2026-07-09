using Microsoft.EntityFrameworkCore;
using CustomerAnalytics.Api.Data;
using CustomerAnalytics.Api.Models;

namespace CustomerAnalytics.Api.Repositories;

public interface IRecommendationRepository
{
    Task<IEnumerable<Recommendation>> GetByCustomerIdAsync(int customerId);
    Task<Recommendation> CreateAsync(Recommendation recommendation);
    Task UpdateAsync(Recommendation recommendation);
    Task<IEnumerable<Product>> GetFrequentlyBoughtTogetherAsync(int productId);
    Task<IEnumerable<Product>> GetPopularProductsAsync(int count);
}

public class RecommendationRepository : IRecommendationRepository
{
    private readonly AnalyticsDbContext _context;

    public RecommendationRepository(AnalyticsDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Recommendation>> GetByCustomerIdAsync(int customerId)
    {
        return await _context.Recommendations
            .Include(r => r.Product)
            .Where(r => r.CustomerId == customerId)
            .OrderByDescending(r => r.Score)
            .Take(10)
            .ToListAsync();
    }

    public async Task<Recommendation> CreateAsync(Recommendation recommendation)
    {
        _context.Recommendations.Add(recommendation);
        await _context.SaveChangesAsync();
        return recommendation;
    }

    public async Task UpdateAsync(Recommendation recommendation)
    {
        _context.Recommendations.Update(recommendation);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Product>> GetFrequentlyBoughtTogetherAsync(int productId)
    {
        return await _context.OrderItems
            .Where(oi => oi.ProductId == productId)
            .SelectMany(oi => oi.Order.Items)
            .Where(oi => oi.ProductId != productId)
            .GroupBy(oi => oi.ProductId)
            .OrderByDescending(g => g.Count())
            .Select(g => g.First().Product)
            .Take(5)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetPopularProductsAsync(int count)
    {
        return await _context.Products
            .Where(p => p.IsActive)
            .OrderByDescending(p => p.OrderItems.Count)
            .Take(count)
            .ToListAsync();
    }
}
