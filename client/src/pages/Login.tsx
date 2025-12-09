import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);
      
      const res = await api.post('/auth/login', formData);
      login(res.data.access_token, { 
        email: res.data.sub, // Assuming sub is email, adjust if needed based on backend response
        full_name: res.data.name, 
        role: res.data.role 
      });
      navigate('/');
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error('Login failed', err);
      setError('Login failed: ' + (err.response?.data?.detail || 'Unknown error'));
    }
  };

  const fillDemo = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      setEmail('admin@todo.dev');
      setPassword('ChangeMe123!');
    } else {
      setEmail('user@todo.dev');
      setPassword('ChangeMe123!');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button fullWidth variant="outlined" onClick={() => fillDemo('user')}>
              Demo User
            </Button>
            <Button fullWidth variant="outlined" onClick={() => fillDemo('admin')}>
              Demo Admin
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
