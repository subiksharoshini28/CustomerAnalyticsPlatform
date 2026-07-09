using Microsoft.EntityFrameworkCore;
using CustomerAnalytics.Api.Data;
using CustomerAnalytics.Api.Models;

namespace CustomerAnalytics.Api.Repositories;

public interface ICustomerRepository
{
    Task<Customer?> GetByIdAsync(int id);
    Task<Customer?> GetByEmailAsync(string email);
    Task<IEnumerable<Customer>> GetAllAsync(int page, int pageSize);
    Task<int> GetCountAsync();
    Task<Customer> CreateAsync(Customer customer);
    Task UpdateAsync(Customer customer);
    Task<bool> ExistsAsync(string email);
    Task<IEnumerable<Customer>> GetTopCustomersAsync(int count);
    Task<decimal> GetTotalRevenueAsync();
    Task<int> GetDailyActiveUsersAsync();
}

public class CustomerRepository : ICustomerRepository
{
    private readonly AnalyticsDbContext _context;

    public CustomerRepository(AnalyticsDbContext context)
    {
        _context = context;
    }

    public async Task<Customer?> GetByIdAsync(int id)
    {
        return await _context.Customers.FindAsync(id);
    }

    public async Task<Customer?> GetByEmailAsync(string email)
    {
        return await _context.Customers.FirstOrDefaultAsync(c => c.Email == email);
    }

    public async Task<IEnumerable<Customer>> GetAllAsync(int page, int pageSize)
    {
        return await _context.Customers
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> GetCountAsync()
    {
        return await _context.Customers.CountAsync();
    }

    public async Task<Customer> CreateAsync(Customer customer)
    {
        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();
        return customer;
    }

    public async Task UpdateAsync(Customer customer)
    {
        customer.UpdatedAt = DateTime.UtcNow;
        _context.Customers.Update(customer);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ExistsAsync(string email)
    {
        return await _context.Customers.AnyAsync(c => c.Email == email);
    }

    public async Task<IEnumerable<Customer>> GetTopCustomersAsync(int count)
    {
        return await _context.Customers
            .OrderByDescending(c => c.LifetimeValue)
            .Take(count)
            .ToListAsync();
    }

    public async Task<decimal> GetTotalRevenueAsync()
    {
        return await _context.Customers.SumAsync(c => c.TotalSpent);
    }

    public async Task<int> GetDailyActiveUsersAsync()
    {
        var today = DateTime.UtcNow.Date;
        return await _context.Customers
            .CountAsync(c => c.LastLoginAt.HasValue && c.LastLoginAt.Value.Date == today);
    }
}
