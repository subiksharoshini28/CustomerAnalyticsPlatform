# Multi-Channel Customer Experience Analytics Platform

A full-stack enterprise web application for tracking customer interactions across multiple channels, providing 360-degree customer views, analytics dashboards, and AI-powered recommendations.

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React.js      │────▶│  ASP.NET Core   │────▶│   Azure SQL     │
│   Frontend      │     │  Web API        │     │   Database      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Power BI      │◀────│  Azure Synapse  │◀────│  Azure Data     │
│   Dashboards    │     │  Analytics      │     │  Factory        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Azure AI       │◀────│  Azure Event    │◀────│  Event Grid     │
│  Recommendations│     │  Hubs           │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Project Structure

```
CustomerAnalyticsPlatform/
├── Backend/                    # ASP.NET Core Web API
│   ├── Controllers/           # API Controllers
│   ├── Models/                # Entity Models
│   ├── DTOs/                  # Data Transfer Objects
│   ├── Services/              # Business Logic Services
│   ├── Repositories/          # Data Access Layer
│   ├── Data/                  # DbContext
│   ├── Azure/                 # Azure Service Integrations
│   ├── Configuration/         # Settings Classes
│   ├── Middleware/             # Custom Middleware
│   └── Program.cs             # Application Entry Point
├── Frontend/                   # React.js Application
│   ├── src/
│   │   ├── components/        # Reusable Components
│   │   ├── pages/             # Page Components
│   │   ├── services/          # API Services
│   │   ├── context/           # React Context
│   │   ├── hooks/             # Custom Hooks
│   │   └── assets/            # Static Assets
│   └── package.json
├── AzureFunctions/             # Azure Functions
│   ├── EventProcessors/       # Event Hub Processors
│   └── Triggers/              # Timer & Event Triggers
├── Database/                   # SQL Scripts
│   └── CreateDatabase.sql     # Database Schema
└── README.md
```

## Prerequisites

- .NET 8 SDK
- Node.js 18+ and npm
- SQL Server (LocalDB or Azure SQL)
- Visual Studio 2022 or VS Code

## Quick Start

### 1. Setup Database

```bash
# Using SQL Server
sqlcmd -S localhost -U sa -P 'YourStrong!Password123' -i Database/CreateDatabase.sql
```

#### 2. Setup Backend

```bash
cd Backend

# Restore packages
dotnet restore

# Update connection string in appsettings.json
# Run migrations
dotnet ef migrations add InitialCreate
dotnet ef database update

# Start the API
dotnet run
```

The API will be available at `https://localhost:7001`

#### 3. Setup Frontend

```bash
cd Frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/{id}` | Get product by ID |
| GET | `/api/products/categories` | Get categories |
| GET | `/api/products/top/{count}` | Get top products |
| GET | `/api/products/{id}/recommendations` | Get recommendations |
| GET | `/api/products/popular` | Get popular products |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get cart |
| POST | `/api/cart` | Add to cart |
| PUT | `/api/cart/{productId}` | Update cart item |
| DELETE | `/api/cart/{productId}` | Remove from cart |
| DELETE | `/api/cart` | Clear cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order |
| GET | `/api/orders/{id}` | Get order by ID |
| GET | `/api/orders/number/{orderNumber}` | Get by order number |
| GET | `/api/orders` | Get my orders |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events` | Track event |
| GET | `/api/events/timeline` | Get timeline |
| GET | `/api/events/journey` | Get journey |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/customerjourney` | Customer journey |
| GET | `/api/analytics/churn` | Churn predictions |
| GET | `/api/analytics/segments` | Customer segments |
| GET | `/api/analytics/cohort` | Cohort analysis |
| GET | `/api/analytics/funnel` | Conversion funnel |
| GET | `/api/analytics/channels` | Channel performance |
| GET | `/api/analytics/heatmap` | Heatmap data |
| GET | `/api/analytics/activity` | Recent activity |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Full dashboard |
| GET | `/api/dashboard/stats` | Dashboard stats |
| GET | `/api/dashboard/revenue` | Revenue chart |
| GET | `/api/dashboard/top-products` | Top products |
| GET | `/api/dashboard/categories` | Top categories |
| GET | `/api/dashboard/attribution` | Marketing attribution |
| GET | `/api/dashboard/recommendations` | Recommendations |

## Features

### Customer Module
- User registration and login
- JWT authentication
- User profile management
- Purchase history

### Shopping Module
- Product listing with search and filters
- Product categories
- Shopping cart
- Wishlist
- Checkout process
- Order confirmation

### Analytics Module
- Event tracking for all customer actions
- Customer journey visualization
- Conversion funnel analysis
- Customer segmentation
- Cohort analysis
- Churn prediction
- Channel performance
- Heatmap data

### Azure Integration
- Azure Event Hubs for event streaming
- Azure Functions for event processing
- Azure SQL Database for storage
- Azure Synapse Analytics for data warehousing
- Azure Data Factory for ETL
- Azure AI for recommendations
- Power BI for dashboards

## Configuration

### Backend Configuration (appsettings.json)

```json
{
  "ConnectionStrings": {
    "AzureSql": "Server=your-server;Database=CustomerAnalyticsDb;..."
  },
  "JwtSettings": {
    "SecretKey": "YourSecretKey",
    "Issuer": "CustomerAnalyticsPlatform",
    "Audience": "CustomerAnalyticsClients",
    "ExpirationInMinutes": 60
  },
  "AzureSettings": {
    "EventHubConnectionString": "...",
    "EventHubName": "customer-events",
    "StorageConnectionString": "...",
    "SynapseConnectionString": "...",
    "AIEndpoint": "...",
    "AIKey": "..."
  }
}
```

### Frontend Configuration

Create `.env` file in Frontend directory:

```
REACT_APP_API_URL=https://localhost:7001/api
```

## Testing the Application

### 1. Register a New User

```bash
curl -X POST https://localhost:7001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "Password123!"
  }'
```

### 2. Login

```bash
curl -X POST https://localhost:7001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123!"
  }'
```

### 3. Track Events

```bash
curl -X POST https://localhost:7001/api/events \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "View Product",
    "channel": "Website",
    "productId": 1
  }'
```

## Development

### Adding New Features

1. Create models in `Backend/Models/`
2. Add DbContext in `Backend/Data/AnalyticsDbContext.cs`
3. Create DTOs in `Backend/DTOs/`
4. Implement repository in `Backend/Repositories/`
5. Implement service in `Backend/Services/`
6. Create controller in `Backend/Controllers/`
7. Create React components in `Frontend/src/`
8. Add API service in `Frontend/src/services/api.js`

### Running Tests

```bash
# Backend tests
cd Backend
dotnet test

# Frontend tests
cd Frontend
npm test
```

## Deployment

### Azure Deployment

1. **Backend**: Deploy to Azure App Service
2. **Frontend**: Deploy to Azure Static Web Apps
3. **Database**: Use Azure SQL Database
4. **Functions**: Deploy Azure Functions

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure SQL Server is running and connection string is correct
2. **CORS Errors**: Check CORS configuration in Program.cs
3. **JWT Errors**: Verify JWT secret key and settings

### Logs

- Backend logs: Check console output or `logs/` directory
- Frontend logs: Check browser console

## License

MIT License

## Support

For issues and questions, please create an issue in the repository.
