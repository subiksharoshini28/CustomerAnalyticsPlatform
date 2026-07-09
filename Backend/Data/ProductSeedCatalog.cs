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
            ImageUrl = "/images/headphones.svg",
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
            ImageUrl = "/images/smartwatch.svg",
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
            ImageUrl = "/images/tshirt.svg",
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
            ImageUrl = "/images/shoes.svg",
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
            ImageUrl = "/images/coffee-maker.svg",
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
            ImageUrl = "/images/keyboard.svg",
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
            ImageUrl = "/images/bottle.svg",
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
            ImageUrl = "/images/earbuds.svg",
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
            ImageUrl = "/images/backpack.svg",
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
            ImageUrl = "/images/speaker.svg",
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
            ImageUrl = "/images/serum.svg",
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
            ImageUrl = "/images/jacket.svg",
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
            ImageUrl = "/images/mouse.svg",
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
            ImageUrl = "/images/lamp.svg",
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
            ImageUrl = "/images/yoga-mat.svg",
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
            ImageUrl = "/images/tripod.svg",
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
            ImageUrl = "/images/books.svg",
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
            ImageUrl = "/images/granola.svg",
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
            ImageUrl = "/images/notebook.svg",
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
            ImageUrl = "/images/dishes.svg",
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
            ImageUrl = "/images/skincare.svg",
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
            ImageUrl = "/images/belt.svg",
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
            ImageUrl = "/images/pillow.svg",
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
            ImageUrl = "/images/blocks.svg",
            StockQuantity = 200,
            IsActive = true
        }
    ];
}
