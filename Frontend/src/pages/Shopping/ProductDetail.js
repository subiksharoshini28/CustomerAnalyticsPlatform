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
  TextField,
  Card,
  CardContent,
  Skeleton,
  Alert,
} from '@mui/material';
import { ShoppingCart as CartIcon, FavoriteBorder as WishlistIcon } from '@mui/icons-material';
import { productsAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { eventsAPI } from '../../services/api';
import { formatINR } from '../../utils/currency';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await productsAPI.getById(id);
        setProduct(response.data);

        // Track view event
        await eventsAPI.track({
          action: 'View Product',
          channel: 'Website',
          productId: parseInt(id),
        });

        // Fetch recommendations
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

  if (loading) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rounded" height={400} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rounded" height={400} />
        </Grid>
      </Grid>
    );
  }

  if (!product) {
    return <Typography>Product not found</Typography>;
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <img
              src={product.imageUrl || '/images/product-placeholder.svg'}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/product-placeholder.svg';
              }}
              style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain' }}
            />
          </Paper>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip label={product.category} color="primary" />
              {!product.isInStock && (
                <Chip label="Out of Stock" color="error" />
              )}
            </Box>

            <Typography variant="h3" color="primary" sx={{ mb: 2 }}>
              {formatINR(product.price)}
            </Typography>

            <Typography variant="body1" sx={{ mb: 3 }}>
              {product.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Stock: {product.stockQuantity} units available
            </Typography>

            {addedToCart && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Added to cart successfully!
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                InputProps={{ inputProps: { min: 1, max: product.stockQuantity } }}
                sx={{ width: 100 }}
              />
              <Button
                variant="contained"
                size="large"
                startIcon={<CartIcon />}
                onClick={handleAddToCart}
                disabled={!product.isInStock}
                sx={{ flexGrow: 1 }}
              >
                Add to Cart
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<WishlistIcon />}
              >
                Wishlist
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Frequently Bought Together
          </Typography>
          <Grid container spacing={2}>
            {recommendations.map((rec) => (
              <Grid item xs={12} sm={6} md={4} key={rec.productId}>
                <Card
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/products/${rec.productId}`)}
                >
                  <CardContent>
                    <Typography variant="h6">{rec.productName}</Typography>
                    <Typography color="primary">{formatINR(rec.price)}</Typography>
                    <Button
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(rec.productId);
                      }}
                    >
                      Add to Cart
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
