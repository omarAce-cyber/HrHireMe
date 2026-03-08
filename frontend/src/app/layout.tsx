'use client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '@/store';
import { theme } from '@/theme';
import { useState } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </QueryClientProvider>
        </Provider>
      </body>
    </html>
  );
}
