'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFactory } from '@/context/FactoryContext';
import { Package, Loader2, ArrowRight, AlertCircle, CheckCircle2, Clock, Circle, Zap } from 'lucide-react';
import type { ReleasePackage } from '@/types';

const phaseStatusIcon = {
  complete: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
  active: <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /></div>,
  pending: <Circle className="w-5 h-5 text-slate-300" />,
};

export default function ReleasePage() {
  const router = useRouter();
  const { feature, quality, release, setRelease } = useFactory();
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
        body: JSON.stringify({
          type: 'release',
          featureName: feature.name,
          context: { qualityScore: quality?.overallScore ?? 92 },
        }),
      });
      const json = await res.json();
      if (json.data) setRelease(json.data as ReleasePackage);
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
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold text-ford-600 uppercase tracking-wider">Stage 6</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Release Factory</h1>
          <p className="text-slate-500 mt-1">Feature: <span className="font-semibold text-slate-700">{feature.name}</span></p>
        </div>
        <div className="flex gap-3">
          {release && (
            <button
              onClick={() => router.push('/fleet')}
              className="flex items-center gap-2 bg-ford-600 hover:bg-ford-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              Next: Fleet Intelligence <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={generate}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-ford-600 hover:bg-ford-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
            {isGenerating ? 'Generating…' : release ? 'Regenerate Package' : 'Generate Release Package'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {isGenerating && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-12 flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
          <p className="text-slate-700 font-semibold">Generating OTA release package…</p>
          <p className="text-slate-400 text-sm mt-1">Building deployment plan and rollout schedule</p>
        </div>
      )}

      {!isGenerating && !release && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-12 flex flex-col items-center text-center">
          <Package className="w-12 h-12 text-slate-200 mb-4" />
          <p className="text-slate-600 font-semibold mb-1">Release package not yet generated</p>
          <p className="text-slate-400 text-sm">Click "Generate Release Package" to create the OTA deployment plan.</p>
        </div>
      )}

      {!isGenerating && release && (
        <div className="space-y-5 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-semibold text-slate-800">Release Package</h2>
                <p className="text-xs text-slate-500 mt-0.5">OTA deployment artifact</p>
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">Ready to Deploy</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Package ID</p>
                <p className="text-sm font-mono font-bold text-slate-800">{release.packageId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Version</p>
                <p className="text-sm font-mono font-bold text-slate-800">v{release.version}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Target Vehicles</p>
                <p className="text-sm font-bold text-slate-800">{release.targetVehicles.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Quality Score</p>
                <p className="text-sm font-bold text-emerald-600">{quality?.overallScore ?? '—'}/100</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 font-medium mb-1">Release Summary</p>
              <p className="text-sm text-slate-700 leading-relaxed">{release.summary}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 mb-5">Phased Deployment Plan</h2>
            <div className="space-y-4">
              {release.deploymentPlan.map((phase, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="shrink-0 mt-0.5">{phaseStatusIcon[phase.status]}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-sm font-semibold text-slate-800">{phase.label}</span>
                        <span className="text-xs text-slate-400 ml-2">{phase.phase}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{phase.duration}</span>
                        <span className="font-semibold text-slate-700">{phase.vehicles.toLocaleString()} vehicles</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 mb-1.5">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          phase.status === 'complete' ? 'bg-emerald-500' :
                          phase.status === 'active' ? 'bg-ford-500' : 'bg-slate-200'
                        }`}
                        style={{ width: phase.status === 'pending' ? '0%' : phase.status === 'complete' ? '100%' : `${phase.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500">
                      <span className="font-medium">Gate criteria:</span> {phase.criteria}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-500" /><span>Complete</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-ford-500" /><span>In Progress</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-slate-200" /><span>Pending</span></div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-500" />
              <h2 className="font-semibold text-slate-800">Change Log</h2>
            </div>
            <ul className="space-y-2">
              {release.changeLog.map((entry, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm font-mono text-slate-700">{entry}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
