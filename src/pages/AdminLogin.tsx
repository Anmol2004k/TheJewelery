 import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Shield, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { supabase, signInWithGoogle } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export function AdminLogin() {
  const [email, setEmail] = useState('theadultanmol@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  // If already authenticated as admin via Supabase
  React.useEffect(() => {
    if (user && isAdmin) {
      localStorage.setItem(
        'adminUsername',
        user.displayName || user.email || 'Admin'
      );
    }
  }, [user, isAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter your admin email and password.');
      return;
    }

    setLoading(true);

    try {
      // 1. Authenticate using Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        toast.error(error.message || 'Invalid email or password.');
        return;
      }

      if (!data.user) {
        toast.error('Authentication failed. Please try again.');
        return;
      }

      const sbUser = data.user;
      const userEmail = (sbUser.email || '').toLowerCase();

      // 2. Get the user's profile from Supabase
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, display_name, avatar_url, role')
        .eq('id', sbUser.id)
        .maybeSingle();

      if (profileError) {
        console.error('Admin profile check error:', profileError);

        await supabase.auth.signOut();

        toast.error('Unable to verify admin profile.');
        return;
      }

      // 3. Admin role MUST come from the database
      if (!profile || profile.role !== 'admin') {
        await supabase.auth.signOut();

        toast.error(
          'Access denied. This account is not an administrator.'
        );

        return;
      }

      // 4. Admin verified
      const adminName =
        profile.display_name ||
        profile.email ||
        userEmail ||
        'Admin';

      // This is only for UI/display purposes.
      // It is NOT used for authentication/security.
      localStorage.setItem('adminUsername', adminName);

      toast.success(`Welcome back, ${adminName}!`);

      // 5. Go to admin dashboard
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error('Admin login error:', err);

      toast.error(
        err?.message || 'Authentication failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAdminLogin = async () => {
    setLoading(true);

    try {
      await signInWithGoogle('/admin/dashboard');
    } catch (err: any) {
      console.error('Google admin login error:', err);

      toast.error(
        err?.message || 'Google admin sign-in failed'
      );

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-light/60 flex flex-col justify-center py-16 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-royal text-sand flex items-center justify-center shadow-lg border border-gold/30">
            <Shield className="w-8 h-8 text-gold" />
          </div>
        </div>

        <h2 className="mt-5 text-center text-3xl font-playfair font-bold text-charcoal tracking-tight">
          Executive Admin Portal
        </h2>

        <p className="mt-2 text-center text-sm text-charcoal-light max-w-sm mx-auto">
          Secure, role-protected administrative control center.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl sm:px-10 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-royal via-gold to-royal" />

          {/* Already logged in as Admin */}
          {user && isAdmin && (
            <div className="mb-6 p-4 rounded-lg bg-gold/10 border border-gold/30 text-center">
              <p className="text-xs text-charcoal mb-2">
                Currently signed in as{' '}
                <strong className="text-royal">
                  {user.displayName || user.email}
                </strong>{' '}
                (Admin).
              </p>

              <Button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="w-full bg-royal hover:bg-royal-dark text-white text-xs py-2 uppercase tracking-wider font-semibold cursor-pointer"
              >
                Go to Dashboard
              </Button>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <Input
              label="Admin Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourEmail@gmail.com"
            />

            <Input
              label="Admin Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-royal hover:bg-royal-dark text-white uppercase tracking-widest font-semibold py-3 text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-gold" />
                  <span>Access Secure Dashboard</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </form>

          {/* Google Admin Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>

              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="bg-white px-2 text-gray-500">
                  Or use Admin SSO
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleAdminLogin}
              disabled={loading}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-xs font-semibold uppercase tracking-wider text-charcoal hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                aria-label="Google logo"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />

                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />

                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />

                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>

              <span>Sign in with Google Admin</span>
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Role-Based Access Control Enabled (RLS)</span>
          </div>
        </div>

        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-charcoal-light hover:text-royal transition-colors underline underline-offset-4"
          >
            ← Return to The Jewel Studio Storefront
          </a>
        </div>
      </div>
    </div>
  );
}