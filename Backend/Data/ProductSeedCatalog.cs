using CustomerAnalytics.Api.Models;

namespace CustomerAnalytics.Api.Data;

public static class ProductSeedCatalog
{
    public static readonly Product[] Products =
    [
        new Product
        {
            Id = 1,
            Name = "Wireless Bluetooth Headphones",
            Description = "Over-ear noise cancelling headphones with deep bass and all-day battery life.",
            Price = 7999.00m,
            Category = "Electronics",
            ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
            StockQuantity = 100,
            IsActive = true
        },
        new Product
        {
            Id = 2,
            Name = "Smart Watch Pro",
            Description = "A fitness-focused smartwatch with heart-rate tracking, GPS, and call alerts.",
            Price = 12999.00m,
            Category = "Electronics",
            ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
            StockQuantity = 75,
            IsActive = true
        },
        new Product
        {
            Id = 3,
            Name = "Organic Cotton T-Shirt",
            Description = "Soft everyday cotton tee made for comfort and easy styling.",
            Price = 999.00m,
            Category = "Clothing",
            ImageUrl = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
            StockQuantity = 200,
            IsActive = true
        },
        new Product
        {
            Id = 4,
            Name = "Running Shoes",
            Description = "Lightweight cushioned running shoes built for long-distance comfort.",
            Price = 4499.00m,
            Category = "Sports",
            ImageUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
            StockQuantity = 50,
            IsActive = true
        },
        new Product
        {
            Id = 5,
            Name = "Coffee Maker Deluxe",
            Description = "Compact drip coffee maker with programmable brew settings.",
            Price = 8999.00m,
            Category = "Home",
            ImageUrl = "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop",
            StockQuantity = 150,
            IsActive = true
        },
        new Product
        {
            Id = 6,
            Name = "Wireless Mechanical Keyboard",
            Description = "Tactile wireless keyboard with RGB lighting and hot-swappable switches.",
            Price = 6499.00m,
            Category = "Electronics",
            ImageUrl = "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop",
            StockQuantity = 90,
            IsActive = true
        },
        new Product
        {
            Id = 7,
            Name = "Stainless Steel Water Bottle",
            Description = "Insulated bottle that keeps drinks cold or hot for hours.",
            Price = 1499.00m,
            Category = "Lifestyle",
            ImageUrl = "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
            StockQuantity = 250,
            IsActive = true
        },
        new Product
        {
            Id = 8,
            Name = "Noise Cancelling Earbuds",
            Description = "Pocket-friendly true wireless earbuds with crisp sound and ANC.",
            Price = 5999.00m,
            Category = "Electronics",
            ImageUrl = "https://images.unsplash.com/photo-1600375104627-c94c416deefa?w=400&h=400&fit=crop",
            StockQuantity = 120,
            IsActive = true
        },
        new Product
        {
            Id = 9,
            Name = "Laptop Backpack",
            Description = "Durable water-resistant backpack with padded laptop storage.",
            Price = 3499.00m,
            Category = "Accessories",
            ImageUrl = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
            StockQuantity = 140,
            IsActive = true
        },
        new Product
        {
            Id = 10,
            Name = "Smart Home Speaker",
            Description = "Voice-enabled speaker for music, routines, and smart home control.",
            Price = 9999.00m,
            Category = "Electronics",
            ImageUrl = "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&h=400&fit=crop",
            StockQuantity = 60,
            IsActive = true
        },
        new Product
        {
            Id = 11,
            Name = "Face Serum Trio",
            Description = "Hydrating skincare set with vitamin C, hyaluronic acid, and niacinamide.",
            Price = 2299.00m,
            Category = "Beauty",
            ImageUrl = "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
            StockQuantity = 180,
            IsActive = true
        },
        new Product
        {
            Id = 12,
            Name = "Denim Jacket",
            Description = "Classic fit denim jacket for casual layering across seasons.",
            Price = 2999.00m,
            Category = "Clothing",
            ImageUrl = "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop",
            StockQuantity = 80,
            IsActive = true
        },
        new Product
        {
            Id = 13,
            Name = "Gaming Mouse Pro",
            Description = "High-precision gaming mouse with customizable buttons and RGB lighting.",
            Price = 2799.00m,
            Category = "Electronics",
            ImageUrl = "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop",
            StockQuantity = 110,
            IsActive = true
        },
        new Product
        {
            Id = 14,
            Name = "Ambient Desk Lamp",
            Description = "Minimal LED desk lamp with adjustable brightness and warm light modes.",
            Price = 1899.00m,
            Category = "Home",
            ImageUrl = "https://images.unsplash.com/photo-1774647002345-5301814a66bb?w=400&h=400&fit=crop",
            StockQuantity = 95,
            IsActive = true
        },
        new Product
        {
            Id = 15,
            Name = "Yoga Mat",
            Description = "Non-slip eco-friendly yoga mat for workouts, stretching, and meditation.",
            Price = 1599.00m,
            Category = "Sports",
            ImageUrl = "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop",
            StockQuantity = 160,
            IsActive = true
        },
        new Product
        {
            Id = 16,
            Name = "Smartphone Tripod",
            Description = "Portable tripod with adjustable height for photos, reels, and video calls.",
            Price = 2499.00m,
            Category = "Accessories",
            ImageUrl = "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=400&fit=crop",
            StockQuantity = 130,
            IsActive = true
        },
        new Product
        {
            Id = 17,
            Name = "Hardcover Novel Set",
            Description = "A curated set of bestselling novels for your reading shelf.",
            Price = 1899.00m,
            Category = "Books",
            ImageUrl = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
            StockQuantity = 70,
            IsActive = true
        },
        new Product
        {
            Id = 18,
            Name = "Protein Granola Pack",
            Description = "Healthy snack pack with oats, nuts, and extra protein.",
            Price = 699.00m,
            Category = "Grocery",
            ImageUrl = "https://images.unsplash.com/photo-1517093728432-a0440f8d45af?w=400&h=400&fit=crop",
            StockQuantity = 300,
            IsActive = true
        },
        new Product
        {
            Id = 19,
            Name = "Executive Notebook Set",
            Description = "Premium notebooks and pens for work, study, and planning.",
            Price = 1299.00m,
            Category = "Office",
            ImageUrl = "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop",
            StockQuantity = 140,
            IsActive = true
        },
        new Product
        {
            Id = 20,
            Name = "Ceramic Dinner Set",
            Description = "Elegant ceramic plates and bowls for everyday dining.",
            Price = 3999.00m,
            Category = "Home",
            ImageUrl = "https://images.unsplash.com/photo-1603199506016-5d549032bb74?w=400&h=400&fit=crop",
            StockQuantity = 85,
            IsActive = true
        },
        new Product
        {
            Id = 21,
            Name = "Skincare Essentials Kit",
            Description = "Daily skincare routine with cleanser, toner, and moisturizer.",
            Price = 2599.00m,
            Category = "Beauty",
            ImageUrl = "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
            StockQuantity = 180,
            IsActive = true
        },
        new Product
        {
            Id = 22,
            Name = "Classic Leather Belt",
            Description = "Full-grain leather belt with a polished metal buckle.",
            Price = 1499.00m,
            Category = "Clothing",
            ImageUrl = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
            StockQuantity = 120,
            IsActive = true
        },
        new Product
        {
            Id = 23,
            Name = "Travel Pillow",
            Description = "Soft memory-foam neck pillow for flights and long road trips.",
            Price = 1199.00m,
            Category = "Lifestyle",
            ImageUrl = "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=400&h=400&fit=crop",
            StockQuantity = 150,
            IsActive = true
        },
        new Product
        {
            Id = 24,
            Name = "Kids Building Blocks",
            Description = "Colorful building block set for creative play and learning.",
            Price = 1799.00m,
            Category = "Toys",
            ImageUrl = "https://images.unsplash.com/photo-1752322069850-f92b5ce0e961?w=400&h=400&fit=crop",
            StockQuantity = 200,
            IsActive = true
        }
    ];
}
