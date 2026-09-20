import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Shield, Lock, UserCheck, ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export function AdminLogin() {
  const [username, setUsername] = useState('Anmol Kumar');
  const [password, setPassword] = useState('Anmol@123');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUsername', data.username || username);
        toast.success(`Welcome back, ${data.username || username}!`);
        navigate('/admin/dashboard');
      } else {
        toast.error(data.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      toast.error('Network communication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    toast.success('Credentials filled!');
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
          Secure, single-user administrative control center for The Jewel Studio
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl sm:px-10 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-royal via-gold to-royal" />

          <form className="space-y-5" onSubmit={handleLogin}>
            <Input
              label="Admin Username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Anmol Kumar or admin"
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-royal hover:bg-royal-dark text-white uppercase tracking-widest font-semibold py-3 text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
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

          {/* Quick-fill helper card */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-charcoal-light uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Quick Login Profiles</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('Anmol Kumar', 'Anmol@123')}
                className="text-left px-3 py-2 text-xs rounded-lg border border-gray-200 bg-gray-50 hover:bg-gold/10 hover:border-gold/40 transition-colors"
              >
                <div className="font-medium text-charcoal flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-royal" /> Anmol Kumar
                </div>
                <div className="text-[11px] text-gray-500 font-mono">Anmol@123</div>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('admin', 'admin_password')}
                className="text-left px-3 py-2 text-xs rounded-lg border border-gray-200 bg-gray-50 hover:bg-royal/10 hover:border-royal/40 transition-colors"
              >
                <div className="font-medium text-charcoal flex items-center gap-1">
                  <Shield className="w-3 h-3 text-royal" /> Admin Master
                </div>
                <div className="text-[11px] text-gray-500 font-mono">admin_password</div>
              </button>
            </div>
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
