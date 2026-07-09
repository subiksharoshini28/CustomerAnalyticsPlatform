using Microsoft.EntityFrameworkCore;
using CustomerAnalytics.Api.Data;
using CustomerAnalytics.Api.Models;

namespace CustomerAnalytics.Api.Repositories;

public interface ICampaignRepository
{
    Task<Campaign?> GetByIdAsync(int id);
    Task<IEnumerable<Campaign>> GetAllAsync();
    Task<IEnumerable<Campaign>> GetByChannelAsync(string channel);
    Task<Campaign> CreateAsync(Campaign campaign);
    Task UpdateAsync(Campaign campaign);
    Task<Dictionary<string, decimal>> GetROIByChannelAsync();
}

public class CampaignRepository : ICampaignRepository
{
    private readonly AnalyticsDbContext _context;

    public CampaignRepository(AnalyticsDbContext context)
    {
        _context = context;
    }

    public async Task<Campaign?> GetByIdAsync(int id)
    {
        return await _context.Campaigns.FindAsync(id);
    }

    public async Task<IEnumerable<Campaign>> GetAllAsync()
    {
        return await _context.Campaigns.OrderByDescending(c => c.CreatedAt).ToListAsync();
    }

    public async Task<IEnumerable<Campaign>> GetByChannelAsync(string channel)
    {
        return await _context.Campaigns
            .Where(c => c.Channel == channel)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<Campaign> CreateAsync(Campaign campaign)
    {
        _context.Campaigns.Add(campaign);
        await _context.SaveChangesAsync();
        return campaign;
    }

    public async Task UpdateAsync(Campaign campaign)
    {
        _context.Campaigns.Update(campaign);
        await _context.SaveChangesAsync();
    }

    public async Task<Dictionary<string, decimal>> GetROIByChannelAsync()
    {
        return await _context.Campaigns
            .GroupBy(c => c.Channel)
            .ToDictionaryAsync(
                g => g.Key,
                g => g.Sum(c => c.Spend) > 0 
                    ? (g.Sum(c => (decimal)c.Conversions * 50) - g.Sum(c => c.Spend)) / g.Sum(c => c.Spend) * 100 
                    : 0
            );
    }
}
