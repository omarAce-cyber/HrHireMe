'use client';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics';
import {
  Box, Typography, Grid, Card, CardContent, CircularProgress,
} from '@mui/material';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, Title, Tooltip, Legend, ArcElement,
);

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsService.getAnalytics,
  });

  if (isLoading) {
    return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  }

  const barData = {
    labels: data?.applicationsPerJob.map((a) => a.jobTitle) ?? [],
    datasets: [{
      label: 'Applications',
      data: data?.applicationsPerJob.map((a) => a.count) ?? [],
      backgroundColor: '#2563eb',
      borderRadius: 6,
    }],
  };

  const doughnutData = {
    labels: data?.scoreDistribution.map((s) => s.range) ?? [],
    datasets: [{
      data: data?.scoreDistribution.map((s) => s.count) ?? [],
      backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'],
    }],
  };

  const stats = [
    { label: 'Total Jobs', value: data?.totalJobs },
    { label: 'Total Applications', value: data?.totalApplications },
    { label: 'Total Candidates', value: data?.totalCandidates },
    { label: 'Avg Assessment Score', value: `${data?.averageScore ?? 0}%` },
  ];

  return (
    <Box>
      <Typography variant="h5" mb={3}>Analytics Dashboard</Typography>
      <Grid container spacing={3} mb={3}>
        {stats.map((stat) => (
          <Grid item xs={6} md={3} key={stat.label}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={700} color="primary">
                  {stat.value ?? 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Applications per Job</Typography>
              <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Assessment Score Distribution</Typography>
              <Doughnut data={doughnutData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
