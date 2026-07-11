import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Skeleton,
  InputAdornment,
  Paper,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  FavoriteBorder as WishlistOutlineIcon,
  Favorite as WishlistFilledIcon,
  ViewModule as GridIcon,
} from '@mui/icons-material';
import { productsAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/currency';
import { getProductImage, handleImageError } from '../../utils/productImages';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    searchTerm: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    page: parseInt(searchParams.get('page')) || 1,
    pageSize: 48,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productsAPI.getAll(filters);
        setProducts(response.data.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productsAPI.getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist')) || []; } catch { return []; }
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const toggleWishlist = (product, e) => {
    e.stopPropagation();
    const exists = wishlist.find((w) => w.id === product.id);
    let updated;
    if (exists) {
      updated = wishlist.filter((w) => w.id !== product.id);
      setSnackbar({ open: true, message: `${product.name} removed from wishlist`, severity: 'info' });
    } else {
      updated = [...wishlist, { id: product.id, name: product.name, price: product.price, imageUrl: getProductImage(product.id, product.imageUrl) }];
      setSnackbar({ open: true, message: `${product.name} added to wishlist`, severity: 'success' });
    }
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  const isWishlisted = (id) => wishlist.some((w) => w.id === id);

  const handleSearch = (e) => {
    setFilters((prev) => ({ ...prev, searchTerm: e.target.value }));
  };

  const handleCategoryChange = (e) => {
    setFilters((prev) => ({ ...prev, category: e.target.value }));
  };

  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();
    await addToCart(productId);
    const product = products.find((p) => p.id === productId);
    setSnackbar({ open: true, message: `${product?.name || 'Product'} added to cart`, severity: 'success' });
  };

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
          Products
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Browse our curated collection of quality products
        </Typography>
      </Box>

      {/* Filters */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 3, border: '1px solid #e2e8f0', background: '#fff' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={filters.searchTerm}
              onChange={handleSearch}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={handleCategoryChange}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                {loading ? 'Loading...' : `${products.length} products`}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Product Grid */}
      <Grid container spacing={2.5}>
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rounded" height={360} sx={{ borderRadius: 3 }} />
            </Grid>
          ))
        ) : products.length === 0 ? (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <GridIcon sx={{ fontSize: 56, color: '#cbd5e1', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>No products found</Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>Try adjusting your search or filter criteria</Typography>
            </Box>
          </Grid>
        ) : (
          products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <Box sx={{ position: 'relative', bgcolor: '#f8fafc', p: 2 }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={getProductImage(product.id, product.imageUrl)}
                    alt={product.name}
                    onError={(e) => handleImageError(e, product.id)}
                    sx={{ objectFit: 'contain', borderRadius: 2 }}
                  />
                  {!product.isInStock && (
                    <Chip
                      label="Out of Stock"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        bgcolor: '#fef2f2',
                        color: '#dc2626',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    />
                  )}
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 2.5, pt: 2 }}>
                  <Chip
                    label={product.category}
                    size="small"
                    sx={{ mb: 1, bgcolor: '#f1f5f9', color: '#475569', fontSize: '0.7rem', height: 22, fontWeight: 500 }}
                  />
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.3, mb: 0.5, color: '#0f172a' }}
                  >
                    {product.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 1.5, fontSize: '0.8rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2563eb' }}>
                      {formatINR(product.price)}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => toggleWishlist(product, e)}
                      sx={{
                        color: isWishlisted(product.id) ? '#ef4444' : '#94a3b8',
                        '&:hover': { color: '#ef4444', bgcolor: '#fef2f2' },
                      }}
                    >
                      {isWishlisted(product.id) ? <WishlistFilledIcon fontSize="small" /> : <WishlistOutlineIcon fontSize="small" />}
                    </IconButton>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2.5, pt: 0 }}>
                  <Button
                    size="small"
                    variant="contained"
                    fullWidth
                    disabled={!product.isInStock}
                    startIcon={<CartIcon sx={{ fontSize: 18 }} />}
                    onClick={(e) => handleAddToCart(product.id, e)}
                    sx={{
                      borderRadius: 2,
                      py: 1,
                      fontWeight: 600,
                      fontSize: '0.82rem',
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default ProductList;
