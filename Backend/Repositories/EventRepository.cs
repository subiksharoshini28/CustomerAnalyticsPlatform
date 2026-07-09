using Microsoft.EntityFrameworkCore;
using CustomerAnalytics.Api.Data;
using CustomerAnalytics.Api.Models;

namespace CustomerAnalytics.Api.Repositories;

public interface IEventRepository
{
    Task<CustomerInteraction> CreateAsync(CustomerInteraction interaction);
    Task<IEnumerable<CustomerInteraction>> GetByCustomerIdAsync(int customerId, int limit = 100);
    Task<IEnumerable<CustomerInteraction>> GetByChannelAsync(string channel, DateTime startDate, DateTime endDate);
    Task<Dictionary<string, int>> GetActionCountsAsync(DateTime startDate, DateTime endDate);
    Task<Dictionary<string, int>> GetChannelCountsAsync(DateTime startDate, DateTime endDate);
    Task<int> GetTotalInteractionsAsync(DateTime startDate, DateTime endDate);
    Task<IEnumerable<CustomerInteraction>> GetRecentInteractionsAsync(int count);
    Task<Dictionary<string, decimal>> GetConversionFunnelAsync();
}

public class EventRepository : IEventRepository
{
    private readonly AnalyticsDbContext _context;

    public EventRepository(AnalyticsDbContext context)
    {
        _context = context;
    }

    public async Task<CustomerInteraction> CreateAsync(CustomerInteraction interaction)
    {
        _context.CustomerInteractions.Add(interaction);
        await _context.SaveChangesAsync();
        return interaction;
    }

    public async Task<IEnumerable<CustomerInteraction>> GetByCustomerIdAsync(int customerId, int limit = 100)
    {
        return await _context.CustomerInteractions
            .Where(i => i.CustomerId == customerId)
            .OrderByDescending(i => i.Timestamp)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<IEnumerable<CustomerInteraction>> GetByChannelAsync(string channel, DateTime startDate, DateTime endDate)
    {
        return await _context.CustomerInteractions
            .Where(i => i.Channel == channel && i.Timestamp >= startDate && i.Timestamp <= endDate)
            .OrderByDescending(i => i.Timestamp)
            .ToListAsync();
    }

    public async Task<Dictionary<string, int>> GetActionCountsAsync(DateTime startDate, DateTime endDate)
    {
        return await _context.CustomerInteractions
            .Where(i => i.Timestamp >= startDate && i.Timestamp <= endDate)
            .GroupBy(i => i.Action)
            .ToDictionaryAsync(g => g.Key, g => g.Count());
    }

    public async Task<Dictionary<string, int>> GetChannelCountsAsync(DateTime startDate, DateTime endDate)
    {
        return await _context.CustomerInteractions
            .Where(i => i.Timestamp >= startDate && i.Timestamp <= endDate)
            .GroupBy(i => i.Channel)
            .ToDictionaryAsync(g => g.Key, g => g.Count());
    }

    public async Task<int> GetTotalInteractionsAsync(DateTime startDate, DateTime endDate)
    {
        return await _context.CustomerInteractions
            .CountAsync(i => i.Timestamp >= startDate && i.Timestamp <= endDate);
    }

    public async Task<IEnumerable<CustomerInteraction>> GetRecentInteractionsAsync(int count)
    {
        return await _context.CustomerInteractions
            .Include(i => i.Customer)
            .OrderByDescending(i => i.Timestamp)
            .Take(count)
            .ToListAsync();
    }

    public async Task<Dictionary<string, decimal>> GetConversionFunnelAsync()
    {
        var actions = new[] { "Website Visit", "Search Product", "View Product", "Add To Cart", "Purchase" };
        var counts = new Dictionary<string, decimal>();

        foreach (var action in actions)
        {
            var count = await _context.CustomerInteractions
                .CountAsync(i => i.Action == action);
            counts[action] = count;
        }

        // Calculate conversion rates relative to first step
        if (counts.Count > 0 && counts.Values.First() > 0)
        {
            var firstCount = counts.Values.First();
            foreach (var key in counts.Keys.ToList())
            {
                counts[key] = counts[key] / firstCount * 100;
            }
        }

        return counts;
    }
}
