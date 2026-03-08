'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, IconButton, Avatar, Menu, MenuItem, Divider, Chip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const DRAWER_WIDTH = 240;

const hrNavItems = [
  { label: 'Dashboard', href: '/hr/dashboard', icon: <DashboardIcon /> },
  { label: 'Jobs', href: '/hr/jobs', icon: <WorkIcon /> },
  { label: 'Assessments', href: '/hr/assessments', icon: <AssignmentIcon /> },
  { label: 'Applications', href: '/hr/applications', icon: <PeopleIcon /> },
  { label: 'Analytics', href: '/hr/analytics', icon: <BarChartIcon /> },
];

const candidateNavItems = [
  { label: 'Dashboard', href: '/candidate/dashboard', icon: <DashboardIcon /> },
  { label: 'Browse Jobs', href: '/candidate/jobs', icon: <WorkIcon /> },
  { label: 'My Applications', href: '/candidate/applications', icon: <PeopleIcon /> },
  { label: 'My Assessments', href: '/candidate/assessments', icon: <AssignmentIcon /> },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = user?.role === 'Candidate' ? candidateNavItems : hrNavItems;

  const drawer = (
    <Box>
      <Toolbar>
        <WorkIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" color="primary.main" fontWeight={700}>SmartHire</Typography>
      </Toolbar>
      <Divider />
      <Box p={2}>
        <Chip
          label={user?.role}
          color={user?.role === 'Candidate' ? 'secondary' : 'primary'}
          size="small"
        />
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.href} disablePadding>
            <ListItemButton
              onClick={() => router.push(item.href)}
              selected={pathname === item.href}
              sx={{ borderRadius: 2, mx: 1, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            Welcome back, {user?.fullName}
          </Typography>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: 14 }}>
              {user?.fullName?.charAt(0)}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem disabled>
              <AccountCircleIcon sx={{ mr: 1 }} fontSize="small" />
              {user?.email}
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                dispatch(logout());
                router.push('/login');
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
        }}
      >
        {drawer}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, ml: { sm: `${DRAWER_WIDTH}px` } }}>
        {children}
      </Box>
    </Box>
  );
}
