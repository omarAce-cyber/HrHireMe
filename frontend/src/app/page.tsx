'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { Box, CircularProgress } from '@mui/material';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    } else if (user?.role === 'Candidate') {
      router.replace('/candidate/dashboard');
    } else {
      router.replace('/hr/dashboard');
    }
  }, [isAuthenticated, user, router]);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress />
    </Box>
  );
}
