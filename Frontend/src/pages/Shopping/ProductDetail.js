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
  Snackbar,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  FavoriteBorder as WishlistIcon,
  Favorite as WishlistIconFilled,
  Add as AddIcon,
  Remove as RemoveIcon,
  NavigateNext as NavigateNextIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  LocalShipping as ShippingIcon,
  VerifiedUser as WarrantyIcon,
  Replay as ReturnIcon,
  ThumbUp as ThumbUpIcon,
} from '@mui/icons-material';
import { productsAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { eventsAPI } from '../../services/api';
import { formatINR } from '../../utils/currency';
import { getProductImage, handleImageError } from '../../utils/productImages';

const productReviews = [
  { id: 1, name: 'Priya Sharma', rating: 5, date: '2026-06-15', title: 'Excellent quality!', comment: 'Really impressed with the build quality and performance. Would definitely recommend to anyone looking for a reliable product.', helpful: 24, avatar: 'PS' },
  { id: 2, name: 'Rahul Verma', rating: 4, date: '2026-06-10', title: 'Good value for money', comment: 'Works as described. The only minor issue is the packaging could be better, but the product itself is solid.', helpful: 18, avatar: 'RV' },
  { id: 3, name: 'Ananya Patel', rating: 5, date: '2026-05-28', title: 'Perfect purchase!', comment: 'I have been using this for about a month now and it works flawlessly. The design is sleek and modern. Very happy with my purchase.', helpful: 31, avatar: 'AP' },
  { id: 4, name: 'Vikram Singh', rating: 4, date: '2026-05-20', title: 'Solid product', comment: 'Delivery was fast and the product matches the description. It does everything I needed. Would rate 5 stars if the manual was more detailed.', helpful: 12, avatar: 'VS' },
  { id: 5, name: 'Meera Nair', rating: 5, date: '2026-05-12', title: 'Highly recommended', comment: 'This is my second purchase from this brand and they never disappoint. Amazing quality at this price point. The customer support was also very responsive.', helpful: 27, avatar: 'MN' },
  { id: 6, name: 'Arjun Reddy', rating: 3, date: '2026-04-30', title: 'Decent but room for improvement', comment: 'It works fine for basic use. However, I expected a bit more in terms of features at this price. Still, it gets the job done.', helpful: 9, avatar: 'AR' },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
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
    setSnackbar({ open: true, message: `${product.name} added to cart`, severity: 'success' });
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleWishlist = () => {
    const newState = !wishlisted;
    setWishlisted(newState);
    setSnackbar({
      open: true,
      message: newState ? `${product.name} added to wishlist` : `${product.name} removed from wishlist`,
      severity: newState ? 'success' : 'info',
    });
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
                <ShippingIcon sx={{ fontSize: 18, color: '#e91e63' }} />
                <Typography variant="body2" sx={{ color: '#475569' }}>Free Shipping</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <ReturnIcon sx={{ fontSize: 18, color: '#e91e63' }} />
                <Typography variant="body2" sx={{ color: '#475569' }}>30-Day Returns</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <WarrantyIcon sx={{ fontSize: 18, color: '#e91e63' }} />
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

      {/* Product Description */}
      <Paper elevation={0} sx={{ p: 4, mt: 4, border: '1px solid #e2e8f0', borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Product Description
        </Typography>
        <Divider sx={{ mb: 2.5 }} />
        <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
          {product.description}
        </Typography>
        <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8 }}>
          This premium product is designed with quality materials and meticulous attention to detail.
          Whether you're looking for everyday reliability or a special gift, this item delivers on both
          style and performance. Built to last with durable construction and a modern aesthetic that
          fits seamlessly into your lifestyle.
        </Typography>
        <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
          {[
            { label: 'Premium Material', desc: 'Crafted from high-quality components' },
            { label: 'Fast Delivery', desc: 'Free shipping on all orders' },
            { label: '1 Year Warranty', desc: 'Full manufacturer warranty included' },
            { label: 'Easy Returns', desc: '30-day hassle-free return policy' },
          ].map((feature, i) => (
            <Box key={i} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #f1f5f9' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0f172a', mb: 0.3 }}>{feature.label}</Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>{feature.desc}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Customer Reviews */}
      <Paper elevation={0} sx={{ p: 4, mt: 3, border: '1px solid #e2e8f0', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Customer Reviews
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: 'flex', gap: 0.25 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <StarIcon key={s} sx={{ fontSize: 20, color: s <= 4 ? '#f59e0b' : '#e2e8f0' }} />
              ))}
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>4.0</Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>({productReviews.length} reviews)</Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {productReviews.map((review) => (
            <Box key={review.id} sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #f1f5f9' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: '#2563eb', fontSize: '0.8rem', fontWeight: 600 }}>
                  {review.avatar}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>{review.name}</Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>{new Date(review.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.25 }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    s <= review.rating ?
                      <StarIcon key={s} sx={{ fontSize: 16, color: '#f59e0b' }} /> :
                      <StarBorderIcon key={s} sx={{ fontSize: 16, color: '#e2e8f0' }} />
                  ))}
                </Box>
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0f172a', mb: 0.5 }}>{review.title}</Typography>
              <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6, mb: 1.5 }}>{review.comment}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#94a3b8' }}>
                <ThumbUpIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption">{review.helpful} found this helpful</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>

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
