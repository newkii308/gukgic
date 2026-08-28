'use client';

import React, { useState, useEffect } from 'react';
import { AuditLogItem } from '@/types';
import { History, Shield, Clock } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/audit-logs');
      if (res.ok) {
        const json = await res.json();
        setLogs(json.logs || []);
      }
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-400" />
          <span>Administrative Audit Trail</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Immutable log of all moderation, role alterations, and advertisement actions
        </p>
      </div>

      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-800 text-xs">
          {logs.length > 0 ? (
            logs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                      {log.action}
                    </span>
                    <span className="font-bold text-slate-200">{log.adminName}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">Target: <code className="font-mono text-slate-300">{log.targetType} ({log.targetId})</code></span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{log.details}</p>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px] whitespace-nowrap">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTimeAgo(log.createdAt, 'en')}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">No audit logs recorded yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
