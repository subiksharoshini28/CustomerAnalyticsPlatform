using Azure.Messaging.EventHubs;
using Azure.Messaging.EventHubs.Producer;
using Microsoft.Extensions.Options;
using CustomerAnalytics.Api.DTOs;
using CustomerAnalytics.Api.Configuration;

namespace CustomerAnalytics.Api.Azure;

public interface IAzureEventHubService
{
    Task SendEventAsync(TrackEventDto eventDto, int customerId);
    Task SendBatchEventsAsync(IEnumerable<(TrackEventDto Event, int CustomerId)> events);
}

public class AzureEventHubService : IAzureEventHubService
{
    private EventHubProducerClient? _producerClient;
    private readonly ILogger<AzureEventHubService> _logger;
    private readonly bool _isAvailable;

    public AzureEventHubService(IOptions<AzureSettings> settings, ILogger<AzureEventHubService> logger)
    {
        _logger = logger;

        try
        {
            if (!string.IsNullOrEmpty(settings.Value.EventHubConnectionString) && 
                !settings.Value.EventHubConnectionString.Contains("your-namespace"))
            {
                _producerClient = new EventHubProducerClient(
                    settings.Value.EventHubConnectionString,
                    settings.Value.EventHubName);
                _isAvailable = true;
            }
            else
            {
                _logger.LogWarning("Azure Event Hub not configured. Events will be logged but not sent.");
                _isAvailable = false;
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to connect to Azure Event Hub. Events will be logged but not sent.");
            _isAvailable = false;
        }
    }

    public async Task SendEventAsync(TrackEventDto eventDto, int customerId)
    {
        try
        {
            if (!_isAvailable || _producerClient == null)
            {
                _logger.LogInformation("Event Hub not available. Event: {Action} for Customer: {CustomerId}", eventDto.Action, customerId);
                return;
            }

            var jsonData = Newtonsoft.Json.JsonConvert.SerializeObject(new
            {
                CustomerId = customerId,
                eventDto.Action,
                eventDto.Channel,
                eventDto.Device,
                eventDto.Browser,
                eventDto.Location,
                eventDto.ProductId,
                eventDto.Metadata,
                eventDto.SessionId,
                eventDto.Referrer,
                Timestamp = DateTime.UtcNow
            });

            var eventData = new EventData(System.Text.Encoding.UTF8.GetBytes(jsonData));
            eventData.Properties.Add("CustomerId", customerId);
            eventData.Properties.Add("Action", eventDto.Action);
            eventData.Properties.Add("Channel", eventDto.Channel);

            await _producerClient.SendAsync(new[] { eventData });
            _logger.LogInformation("Event sent to Event Hub: {Action} for Customer: {CustomerId}", eventDto.Action, customerId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending event to Event Hub");
        }
    }

    public async Task SendBatchEventsAsync(IEnumerable<(TrackEventDto Event, int CustomerId)> events)
    {
        try
        {
            if (!_isAvailable || _producerClient == null)
            {
                _logger.LogInformation("Event Hub not available. Batch events will be logged.");
                return;
            }

            var eventCount = 0;
            EventDataBatch? currentBatch = null;

            foreach (var (eventDto, customerId) in events)
            {
                var jsonData = Newtonsoft.Json.JsonConvert.SerializeObject(new
                {
                    CustomerId = customerId,
                    eventDto.Action,
                    eventDto.Channel,
                    eventDto.Device,
                    eventDto.Browser,
                    eventDto.Location,
                    eventDto.ProductId,
                    eventDto.Metadata,
                    eventDto.SessionId,
                    eventDto.Referrer,
                    Timestamp = DateTime.UtcNow
                });

                var eventData = new EventData(System.Text.Encoding.UTF8.GetBytes(jsonData));
                eventData.Properties.Add("CustomerId", customerId);
                eventData.Properties.Add("Action", eventDto.Action);

                if (currentBatch == null)
                {
                    currentBatch = await _producerClient.CreateBatchAsync();
                }

                if (!currentBatch.TryAdd(eventData))
                {
                    if (currentBatch.Count > 0)
                    {
                        await _producerClient.SendAsync(currentBatch);
                    }
                    currentBatch.Dispose();
                    currentBatch = await _producerClient.CreateBatchAsync();
                    currentBatch.TryAdd(eventData);
                }
                eventCount++;
            }

            if (currentBatch != null && currentBatch.Count > 0)
            {
                await _producerClient.SendAsync(currentBatch);
            }
            currentBatch?.Dispose();

            _logger.LogInformation("Batch of {Count} events sent to Event Hub", eventCount);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending batch events to Event Hub");
        }
    }

    public async ValueTask DisposeAsync()
    {
        if (_producerClient != null)
        {
            await _producerClient.DisposeAsync();
        }
    }
}
