'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationsService } from '@/services/applications';
import {
  Box, Typography, Card, CardContent, Stack, Chip, MenuItem, Select,
  FormControl, InputLabel, CircularProgress, Avatar, Grid,
} from '@mui/material';

const statusColors: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  Pending: 'warning',
  Reviewing: 'info',
  Accepted: 'success',
  Rejected: 'error',
};

export default function HrApplicationsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: () => applicationsService.getApplications({ pageSize: 50 }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      applicationsService.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applications'] }),
  });

  if (isLoading) {
    return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Typography variant="h5" mb={3}>Applications</Typography>
      <Grid container spacing={2}>
        {data?.items.map((app) => (
          <Grid item xs={12} md={6} key={app.id}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar sx={{ bgcolor: 'primary.main' }}>{app.candidateName.charAt(0)}</Avatar>
                  <Box flex={1}>
                    <Typography fontWeight={600}>{app.candidateName}</Typography>
                    <Typography variant="body2" color="text.secondary">{app.candidateEmail}</Typography>
                    <Typography variant="body2" mt={0.5}>
                      <strong>Job:</strong> {app.jobTitle}
                    </Typography>
                    {app.coverLetter && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        mt={0.5}
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
                      <Chip
                        label={`Readiness: ${app.readinessScore}%`}
                        size="small"
                        color="primary"
                        sx={{ mt: 0.5 }}
                      />
                    )}
                    <Stack direction="row" spacing={1} mt={1} alignItems="center">
                      <FormControl size="small" sx={{ minWidth: 130 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={app.status}
                          label="Status"
                          onChange={(e) =>
                            updateMutation.mutate({ id: app.id, status: e.target.value })
                          }
                        >
                          {['Pending', 'Reviewing', 'Accepted', 'Rejected'].map((s) => (
                            <MenuItem key={s} value={s}>{s}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Chip
                        label={app.status}
                        size="small"
                        color={statusColors[app.status] ?? 'default'}
                      />
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
