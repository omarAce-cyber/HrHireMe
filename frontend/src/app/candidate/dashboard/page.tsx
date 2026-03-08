'use client';
import { useQuery } from '@tanstack/react-query';
import { applicationsService } from '@/services/applications';
import { jobsService } from '@/services/jobs';
import { useAppSelector } from '@/store/hooks';
import {
  Box, Typography, Grid, Card, CardContent, Stack, Chip, Button,
  CircularProgress, LinearProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';

const statusColors: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  Pending: 'warning',
  Reviewing: 'info',
  Accepted: 'success',
  Rejected: 'error',
};

export default function CandidateDashboard() {
  const { user } = useAppSelector((s) => s.auth);
  const router = useRouter();

  const { data: applications, isLoading: appsLoading } = useQuery({
    queryKey: ['my-applications', user?.userId],
    queryFn: () => applicationsService.getApplications({ candidateId: user?.userId }),
    enabled: !!user?.userId,
  });

  const { data: jobs } = useQuery({
    queryKey: ['jobs', 'open'],
    queryFn: () => jobsService.getJobs({ status: 'Open', pageSize: 3 }),
  });

  if (appsLoading) {
    return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  }

  const scoredApps = applications?.items.filter((a) => a.readinessScore != null) ?? [];
  const avgReadiness = scoredApps.length > 0
    ? scoredApps.reduce((sum, a) => sum + (a.readinessScore ?? 0), 0) / scoredApps.length
    : NaN;

  return (
    <Box>
      <Typography variant="h5" mb={3}>My Dashboard</Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight={700} color="primary">
                {applications?.totalCount ?? 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">Total Applications</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight={700} color="success.main">
                {applications?.items.filter((a) => a.status === 'Accepted').length ?? 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">Accepted</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight={700} color="warning.main">
                {applications?.items.filter((a) => a.status === 'Reviewing').length ?? 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">Under Review</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Avg Readiness Score
              </Typography>
              <Typography variant="h3" fontWeight={700} color="secondary.main">
                {isNaN(avgReadiness) ? 'N/A' : `${Math.round(avgReadiness)}%`}
              </Typography>
              {!isNaN(avgReadiness) && (
                <LinearProgress
                  variant="determinate"
                  value={avgReadiness}
                  color="secondary"
                  sx={{ mt: 1 }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>My Applications</Typography>
              <Stack spacing={1}>
                {applications?.items.slice(0, 5).map((app) => (
                  <Box
                    key={app.id}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p={1.5}
                    border="1px solid"
                    borderColor="divider"
                    borderRadius={2}
                  >
                    <Box>
                      <Typography fontWeight={600}>{app.jobTitle}</Typography>
                      {app.readinessScore != null && (
                        <Typography variant="body2" color="text.secondary">
                          Readiness: {app.readinessScore}%
                        </Typography>
                      )}
                    </Box>
                    <Chip
                      label={app.status}
                      size="small"
                      color={statusColors[app.status] ?? 'default'}
                    />
                  </Box>
                ))}
                {(applications?.totalCount ?? 0) === 0 && (
                  <Typography color="text.secondary" textAlign="center" py={2}>
                    No applications yet. Browse jobs to get started!
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Open Jobs</Typography>
                <Button size="small" onClick={() => router.push('/candidate/jobs')}>View All</Button>
              </Stack>
              <Stack spacing={1}>
                {jobs?.items.map((job) => (
                  <Box
                    key={job.id}
                    p={1.5}
                    border="1px solid"
                    borderColor="divider"
                    borderRadius={2}
                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                    onClick={() => router.push('/candidate/jobs')}
                  >
                    <Typography fontWeight={600}>{job.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {job.department} · {job.location}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
