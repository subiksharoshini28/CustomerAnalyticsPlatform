using Microsoft.EntityFrameworkCore;
using CustomerAnalytics.Api.Data;
using CustomerAnalytics.Api.Models;

namespace CustomerAnalytics.Api.Repositories;

public interface IOrderRepository
{
    Task<Order?> GetByIdAsync(int id);
    Task<Order?> GetByOrderNumberAsync(string orderNumber);
    Task<IEnumerable<Order>> GetByCustomerIdAsync(int customerId, int page, int pageSize);
    Task<int> GetCountByCustomerIdAsync(int customerId);
    Task<int> GetTotalCountAsync();
    Task<decimal> GetTotalRevenueAsync();
    Task<Order> CreateAsync(Order order);
    Task UpdateAsync(Order order);
    Task<IEnumerable<Order>> GetRecentOrdersAsync(int count);
    Task<Dictionary<string, decimal>> GetRevenueByDateAsync(DateTime startDate, DateTime endDate);
}

public class OrderRepository : IOrderRepository
{
    private readonly AnalyticsDbContext _context;

    public OrderRepository(AnalyticsDbContext context)
    {
        _context = context;
    }

    public async Task<Order?> GetByIdAsync(int id)
    {
        return await _context.Orders
            .Include(o => o.Items)
            .ThenInclude(oi => oi.Product)
            .Include(o => o.Customer)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<Order?> GetByOrderNumberAsync(string orderNumber)
    {
        return await _context.Orders
            .Include(o => o.Items)
            .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);
    }

    public async Task<IEnumerable<Order>> GetByCustomerIdAsync(int customerId, int page, int pageSize)
    {
        return await _context.Orders
            .Include(o => o.Items)
            .ThenInclude(oi => oi.Product)
            .Where(o => o.CustomerId == customerId)
            .OrderByDescending(o => o.OrderDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> GetCountByCustomerIdAsync(int customerId)
    {
        return await _context.Orders.CountAsync(o => o.CustomerId == customerId);
    }

    public async Task<int> GetTotalCountAsync()
    {
        return await _context.Orders.CountAsync();
    }

    public async Task<decimal> GetTotalRevenueAsync()
    {
        return await _context.Orders.SumAsync(o => o.TotalAmount);
    }

    public async Task<Order> CreateAsync(Order order)
    {
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
        return order;
    }

    public async Task UpdateAsync(Order order)
    {
        _context.Orders.Update(order);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Order>> GetRecentOrdersAsync(int count)
    {
        return await _context.Orders
            .Include(o => o.Customer)
            .OrderByDescending(o => o.OrderDate)
            .Take(count)
            .ToListAsync();
    }

    public async Task<Dictionary<string, decimal>> GetRevenueByDateAsync(DateTime startDate, DateTime endDate)
    {
        return await _context.Orders
            .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate)
            .GroupBy(o => o.OrderDate.Date)
            .ToDictionaryAsync(
                g => g.Key.ToString("yyyy-MM-dd"),
                g => g.Sum(o => o.TotalAmount)
            );
    }
}
