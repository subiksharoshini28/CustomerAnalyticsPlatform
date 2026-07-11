import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  LinearProgress,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { analyticsAPI } from '../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CustomerJourney = () => {
  const [journey, setJourney] = useState(null);
  const [funnel, setFunnel] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [journeyRes, funnelRes] = await Promise.all([
          analyticsAPI.getCustomerJourney(1),
          analyticsAPI.getConversionFunnel(),
        ]);
        setJourney(journeyRes.data);
        setFunnel(funnelRes.data);
      } catch (error) {
        console.error('Failed to fetch journey data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Typography>Loading journey data...</Typography>;
  }

  const funnelData = Object.entries(funnel);
  const maxCount = Math.max(...funnelData.map(([_, count]) => count));

  const chartData = {
    labels: funnelData.map(([action]) => action),
    datasets: [
      {
        label: 'Conversion Rate',
        data: funnelData.map(([_, count]) => count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Customer Journey
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Conversion Funnel
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Users',
                      },
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Journey Steps
            </Typography>
            {journey?.steps?.map((step, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">
                    {step.action}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.channel}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(step.count / maxCount) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                {step.dropoffRate > 0 && (
                  <Typography variant="caption" color="error">
                    Drop-off: {step.dropoffRate.toFixed(1)}%
                  </Typography>
                )}
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Journey Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary">Conversion Rate</Typography>
                    <Typography variant="h4">
                      {journey?.conversionRate?.toFixed(1) || 0}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary">Average Duration</Typography>
                    <Typography variant="h4">
                      {journey?.averageDuration 
                        ? `${Math.round(journey.averageDuration / 60000)} min`
                        : '0 min'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary">Total Steps</Typography>
                    <Typography variant="h4">
                      {journey?.steps?.length || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerJourney;
