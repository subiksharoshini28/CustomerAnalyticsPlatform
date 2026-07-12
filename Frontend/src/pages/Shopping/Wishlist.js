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
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  FavoriteBorder as EmptyWishlistIcon,
} from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/currency';
import { getProductImage, handleImageError } from '../../utils/productImages';
import { getWishlist, setWishlist } from '../../utils/wishlistStorage';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    setWishlistItems(getWishlist());
  }, []);

  const removeFromWishlist = (productId, productName) => {
    const updated = wishlistItems.filter((item) => item.id !== productId);
    setWishlistItems(updated);
    setWishlist(updated);
    setSnackbar({ open: true, message: `${productName} removed from wishlist`, severity: 'info' });
  };

  const handleAddToCart = async (productId, productName) => {
    await addToCart(productId);
    removeFromWishlist(productId, productName);
    setSnackbar({ open: true, message: `${productName} added to cart`, severity: 'success' });
  };

  if (wishlistItems.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: '#fef2f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <EmptyWishlistIcon sx={{ fontSize: 40, color: '#fca5a5' }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
          Your wishlist is empty
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
          Save your favorite products here for later.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/products')}
          sx={{
            px: 4,
            py: 1.25,
            borderRadius: 2.5,
            fontWeight: 600,
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
          }}
        >
          Browse Products
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
          Wishlist
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        {wishlistItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/products/${item.id}`)}
            >
              <Box sx={{ position: 'relative', bgcolor: '#f8fafc', p: 2 }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={getProductImage(item.id, item.imageUrl)}
                  alt={item.name}
                  onError={(e) => handleImageError(e, item.id)}
                  sx={{ objectFit: 'contain', borderRadius: 2 }}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1, p: 2.5, pt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a', mb: 0.5 }}>
                  {item.name}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2563eb', mb: 2 }}>
                  {formatINR(item.price)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<CartIcon sx={{ fontSize: 16 }} />}
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(item.id, item.name); }}
                    fullWidth
                    sx={{ borderRadius: 2, fontWeight: 600, fontSize: '0.82rem' }}
                  >
                    Add to Cart
                  </Button>
                  <IconButton
                    color="error"
                    onClick={(e) => { e.stopPropagation(); removeFromWishlist(item.id, item.name); }}
                    size="small"
                    sx={{ border: '1px solid #fecaca', borderRadius: 2, '&:hover': { bgcolor: '#fef2f2' } }}
                  >
                    <DeleteIcon fontSize="small" />
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
