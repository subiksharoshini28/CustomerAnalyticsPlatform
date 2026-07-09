namespace CustomerAnalytics.Api.Configuration;

public class JwtSettings
{
    public string SecretKey { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public int ExpirationInMinutes { get; set; } = 60;
}

public class AzureSettings
{
    public string EventHubConnectionString { get; set; } = string.Empty;
    public string EventHubName { get; set; } = string.Empty;
    public string StorageConnectionString { get; set; } = string.Empty;
    public string SynapseConnectionString { get; set; } = string.Empty;
    public string AIEndpoint { get; set; } = string.Empty;
    public string AIKey { get; set; } = string.Empty;
}
