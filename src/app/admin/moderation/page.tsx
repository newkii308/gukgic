'use client';

import React, { useState, useEffect } from 'react';
import { ReportItem } from '@/types';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  EyeOff,
  UserX,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';

export default function AdminModerationPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'resolved' | 'dismissed' | 'all'>('pending');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/admin/reports');
      if (res.ok) {
        const json = await res.json();
        setReports(json.reports || []);
      }
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (reportId: string, action: string) => {
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        fetchReports();
      }
    } catch {
      //
    }
  };

  const filteredReports = reports.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Content Moderation Desk</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Review reported content, take actions, and maintain community safety</p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-2xl">
          {(['pending', 'resolved', 'dismissed', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-colors ${
                filter === f
                  ? 'bg-rose-500 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length > 0 ? (
          filteredReports.map((rep) => (
            <div
              key={rep.id}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-rose-400 border border-slate-700">
                    {rep.targetType}
                  </span>
                  <span className="text-xs text-slate-400">Target ID: <code className="text-slate-200 font-mono">{rep.targetId}</code></span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTimeAgo(rep.createdAt, 'en')}</span>
                </div>
              </div>

              {/* Reason & Details */}
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>{rep.reason}</span>
                </p>
                {rep.details && (
                  <p className="text-xs text-slate-400 pl-6">{rep.details}</p>
                )}
                {rep.reporter && (
                  <p className="text-[11px] text-slate-500 pl-6">
                    Reported by: <span className="text-slate-300 font-semibold">{rep.reporter.name}</span> (@{rep.reporter.username})
                  </p>
                )}
              </div>

              {/* Moderation Controls / Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Status:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      rep.status === 'pending'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : rep.status === 'resolved'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {rep.status} {rep.actionTaken !== 'none' ? `(${rep.actionTaken})` : ''}
                  </span>
                </div>

                {rep.status === 'pending' && (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleAction(rep.id, 'dismiss')}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    >
                      Dismiss Report
                    </button>
                    <button
                      onClick={() => handleAction(rep.id, 'hidden')}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-colors flex items-center gap-1.5"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide Content</span>
                    </button>
                    <button
                      onClick={() => handleAction(rep.id, 'banned')}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors flex items-center gap-1.5"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Ban Author</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center rounded-3xl bg-slate-900 border border-slate-800 p-8 space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-sm font-bold text-slate-200">No reports found in this view</p>
            <p className="text-xs text-slate-500">Moderation desk is up to date.</p>
          </div>
        )}
      </div>
    </div>
  );
}
