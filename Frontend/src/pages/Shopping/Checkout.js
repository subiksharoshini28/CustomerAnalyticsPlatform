import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Avatar,
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckIcon,
  CreditCard as CardIcon,
  QrCode as UpiIcon,
  Money as CashIcon,
} from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/currency';
import { ordersAPI } from '../../services/api';

const steps = ['Shipping', 'Payment', 'Review'];

const Checkout = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeStep] = useState(0);
  const [formData, setFormData] = useState({
    shippingAddress: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'upi',
    promoCode: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const fullAddress = `${formData.shippingAddress}, ${formData.city}, ${formData.state} ${formData.zipCode}`;
      const response = await ordersAPI.create({
        shippingAddress: fullAddress,
        paymentMethod: formData.paymentMethod,
        promoCode: formData.promoCode || null,
      });
      navigate(`/order-confirmation/${response.data.orderNumber}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  const subtotal = cart.totalAmount;
  const shipping = 0;
  const tax = subtotal * 0.08;
  const discount = formData.promoCode === 'SAVE10' ? subtotal * 0.1 : 0;
  const total = subtotal + shipping + tax - discount;

  return (
    <Box>
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
          Checkout
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Complete your order in a few simple steps
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              StepIconComponent={({ active, completed }) => (
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: completed ? '#10b981' : active ? '#2563eb' : '#e2e8f0',
                    color: completed || active ? '#fff' : '#94a3b8',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  {completed ? <CheckIcon sx={{ fontSize: 18 }} /> : label[0]}
                </Avatar>
              )}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {/* Shipping */}
            <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e2e8f0', borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: '#eff6ff', color: '#2563eb' }}>
                  <ShippingIcon fontSize="small" />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Shipping Address</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    required
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="ZIP Code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Payment */}
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: '#f5f3ff', color: '#7c3aed' }}>
                  <PaymentIcon fontSize="small" />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Payment Method</Typography>
              </Box>
              <FormControl>
                <RadioGroup
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {[
                      { value: 'credit_card', label: 'Credit Card', icon: <CardIcon />, desc: 'Pay with Visa, Mastercard, or Amex' },
                      { value: 'debit_card', label: 'Debit Card', icon: <CardIcon />, desc: 'Pay directly from your bank account' },
                      { value: 'upi', label: 'UPI Payment', icon: <UpiIcon />, desc: 'Pay via Google Pay, PhonePe, or Paytm UPI' },
                      { value: 'cod', label: 'Cash on Delivery', icon: <CashIcon />, desc: 'Pay when your order arrives at your door' },
                    ].map((option) => (
                      <Box
                        key={option.value}
                        sx={{
                          p: 2,
                          border: formData.paymentMethod === option.value ? '2px solid #2563eb' : '1px solid #e2e8f0',
                          borderRadius: 2,
                          cursor: 'pointer',
                          bgcolor: formData.paymentMethod === option.value ? '#f8fafc' : 'transparent',
                          transition: 'all 0.2s',
                          '&:hover': { borderColor: '#2563eb' },
                        }}
                        onClick={() => setFormData({ ...formData, paymentMethod: option.value })}
                      >
                        <FormControlLabel
                          value={option.value}
                          control={<Radio size="small" />}
                          label={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{option.label}</Typography>
                              <Typography variant="caption" sx={{ color: '#64748b' }}>{option.desc}</Typography>
                            </Box>
                          }
                          sx={{ m: 0 }}
                        />
                      </Box>
                    ))}
                  </Box>
                </RadioGroup>
              </FormControl>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 3, position: 'sticky', top: 80 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>
                Order Summary
              </Typography>

              {cart.items.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" sx={{ color: '#475569', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mr: 1 }}>
                    {item.productName} × {item.quantity}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatINR(item.totalPrice)}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2, borderColor: '#f1f5f9' }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748b' }}>Subtotal</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatINR(subtotal)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748b' }}>Shipping</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981' }}>Free</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748b' }}>Tax (8%)</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatINR(tax)}</Typography>
              </Box>
              {discount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#10b981' }}>Discount (SAVE10)</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981' }}>-{formatINR(discount)}</Typography>
                </Box>
              )}

              <Divider sx={{ my: 2, borderColor: '#f1f5f9' }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2563eb' }}>
                  {formatINR(total)}
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="Promo Code"
                name="promoCode"
                value={formData.promoCode}
                onChange={handleChange}
                placeholder="Enter SAVE10 for 10% off"
                size="small"
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 2.5,
                  background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                  '&:hover': { background: 'linear-gradient(135deg, #1d4ed8, #6d28d9)' },
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Place Order'}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Checkout;
