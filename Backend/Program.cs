using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Serilog;
using CustomerAnalytics.Api.Data;
using CustomerAnalytics.Api.Services;
using CustomerAnalytics.Api.Repositories;
using CustomerAnalytics.Api.Azure;
using CustomerAnalytics.Api.Middleware;
using CustomerAnalytics.Api.Configuration;
using CustomerAnalytics.Api.Models;
using BCrypt.Net;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/analytics-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    });

// Configure Entity Framework with SQLite for local development
builder.Services.AddDbContext<AnalyticsDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings?.Issuer,
        ValidAudience = jwtSettings?.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings?.SecretKey ?? "DefaultSecretKey12345678901234567890")),
        ClockSkew = TimeSpan.Zero
    };
});

// Configure Azure Services
builder.Services.Configure<AzureSettings>(builder.Configuration.GetSection("AzureSettings"));
builder.Services.AddSingleton<IAzureEventHubService, AzureEventHubService>();
builder.Services.AddSingleton<IAzureSynapseService, AzureSynapseService>();
builder.Services.AddHttpContextAccessor();

// Configure Repositories
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<ICampaignRepository, CampaignRepository>();
builder.Services.AddScoped<IRecommendationRepository, RecommendationRepository>();

// Configure Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IEventTrackingService, EventTrackingService>();
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();
builder.Services.AddScoped<IRecommendationService, RecommendationService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
                    "http://localhost:3000",
                    "https://happy-flower-076267500.7.azurestaticapps.net")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configure Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Customer Analytics API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
app.UseSwagger();
app.UseSwaggerUI();

// Use CORS
app.UseCors("AllowReactApp");

// Use custom exception handling middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Ensure database is created and seeded
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AnalyticsDbContext>();
    db.Database.EnsureCreated();
    await SeedProductCatalogAsync(db);
    await SeedAdminUserAsync(db);
    await SeedCustomerUsersAsync(db);
}

app.Run();

static async Task SeedProductCatalogAsync(AnalyticsDbContext db)
{
    var products = ProductSeedCatalog.Products;

    foreach (var seed in products)
    {
        var existing = await db.Products.FirstOrDefaultAsync(p => p.Id == seed.Id);
        if (existing == null)
        {
            db.Products.Add(seed);
            continue;
        }

        existing.Name = seed.Name;
        existing.Description = seed.Description;
        existing.Price = seed.Price;
        existing.Category = seed.Category;
        existing.ImageUrl = seed.ImageUrl;
        existing.StockQuantity = seed.StockQuantity;
        existing.IsActive = true;
        existing.UpdatedAt = DateTime.UtcNow;
    }

    await db.SaveChangesAsync();
}

static async Task SeedAdminUserAsync(AnalyticsDbContext db)
{
    const string adminEmail = "admin@customeranalytics.com";
    var existingAdmin = await db.Customers.FirstOrDefaultAsync(c => c.Email == adminEmail);
    if (existingAdmin == null)
    {
        var admin = new Customer
        {
            Email = adminEmail,
            FirstName = "Admin",
            LastName = "User",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Role = "Admin",
            CreatedAt = DateTime.UtcNow,
            IsActive = true,
            AcquisitionSource = "System"
        };
        db.Customers.Add(admin);
        await db.SaveChangesAsync();
    }
    else if (existingAdmin.Role != "Admin")
    {
        existingAdmin.Role = "Admin";
        await db.SaveChangesAsync();
    }
}

static async Task SeedCustomerUsersAsync(AnalyticsDbContext db)
{
    if (await db.Customers.AnyAsync(c => c.Role == "Customer"))
        return;

    var customers = new List<Customer>
    {
        new Customer { Email = "priyasharma002@gmail.com", FirstName = "Priya", LastName = "Sharma", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Priya@123"), Role = "Customer", PhoneNumber = "+91-9876543210", CreatedAt = new DateTime(2025, 1, 15, 0, 0, 0, DateTimeKind.Utc), IsActive = true, AcquisitionSource = "Google Ads", TotalSpent = 12499m, TotalOrders = 5, Segment = "Premium", LifetimeValue = 12499m },
        new Customer { Email = "rahulverma@gmail.com", FirstName = "Rahul", LastName = "Verma", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Rahul@123"), Role = "Customer", PhoneNumber = "+91-9876543211", CreatedAt = new DateTime(2025, 2, 20, 0, 0, 0, DateTimeKind.Utc), IsActive = true, AcquisitionSource = "Facebook", TotalSpent = 8750m, TotalOrders = 3, Segment = "Regular", LifetimeValue = 8750m },
        new Customer { Email = "ananyapatel@gmail.com", FirstName = "Ananya", LastName = "Patel", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Ananya@123"), Role = "Customer", PhoneNumber = "+91-9876543212", CreatedAt = new DateTime(2025, 3, 10, 0, 0, 0, DateTimeKind.Utc), IsActive = true, AcquisitionSource = "Instagram", TotalSpent = 21300m, TotalOrders = 8, Segment = "VIP", LifetimeValue = 21300m },
        new Customer { Email = "vikramsingh@gmail.com", FirstName = "Vikram", LastName = "Singh", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Vikram@123"), Role = "Customer", PhoneNumber = "+91-9876543213", CreatedAt = new DateTime(2025, 4, 5, 0, 0, 0, DateTimeKind.Utc), IsActive = true, AcquisitionSource = "Direct", TotalSpent = 5200m, TotalOrders = 2, Segment = "New", LifetimeValue = 5200m },
        new Customer { Email = "meeranair@gmail.com", FirstName = "Meera", LastName = "Nair", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Meera@123"), Role = "Customer", PhoneNumber = "+91-9876543214", CreatedAt = new DateTime(2025, 5, 18, 0, 0, 0, DateTimeKind.Utc), IsActive = true, AcquisitionSource = "Google Ads", TotalSpent = 15800m, TotalOrders = 6, Segment = "Premium", LifetimeValue = 15800m },
        new Customer { Email = "arjunreddy@gmail.com", FirstName = "Arjun", LastName = "Reddy", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Arjun@123"), Role = "Customer", PhoneNumber = "+91-9876543215", CreatedAt = new DateTime(2025, 6, 22, 0, 0, 0, DateTimeKind.Utc), IsActive = true, AcquisitionSource = "Referral", TotalSpent = 3450m, TotalOrders = 1, Segment = "New", LifetimeValue = 3450m },
        new Customer { Email = "kavyaiyer@gmail.com", FirstName = "Kavya", LastName = "Iyer", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Kavya@123"), Role = "Customer", PhoneNumber = "+91-9876543216", CreatedAt = new DateTime(2025, 7, 8, 0, 0, 0, DateTimeKind.Utc), IsActive = true, AcquisitionSource = "Facebook", TotalSpent = 9900m, TotalOrders = 4, Segment = "Regular", LifetimeValue = 9900m },
        new Customer { Email = "rohitgupta@gmail.com", FirstName = "Rohit", LastName = "Gupta", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Rohit@123"), Role = "Customer", PhoneNumber = "+91-9876543217", CreatedAt = new DateTime(2025, 8, 14, 0, 0, 0, DateTimeKind.Utc), IsActive = false, AcquisitionSource = "Instagram", TotalSpent = 2100m, TotalOrders = 1, Segment = "At Risk", LifetimeValue = 2100m, ChurnScore = 0.78m },
        new Customer { Email = "nehamishra@gmail.com", FirstName = "Neha", LastName = "Mishra", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Neha@123"), Role = "Customer", PhoneNumber = "+91-9876543218", CreatedAt = new DateTime(2025, 9, 1, 0, 0, 0, DateTimeKind.Utc), IsActive = true, AcquisitionSource = "Direct", TotalSpent = 18200m, TotalOrders = 7, Segment = "Premium", LifetimeValue = 18200m },
        new Customer { Email = "amitkumar@gmail.com", FirstName = "Amit", LastName = "Kumar", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Amit@123"), Role = "Customer", PhoneNumber = "+91-9876543219", CreatedAt = new DateTime(2025, 10, 12, 0, 0, 0, DateTimeKind.Utc), IsActive = true, AcquisitionSource = "Google Ads", TotalSpent = 6700m, TotalOrders = 3, Segment = "Regular", LifetimeValue = 6700m },
        new Customer { Email = "sneha95@gmail.com", FirstName = "Sneha", LastName = "Das", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Sneha@123"), Role = "Customer", PhoneNumber = "+91-9876543220", CreatedAt = new DateTime(2025, 11, 3, 0, 0, 0, DateTimeKind.Utc), IsActive = true, AcquisitionSource = "Referral", TotalSpent = 4300m, TotalOrders = 2, Segment = "New", LifetimeValue = 4300m },
        new Customer { Email = "karthikramesh@gmail.com", FirstName = "Karthik", LastName = "Ramesh", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Karthik@123"), Role = "Customer", PhoneNumber = "+91-9876543221", CreatedAt = new DateTime(2025, 12, 20, 0, 0, 0, DateTimeKind.Utc), IsActive = true, AcquisitionSource = "Facebook", TotalSpent = 11500m, TotalOrders = 5, Segment = "Premium", LifetimeValue = 11500m },
    };

    foreach (var c in customers)
    {
        c.LastLoginAt = c.CreatedAt.AddDays(new Random().Next(1, 30));
        c.ChurnScore = c.IsActive ? Math.Round((decimal)new Random().Next(5, 40) / 100, 4) : 0.75m;
    }

    db.Customers.AddRange(customers);
    await db.SaveChangesAsync();
}
