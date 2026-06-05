'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFactory } from '@/context/FactoryContext';
import {
  LayoutDashboard,
  Upload,
  Globe,
  FileText,
  Code2,
  FlaskConical,
  ShieldCheck,
  Package,
  Car,
  Network,
  Zap,
  CheckCircle2,
  Circle,
  List,
  AlertTriangle,
} from 'lucide-react';

function FeatureTags({ feature }: { feature: import('@/types').FactoryFeature }) {
  if (feature.isGlobal) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-ford-300">
        <Globe className="w-3 h-3" /> Global
      </span>
    );
  }
  const codes = feature.programCodes ?? [];
  const years = feature.modelYears ?? [];
  if (!codes.length && !years.length) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {codes.map(c => (
        <span key={c} className="text-xs bg-ford-700 text-ford-200 font-mono px-1.5 py-0.5 rounded">{c}</span>
      ))}
      {years.map(y => (
        <span key={y} className="text-xs bg-ford-800 text-ford-300 px-1.5 py-0.5 rounded">MY{y}</span>
      ))}
    </div>
  );
}

const stages = [
  { href: '/intake', label: 'Feature Intake', icon: Upload, stage: 'intake' },
  { href: '/requirements', label: 'Requirements', icon: FileText, stage: 'requirements' },
  { href: '/development', label: 'Development', icon: Code2, stage: 'development' },
  { href: '/validation', label: 'Validation', icon: FlaskConical, stage: 'validation' },
  { href: '/quality', label: 'Quality Gate', icon: ShieldCheck, stage: 'quality' },
  { href: '/release', label: 'Release Factory', icon: Package, stage: 'release' },
  { href: '/fleet', label: 'Fleet Intelligence', icon: Car, stage: 'fleet' },
];

const completedOrder = ['intake', 'requirements', 'development', 'validation', 'quality', 'release', 'fleet'];

function isStageComplete(stage: string, currentStage: string): boolean {
  const currentIdx = completedOrder.indexOf(currentStage);
  const stageIdx = completedOrder.indexOf(stage);
  return stageIdx < currentIdx;
}

function isStageActive(stage: string, currentStage: string): boolean {
  return stage === currentStage;
}

export default function Navbar() {
  const pathname = usePathname();
  const { feature, currentStage } = useFactory();

  return (
    <aside className="w-64 min-h-screen bg-ford-900 flex flex-col fixed left-0 top-0 bottom-0 z-40">
      <div className="px-6 py-5 border-b border-ford-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-ford-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">AutoSW Factory</p>
            <p className="text-ford-300 text-xs">AI-Powered Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <Link
          href="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            pathname === '/'
              ? 'bg-ford-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-ford-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          Dashboard
        </Link>

        <div className="pt-3 pb-1 px-3">
          <p className="text-xs font-semibold text-ford-400 uppercase tracking-wider">Factory Pipeline</p>
        </div>

        {stages.map(({ href, label, icon: Icon, stage }) => {
          const isActive = pathname === href;
          const complete = isStageComplete(stage, currentStage);
          const active = isStageActive(stage, currentStage);

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-ford-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-ford-800'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {complete && !isActive && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              )}
              {active && !isActive && (
                <Circle className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400" />
              )}
            </Link>
          );
        })}

        <div className="pt-3 pb-1 px-3">
          <p className="text-xs font-semibold text-ford-400 uppercase tracking-wider">Overview</p>
        </div>

        <Link
          href="/features"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            pathname === '/features'
              ? 'bg-ford-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-ford-800'
          }`}
        >
          <List className="w-4 h-4 shrink-0" />
          Feature Registry
        </Link>

        <Link
          href="/architecture"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            pathname === '/architecture'
              ? 'bg-ford-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-ford-800'
          }`}
        >
          <Network className="w-4 h-4 shrink-0" />
          Architecture
        </Link>
      </nav>

      <div className="px-4 py-4 border-t border-ford-800">
        {feature ? (
          <div className="bg-ford-800 rounded-lg px-3 py-2.5">
            <p className="text-xs text-ford-300 mb-0.5">Active Feature</p>
            <p className="text-sm text-white font-medium truncate">{feature.name}</p>
            <FeatureTags feature={feature} />
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-ford-300 animate-pulse" />
              <p className="text-xs text-ford-300 capitalize">{currentStage} stage</p>
            </div>
          </div>
        ) : (
          <div className="bg-ford-800 rounded-lg px-3 py-2.5">
            <p className="text-xs text-ford-300">No active feature</p>
            <p className="text-xs text-ford-400 mt-0.5">Start at Feature Intake</p>
          </div>
        )}
        {feature && !feature.isGlobal && (!(feature.programCodes?.length) || !(feature.modelYears?.length)) && (
          <Link
            href="/features"
            className="mt-2 flex items-start gap-2 bg-amber-900/40 border border-amber-600/40 rounded-lg px-3 py-2 hover:bg-amber-900/60 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300 leading-snug">
              Missing Program Code / Model Year —{' '}
              <span className="underline font-semibold">assign in Feature Registry</span>
            </p>
          </Link>
        )}
      </div>
    </aside>
  );
}
