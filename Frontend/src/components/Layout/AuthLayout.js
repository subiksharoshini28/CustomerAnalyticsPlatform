import React from 'react';
import { Box, Container, Paper, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';

const features = [
  { icon: <ShoppingBagIcon sx={{ fontSize: 28 }} />, title: 'Smart Shopping', desc: 'Personalized recommendations powered by AI' },
  { icon: <TrendingUpIcon sx={{ fontSize: 28 }} />, title: 'Trend Analytics', desc: 'Real-time insights into customer behavior' },
  { icon: <BarChartIcon sx={{ fontSize: 28 }} />, title: 'Deep Insights', desc: 'Comprehensive analytics dashboards' },
  { icon: <PeopleIcon sx={{ fontSize: 28 }} />, title: 'Customer 360', desc: 'Complete customer journey tracking' },
];

const AuthLayout = ({ children }) => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left Visual Side */}
      {isLarge && (
        <Box
          sx={{
            flex: 1,
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 40%, #7c3aed 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 6,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -100,
              right: -100,
              width: 400,
              height: 400,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -150,
              left: -150,
              width: 500,
              height: 500,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.03)',
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 440 }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: 3,
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 4,
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <BarChartIcon sx={{ fontSize: 36, color: '#fff' }} />
            </Box>
            <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800, mb: 2, letterSpacing: '-0.03em' }}>
              Customer Analytics
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 400, mb: 5, lineHeight: 1.6 }}>
              Multi-Channel Experience Platform
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5, mt: 2 }}>
              {features.map((f, i) => (
                <Box
                  key={i}
                  sx={{
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 3,
                    p: 2.5,
                    textAlign: 'left',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.14)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Box sx={{ color: '#60a5fa', mb: 1 }}>{f.icon}</Box>
                  <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 600, mb: 0.3 }}>
                    {f.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.4 }}>
                    {f.desc}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}

      {/* Right Form Side */}
      <Box
        sx={{
          flex: { xs: 1, md: '0 0 520px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
          p: { xs: 3, sm: 4 },
          position: 'relative',
        }}
      >
        <Container maxWidth="sm">
          {isLarge && (
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 5,
                textDecoration: 'none',
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BarChartIcon sx={{ fontSize: 20, color: '#fff' }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                CAP
              </Typography>
            </Box>
          )}

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              background: '#fff',
              boxShadow: '0 1px 3px 0 rgba(0,0,0,0.04)',
            }}
          >
            {children}
          </Paper>

          <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: '#94a3b8', fontSize: '0.8rem' }}>
            &copy; 2026 Customer Analytics Platform. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default AuthLayout;
