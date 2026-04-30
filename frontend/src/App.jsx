import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles.css';
import Landing from './routes/index';
import Login from './routes/login';
import Register from './routes/register';
import Dashboard from './routes/dashboard';
import Restaurants from './routes/restaurants';
import Queue from './routes/queue';
import Profile from './routes/profile';
import History from './routes/history';
import OwnerHistory from './routes/owner-history';
import AuthCallback from './routes/auth-callback';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="/queue/:restaurantId" element={<Queue />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<History />} />
        <Route path="/owner-history" element={<OwnerHistory />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </BrowserRouter>
  );
}
