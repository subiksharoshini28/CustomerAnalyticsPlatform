import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Badge,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ShoppingBag as ShoppingIcon,
  Person as PersonIcon,
  ShoppingCart as CartIcon,
  Favorite as WishlistIcon,
  Receipt as OrdersIcon,
  Timeline as JourneyIcon,
  Warning as ChurnIcon,
  Recommend as RecommendIcon,
  Logout as LogoutIcon,
  BarChart as AnalyticsIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const DRAWER_WIDTH = 260;

const adminMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Products', icon: <ShoppingIcon />, path: '/products' },
  { divider: true, label: 'Analytics' },
  { text: 'Customer Journey', icon: <JourneyIcon />, path: '/analytics/journey' },
  { text: 'Churn Prediction', icon: <ChurnIcon />, path: '/analytics/churn' },
  { text: 'Recommendations', icon: <RecommendIcon />, path: '/analytics/recommendations' },
  { divider: true, label: 'Account' },
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
];

const customerMenuItems = [
  { text: 'Products', icon: <ShoppingIcon />, path: '/products' },
  { text: 'Cart', icon: <CartIcon />, path: '/cart' },
  { text: 'Wishlist', icon: <WishlistIcon />, path: '/wishlist' },
  { text: 'Orders', icon: <OrdersIcon />, path: '/orders' },
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
];

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const menuItems = isAdmin ? adminMenuItems : customerMenuItems;

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => { handleClose(); logout(); navigate('/login'); };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2.5,
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AnalyticsIcon sx={{ fontSize: 22, color: '#fff' }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2, fontSize: '0.95rem' }}>
            Customer Analytics
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
            Platform
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mx: 2, borderColor: '#f1f5f9' }} />

      {/* Menu Items */}
      <List sx={{ flex: 1, px: 1.5, py: 1 }}>
        {menuItems.map((item, index) => {
          if (item.divider) {
            return (
              <Box key={index} sx={{ px: 1.5, pt: 2.5, pb: 0.75 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.68rem' }}>
                  {item.label}
                </Typography>
              </Box>
            );
          }

          const isActive = location.pathname === item.path;
          const isCart = item.path === '/cart';

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.3 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => { navigate(item.path); if (isMobile) handleDrawerToggle(); }}
                sx={{
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.85,
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(124,58,237,0.08) 100%)',
                    '&:hover': { background: 'linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(124,58,237,0.12) 100%)' },
                  },
                  '&:hover': {
                    background: '#f8fafc',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 38, color: isActive ? '#2563eb' : '#64748b' }}>
                  {isCart ? (
                    <Badge badgeContent={cart.itemCount} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: 18, minWidth: 18 } }}>
                      {item.icon}
                    </Badge>
                  ) : item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: isActive ? 600 : 450, color: isActive ? '#2563eb' : '#334155' }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* User Section */}
      <Box sx={{ p: 2, borderTop: '1px solid #f1f5f9' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 38,
              height: 38,
              bgcolor: '#2563eb',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #e2e8f0',
          color: '#0f172a',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 60, md: 64 } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 1.5, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flex: 1 }} />

          <Chip
            label={isAdmin ? 'Admin' : 'Customer'}
            size="small"
            sx={{
              mr: 1.5,
              background: isAdmin ? 'linear-gradient(135deg, #e91e63, #f06292)' : 'linear-gradient(135deg, #2563eb, #7c3aed)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.7rem',
              height: 24,
            }}
          />

          <IconButton onClick={handleMenu} sx={{ p: 0.5 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: '#2563eb',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              elevation: 3,
              sx: { mt: 1, minWidth: 180, borderRadius: 2, border: '1px solid #e2e8f0' },
            }}
          >
            <MenuItem disabled sx={{ opacity: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {user?.fullName || user?.email}
              </Typography>
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
              <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, border: 'none' },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            borderRight: '1px solid #e2e8f0',
            background: '#fff',
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          minHeight: '100vh',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 60, md: 64 } }} />
        <Box sx={{ animation: 'fadeIn 0.3s ease-out' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
