'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsService } from '@/services/jobs';
import {
  Box, Typography, Button, Card, CardContent, Grid, TextField, Chip, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, IconButton, CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Job } from '@/types';

const emptyJob = {
  title: '',
  description: '',
  department: '',
  location: '',
  salaryRange: '',
  status: 'Open',
  deadline: '',
};

export default function HrJobsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const [form, setForm] = useState(emptyJob);
  const [page] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', search, page],
    queryFn: () => jobsService.getJobs({ search, page, pageSize: 10 }),
  });

  const createMutation = useMutation({
    mutationFn: jobsService.createJob,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jobs'] });
      setOpen(false);
      setForm(emptyJob);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Job>) => jobsService.updateJob(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jobs'] });
      setOpen(false);
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: jobsService.deleteJob,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }),
  });

  const handleSubmit = () => {
    const deadlineIso = form.deadline ? new Date(form.deadline).toISOString() : undefined;
    if (editing) {
      updateMutation.mutate({
        id: editing.id,
        ...form,
        status: form.status as Job['status'],
        deadline: deadlineIso,
      });
    } else {
      createMutation.mutate({
        ...form,
        status: form.status as Job['status'],
        deadline: deadlineIso,
      });
    }
  };

  const openEdit = (job: Job) => {
    setEditing(job);
    setForm({
      title: job.title,
      description: job.description,
      department: job.department,
      location: job.location,
      salaryRange: job.salaryRange ?? '',
      status: job.status,
      deadline: job.deadline ? job.deadline.substring(0, 10) : '',
    });
    setOpen(true);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Job Postings</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { setEditing(null); setForm(emptyJob); setOpen(true); }}
        >
          Post New Job
        </Button>
      </Stack>
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
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box flex={1}>
                      <Typography variant="h6" gutterBottom>{job.title}</Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>{job.description}</Typography>
                      <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                        <Chip label={job.department} size="small" />
                        <Chip label={job.location} size="small" variant="outlined" />
                        {job.salaryRange && (
                          <Chip label={job.salaryRange} size="small" color="success" variant="outlined" />
                        )}
                        <Chip
                          label={job.status}
                          size="small"
                          color={job.status === 'Open' ? 'success' : 'default'}
                        />
                      </Stack>
                      <Typography variant="caption" color="text.secondary" mt={1} display="block">
                        {job.applicationCount} applicants · Posted by {job.postedByName}
                      </Typography>
                    </Box>
                    <Stack>
                      <IconButton size="small" onClick={() => openEdit(job)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => deleteMutation.mutate(job.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Job' : 'Post New Job'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Job Title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              fullWidth
              multiline
              rows={3}
              required
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Department"
                  value={form.department}
                  onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Location"
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
            <TextField
              label="Salary Range"
              value={form.salaryRange}
              onChange={(e) => setForm((p) => ({ ...p, salaryRange: e.target.value }))}
              fullWidth
            />
            <TextField
              select
              label="Status"
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              fullWidth
            >
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
              <MenuItem value="Draft">Draft</MenuItem>
            </TextField>
            <TextField
              label="Deadline"
              type="date"
              value={form.deadline}
              onChange={(e) => setForm((p) => ({ ...p, deadline: e.target.value }))}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>{editing ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
