import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  Divider,
  TextField,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  ArrowForward as ArrowIcon,
  LocalOffer as PromoIcon,
} from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/currency';
import { getProductImage, handleImageError } from '../../utils/productImages';

const Cart = () => {
  const { cart, loading, updateCartItem, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" sx={{ color: '#64748b' }}>Loading cart...</Typography>
      </Box>
    );
  }

  if (cart.items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <CartIcon sx={{ fontSize: 40, color: '#cbd5e1' }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
          Your cart is empty
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
          Looks like you haven't added anything to your cart yet.
        </Typography>
        <Button
          variant="contained"
          endIcon={<ArrowIcon />}
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
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
          Shopping Cart
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'} in your cart
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {cart.items.map((item, index) => (
            <Card
              key={item.id}
              elevation={0}
              sx={{
                mb: 2,
                border: '1px solid #e2e8f0',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3} sm={2}>
                    <Box sx={{ bgcolor: '#f8fafc', borderRadius: 2, p: 1, textAlign: 'center' }}>
                      <CardMedia
                        component="img"
                        height="80"
                        image={getProductImage(item.productId, item.imageUrl)}
                        alt={item.productName}
                        onError={(e) => handleImageError(e, item.productId)}
                        sx={{ objectFit: 'contain', borderRadius: 1 }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={9} sm={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0f172a', mb: 0.3, fontSize: '0.9rem' }}>
                      {item.productName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {formatINR(item.price)} each
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => updateCartItem(item.productId, item.quantity - 1)} sx={{ border: '1px solid #e2e8f0', borderRadius: 1.5, width: 32, height: 32 }}>
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <TextField
                        size="small"
                        value={item.quantity}
                        onChange={(e) => {
                          const qty = parseInt(e.target.value) || 1;
                          updateCartItem(item.productId, qty);
                        }}
                        inputProps={{ min: 1, style: { textAlign: 'center', width: 40, fontSize: '0.9rem', fontWeight: 600 } }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                      />
                      <IconButton size="small" onClick={() => updateCartItem(item.productId, item.quantity + 1)} sx={{ border: '1px solid #e2e8f0', borderRadius: 1.5, width: 32, height: 32 }}>
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid item xs={4} sm={2}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2563eb' }}>
                      {formatINR(item.totalPrice)}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} sm={1}>
                    <IconButton color="error" onClick={() => removeFromCart(item.productId)} size="small" sx={{ '&:hover': { bgcolor: '#fef2f2' } }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 3, position: 'sticky', top: 80 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>
              Order Summary
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: '#64748b' }}>Subtotal</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatINR(cart.totalAmount)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: '#64748b' }}>Shipping</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#e91e63' }}>Free</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#64748b' }}>Tax (8%)</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatINR(cart.totalAmount * 0.08)}</Typography>
            </Box>

            <Divider sx={{ my: 2, borderColor: '#f1f5f9' }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2563eb' }}>
                {formatINR(cart.totalAmount + cart.totalAmount * 0.08)}
              </Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              endIcon={<ArrowIcon />}
              onClick={() => navigate('/checkout')}
              sx={{
                py: 1.5,
                fontWeight: 600,
                borderRadius: 2.5,
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                '&:hover': { background: 'linear-gradient(135deg, #1d4ed8, #6d28d9)', boxShadow: '0 4px 15px rgba(37,99,235,0.4)' },
              }}
            >
              Proceed to Checkout
            </Button>

            <Button
              variant="text"
              fullWidth
              onClick={() => navigate('/products')}
              sx={{ mt: 1, color: '#64748b', fontWeight: 500 }}
            >
              Continue Shopping
            </Button>

            <Box sx={{ mt: 2.5, p: 1.5, bgcolor: '#f0fdf4', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PromoIcon sx={{ fontSize: 18, color: '#16a34a' }} />
              <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 500 }}>
                Use code SAVE10 at checkout for 10% off
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Cart;
