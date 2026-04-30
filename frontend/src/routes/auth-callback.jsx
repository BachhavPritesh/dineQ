import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      toast.success('Logged in with Google successfully!');
      navigate('/');
    } else {
      toast.error('Google authentication failed');
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Processing Google login...</p>
    </div>
  );
}
