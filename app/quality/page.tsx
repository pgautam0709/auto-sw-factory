'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFactory } from '@/context/FactoryContext';
import { ShieldCheck, Loader2, ArrowRight, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import type { QualityMetrics } from '@/types';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip,
} from 'recharts';

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const strokeColor = score >= 90 ? '#10B981' : score >= 75 ? '#F59E0B' : '#EF4444';
  return (
    <div className="flex flex-col items-center p-5">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#F1F5F9" strokeWidth="10" />
          <circle
            cx="50" cy="50" r={r} fill="none"
            stroke={strokeColor} strokeWidth="10"
            strokeDasharray={`${circ * score / 100} ${circ}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-slate-900">{score}</span>
          <span className="text-xs text-slate-400">/100</span>
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-700 mt-2 text-center">{label}</p>
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${
        score >= 90 ? 'bg-emerald-100 text-emerald-700' :
        score >= 75 ? 'bg-amber-100 text-amber-700' :
        'bg-red-100 text-red-700'
      }`}>
        {score >= 90 ? 'Excellent' : score >= 75 ? 'Good' : 'Needs Attention'}
      </span>
    </div>
  );
}

export default function QualityPage() {
  const router = useRouter();
  const { feature, validation, quality, setQuality } = useFactory();
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
          type: 'quality',
          featureName: feature.name,
          context: { passRate: validation?.passRate ?? 95.2 },
        }),
      });
      const json = await res.json();
      if (json.data) setQuality(json.data as QualityMetrics);
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

  const radarData = quality ? [
    { dimension: 'Traceability', score: quality.traceabilityScore },
    { dimension: 'Test Coverage', score: quality.testCoverageScore },
    { dimension: 'Cybersecurity', score: quality.cybersecurityScore },
    { dimension: 'Compliance', score: quality.complianceScore },
  ] : [];

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-ford-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold text-ford-600 uppercase tracking-wider">Stage 5</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Quality Factory</h1>
          <p className="text-slate-500 mt-1">Feature: <span className="font-semibold text-slate-700">{feature.name}</span></p>
        </div>
        <div className="flex gap-3">
          {quality && (
            <button
              onClick={() => router.push('/release')}
              className="flex items-center gap-2 bg-ford-600 hover:bg-ford-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              Next: Release Factory <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={generate}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-ford-600 hover:bg-ford-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            {isGenerating ? 'Analyzing…' : quality ? 'Re-assess' : 'Run Quality Assessment'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {isGenerating && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-12 flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
          <p className="text-slate-700 font-semibold">AI is assessing quality across 4 dimensions…</p>
          <p className="text-slate-400 text-sm mt-1">Evaluating against ISO 26262, ASPICE, UN ECE R155</p>
        </div>
      )}

      {!isGenerating && !quality && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-12 flex flex-col items-center text-center">
          <ShieldCheck className="w-12 h-12 text-slate-200 mb-4" />
          <p className="text-slate-600 font-semibold mb-1">Quality assessment not yet run</p>
          <p className="text-slate-400 text-sm">Click "Run Quality Assessment" to generate scores.</p>
        </div>
      )}

      {!isGenerating && quality && (
        <div className="space-y-5 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-slate-800">Quality Gate Scores</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Overall Score</span>
                <span className={`text-lg font-bold px-3 py-1 rounded-lg ${
                  quality.overallScore >= 90 ? 'bg-emerald-100 text-emerald-700' :
                  quality.overallScore >= 75 ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>{quality.overallScore}/100</span>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 divide-x divide-slate-100">
              <ScoreRing score={quality.traceabilityScore} label="Traceability" color="#2563EB" />
              <ScoreRing score={quality.testCoverageScore} label="Test Coverage" color="#7C3AED" />
              <ScoreRing score={quality.cybersecurityScore} label="Cybersecurity" color="#059669" />
              <ScoreRing score={quality.complianceScore} label="Compliance" color="#D97706" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <h2 className="font-semibold text-slate-800 mb-4">Quality Radar</h2>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#F1F5F9" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Radar dataKey="score" fill="#003476" fillOpacity={0.15} stroke="#003476" strokeWidth={2} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
                    formatter={(val: unknown) => [`${val}/100`, 'Score']}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-ford-500" />
                <h2 className="font-semibold text-slate-800">AI Recommendations</h2>
              </div>
              <div className="space-y-3">
                {quality.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-ford-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-ford-600">{i + 1}</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {quality.overallScore >= 85 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-center gap-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />
              <div>
                <p className="font-semibold text-emerald-800">Quality Gate Passed</p>
                <p className="text-sm text-emerald-700 mt-0.5">
                  All scores exceed OEM thresholds. Feature is approved to proceed to Release Factory.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
