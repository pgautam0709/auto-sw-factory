'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFactory } from '@/context/FactoryContext';
import { Code2, Loader2, ArrowRight, AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import type { DevelopmentArtifacts } from '@/types';

const methodColors: Record<string, string> = {
  GET: 'bg-emerald-100 text-emerald-700',
  POST: 'bg-blue-100 text-blue-700',
  PUT: 'bg-amber-100 text-amber-700',
  DELETE: 'bg-red-100 text-red-700',
  PATCH: 'bg-violet-100 text-violet-700',
};

const testStatusIcon = {
  passing: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  failing: <XCircle className="w-4 h-4 text-red-500" />,
  pending: <Clock className="w-4 h-4 text-amber-500" />,
};

export default function DevelopmentPage() {
  const router = useRouter();
  const { feature, development, setDevelopment } = useFactory();
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
        body: JSON.stringify({ type: 'development', featureName: feature.name }),
      });
      const json = await res.json();
      if (json.data) setDevelopment(json.data as DevelopmentArtifacts);
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
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold text-ford-600 uppercase tracking-wider">Stage 3</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Development Factory</h1>
          <p className="text-slate-500 mt-1">Feature: <span className="font-semibold text-slate-700">{feature.name}</span></p>
        </div>
        <div className="flex gap-3">
          {development && (
            <button
              onClick={() => router.push('/validation')}
              className="flex items-center gap-2 bg-ford-600 hover:bg-ford-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              Next: Validation <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={generate}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-ford-600 hover:bg-ford-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Code2 className="w-4 h-4" />}
            {isGenerating ? 'Generating…' : development ? 'Regenerate' : 'Generate Artifacts'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {isGenerating && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-12 flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
          <p className="text-slate-700 font-semibold">AI is generating development artifacts…</p>
          <p className="text-slate-400 text-sm mt-1">Designing AUTOSAR-aligned service architecture</p>
        </div>
      )}

      {!isGenerating && !development && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-12 flex flex-col items-center text-center">
          <Code2 className="w-12 h-12 text-slate-200 mb-4" />
          <p className="text-slate-600 font-semibold mb-1">Development artifacts not yet generated</p>
          <p className="text-slate-400 text-sm">Click "Generate Artifacts" to proceed.</p>
        </div>
      )}

      {!isGenerating && development && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 mb-4">Service Design</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Service Name</p>
                <p className="text-sm font-mono font-bold text-indigo-700">{development.serviceDesign.name}</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-4 mb-1">Responsibility</p>
                <p className="text-sm text-slate-700 leading-relaxed">{development.serviceDesign.responsibility}</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-4 mb-1">Architecture Pattern</p>
                <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-md">{development.serviceDesign.pattern}</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Components</p>
                <ul className="space-y-1.5">
                  {development.serviceDesign.components.map((c, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                      <span className="font-mono text-xs">{c}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-4 mb-2">Dependencies</p>
                <ul className="space-y-1.5">
                  {development.serviceDesign.dependencies.map((d, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                      <span className="font-mono text-xs">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">API Contract</h2>
              <p className="text-xs text-slate-500 mt-0.5">{development.apiContract.length} endpoints defined</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Path</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Response Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {development.apiContract.map((ep, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-6 py-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${methodColors[ep.method] ?? 'bg-slate-100 text-slate-700'}`}>{ep.method}</span>
                      </td>
                      <td className="px-6 py-3 font-mono text-xs text-slate-700">{ep.path}</td>
                      <td className="px-6 py-3 text-slate-600">{ep.description}</td>
                      <td className="px-6 py-3 font-mono text-xs text-slate-500">{ep.responseType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">Unit Test Suite</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {development.unitTests.filter(t => t.status === 'passing').length} passing ·{' '}
                {development.unitTests.filter(t => t.status === 'failing').length} failing ·{' '}
                {development.unitTests.filter(t => t.status === 'pending').length} pending
              </p>
            </div>
            <div className="divide-y divide-slate-50">
              {development.unitTests.map(test => (
                <div key={test.id} className="px-6 py-4 flex items-start gap-4">
                  <div className="shrink-0 mt-0.5">{testStatusIcon[test.status]}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono font-bold text-slate-400">{test.id}</span>
                      <p className="text-sm font-semibold text-slate-800">{test.name}</p>
                    </div>
                    <p className="text-xs text-slate-500"><span className="font-medium">Scenario:</span> {test.scenario}</p>
                    <p className="text-xs text-slate-500 mt-0.5"><span className="font-medium">Expected:</span> {test.expected}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
