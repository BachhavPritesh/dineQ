import { Link, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Mail, Lock, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { RoleToggle } from '@/components/auth/RoleToggle';
import { setStoredRole } from '@/lib/role';
import { authService } from '@/services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.login({ email, password });
      setStoredRole(role);
      navigate(role === 'owner' ? '/dashboard' : '/restaurants');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:block overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/70 to-background/40" />
        <div className="relative h-full flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2 w-fit group">
            <div className="h-9 w-9 rounded-lg gradient-gold grid place-items-center shadow-gold transition group-hover:scale-105">
              <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-lg tracking-tight">
              Dine<span className="text-gold">Q</span>
            </span>
          </Link>
          <div>
            <p className="font-display text-3xl font-semibold leading-tight max-w-md">
              "I haven't waited blindly outside a restaurant in months."
            </p>
            <p className="mt-4 text-sm text-muted-foreground">— Maya R., regular at Ember & Oak</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8 group">
            <div className="h-9 w-9 rounded-lg gradient-gold grid place-items-center shadow-gold transition group-hover:scale-105">
              <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-lg tracking-tight">
              Dine<span className="text-gold">Q</span>
            </span>
          </Link>

          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">Choose how you want to sign in.</p>

          <div className="mt-6">
            <RoleToggle value={role} onChange={setRole} />
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {error}
              </div>
            )}
            <Field
              label="Email"
              icon={Mail}
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
            />
            <Field
              label="Password"
              icon={Lock}
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
            />
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input
                  type="checkbox"
                  className="rounded border-border bg-input accent-[var(--gold)]"
                />
                Remember me
              </label>
              <a href="#" className="text-gold hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg gradient-gold text-primary-foreground font-medium shadow-gold hover:opacity-90 transition"
            >
              Log in as {role === 'owner' ? 'Owner' : 'Customer'} <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <button
            onClick={() =>
              (window.location.href = 'https://dineq-a2v9.onrender.com/api/v1/auth/google')
            }
            className="w-full px-5 py-3 rounded-lg border border-border hover:border-gold/40 transition text-sm font-medium flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 4.22v3.38h3.57c2.1-1.93 3.3-4.78 3.3-8.61z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-3.38c-.98.66-2.23 1.05-3.71 1.05-2.86 0-5.29-1.93-6.16-4.53H2.18v3.48C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.37-.35-2.09s.13-1.43.35-2.09V6.43H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.57l2.66-2.48z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.43l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-8 text-sm text-center text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, type, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-3 z-10 h-4 w-4 text-muted-foreground pointer-events-none shrink-0" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-border/60 bg-surface/50 backdrop-blur-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition text-sm shadow-sm"
        />
      </div>
    </div>
  );
}
