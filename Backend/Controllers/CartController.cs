using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using CustomerAnalytics.Api.DTOs;
using CustomerAnalytics.Api.Services;

namespace CustomerAnalytics.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    [HttpGet]
    public async Task<ActionResult<CartDto>> GetCart()
    {
        try
        {
            var customerId = GetCustomerId();
            var cart = await _cartService.GetCartAsync(customerId);
            return Ok(cart);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching cart" });
        }
    }

    [HttpPost]
    public async Task<ActionResult<CartDto>> AddToCart([FromBody] AddToCartDto dto)
    {
        try
        {
            var customerId = GetCustomerId();
            var cart = await _cartService.AddToCartAsync(customerId, dto);
            return Ok(cart);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while adding to cart" });
        }
    }

    [HttpPut("{productId}")]
    public async Task<ActionResult<CartDto>> UpdateCartItem(int productId, [FromBody] int quantity)
    {
        try
        {
            var customerId = GetCustomerId();
            var cart = await _cartService.UpdateCartItemAsync(customerId, productId, quantity);
            return Ok(cart);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating cart" });
        }
    }

    [HttpDelete("{productId}")]
    public async Task<ActionResult<CartDto>> RemoveFromCart(int productId)
    {
        try
        {
            var customerId = GetCustomerId();
            var cart = await _cartService.RemoveFromCartAsync(customerId, productId);
            return Ok(cart);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while removing from cart" });
        }
    }

    [HttpDelete]
    public async Task<IActionResult> ClearCart()
    {
        try
        {
            var customerId = GetCustomerId();
            await _cartService.ClearCartAsync(customerId);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while clearing cart" });
        }
    }

    private int GetCustomerId()
    {
        return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
    }
}
