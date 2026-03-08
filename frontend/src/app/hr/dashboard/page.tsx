'use client';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics';
import { jobsService } from '@/services/jobs';
import {
  Grid, Card, CardContent, Typography, Box, CircularProgress, Chip, Stack,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

const MAX_JOB_TITLE_DISPLAY_LENGTH = 20;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary">{title}</Typography>
            <Typography variant="h4" fontWeight={700} color={color}>{value}</Typography>
          </Box>
          <Box sx={{ bgcolor: `${color}20`, borderRadius: '50%', p: 1.5, display: 'flex', color }}>
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function HrDashboard() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsService.getAnalytics,
  });
  const { data: recentJobs } = useQuery({
    queryKey: ['jobs', 'recent'],
    queryFn: () => jobsService.getJobs({ pageSize: 5 }),
  });

  if (isLoading) {
    return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  }

  const barData = {
    labels: analytics?.applicationsPerJob.map((a) => a.jobTitle.substring(0, MAX_JOB_TITLE_DISPLAY_LENGTH)) ?? [],
    datasets: [{
      label: 'Applications',
      data: analytics?.applicationsPerJob.map((a) => a.count) ?? [],
      backgroundColor: '#2563eb',
      borderRadius: 6,
    }],
  };

  const doughnutData = {
    labels: analytics?.scoreDistribution.map((s) => s.range) ?? [],
    datasets: [{
      data: analytics?.scoreDistribution.map((s) => s.count) ?? [],
      backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'],
    }],
  };

  return (
    <Box>
      <Typography variant="h5" mb={3}>HR Dashboard</Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Jobs" value={analytics?.totalJobs ?? 0} icon={<WorkIcon />} color="#2563eb" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Applications" value={analytics?.totalApplications ?? 0} icon={<PeopleIcon />} color="#7c3aed" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Candidates" value={analytics?.totalCandidates ?? 0} icon={<PeopleIcon />} color="#059669" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Avg Score" value={`${analytics?.averageScore ?? 0}%`} icon={<TrendingUpIcon />} color="#dc2626" />
        </Grid>
      </Grid>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Applications per Job</Typography>
              {(analytics?.applicationsPerJob?.length ?? 0) > 0 ? (
                <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
              ) : (
                <Typography color="text.secondary" textAlign="center" py={4}>No data yet</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Score Distribution</Typography>
              {analytics?.scoreDistribution?.some((s) => s.count > 0) ? (
                <Doughnut data={doughnutData} />
              ) : (
                <Typography color="text.secondary" textAlign="center" py={4}>No assessment data</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>Recent Jobs</Typography>
          <Stack spacing={1}>
            {recentJobs?.items.map((job) => (
              <Box
                key={job.id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={1.5}
                border="1px solid"
                borderColor="divider"
                borderRadius={2}
              >
                <Box>
                  <Typography fontWeight={600}>{job.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.department} · {job.location}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label={`${job.applicationCount} apps`} size="small" />
                  <Chip
                    label={job.status}
                    size="small"
                    color={job.status === 'Open' ? 'success' : job.status === 'Closed' ? 'error' : 'default'}
                  />
                </Stack>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
