'use client';

import React, { useState, useEffect } from 'react';
import { Advertisement } from '@/types';
import { Megaphone, Plus, Trash2, ExternalLink, Eye, MousePointer, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New Ad Form state
  const [title, setTitle] = useState('');
  const [sponsor, setSponsor] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ctaText, setCtaText] = useState('View Details');
  const [targetUrl, setTargetUrl] = useState('');
  const [badge, setBadge] = useState('Sponsored');

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await fetch('/api/admin/ads');
      if (res.ok) {
        const json = await res.json();
        setAds(json.ads || []);
      }
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (adId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/ads/${adId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) {
        setAds((prev) =>
          prev.map((a) => (a.id === adId ? { ...a, isActive: !currentStatus } : a))
        );
      }
    } catch {
      //
    }
  };

  const handleDelete = async (adId: string) => {
    if (!confirm('Are you sure you want to delete this ad campaign?')) return;
    try {
      const res = await fetch(`/api/admin/ads/${adId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setAds((prev) => prev.filter((a) => a.id !== adId));
      }
    } catch {
      //
    }
  };

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !sponsor || !description || !targetUrl) return;

    try {
      const res = await fetch('/api/admin/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          sponsor,
          description,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
          ctaText,
          targetUrl,
          badge,
          isActive: true,
        }),
      });

      if (res.ok) {
        fetchAds();
        setCreateModalOpen(false);
        setTitle('');
        setSponsor('');
        setDescription('');
        setImageUrl('');
        setTargetUrl('');
      }
    } catch {
      //
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-amber-400" />
            <span>Advertisement Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Create and manage sponsored ad cards displayed in the user social feed</p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Ads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ads.map((ad) => (
          <div
            key={ad.id}
            className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                  {ad.badge || 'Sponsored'}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    ad.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {ad.isActive ? 'Active in Feed' : 'Paused'}
                </span>
              </div>

              {ad.imageUrl && (
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="w-full h-32 rounded-2xl object-cover"
                />
              )}

              <div>
                <span className="text-[11px] font-bold text-slate-400">{ad.sponsor}</span>
                <h4 className="text-sm font-bold text-white leading-tight mt-0.5">{ad.title}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{ad.description}</p>
              </div>

              {/* Metrics */}
              <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>{ad.impressions || 0} views</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MousePointer className="w-3.5 h-3.5 text-slate-500" />
                  <span>{ad.clicks || 0} clicks</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => handleToggleActive(ad.id, ad.isActive)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                  ad.isActive
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {ad.isActive ? 'Pause' : 'Activate'}
              </button>

              <button
                onClick={() => handleDelete(ad.id)}
                className="p-1.5 rounded-xl hover:bg-red-500/20 text-red-400 transition-colors"
                aria-label="Delete ad"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Campaign Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Sponsored Ad Campaign"
      >
        <form onSubmit={handleCreateAd} className="space-y-3 text-xs text-slate-800 dark:text-slate-200">
          <div>
            <label className="font-bold block mb-1">Campaign Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. ໂປຣໂມຊັ່ນກາເຟ Dirty Coffee ໃໝ່"
              required
            />
          </div>

          <div>
            <label className="font-bold block mb-1">Sponsor / Brand Name</label>
            <Input
              value={sponsor}
              onChange={(e) => setSponsor(e.target.value)}
              placeholder="e.g. Cafe Sinouk Laos"
              required
            />
          </div>

          <div>
            <label className="font-bold block mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed promotional copy for Gen Z feed users..."
              rows={3}
              required
              className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-dark-elevated border border-slate-200 dark:border-slate-800 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold block mb-1">Banner Image URL</label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold block mb-1">CTA Button Text</label>
              <Input
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="View Offer"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Target Link URL</label>
              <Input
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://example.com"
                required
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Launch Campaign
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
