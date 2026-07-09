-- Customer Analytics Platform Database Schema
-- SQL Server / Azure SQL Database

-- Create Database
CREATE DATABASE CustomerAnalyticsDb;
GO

USE CustomerAnalyticsDb;
GO

-- Customers Table
CREATE TABLE Customers (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Email NVARCHAR(256) NOT NULL UNIQUE,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    PhoneNumber NVARCHAR(20) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    LastLoginAt DATETIME2 NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    TotalSpent DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalOrders INT NOT NULL DEFAULT 0,
    ChurnScore DECIMAL(5,4) NOT NULL DEFAULT 0,
    LifetimeValue DECIMAL(18,2) NOT NULL DEFAULT 0,
    Segment NVARCHAR(50) NULL,
    AcquisitionSource NVARCHAR(50) NULL
);

-- Products Table
CREATE TABLE Products (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(2000) NULL,
    Price DECIMAL(18,2) NOT NULL,
    Category NVARCHAR(100) NOT NULL,
    ImageUrl NVARCHAR(500) NULL,
    StockQuantity INT NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL
);

-- Orders Table
CREATE TABLE Orders (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CustomerId INT NOT NULL,
    OrderNumber NVARCHAR(50) NOT NULL UNIQUE,
    TotalAmount DECIMAL(18,2) NOT NULL,
    Tax DECIMAL(18,2) NOT NULL DEFAULT 0,
    ShippingCost DECIMAL(18,2) NOT NULL DEFAULT 0,
    Discount DECIMAL(18,2) NOT NULL DEFAULT 0,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Pending',
    PaymentMethod NVARCHAR(50) NOT NULL,
    ShippingAddress NVARCHAR(500) NOT NULL,
    OrderDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ShippedDate DATETIME2 NULL,
    DeliveredDate DATETIME2 NULL,
    FOREIGN KEY (CustomerId) REFERENCES Customers(Id) ON DELETE CASCADE
);

-- OrderItems Table
CREATE TABLE OrderItems (
    Id INT PRIMARY KEY IDENTITY(1,1),
    OrderId INT NOT NULL,
    ProductId INT NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    TotalPrice DECIMAL(18,2) NOT NULL,
    FOREIGN KEY (OrderId) REFERENCES Orders(Id) ON DELETE CASCADE,
    FOREIGN KEY (ProductId) REFERENCES Products(Id)
);

-- CustomerInteractions Table (Events)
CREATE TABLE CustomerInteractions (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CustomerId INT NOT NULL,
    Channel NVARCHAR(50) NOT NULL,
    Action NVARCHAR(100) NOT NULL,
    Timestamp DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    Device NVARCHAR(100) NULL,
    Browser NVARCHAR(100) NULL,
    Location NVARCHAR(200) NULL,
    ProductId INT NULL,
    Metadata NVARCHAR(MAX) NULL,
    SessionId NVARCHAR(100) NULL,
    Referrer NVARCHAR(500) NULL,
    FOREIGN KEY (CustomerId) REFERENCES Customers(Id) ON DELETE CASCADE
);

-- Campaigns Table
CREATE TABLE Campaigns (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(200) NOT NULL,
    Channel NVARCHAR(50) NOT NULL,
    StartDate DATETIME2 NOT NULL,
    EndDate DATETIME2 NOT NULL,
    Budget DECIMAL(18,2) NOT NULL,
    Spend DECIMAL(18,2) NOT NULL DEFAULT 0,
    Impressions INT NOT NULL DEFAULT 0,
    Clicks INT NOT NULL DEFAULT 0,
    Conversions INT NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- SupportTickets Table
CREATE TABLE SupportTickets (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CustomerId INT NOT NULL,
    Subject NVARCHAR(200) NOT NULL,
    Description NVARCHAR(2000) NULL,
    Channel NVARCHAR(50) NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Open',
    Priority NVARCHAR(20) NOT NULL DEFAULT 'Medium',
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ResolvedAt DATETIME2 NULL,
    SatisfactionRating INT NULL,
    FOREIGN KEY (CustomerId) REFERENCES Customers(Id) ON DELETE CASCADE
);

-- Recommendations Table
CREATE TABLE Recommendations (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CustomerId INT NOT NULL,
    ProductId INT NOT NULL,
    Score DECIMAL(5,4) NOT NULL,
    Reason NVARCHAR(200) NOT NULL,
    GeneratedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsClicked BIT NOT NULL DEFAULT 0,
    IsPurchased BIT NOT NULL DEFAULT 0,
    FOREIGN KEY (CustomerId) REFERENCES Customers(Id) ON DELETE CASCADE,
    FOREIGN KEY (ProductId) REFERENCES Products(Id)
);

-- UserSessions Table
CREATE TABLE UserSessions (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CustomerId INT NOT NULL,
    SessionId NVARCHAR(100) NOT NULL,
    StartTime DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    EndTime DATETIME2 NULL,
    Device NVARCHAR(100) NULL,
    Browser NVARCHAR(100) NULL,
    IpAddress NVARCHAR(50) NULL,
    Location NVARCHAR(200) NULL,
    PagesViewed INT NOT NULL DEFAULT 0,
    IsConverted BIT NOT NULL DEFAULT 0,
    FOREIGN KEY (CustomerId) REFERENCES Customers(Id) ON DELETE CASCADE
);

-- WishlistItems Table
CREATE TABLE WishlistItems (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CustomerId INT NOT NULL,
    ProductId INT NOT NULL,
    AddedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (CustomerId) REFERENCES Customers(Id) ON DELETE CASCADE,
    FOREIGN KEY (ProductId) REFERENCES Products(Id)
);

-- CartItems Table
CREATE TABLE CartItems (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CustomerId INT NOT NULL,
    ProductId INT NOT NULL,
    Quantity INT NOT NULL DEFAULT 1,
    AddedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (CustomerId) REFERENCES Customers(Id) ON DELETE CASCADE,
    FOREIGN KEY (ProductId) REFERENCES Products(Id)
);

-- Create Indexes
CREATE INDEX IX_Customers_Email ON Customers(Email);
CREATE INDEX IX_Customers_LastLoginAt ON Customers(LastLoginAt);
CREATE INDEX IX_Orders_CustomerId ON Orders(CustomerId);
CREATE INDEX IX_Orders_OrderDate ON Orders(OrderDate);
CREATE INDEX IX_OrderItems_OrderId ON OrderItems(OrderId);
CREATE INDEX IX_OrderItems_ProductId ON OrderItems(ProductId);
CREATE INDEX IX_CustomerInteractions_CustomerId ON CustomerInteractions(CustomerId);
CREATE INDEX IX_CustomerInteractions_Timestamp ON CustomerInteractions(Timestamp);
CREATE INDEX IX_CustomerInteractions_Channel ON CustomerInteractions(Channel);
CREATE INDEX IX_CustomerInteractions_Action ON CustomerInteractions(Action);
CREATE INDEX IX_Products_Category ON Products(Category);
CREATE INDEX IX_Products_Name ON Products(Name);
CREATE INDEX IX_Recommendations_CustomerId ON Recommendations(CustomerId);
CREATE INDEX IX_UserSessions_CustomerId ON UserSessions(CustomerId);

-- Seed Products
INSERT INTO Products (Name, Description, Price, Category, ImageUrl, StockQuantity)
VALUES
('Wireless Bluetooth Headphones', 'High-quality wireless headphones with noise cancellation', 199.99, 'Electronics', '/images/headphones.jpg', 100),
('Smart Watch Pro', 'Feature-rich smartwatch with health tracking', 299.99, 'Electronics', '/images/smartwatch.jpg', 75),
('Organic Cotton T-Shirt', 'Comfortable organic cotton t-shirt', 29.99, 'Clothing', '/images/tshirt.jpg', 200),
('Running Shoes', 'Lightweight running shoes for professional athletes', 149.99, 'Sports', '/images/shoes.jpg', 50),
('Coffee Maker Deluxe', 'Premium coffee maker with programmable features', 89.99, 'Home', '/images/coffeemaker.jpg', 150);

-- Seed Campaigns
INSERT INTO Campaigns (Name, Channel, StartDate, EndDate, Budget, Spend, Impressions, Clicks, Conversions)
VALUES
('Summer Sale 2024', 'Email', '2024-06-01', '2024-08-31', 10000, 7500, 50000, 5000, 250),
('Social Media Blitz', 'Facebook', '2024-07-01', '2024-07-31', 5000, 4200, 30000, 3000, 150),
('Google Ads Campaign', 'Google', '2024-07-15', '2024-09-15', 15000, 8000, 75000, 7500, 375);

PRINT 'Database schema created successfully!';
GO
