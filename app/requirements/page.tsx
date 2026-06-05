'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFactory } from '@/context/FactoryContext';
import { FileText, Loader2, ArrowRight, CheckCircle2, AlertCircle, Cpu, Code2 } from 'lucide-react';
import type { Requirements } from '@/types';

function cleanAction(s: string) {
  return s.replace(/^(i\s+want\s+to\s+|want\s+to\s+|want\s+)/i, '');
}
function cleanBenefit(s: string) {
  return s.replace(/^(so\s+that\s+|so\s+|to\s+)/i, '');
}

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

const asilColors: Record<string, string> = {
  'QM':     'bg-slate-100 text-slate-600 border-slate-200',
  'ASIL-A': 'bg-amber-100 text-amber-700 border-amber-200',
  'ASIL-B': 'bg-orange-100 text-orange-700 border-orange-200',
  'ASIL-C': 'bg-red-100 text-red-700 border-red-200',
  'ASIL-D': 'bg-red-200 text-red-800 border-red-300',
};

const busColors: Record<string, string> = {
  CAN:      'bg-emerald-100 text-emerald-700',
  LIN:      'bg-teal-100 text-teal-700',
  FlexRay:  'bg-blue-100 text-blue-700',
  Ethernet: 'bg-indigo-100 text-indigo-700',
  SENT:     'bg-violet-100 text-violet-700',
  SPI:      'bg-slate-100 text-slate-600',
  I2C:      'bg-slate-100 text-slate-600',
};

const appCategoryColors: Record<string, string> = {
  API:         'bg-ford-100 text-ford-700',
  Data:        'bg-violet-100 text-violet-700',
  Security:    'bg-rose-100 text-rose-700',
  Performance: 'bg-amber-100 text-amber-700',
  Integration: 'bg-cyan-100 text-cyan-700',
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

          {/* Level hierarchy banner */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full font-semibold">System Level</span>
            <span className="text-slate-300">→</span>
            <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-semibold">ECU Level</span>
            <span className="text-slate-300">→</span>
            <span className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full font-semibold">Application / Service Level</span>
          </div>

          {/* System Requirements */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-violet-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-800">System Requirements</h2>
                <p className="text-xs text-slate-500 mt-0.5">{requirements.systemRequirements.length} vehicle-level requirements · ISO 26262 aligned</p>
              </div>
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

          {/* ECU Requirements */}
          {requirements.ecuRequirements && requirements.ecuRequirements.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800">ECU-Level Requirements</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{requirements.ecuRequirements.length} requirements across {new Set(requirements.ecuRequirements.map(r => r.ecuName)).size} ECUs</p>
                </div>
              </div>
              <div className="divide-y divide-slate-50">
                {requirements.ecuRequirements.map(req => (
                  <div key={req.id} className="px-6 py-4">
                    <div className="flex items-start gap-4">
                      <span className="text-xs font-mono font-bold text-slate-400 mt-0.5 shrink-0">{req.id}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">{req.ecuName}</span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{req.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${busColors[req.interface] ?? 'bg-slate-100 text-slate-600'}`}>
                            {req.interface}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-md border font-bold font-mono ${asilColors[req.asilLevel] ?? 'bg-slate-100 text-slate-600'}`}>
                            {req.asilLevel}
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
          )}

          {/* App / Service Requirements */}
          {requirements.appServiceRequirements && requirements.appServiceRequirements.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800">Application / Service Requirements</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{requirements.appServiceRequirements.length} requirements across {new Set(requirements.appServiceRequirements.map(r => r.serviceName)).size} services</p>
                </div>
              </div>
              <div className="divide-y divide-slate-50">
                {requirements.appServiceRequirements.map(req => (
                  <div key={req.id} className="px-6 py-4">
                    <div className="flex items-start gap-4">
                      <span className="text-xs font-mono font-bold text-slate-400 mt-0.5 shrink-0">{req.id}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-mono">{req.serviceName}</span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{req.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${appCategoryColors[req.category] ?? 'bg-slate-100 text-slate-600'}`}>
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
          )}

          {/* User Stories */}
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
                    <span className="font-medium">I want to</span> {cleanAction(story.action)},{' '}
                    <span className="font-medium">so that</span> {cleanBenefit(story.benefit)}.
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
