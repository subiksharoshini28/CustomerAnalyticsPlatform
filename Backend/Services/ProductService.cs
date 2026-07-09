using CustomerAnalytics.Api.DTOs;
using CustomerAnalytics.Api.Models;
using CustomerAnalytics.Api.Repositories;

namespace CustomerAnalytics.Api.Services;

public interface IProductService
{
    Task<ProductListDto> GetProductsAsync(ProductSearchDto searchDto);
    Task<ProductDto?> GetProductByIdAsync(int id);
    Task<IEnumerable<string>> GetCategoriesAsync();
    Task<IEnumerable<ProductDto>> GetTopProductsAsync(int count);
}

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;

    public ProductService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<ProductListDto> GetProductsAsync(ProductSearchDto searchDto)
    {
        var products = await _productRepository.GetAllAsync(
            searchDto.Page, 
            searchDto.PageSize, 
            searchDto.SearchTerm, 
            searchDto.Category);

        var totalCount = await _productRepository.GetCountAsync(searchDto.SearchTerm, searchDto.Category);

        return new ProductListDto
        {
            Products = products.Select(MapToDto).ToList(),
            TotalCount = totalCount,
            Page = searchDto.Page,
            PageSize = searchDto.PageSize
        };
    }

    public async Task<ProductDto?> GetProductByIdAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        return product != null ? MapToDto(product) : null;
    }

    public async Task<IEnumerable<string>> GetCategoriesAsync()
    {
        return await _productRepository.GetCategoriesAsync();
    }

    public async Task<IEnumerable<ProductDto>> GetTopProductsAsync(int count)
    {
        var products = await _productRepository.GetTopProductsAsync(count);
        return products.Select(MapToDto);
    }

    private static ProductDto MapToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Category = product.Category,
            ImageUrl = product.ImageUrl,
            StockQuantity = product.StockQuantity
        };
    }
}
