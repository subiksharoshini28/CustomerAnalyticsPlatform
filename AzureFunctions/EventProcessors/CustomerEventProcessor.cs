using System;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace CustomerAnalytics.Functions.EventProcessors;

public class CustomerEventProcessor
{
    [FunctionName("CustomerEventProcessor")]
    public async Task Run(
        [EventHubTrigger("%EventHubName%", Connection = "EventHubConnectionString")] string[] messages,
        ILogger log)
    {
        foreach (var message in messages)
        {
            try
            {
                var eventData = JsonConvert.DeserializeObject<CustomerEvent>(message);
                
                if (eventData != null)
                {
                    log.LogInformation($"Processing event: {eventData.Action} for Customer: {eventData.CustomerId}");
                    
                    // Process the event
                    await ProcessEventAsync(eventData, log);
                    
                    // Send to Event Grid for downstream consumers
                    await SendToEventGridAsync(eventData, log);
                    
                    log.LogInformation($"Successfully processed event: {eventData.Action}");
                }
            }
            catch (Exception ex)
            {
                log.LogError(ex, $"Error processing event message: {message}");
            }
        }
    }

    private async Task ProcessEventAsync(CustomerEvent eventData, ILogger log)
    {
        // In production, this would:
        // 1. Store processed event in Azure SQL
        // 2. Update customer analytics
        // 3. Trigger recommendation engine if needed
        // 4. Update real-time dashboards
        
        await Task.Delay(100); // Simulated processing
        
        log.LogInformation($"Event processed: {eventData.Action} at {eventData.Timestamp}");
    }

    private async Task SendToEventGridAsync(CustomerEvent eventData, ILogger log)
    {
        // Send to Event Grid for downstream consumers like Power BI
        await Task.Delay(50); // Simulated sending
        
        log.LogInformation($"Event sent to Event Grid: {eventData.Action}");
    }
}

public class CustomerEvent
{
    public int CustomerId { get; set; }
    public string Action { get; set; } = string.Empty;
    public string Channel { get; set; } = string.Empty;
    public string? Device { get; set; }
    public string? Browser { get; set; }
    public string? Location { get; set; }
    public int? ProductId { get; set; }
    public string? Metadata { get; set; }
    public string? SessionId { get; set; }
    public DateTime Timestamp { get; set; }
}
