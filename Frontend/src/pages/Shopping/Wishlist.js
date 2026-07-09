import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon, ShoppingCart as CartIcon } from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/currency';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, []);

  const removeFromWishlist = (productId) => {
    const updated = wishlistItems.filter((item) => item.id !== productId);
    setWishlistItems(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  const handleAddToCart = async (productId) => {
    await addToCart(productId);
    removeFromWishlist(productId);
  };

  if (wishlistItems.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Your wishlist is empty
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          Browse Products
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Wishlist ({wishlistItems.length} items)
      </Typography>

      <Grid container spacing={3}>
        {wishlistItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={item.imageUrl || '/images/product-placeholder.svg'}
                alt={item.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/product-placeholder.svg';
                }}
                sx={{ objectFit: 'contain', p: 2 }}
                onClick={() => navigate(`/products/${item.id}`)}
              />
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/products/${item.id}`)}
                >
                  {item.name}
                </Typography>
                <Typography color="primary" sx={{ mb: 2 }}>
                  {formatINR(item.price)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<CartIcon />}
                    onClick={() => handleAddToCart(item.id)}
                    fullWidth
                  >
                    Add to Cart
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Wishlist;
