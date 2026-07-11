import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Skeleton,
  Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as MoneyIcon,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { dashboardAPI } from '../../services/api';
import { formatINR } from '../../utils/currency';
import { getProductImage, handleImageError } from '../../utils/productImages';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const StatCard = ({ title, value, icon, color, trend, gradient }) => (
  <Card
    sx={{
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: gradient || color,
      },
    }}
  >
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mb: 0.5, fontSize: '0.8rem' }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
            {value}
          </Typography>
          {trend !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
              {trend > 0 ? (
                <ArrowUpward sx={{ fontSize: 16, color: 'success.main' }} />
              ) : (
                <ArrowDownward sx={{ fontSize: 16, color: 'error.main' }} />
              )}
              <Typography variant="body2" sx={{ color: trend > 0 ? 'success.main' : 'error.main', fontWeight: 600, fontSize: '0.8rem' }}>
                {trend > 0 ? '+' : ''}{trend}%
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>vs last month</Typography>
            </Box>
          )}
        </Box>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            background: gradient || color,
            boxShadow: `0 4px 12px ${color}33`,
          }}
        >
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await dashboardAPI.get();
        setDashboardData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>Dashboard</Typography>
        <Grid container spacing={2.5}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rounded" height={130} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
          <Grid item xs={12} md={8}>
            <Skeleton variant="rounded" height={380} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rounded" height={380} sx={{ borderRadius: 3 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  const stats = dashboardData?.stats || {};
  const revenueChart = dashboardData?.revenueChart || [];
  const topProducts = dashboardData?.topProducts || [];
  const recentActivity = dashboardData?.recentActivity || [];
  const channelPerformance = dashboardData?.channelPerformance || [];

  const revenueChartData = {
    labels: revenueChart.map((d) => d.date),
    datasets: [{
      label: 'Revenue',
      data: revenueChart.map((d) => d.revenue),
      borderColor: '#2563eb',
      backgroundColor: (ctx) => {
        const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(37, 99, 235, 0.15)');
        gradient.addColorStop(1, 'rgba(37, 99, 235, 0)');
        return gradient;
      },
      fill: true,
      tension: 0.4,
      borderWidth: 2.5,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: '#2563eb',
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 2,
    }],
  };

  const channelChartData = {
    labels: channelPerformance.map((c) => c.channel),
    datasets: [{
      data: channelPerformance.map((c) => c.interactions),
      backgroundColor: ['#2563eb', '#7c3aed', '#06b6d4', '#e91e63', '#f59e0b'],
      borderWidth: 0,
      hoverOffset: 6,
    }],
  };

  return (
    <Box>
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Welcome back! Here's what's happening with your store.
        </Typography>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Customers" value={stats.totalCustomers?.toLocaleString() || '0'} icon={<PeopleIcon />} color="#2563eb" gradient="linear-gradient(135deg, #2563eb, #3b82f6)" trend={5.2} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Daily Active Users" value={stats.dailyActiveUsers?.toLocaleString() || '0'} icon={<TrendingUpIcon />} color="#e91e63" gradient="linear-gradient(135deg, #e91e63, #f06292)" trend={3.1} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Revenue" value={formatINR(stats.totalRevenue)} icon={<MoneyIcon />} color="#f59e0b" gradient="linear-gradient(135deg, #f59e0b, #fbbf24)" trend={12.5} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Orders" value={stats.totalOrders?.toLocaleString() || '0'} icon={<ShoppingCartIcon />} color="#7c3aed" gradient="linear-gradient(135deg, #7c3aed, #8b5cf6)" trend={-2.1} />
        </Grid>
      </Grid>

      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2.5 }}>
              Revenue Trend
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line data={revenueChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8' } }, x: { grid: { display: false }, ticks: { color: '#94a3b8' } } } }} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2.5 }}>
              Channel Performance
            </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              <Doughnut data={channelChartData} options={{ responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { padding: 15, usePointStyle: true, pointStyleWidth: 10 } } } }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Top Products
            </Typography>
            <List disablePadding>
              {topProducts.slice(0, 5).map((product, index) => (
                <React.Fragment key={product.productId}>
                  <ListItem disablePadding sx={{ py: 1.25 }}>
                    <ListItemAvatar sx={{ minWidth: 52 }}>
                      <Avatar
                        variant="rounded"
                        src={getProductImage(product.productId, product.imageUrl)}
                        alt={product.productName}
                        onError={(e) => handleImageError(e, product.productId)}
                        sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: '#f1f5f9' }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>{product.productName}</Typography>}
                      secondary={<Typography variant="caption" sx={{ color: '#64748b' }}>Sold: {product.totalSold} | {formatINR(product.totalRevenue)}</Typography>}
                    />
                  </ListItem>
                  {index < topProducts.length - 1 && <Divider sx={{ borderColor: '#f1f5f9' }} />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Recent Activity
            </Typography>
            <List disablePadding>
              {recentActivity.slice(0, 5).map((activity, index) => (
                <React.Fragment key={index}>
                  <ListItem disablePadding sx={{ py: 1.25 }}>
                    <ListItemText
                      primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>{activity.action}</Typography>}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.3 }}>
                          <Chip label={activity.channel} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: '#f1f5f9' }} />
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                            {new Date(activity.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentActivity.length - 1 && <Divider sx={{ borderColor: '#f1f5f9' }} />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
