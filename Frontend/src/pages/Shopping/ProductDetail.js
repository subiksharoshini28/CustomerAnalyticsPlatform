import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  Card,
  CardContent,
  Skeleton,
  Alert,
  Avatar,
  Breadcrumbs,
  Link,
  IconButton,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  FavoriteBorder as WishlistIcon,
  Favorite as WishlistIconFilled,
  Add as AddIcon,
  Remove as RemoveIcon,
  NavigateNext as NavigateNextIcon,
  Star as StarIcon,
  LocalShipping as ShippingIcon,
  VerifiedUser as WarrantyIcon,
  Replay as ReturnIcon,
} from '@mui/icons-material';
import { productsAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { eventsAPI } from '../../services/api';
import { formatINR } from '../../utils/currency';
import { getProductImage, handleImageError } from '../../utils/productImages';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await productsAPI.getById(id);
        setProduct(response.data);
        await eventsAPI.track({ action: 'View Product', channel: 'Website', productId: parseInt(id) });
        const recResponse = await productsAPI.getRecommendations(id);
        setRecommendations(recResponse.data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    for (let i = 0; i < quantity; i++) {
      await addToCart(product.id);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleWishlist = () => {
    setWishlisted(!wishlisted);
  };

  if (loading) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}><Skeleton variant="rounded" height={450} sx={{ borderRadius: 3 }} /></Grid>
        <Grid item xs={12} md={6}><Skeleton variant="rounded" height={450} sx={{ borderRadius: 3 }} /></Grid>
      </Grid>
    );
  }

  if (!product) {
    return <Typography>Product not found</Typography>;
  }

  return (
    <Box>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
        <Link component="button" variant="body2" onClick={() => navigate('/products')} sx={{ color: '#64748b', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
          Products
        </Link>
        <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 500 }}>
          {product.name}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={3}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px solid #e2e8f0', borderRadius: 3, bgcolor: '#f8fafc' }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={getProductImage(product.id, product.imageUrl)}
                alt={product.name}
                onError={(e) => handleImageError(e, product.id)}
                style={{ maxWidth: '100%', maxHeight: 420, objectFit: 'contain', borderRadius: 12 }}
              />
              <IconButton
                onClick={handleWishlist}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  '&:hover': { bgcolor: '#fef2f2' },
                }}
              >
                {wishlisted ? <WishlistIconFilled color="error" /> : <WishlistIcon />}
              </IconButton>
            </Box>
          </Paper>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box>
            <Chip label={product.category} size="small" sx={{ mb: 1.5, bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 500, fontSize: '0.75rem' }} />

            <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a', mb: 1, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 0.25 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} sx={{ fontSize: 18, color: star <= 4 ? '#f59e0b' : '#e2e8f0' }} />
                ))}
              </Box>
              <Typography variant="body2" sx={{ color: '#64748b' }}>(4.0) · 128 reviews</Typography>
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 700, color: '#2563eb', mb: 2 }}>
              {formatINR(product.price)}
            </Typography>

            <Typography variant="body1" sx={{ color: '#475569', mb: 3, lineHeight: 1.7 }}>
              {product.description}
            </Typography>

            <Divider sx={{ my: 2.5, borderColor: '#f1f5f9' }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <ShippingIcon sx={{ fontSize: 18, color: '#10b981' }} />
                <Typography variant="body2" sx={{ color: '#475569' }}>Free Shipping</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <ReturnIcon sx={{ fontSize: 18, color: '#10b981' }} />
                <Typography variant="body2" sx={{ color: '#475569' }}>30-Day Returns</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <WarrantyIcon sx={{ fontSize: 18, color: '#10b981' }} />
                <Typography variant="body2" sx={{ color: '#475569' }}>1 Year Warranty</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Stock:
              </Typography>
              <Chip
                label={product.stockQuantity > 0 ? `${product.stockQuantity} units available` : 'Out of Stock'}
                size="small"
                sx={{
                  bgcolor: product.stockQuantity > 0 ? '#f0fdf4' : '#fef2f2',
                  color: product.stockQuantity > 0 ? '#16a34a' : '#dc2626',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              />
            </Box>

            {addedToCart && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                Added to cart successfully!
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <IconButton size="small" onClick={() => setQuantity(Math.max(1, quantity - 1))} sx={{ borderRadius: '8px 0 0 8px' }}>
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ px: 2, minWidth: 40, textAlign: 'center', fontWeight: 600 }}>{quantity}</Typography>
                <IconButton size="small" onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))} sx={{ borderRadius: '0 8px 8px 0' }}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<CartIcon />}
                onClick={handleAddToCart}
                disabled={!product.isInStock}
                sx={{
                  flex: 1,
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 2.5,
                  background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                  '&:hover': { background: 'linear-gradient(135deg, #1d4ed8, #6d28d9)', boxShadow: '0 4px 15px rgba(37,99,235,0.4)' },
                }}
              >
                Add to Cart
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2.5 }}>
            Frequently Bought Together
          </Typography>
          <Grid container spacing={2}>
            {recommendations.map((rec) => (
              <Grid item xs={12} sm={6} md={4} key={rec.productId}>
                <Card
                  sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)', boxShadow: 6 } }}
                  onClick={() => navigate(`/products/${rec.productId}`)}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar variant="rounded" sx={{ width: 56, height: 56, bgcolor: '#f1f5f9' }}>
                      <img src={getProductImage(rec.productId, rec.imageUrl)} alt={rec.productName} onError={(e) => handleImageError(e, rec.productId)} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 8 }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{rec.productName}</Typography>
                      <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>{formatINR(rec.price)}</Typography>
                    </Box>
                    <Button size="small" variant="outlined" onClick={(e) => { e.stopPropagation(); addToCart(rec.productId); }} sx={{ borderRadius: 2, fontSize: '0.75rem' }}>
                      Add
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ProductDetail;
