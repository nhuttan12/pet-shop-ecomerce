import { useRoutes } from 'react-router-dom';
import router from 'src/router';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { CssBaseline } from '@mui/material';
import ThemeProvider from './theme/ThemeProvider';
import { useEffect, useState } from 'react';

function App() {
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');

    if (token) {
      localStorage.setItem('authToken', token);

      // Xoá token khỏi URL sau khi lưu
      window.history.replaceState({}, document.title, '/admin/dashboard');

      setTokenReady(true);
    } else if (localStorage.getItem('authToken')) {
      setTokenReady(true);
    }
  }, []);

  const content = useRoutes(router);

  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        {content}
      </LocalizationProvider>
    </ThemeProvider>
  );
}
export default App;
