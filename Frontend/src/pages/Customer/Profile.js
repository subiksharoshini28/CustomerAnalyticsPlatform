import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as DateIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
          Profile
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Manage your account settings and personal information
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px solid #e2e8f0', borderRadius: 3 }}>
            <Avatar
              sx={{
                width: 96,
                height: 96,
                mx: 'auto',
                mb: 2,
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                fontSize: '2rem',
                fontWeight: 700,
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)',
              }}
            >
              {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
              {user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim()}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
              {user?.email}
            </Typography>
            <Chip
              label="Pro Member"
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.75rem',
                mb: 2,
              }}
            />
            <Divider sx={{ my: 2, borderColor: '#f1f5f9' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'flex-start', px: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DateIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.82rem' }}>
                  Member since {new Date(user?.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              {user?.lastLoginAt && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                  <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.82rem' }}>
                    Last login {new Date(user?.lastLoginAt).toLocaleDateString()}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Edit Profile
            </Typography>

            {success && (
              <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2 }}>
                Profile updated successfully!
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    size="small"
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: '#94a3b8', fontSize: 20 }} />,
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled
                    size="small"
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: '#94a3b8', fontSize: 20 }} />,
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    size="small"
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: '#94a3b8', fontSize: 20 }} />,
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <SaveIcon />}
                    disabled={loading}
                    sx={{
                      px: 4,
                      py: 1.25,
                      fontWeight: 600,
                      borderRadius: 2.5,
                      background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                      '&:hover': { background: 'linear-gradient(135deg, #1d4ed8, #6d28d9)' },
                    }}
                  >
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
