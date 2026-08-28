'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  MessageCircle,
  FileText,
  Flag,
  Megaphone,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const res = await fetch('/api/admin/overview');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: data?.stats?.totalUsers || 0,
      sub: `${data?.stats?.activeUsers || 0} active now`,
      icon: Users,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Feed Posts',
      value: data?.stats?.totalPosts || 0,
      sub: 'Published user stories',
      icon: FileText,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Pending Reports',
      value: data?.stats?.pendingReports || 0,
      sub: 'Requires moderation action',
      icon: Flag,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
    },
    {
      title: 'Active Campaigns',
      value: data?.stats?.activeAds || 0,
      sub: `${data?.stats?.totalAds || 0} total campaigns`,
      icon: Megaphone,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-black text-white">Platform Overview & Metrics</h1>
        <p className="text-xs text-slate-400 mt-0.5">Real-time telemetry and operational status for GUKGIC</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`p-4 rounded-3xl border ${card.bg} space-y-3 shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{card.title}</span>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div>
                <p className="text-2xl font-black text-white tracking-tight">
                  {isLoading ? '...' : card.value}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Reports Quick Desk */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Pending Moderation Queue</span>
            </h3>
            <Link
              href="/admin/moderation"
              className="text-xs font-semibold text-rose-400 hover:underline flex items-center gap-1"
            >
              <span>View Desk</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {data?.pendingReports && data.pendingReports.length > 0 ? (
              data.pendingReports.map((rep: any) => (
                <div
                  key={rep.id}
                  className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-200 capitalize">
                      [{rep.targetType}] {rep.reason}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{rep.details || 'No additional comment'}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Pending
                  </span>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-xs text-slate-500">No pending reports! Moderation queue is clean.</p>
            )}
          </div>
        </div>

        {/* Recent Registered Users */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Recent User Accounts</span>
            </h3>
            <Link
              href="/admin/users"
              className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {data?.recentUsers &&
              data.recentUsers.map((u: any) => (
                <div
                  key={u.id}
                  className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <span className="font-bold text-slate-200">{u.name}</span>
                      <p className="text-[11px] text-slate-400">@{u.username} • {u.city || 'Laos'}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 uppercase">
                    {u.role}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
