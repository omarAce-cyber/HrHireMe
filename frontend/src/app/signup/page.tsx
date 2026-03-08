'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';
import { authService } from '@/services/auth';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Alert, Stack, Divider, Link, MenuItem, CircularProgress,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Candidate',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await authService.register(
        form.firstName,
        form.lastName,
        form.email,
        form.password,
        form.role,
      );
      dispatch(setUser(user));
      if (user.role === 'Candidate') router.push('/candidate/dashboard');
      else router.push('/hr/dashboard');
    } catch {
      setError('Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
    >
      <Card sx={{ width: '100%', maxWidth: 440, mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack alignItems="center" spacing={1} mb={3}>
            <Box sx={{ bgcolor: 'primary.main', borderRadius: '50%', p: 1.5, display: 'flex' }}>
              <WorkIcon sx={{ color: 'white', fontSize: 32 }} />
            </Box>
            <Typography variant="h5" color="primary.main">Create Account</Typography>
            <Typography variant="body2" color="text.secondary">Join SmartHire today</Typography>
          </Stack>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Stack>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                select
                label="Role"
                name="role"
                value={form.role}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="Candidate">Candidate</MenuItem>
                <MenuItem value="HR">HR Manager</MenuItem>
              </TextField>
              <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
              </Button>
            </Stack>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" align="center" color="text.secondary">
            Already have an account?{' '}
            <Link href="/login" underline="hover" color="primary">Sign in</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
