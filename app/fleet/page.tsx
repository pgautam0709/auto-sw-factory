'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFactory } from '@/context/FactoryContext';
import { Car, Loader2, AlertCircle, Zap, AlertTriangle, Info } from 'lucide-react';
import type { FleetIntelligence } from '@/types';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const severityConfig = {
  Critical: { cls: 'bg-red-100 text-red-700 border-red-200', icon: <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> },
  Warning: { cls: 'bg-amber-100 text-amber-700 border-amber-200', icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> },
  Info: { cls: 'bg-blue-100 text-blue-700 border-blue-200', icon: <Info className="w-3.5 h-3.5 text-blue-500" /> },
};

export default function FleetPage() {
  const router = useRouter();
  const { feature, fleet, setFleet } = useFactory();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    if (!feature) return;
    setIsGenerating(true);
    setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'fleet', featureName: feature.name }),
      });
      const json = await res.json();
      if (json.data) setFleet(json.data as FleetIntelligence);
      else setError('Generation failed. Please try again.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!feature) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
        <h2 className="text-lg font-semibold text-slate-700 mb-2">No Feature Selected</h2>
        <p className="text-slate-500 text-sm mb-6">Start by submitting a feature in the Feature Intake stage.</p>
        <button onClick={() => router.push('/intake')} className="bg-ford-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-ford-700 transition-colors">
          Go to Feature Intake
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-ford-700 flex items-center justify-center">
              <Car className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold text-ford-600 uppercase tracking-wider">Stage 7</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Fleet Intelligence</h1>
          <p className="text-slate-500 mt-1">Feature: <span className="font-semibold text-slate-700">{feature.name}</span></p>
        </div>
        <button
          onClick={generate}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-ford-600 hover:bg-ford-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Car className="w-4 h-4" />}
          {isGenerating ? 'Loading Fleet Data…' : fleet ? 'Refresh Intelligence' : 'Load Fleet Intelligence'}
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {isGenerating && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-12 flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-rose-500 animate-spin mb-4" />
          <p className="text-slate-700 font-semibold">Aggregating fleet telemetry…</p>
          <p className="text-slate-400 text-sm mt-1">Analyzing 51,000 deployed vehicles</p>
        </div>
      )}

      {!isGenerating && !fleet && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-12 flex flex-col items-center text-center">
          <Car className="w-12 h-12 text-slate-200 mb-4" />
          <p className="text-slate-600 font-semibold mb-1">Fleet intelligence not yet loaded</p>
          <p className="text-slate-400 text-sm">Click "Load Fleet Intelligence" to view post-deployment telemetry and AI insights.</p>
        </div>
      )}

      {!isGenerating && fleet && (
        <div className="space-y-5 animate-fade-in">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 text-center">
              <p className="text-xs text-slate-500 font-medium mb-1">Fleet Success Rate</p>
              <p className="text-4xl font-bold text-emerald-600">{fleet.successRate}%</p>
              <p className="text-xs text-slate-400 mt-1">Phase 1 + Phase 2</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 text-center">
              <p className="text-xs text-slate-500 font-medium mb-1">Vehicles Deployed</p>
              <p className="text-4xl font-bold text-slate-900">{fleet.totalDeployed.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mt-1">of 847,250 target</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 text-center">
              <p className="text-xs text-slate-500 font-medium mb-1">Active Clusters</p>
              <p className="text-4xl font-bold text-amber-600">{fleet.failureClusters.length}</p>
              <p className="text-xs text-slate-400 mt-1">Failure clusters detected</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 mb-4">Success Rate Trend — 7 Day Rollout</h2>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={fleet.trends} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#003476" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#003476" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={[93, 99]} tick={{ fontSize: 11, fill: '#64748B' }} unit="%" />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
                  formatter={(val: unknown) => [`${val}%`, 'Success Rate']}
                />
                <Area
                  type="monotone"
                  dataKey="successRate"
                  stroke="#003476"
                  strokeWidth={2.5}
                  fill="url(#successGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">Failure Clusters</h2>
              <p className="text-xs text-slate-500 mt-0.5">Geospatial and model-variant anomaly detection</p>
            </div>
            <div className="divide-y divide-slate-50">
              {fleet.failureClusters.map(cluster => (
                <div key={cluster.id} className="px-6 py-4">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 mt-0.5">
                      {severityConfig[cluster.severity].icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${severityConfig[cluster.severity].cls}`}>
                          {cluster.severity}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{cluster.id}</span>
                        <span className="text-xs text-slate-500">{cluster.affectedVehicles} vehicles</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-800">{cluster.region} · {cluster.model}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{cluster.issueType}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-rose-600" />
              <p className="text-sm font-semibold text-rose-800">AI Fleet Recommendations</p>
            </div>
            <div className="space-y-3">
              {fleet.aiRecommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-200 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-rose-700">{i + 1}</span>
                  </div>
                  <p className="text-sm text-rose-800 leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <p className="text-sm font-semibold text-emerald-800 mb-1">Software Lifecycle Complete</p>
            <p className="text-sm text-emerald-700">
              The {feature.name} feature has successfully progressed from initial concept through requirements, development, validation, quality, release, and is now actively monitored in the production fleet. The AI factory has closed the loop.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
