'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Lock, User as UserIcon, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('ກະລຸນາປ້ອນ Username ແລະ ລະຫັດຜ່ານ');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(username, password);
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-3xl bg-gradient-to-tr from-primary-600 via-indigo-500 to-rose-400 items-center justify-center text-white shadow-xl shadow-primary-500/25 mb-1">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-dark-text tracking-tight">
            ເຂົ້າສູ່ລະບົບ GUKGIC
          </h1>
          <p className="text-xs text-slate-400">
            Social Web App ສຳລັບຫາເພື່ອນໃໝ່ຂອງຄົນຮຸ່ນໃໝ່ໃນລາວ 🇱🇦
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 shadow-xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Username
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="e.g. alouny_s, khamla_dev, khampheng"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                ລະຫັດຜ່ານ (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl text-sm font-bold shadow-md shadow-primary-500/20 mt-2 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'ກຳລັງເຂົ້າສູ່ລະບົບ...' : 'ເຂົ້າສູ່ລະບົບ (Sign In)'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Quick Demo Accounts Helper */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-elevated text-[11px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-700 dark:text-slate-300">💡 ບັນຊີທົດສອບ (Default Seed Accounts):</p>
            <p>• <strong>khampheng</strong> (Admin) / <code>password123</code></p>
            <p>• <strong>alouny_s</strong> (User) / <code>password123</code></p>
            <p>• <strong>khamla_dev</strong> (Moderator) / <code>password123</code></p>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="text-center text-xs text-slate-500">
          ຍັງບໍ່ມີບັນຊີເທື່ອບໍ?{' '}
          <Link href="/register" className="font-bold text-primary-600 hover:underline">
            ລົງທະບຽນໃໝ່ (Create Account)
          </Link>
        </div>
      </div>
    </div>
  );
}
