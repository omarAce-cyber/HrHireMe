'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsService } from '@/services/jobs';
import { applicationsService } from '@/services/applications';
import { useAppSelector } from '@/store/hooks';
import {
  Box, Typography, Grid, Card, CardContent, Stack, Chip, Button,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Alert,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';

export default function CandidateJobsPage() {
  const { user } = useAppSelector((s) => s.auth);
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applyOpen, setApplyOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', search],
    queryFn: () => jobsService.getJobs({ search, status: 'Open', pageSize: 20 }),
  });

  const { data: myApps } = useQuery({
    queryKey: ['my-applications', user?.userId],
    queryFn: () => applicationsService.getApplications({ candidateId: user?.userId }),
    enabled: !!user?.userId,
  });

  const applyMutation = useMutation({
    mutationFn: () => applicationsService.apply(selectedJobId!, coverLetter),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-applications'] });
      setApplyOpen(false);
      setCoverLetter('');
      setSuccessMsg('Application submitted successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    },
  });

  const appliedJobIds = new Set(myApps?.items.map((a) => a.jobId));

  return (
    <Box>
      <Typography variant="h5" mb={3}>Browse Jobs</Typography>
      {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
      <TextField
        label="Search jobs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3, maxWidth: 400 }}
        size="small"
        fullWidth
      />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {data?.items.map((job) => (
            <Grid item xs={12} md={6} key={job.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{job.title}</Typography>
                  <Stack direction="row" spacing={2} mb={1}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <BusinessIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">{job.department}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <LocationOnIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">{job.location}</Typography>
                    </Stack>
                  </Stack>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 1,
                    }}
                  >
                    {job.description}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                    {job.salaryRange && (
                      <Chip label={job.salaryRange} size="small" color="success" variant="outlined" />
                    )}
                    {job.deadline && (
                      <Chip
                        label={`Deadline: ${new Date(job.deadline).toLocaleDateString()}`}
                        size="small"
                      />
                    )}
                  </Stack>
                  {appliedJobIds.has(job.id) ? (
                    <Button variant="outlined" disabled fullWidth>Already Applied</Button>
                  ) : (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => { setSelectedJobId(job.id); setApplyOpen(true); }}
                    >
                      Apply Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
          {data?.items.length === 0 && (
            <Grid item xs={12}>
              <Typography color="text.secondary" textAlign="center" py={4}>No jobs found.</Typography>
            </Grid>
          )}
        </Grid>
      )}
      <Dialog open={applyOpen} onClose={() => setApplyOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Apply for this position</DialogTitle>
        <DialogContent>
          <TextField
            label="Cover Letter (optional)"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            fullWidth
            multiline
            rows={5}
            sx={{ mt: 1 }}
            placeholder="Tell us why you're a great fit for this role..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplyOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => applyMutation.mutate()}
            disabled={applyMutation.isPending}
          >
            {applyMutation.isPending ? <CircularProgress size={20} /> : 'Submit Application'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
