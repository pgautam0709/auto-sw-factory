'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFactory } from '@/context/FactoryContext';
import { FileText, Loader2, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Requirements } from '@/types';

const priorityColors = {
  High: 'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-amber-100 text-amber-700 border-amber-200',
  Low: 'bg-slate-100 text-slate-600 border-slate-200',
};

const categoryColors: Record<string, string> = {
  Functional: 'bg-blue-100 text-blue-700',
  Safety: 'bg-rose-100 text-rose-700',
  Performance: 'bg-violet-100 text-violet-700',
  Interface: 'bg-cyan-100 text-cyan-700',
};

export default function RequirementsPage() {
  const router = useRouter();
  const { feature, requirements, setRequirements } = useFactory();
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
        body: JSON.stringify({ type: 'requirements', featureName: feature.name }),
      });
      const json = await res.json();
      if (json.data) setRequirements(json.data as Requirements);
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
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold text-ford-600 uppercase tracking-wider">Stage 2</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Requirements Factory</h1>
          <p className="text-slate-500 mt-1">Feature: <span className="font-semibold text-slate-700">{feature.name}</span></p>
        </div>
        <div className="flex gap-3">
          {requirements && (
            <button
              onClick={() => router.push('/development')}
              className="flex items-center gap-2 bg-ford-600 hover:bg-ford-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              Next: Development <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={generate}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-ford-600 hover:bg-ford-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            {isGenerating ? 'Generating…' : requirements ? 'Regenerate' : 'Generate Requirements'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {isGenerating && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-12 flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-violet-500 animate-spin mb-4" />
          <p className="text-slate-700 font-semibold">AI is generating engineering requirements…</p>
          <p className="text-slate-400 text-sm mt-1">Applying ISO 26262 and AUTOSAR constraints</p>
        </div>
      )}

      {!isGenerating && !requirements && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-12 flex flex-col items-center text-center">
          <FileText className="w-12 h-12 text-slate-200 mb-4" />
          <p className="text-slate-600 font-semibold mb-1">Requirements not yet generated</p>
          <p className="text-slate-400 text-sm">Click "Generate Requirements" to begin AI processing.</p>
        </div>
      )}

      {!isGenerating && requirements && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">System Requirements</h2>
              <p className="text-xs text-slate-500 mt-0.5">{requirements.systemRequirements.length} requirements generated</p>
            </div>
            <div className="divide-y divide-slate-50">
              {requirements.systemRequirements.map(req => (
                <div key={req.id} className="px-6 py-4">
                  <div className="flex items-start gap-4">
                    <span className="text-xs font-mono font-bold text-slate-400 mt-0.5 shrink-0">{req.id}</span>
                    <div className="flex-1">
                      <p className="text-sm text-slate-700 leading-relaxed">{req.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${categoryColors[req.category] ?? 'bg-slate-100 text-slate-600'}`}>
                          {req.category}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-md border font-medium ${priorityColors[req.priority]}`}>
                          {req.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">User Stories</h2>
              <p className="text-xs text-slate-500 mt-0.5">{requirements.userStories.length} stories generated</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-6">
              {requirements.userStories.map(story => (
                <div key={story.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-slate-400">{story.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-md border font-medium ${priorityColors[story.priority]}`}>
                      {story.priority}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">
                    <span className="font-medium">As a</span> {story.role},{' '}
                    <span className="font-medium">I want to</span> {story.action},{' '}
                    <span className="font-medium">so that</span> {story.benefit}.
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">Acceptance Criteria</h2>
              <p className="text-xs text-slate-500 mt-0.5">{requirements.acceptanceCriteria.length} criteria defined</p>
            </div>
            <div className="divide-y divide-slate-50">
              {requirements.acceptanceCriteria.map((criterion, i) => (
                <div key={i} className="px-6 py-4 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-700 leading-relaxed">{criterion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
