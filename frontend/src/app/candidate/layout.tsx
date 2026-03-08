'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import AppLayout from '@/components/layout/AppLayout';
import { CircularProgress, Box } from '@mui/material';

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
    else if (user?.role !== 'Candidate') router.replace('/hr/dashboard');
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'Candidate') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}
