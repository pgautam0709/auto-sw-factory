'use client';

import {
  Upload, FileText, Code2, FlaskConical, ShieldCheck, Package, Car,
  Zap, Database, Network, ArrowRight, ArrowDown, Cloud, GitBranch,
} from 'lucide-react';

const FACTORY_LAYERS = [
  {
    label: 'Input Layer',
    color: 'border-ford-200 bg-ford-50',
    textColor: 'text-ford-700',
    nodes: [
      { icon: Upload, label: 'Feature Intake', sub: 'Natural language input', color: 'bg-ford-600' },
    ],
  },
  {
    label: 'AI Orchestration Layer',
    color: 'border-violet-200 bg-violet-50',
    textColor: 'text-violet-700',
    nodes: [
      { icon: Zap, label: 'AI Orchestrator', sub: 'GPT-4o powered', color: 'bg-ford-600' },
      { icon: Database, label: 'Prompt Registry', sub: 'Centralized prompts', color: 'bg-ford-500' },
      { icon: GitBranch, label: 'Workflow Engine', sub: 'Stage sequencing', color: 'bg-ford-500' },
    ],
  },
  {
    label: 'Factory Pipeline',
    color: 'border-indigo-200 bg-indigo-50',
    textColor: 'text-indigo-700',
    nodes: [
      { icon: FileText, label: 'Requirements Factory', sub: 'ISO 26262 aligned', color: 'bg-indigo-600' },
      { icon: Code2, label: 'Development Factory', sub: 'AUTOSAR patterns', color: 'bg-indigo-500' },
      { icon: FlaskConical, label: 'Validation Factory', sub: '1,000-vehicle vSIL', color: 'bg-cyan-600' },
      { icon: ShieldCheck, label: 'Quality Factory', sub: 'ASPICE / UN ECE R155', color: 'bg-emerald-600' },
    ],
  },
  {
    label: 'Delivery Layer',
    color: 'border-amber-200 bg-amber-50',
    textColor: 'text-amber-700',
    nodes: [
      { icon: Package, label: 'Release Factory', sub: 'OTA package generation', color: 'bg-amber-500' },
      { icon: Cloud, label: 'OTA Platform', sub: 'Phased fleet rollout', color: 'bg-amber-600' },
    ],
  },
  {
    label: 'Intelligence Layer',
    color: 'border-rose-200 bg-rose-50',
    textColor: 'text-rose-700',
    nodes: [
      { icon: Car, label: 'Fleet Intelligence', sub: 'Real-time telemetry', color: 'bg-rose-600' },
      { icon: Network, label: 'Feedback Loop', sub: 'Closes the lifecycle', color: 'bg-rose-500' },
    ],
  },
];

const INTEGRATIONS = [
  { label: 'OEM PLM', desc: 'Product Lifecycle Management (Conceptual)', color: 'border-slate-300' },
  { label: 'AUTOSAR', desc: 'Adaptive / Classic Platform (Conceptual)', color: 'border-slate-300' },
  { label: 'vECU / HIL', desc: 'Virtual ECU Simulation (Conceptual)', color: 'border-slate-300' },
  { label: 'OTA Backend', desc: 'Fleet Update Management (Conceptual)', color: 'border-slate-300' },
  { label: 'Telematics', desc: 'Vehicle Data Platform (Conceptual)', color: 'border-slate-300' },
  { label: 'JIRA / ALM', desc: 'Requirements Traceability (Conceptual)', color: 'border-slate-300' },
];

export default function ArchitecturePage() {
  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center">
            <Network className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Architecture Vision</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Software Factory Architecture</h1>
        <p className="text-slate-500 mt-1">Future-state enterprise vision. This diagram represents the conceptual architecture — not the current implementation.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 mb-6 flex items-center gap-3">
        <Zap className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Executive Vision View.</span>{' '}
          Enterprise integrations shown below represent target-state architecture. This POC demonstrates the core AI pipeline — not enterprise infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-3">
          {FACTORY_LAYERS.map((layer, layerIdx) => (
            <div key={layer.label}>
              <div className={`border-2 rounded-xl p-4 ${layer.color}`}>
                <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${layer.textColor}`}>{layer.label}</p>
                <div className="flex flex-wrap gap-3">
                  {layer.nodes.map(({ icon: Icon, label, sub, color }) => (
                    <div key={label} className="flex items-center gap-2.5 bg-white rounded-lg border border-white/80 shadow-sm px-3 py-2.5">
                      <div className={`w-7 h-7 rounded-md ${color} flex items-center justify-center shrink-0`}>
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800 leading-tight">{label}</p>
                        <p className="text-xs text-slate-400 leading-tight">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {layerIdx < FACTORY_LAYERS.length - 1 && (
                <div className="flex justify-center my-1">
                  <ArrowDown className="w-5 h-5 text-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Enterprise Integrations</p>
            <p className="text-xs text-slate-400 mb-4">Conceptual connections — not implemented in this POC</p>
            <div className="space-y-2">
              {INTEGRATIONS.map(({ label, desc, color }) => (
                <div key={label} className={`border rounded-lg px-3 py-2 ${color}`}>
                  <p className="text-xs font-semibold text-slate-700">{label}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Current POC Stack</p>
            <div className="space-y-2">
              {[
                { label: 'Next.js 16', desc: 'App Router + API Routes' },
                { label: 'React 19', desc: 'Context state management' },
                { label: 'OpenAI GPT-4o', desc: 'AI artifact generation' },
                { label: 'Tailwind CSS v4', desc: 'UI styling' },
                { label: 'Recharts v3', desc: 'Data visualization' },
                { label: 'TypeScript', desc: 'Type-safe codebase' },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span className="text-xs font-semibold text-white">{label}</span>
                  <span className="text-xs text-slate-400">— {desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-slate-800 mb-4">Software Lifecycle Flow</h2>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { label: 'Feature', sub: 'Input', color: 'bg-ford-600' },
            { label: 'Requirements', sub: 'AI Generated', color: 'bg-violet-600' },
            { label: 'Development', sub: 'Artifacts', color: 'bg-indigo-600' },
            { label: 'Validation', sub: 'vSIL 1K', color: 'bg-cyan-600' },
            { label: 'Quality', sub: 'Gate', color: 'bg-emerald-600' },
            { label: 'Release', sub: 'OTA Package', color: 'bg-amber-500' },
            { label: 'Fleet', sub: 'Intelligence', color: 'bg-rose-600' },
            { label: 'Feedback', sub: '→ Iteration', color: 'bg-slate-700' },
          ].map(({ label, sub, color }, i, arr) => (
            <div key={label} className="flex items-center gap-2 shrink-0">
              <div className={`${color} rounded-lg px-3 py-2 text-center min-w-[90px]`}>
                <p className="text-white text-xs font-bold">{label}</p>
                <p className="text-white/70 text-xs">{sub}</p>
              </div>
              {i < arr.length - 1 && <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />}
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            <span className="font-semibold">Cycle time impact:</span> Traditional OEM software lifecycle 18+ days →{' '}
            <span className="text-blue-600 font-semibold">AI-accelerated 6 days</span> with automated requirements, validation, and release packaging.
            <span className="text-slate-400 ml-2">(Illustrative benchmark)</span>
          </p>
        </div>
      </div>
    </div>
  );
}
