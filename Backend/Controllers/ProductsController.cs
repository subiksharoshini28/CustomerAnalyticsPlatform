using Microsoft.AspNetCore.Mvc;
using CustomerAnalytics.Api.DTOs;
using CustomerAnalytics.Api.Services;

namespace CustomerAnalytics.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly IRecommendationService _recommendationService;

    public ProductsController(IProductService productService, IRecommendationService recommendationService)
    {
        _productService = productService;
        _recommendationService = recommendationService;
    }

    [HttpGet]
    public async Task<ActionResult<ProductListDto>> GetProducts([FromQuery] ProductSearchDto searchDto)
    {
        try
        {
            var result = await _productService.GetProductsAsync(searchDto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching products" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        try
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null) return NotFound();
            return Ok(product);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching the product" });
        }
    }

    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<string>>> GetCategories()
    {
        try
        {
            var categories = await _productService.GetCategoriesAsync();
            return Ok(categories);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching categories" });
        }
    }

    [HttpGet("top/{count}")]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetTopProducts(int count)
    {
        try
        {
            var products = await _productService.GetTopProductsAsync(count);
            return Ok(products);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching top products" });
        }
    }

    [HttpGet("{id}/recommendations")]
    public async Task<ActionResult<IEnumerable<RecommendationDto>>> GetRecommendations(int id)
    {
        try
        {
            var recommendations = await _recommendationService.GetFrequentlyBoughtTogetherAsync(id);
            return Ok(recommendations);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching recommendations" });
        }
    }

    [HttpGet("popular")]
    public async Task<ActionResult<IEnumerable<RecommendationDto>>> GetPopularProducts([FromQuery] int count = 10)
    {
        try
        {
            var products = await _recommendationService.GetPopularProductsAsync(count);
            return Ok(products);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching popular products" });
        }
    }
}
