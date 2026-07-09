using Microsoft.EntityFrameworkCore;
using CustomerAnalytics.Api.Data;
using CustomerAnalytics.Api.DTOs;
using CustomerAnalytics.Api.Models;
using CustomerAnalytics.Api.Repositories;
using CustomerAnalytics.Api.Azure;

namespace CustomerAnalytics.Api.Services;

public interface IOrderService
{
    Task<OrderDto?> CreateOrderAsync(int customerId, CheckoutDto dto);
    Task<OrderDto?> GetOrderByIdAsync(int id);
    Task<OrderDto?> GetOrderByNumberAsync(string orderNumber);
    Task<OrderListDto> GetCustomerOrdersAsync(int customerId, int page, int pageSize);
    Task<bool> UpdateOrderStatusAsync(int orderId, string status);
}

public class OrderService : IOrderService
{
    private readonly AnalyticsDbContext _context;
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;
    private readonly ICartService _cartService;
    private readonly IAzureEventHubService _eventHubService;

    public OrderService(
        AnalyticsDbContext context,
        IOrderRepository orderRepository,
        IProductRepository productRepository,
        ICartService cartService,
        IAzureEventHubService eventHubService)
    {
        _context = context;
        _orderRepository = orderRepository;
        _productRepository = productRepository;
        _cartService = cartService;
        _eventHubService = eventHubService;
    }

    public async Task<OrderDto?> CreateOrderAsync(int customerId, CheckoutDto dto)
    {
        var cartItems = await _context.CartItems
            .Include(ci => ci.Product)
            .Where(ci => ci.CustomerId == customerId)
            .ToListAsync();

        if (!cartItems.Any())
            return null;

        var order = new Order
        {
            CustomerId = customerId,
            OrderNumber = GenerateOrderNumber(),
            ShippingAddress = dto.ShippingAddress,
            PaymentMethod = dto.PaymentMethod,
            Status = "Confirmed",
            OrderDate = DateTime.UtcNow,
            Tax = cartItems.Sum(ci => ci.Product.Price * ci.Quantity) * 0.08m,
            ShippingCost = 9.99m,
            Discount = dto.PromoCode == "SAVE10" ? cartItems.Sum(ci => ci.Product.Price * ci.Quantity) * 0.10m : 0,
            Items = cartItems.Select(ci => new OrderItem
            {
                ProductId = ci.ProductId,
                Quantity = ci.Quantity,
                UnitPrice = ci.Product.Price,
                TotalPrice = ci.Product.Price * ci.Quantity
            }).ToList()
        };

        order.TotalAmount = order.Items.Sum(i => i.TotalPrice) + order.Tax + order.ShippingCost - order.Discount;

        await _orderRepository.CreateAsync(order);

        // Update customer stats
        var customer = await _context.Customers.FindAsync(customerId);
        if (customer != null)
        {
            customer.TotalSpent += order.TotalAmount;
            customer.TotalOrders += 1;
            customer.LifetimeValue = customer.TotalSpent;
            await _context.SaveChangesAsync();
        }

        // Clear cart
        await _cartService.ClearCartAsync(customerId);

        // Send purchase event to Event Hub
        await _eventHubService.SendEventAsync(new TrackEventDto
        {
            Action = "Purchase",
            Channel = "Website",
            Metadata = Newtonsoft.Json.JsonConvert.SerializeObject(new { OrderId = order.Id, OrderNumber = order.OrderNumber })
        }, customerId);

        return MapToDto(order);
    }

    public async Task<OrderDto?> GetOrderByIdAsync(int id)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        return order != null ? MapToDto(order) : null;
    }

    public async Task<OrderDto?> GetOrderByNumberAsync(string orderNumber)
    {
        var order = await _orderRepository.GetByOrderNumberAsync(orderNumber);
        return order != null ? MapToDto(order) : null;
    }

    public async Task<OrderListDto> GetCustomerOrdersAsync(int customerId, int page, int pageSize)
    {
        var orders = await _orderRepository.GetByCustomerIdAsync(customerId, page, pageSize);
        var totalCount = await _orderRepository.GetCountByCustomerIdAsync(customerId);

        return new OrderListDto
        {
            Orders = orders.Select(MapToDto).ToList(),
            TotalCount = totalCount
        };
    }

    public async Task<bool> UpdateOrderStatusAsync(int orderId, string status)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order == null) return false;

        order.Status = status;
        if (status == "Shipped") order.ShippedDate = DateTime.UtcNow;
        if (status == "Delivered") order.DeliveredDate = DateTime.UtcNow;

        await _orderRepository.UpdateAsync(order);
        return true;
    }

    private static OrderDto MapToDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            TotalAmount = order.TotalAmount,
            Tax = order.Tax,
            ShippingCost = order.ShippingCost,
            Discount = order.Discount,
            Status = order.Status,
            OrderDate = order.OrderDate,
            Items = order.Items.Select(i => new OrderItemDto
            {
                Id = i.Id,
                ProductName = i.Product?.Name ?? string.Empty,
                UnitPrice = i.UnitPrice,
                Quantity = i.Quantity,
                TotalPrice = i.TotalPrice,
                ImageUrl = i.Product?.ImageUrl
            }).ToList()
        };
    }

    private static string GenerateOrderNumber()
    {
        return $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8].ToUpper()}";
    }
}
