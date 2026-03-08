'use client';
import { useQuery } from '@tanstack/react-query';
import { applicationsService } from '@/services/applications';
import { useAppSelector } from '@/store/hooks';
import {
  Box, Typography, Card, CardContent, Stack, Chip, CircularProgress,
  LinearProgress, Grid,
} from '@mui/material';

const statusColors: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  Pending: 'warning',
  Reviewing: 'info',
  Accepted: 'success',
  Rejected: 'error',
};

export default function CandidateApplicationsPage() {
  const { user } = useAppSelector((s) => s.auth);
  const { data, isLoading } = useQuery({
    queryKey: ['my-applications', user?.userId],
    queryFn: () => applicationsService.getApplications({ candidateId: user?.userId }),
    enabled: !!user?.userId,
  });

  if (isLoading) {
    return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Typography variant="h5" mb={3}>My Applications</Typography>
      {data?.items.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" py={4}>
          No applications yet. Browse jobs to get started!
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {data?.items.map((app) => (
            <Grid item xs={12} md={6} key={app.id}>
              <Card>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography variant="h6">{app.jobTitle}</Typography>
                    <Chip
                      label={app.status}
                      size="small"
                      color={statusColors[app.status] ?? 'default'}
                    />
                  </Stack>
                  {app.coverLetter && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      mb={1}
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {app.coverLetter}
                    </Typography>
                  )}
                  {app.readinessScore != null && (
                    <Box>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Readiness Score</Typography>
                        <Typography variant="body2" fontWeight={600}>{app.readinessScore}%</Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={app.readinessScore}
                        color={app.readinessScore >= 70 ? 'success' : 'warning'}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  )}
                  <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                    Applied: {new Date(app.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
