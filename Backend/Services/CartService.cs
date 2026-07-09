using Microsoft.EntityFrameworkCore;
using CustomerAnalytics.Api.Data;
using CustomerAnalytics.Api.DTOs;
using CustomerAnalytics.Api.Models;
using CustomerAnalytics.Api.Repositories;

namespace CustomerAnalytics.Api.Services;

public interface ICartService
{
    Task<CartDto> GetCartAsync(int customerId);
    Task<CartDto> AddToCartAsync(int customerId, AddToCartDto dto);
    Task<CartDto> UpdateCartItemAsync(int customerId, int productId, int quantity);
    Task<CartDto> RemoveFromCartAsync(int customerId, int productId);
    Task ClearCartAsync(int customerId);
}

public class CartService : ICartService
{
    private readonly AnalyticsDbContext _context;
    private readonly IProductRepository _productRepository;

    public CartService(AnalyticsDbContext context, IProductRepository productRepository)
    {
        _context = context;
        _productRepository = productRepository;
    }

    public async Task<CartDto> GetCartAsync(int customerId)
    {
        var items = await _context.CartItems
            .Include(ci => ci.Product)
            .Where(ci => ci.CustomerId == customerId)
            .ToListAsync();

        return new CartDto
        {
            Items = items.Select(i => new CartItemDto
            {
                Id = i.Id,
                ProductId = i.ProductId,
                ProductName = i.Product.Name,
                Price = i.Product.Price,
                Quantity = i.Quantity,
                ImageUrl = i.Product.ImageUrl
            }).ToList()
        };
    }

    public async Task<CartDto> AddToCartAsync(int customerId, AddToCartDto dto)
    {
        var existingItem = await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.CustomerId == customerId && ci.ProductId == dto.ProductId);

        if (existingItem != null)
        {
            existingItem.Quantity += dto.Quantity;
        }
        else
        {
            var cartItem = new CartItem
            {
                CustomerId = customerId,
                ProductId = dto.ProductId,
                Quantity = dto.Quantity,
                AddedAt = DateTime.UtcNow
            };
            _context.CartItems.Add(cartItem);
        }

        await _context.SaveChangesAsync();
        return await GetCartAsync(customerId);
    }

    public async Task<CartDto> UpdateCartItemAsync(int customerId, int productId, int quantity)
    {
        var cartItem = await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.CustomerId == customerId && ci.ProductId == productId);

        if (cartItem != null)
        {
            if (quantity <= 0)
            {
                _context.CartItems.Remove(cartItem);
            }
            else
            {
                cartItem.Quantity = quantity;
            }
            await _context.SaveChangesAsync();
        }

        return await GetCartAsync(customerId);
    }

    public async Task<CartDto> RemoveFromCartAsync(int customerId, int productId)
    {
        var cartItem = await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.CustomerId == customerId && ci.ProductId == productId);

        if (cartItem != null)
        {
            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
        }

        return await GetCartAsync(customerId);
    }

    public async Task ClearCartAsync(int customerId)
    {
        var items = await _context.CartItems
            .Where(ci => ci.CustomerId == customerId)
            .ToListAsync();

        _context.CartItems.RemoveRange(items);
        await _context.SaveChangesAsync();
    }
}
