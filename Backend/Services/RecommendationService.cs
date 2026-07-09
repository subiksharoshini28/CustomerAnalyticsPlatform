using CustomerAnalytics.Api.DTOs;
using CustomerAnalytics.Api.Repositories;

namespace CustomerAnalytics.Api.Services;

public interface IRecommendationService
{
    Task<IEnumerable<RecommendationDto>> GetPersonalizedRecommendationsAsync(int customerId);
    Task<IEnumerable<RecommendationDto>> GetFrequentlyBoughtTogetherAsync(int productId);
    Task<IEnumerable<RecommendationDto>> GetPopularProductsAsync(int count);
}

public class RecommendationService : IRecommendationService
{
    private readonly IRecommendationRepository _recommendationRepository;
    private readonly IProductRepository _productRepository;

    public RecommendationService(
        IRecommendationRepository recommendationRepository,
        IProductRepository productRepository)
    {
        _recommendationRepository = recommendationRepository;
        _productRepository = productRepository;
    }

    public async Task<IEnumerable<RecommendationDto>> GetPersonalizedRecommendationsAsync(int customerId)
    {
        var recommendations = await _recommendationRepository.GetByCustomerIdAsync(customerId);

        if (!recommendations.Any())
        {
            // Fallback to popular products if no personalized recommendations
            var popularProducts = await _recommendationRepository.GetPopularProductsAsync(10);
            return popularProducts.Select(p => new RecommendationDto
            {
                ProductId = p.Id,
                ProductName = p.Name,
                Score = 0.5m,
                Reason = "Popular Product",
                ImageUrl = p.ImageUrl,
                Price = p.Price
            });
        }

        return recommendations.Select(r => new RecommendationDto
        {
            ProductId = r.ProductId,
            ProductName = r.Product?.Name ?? string.Empty,
            Score = r.Score,
            Reason = r.Reason,
            ImageUrl = r.Product?.ImageUrl,
            Price = r.Product?.Price ?? 0
        });
    }

    public async Task<IEnumerable<RecommendationDto>> GetFrequentlyBoughtTogetherAsync(int productId)
    {
        var products = await _recommendationRepository.GetFrequentlyBoughtTogetherAsync(productId);

        return products.Select((p, index) => new RecommendationDto
        {
            ProductId = p.Id,
            ProductName = p.Name,
            Score = 1m - (index * 0.1m),
            Reason = "Frequently Bought Together",
            ImageUrl = p.ImageUrl,
            Price = p.Price
        });
    }

    public async Task<IEnumerable<RecommendationDto>> GetPopularProductsAsync(int count)
    {
        var products = await _recommendationRepository.GetPopularProductsAsync(count);

        return products.Select((p, index) => new RecommendationDto
        {
            ProductId = p.Id,
            ProductName = p.Name,
            Score = 1m - (index * 0.1m),
            Reason = "Trending Now",
            ImageUrl = p.ImageUrl,
            Price = p.Price
        });
    }
}
