'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Lock, User as UserIcon, MapPin, AlertCircle, ArrowRight, Heart } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('Vientiane');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Coffee', 'Photography']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const availableInterests = [
    'Coffee', 'Photography', 'Music', 'Tech', 'Travel', 'Gaming', 'Fashion', 'Camping', 'Art', 'Fitness'
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !name || !password) {
      setError('ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register({
        username: username.toLowerCase().trim(),
        name: name.trim(),
        password,
        city,
        interests: selectedInterests,
      });

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-3xl bg-gradient-to-tr from-primary-600 via-indigo-500 to-rose-400 items-center justify-center text-white shadow-xl shadow-primary-500/25 mb-1">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-dark-text tracking-tight">
            ລົງທະບຽນສະມາຊິກ GUKGIC
          </h1>
          <p className="text-xs text-slate-400">
            ສ້າງໂປຣໄຟລ໌ເພື່ອເລີ່ມຫາເພື່ອນໃໝ່ໃນລາວ 🇱🇦
          </p>
        </div>

        {/* Register Card */}
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
                ຊື່ສະແດງ (Display Name)
              </label>
              <Input
                type="text"
                placeholder="e.g. Noy Vientiane, Anousone"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="text-slate-400 text-xs font-bold absolute left-3.5 top-1/2 -translate-y-1/2">@</span>
                <Input
                  type="text"
                  placeholder="noy_laos"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-8"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">ພາສາອັງກິດ ແລະ ຕົວເລກ ເທົ່ານັ້ນ (min 3 chars)</p>
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
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                ເມືອງ / ແຂວງ (City)
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-dark-elevated text-xs border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="Vientiane">ນະຄອນຫຼວງວຽງຈັນ (Vientiane Capital)</option>
                <option value="Luang Prabang">ຫຼວງພະບາງ (Luang Prabang)</option>
                <option value="Champasak">ຈຳປາສັກ / ປາກເຊ (Champasak / Pakse)</option>
                <option value="Savannakhet">ສະຫວັນນະເຂດ (Savannakhet)</option>
                <option value="Khammouane">ຄຳມ່ວນ (Khammouane)</option>
                <option value="Vang Vieng">ວັງວຽງ (Vang Vieng)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                ສິ່ງທີ່ມັກ / ຄວາມສົນໃຈ (Interests)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableInterests.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-dark-elevated text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl text-sm font-bold shadow-md shadow-primary-500/20 mt-2 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'ກຳລັງສ້າງບັນຊີ...' : 'ສ້າງບັນຊີໃໝ່ (Create Account)'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </div>

        {/* Footer Navigation */}
        <div className="text-center text-xs text-slate-500">
          ມີບັນຊີແລ້ວບໍ?{' '}
          <Link href="/login" className="font-bold text-primary-600 hover:underline">
            ເຂົ້າສູ່ລະບົບ (Sign In)
          </Link>
        </div>
      </div>
    </div>
  );
}
