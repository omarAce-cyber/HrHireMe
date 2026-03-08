'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';
import { authService } from '@/services/auth';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Alert, Stack, Divider, Link, CircularProgress,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await authService.login(email, password);
      dispatch(setUser(user));
      if (user.role === 'Candidate') router.push('/candidate/dashboard');
      else router.push('/hr/dashboard');
    } catch {
      setError('Invalid email or password.');
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
      <Card sx={{ width: '100%', maxWidth: 420, mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack alignItems="center" spacing={1} mb={3}>
            <Box sx={{ bgcolor: 'primary.main', borderRadius: '50%', p: 1.5, display: 'flex' }}>
              <WorkIcon sx={{ color: 'white', fontSize: 32 }} />
            </Box>
            <Typography variant="h5" color="primary.main">SmartHire</Typography>
            <Typography variant="body2" color="text.secondary">Sign in to your account</Typography>
          </Stack>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleLogin}>
            <Stack spacing={2.5}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
              />
              <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </Stack>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" align="center" color="text.secondary">
            Don&apos;t have an account?{' '}
            <Link href="/signup" underline="hover" color="primary">Sign up</Link>
          </Typography>
          <Box mt={2} p={1.5} bgcolor="grey.50" borderRadius={1}>
            <Typography variant="caption" color="text.secondary" display="block">Demo credentials:</Typography>
            <Typography variant="caption" color="text.secondary" display="block">HR: hr@smarthire.com / HR@123456</Typography>
            <Typography variant="caption" color="text.secondary" display="block">Candidate: candidate@smarthire.com / Candidate@123</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
