using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using CustomerAnalytics.Api.DTOs;
using CustomerAnalytics.Api.Services;

namespace CustomerAnalytics.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    public async Task<ActionResult<OrderDto>> CreateOrder([FromBody] CheckoutDto dto)
    {
        try
        {
            var customerId = GetCustomerId();
            var order = await _orderService.CreateOrderAsync(customerId, dto);
            if (order == null) return BadRequest(new { message = "Cart is empty" });
            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while creating order" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderDto>> GetOrder(int id)
    {
        try
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null) return NotFound();
            return Ok(order);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching order" });
        }
    }

    [HttpGet("number/{orderNumber}")]
    public async Task<ActionResult<OrderDto>> GetOrderByNumber(string orderNumber)
    {
        try
        {
            var order = await _orderService.GetOrderByNumberAsync(orderNumber);
            if (order == null) return NotFound();
            return Ok(order);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching order" });
        }
    }

    [HttpGet]
    public async Task<ActionResult<OrderListDto>> GetMyOrders([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var customerId = GetCustomerId();
            var orders = await _orderService.GetCustomerOrdersAsync(customerId, page, pageSize);
            return Ok(orders);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching orders" });
        }
    }

    private int GetCustomerId()
    {
        return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
    }
}
