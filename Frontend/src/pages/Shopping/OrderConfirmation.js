import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Button,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ReceiptIcon from '@mui/icons-material/Receipt';

const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Paper
        elevation={0}
        sx={{
          p: 5,
          maxWidth: 520,
          width: '100%',
          textAlign: 'center',
          border: '1px solid #e2e8f0',
          borderRadius: 4,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e91e63, #f06292)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 44, color: '#fff' }} />
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
          Order Confirmed!
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', mb: 3 }}>
          Thank you for your purchase. Your order has been placed successfully.
        </Typography>

        <Box
          sx={{
            p: 2,
            bgcolor: '#f8fafc',
            borderRadius: 2,
            mb: 3,
            border: '1px solid #e2e8f0',
          }}
        >
          <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
            Order Number
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2563eb', fontFamily: 'monospace' }}>
            {orderNumber}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<ReceiptIcon />}
            onClick={() => navigate('/orders')}
            sx={{
              px: 3,
              py: 1.25,
              fontWeight: 600,
              borderRadius: 2.5,
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            }}
          >
            View Orders
          </Button>
          <Button
            variant="outlined"
            startIcon={<ShoppingBagIcon />}
            onClick={() => navigate('/products')}
            sx={{
              px: 3,
              py: 1.25,
              fontWeight: 600,
              borderRadius: 2.5,
              borderColor: '#e2e8f0',
              color: '#475569',
              '&:hover': { borderColor: '#2563eb', color: '#2563eb', bgcolor: '#f8fafc' },
            }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default OrderConfirmation;
