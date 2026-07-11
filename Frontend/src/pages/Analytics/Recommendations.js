import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  Rating,
  Skeleton,
} from '@mui/material';
import { dashboardAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/currency';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await dashboardAPI.getRecommendations();
        setRecommendations(response.data);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleAddToCart = async (productId) => {
    await addToCart(productId);
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Recommendations
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={300} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Recommended For You
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Based on your browsing history and purchase patterns, we think you'll love these products.
      </Typography>

      <Grid container spacing={3}>
        {recommendations.map((rec) => (
          <Grid item xs={12} sm={6} md={4} key={rec.productId}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={rec.imageUrl || '/images/product-placeholder.svg'}
                alt={rec.productName}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/product-placeholder.svg';
                }}
                sx={{ objectFit: 'contain', p: 2, cursor: 'pointer' }}
                onClick={() => navigate(`/products/${rec.productId}`)}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/products/${rec.productId}`)}
                  >
                    {rec.productName}
                  </Typography>
                  <Chip
                    label={`${(rec.score * 100).toFixed(0)}% Match`}
                    size="small"
                    color="primary"
                  />
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating
                    value={rec.score * 5}
                    precision={0.1}
                    readOnly
                    size="small"
                  />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({rec.score.toFixed(2)})
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {rec.reason}
                </Typography>

                <Typography variant="h6" color="primary">
                  {formatINR(rec.price)}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  size="small"
                  variant="contained"
                  fullWidth
                  onClick={() => handleAddToCart(rec.productId)}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Recommendations;
