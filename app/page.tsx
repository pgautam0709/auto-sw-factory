'use client';

import Link from 'next/link';
import { useFactory } from '@/context/FactoryContext';
import MetricCard from '@/components/MetricCard';
import PipelineBar from '@/components/PipelineBar';
import {
  Upload,
  FileText,
  Code2,
  FlaskConical,
  ShieldCheck,
  Package,
  Car,
  TrendingDown,
  Zap,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

const FACTORY_STAGES = [
  { href: '/intake', icon: Upload, label: 'Feature Intake', desc: 'Submit a vehicle feature for AI-powered processing', color: 'bg-ford-600' },
  { href: '/requirements', icon: FileText, label: 'Requirements', desc: 'Auto-generated system requirements & user stories', color: 'bg-violet-500' },
  { href: '/development', icon: Code2, label: 'Development', desc: 'Service design, API contracts & test scaffolding', color: 'bg-indigo-500' },
  { href: '/validation', icon: FlaskConical, label: 'Validation', desc: '1,000-vehicle virtual validation simulation', color: 'bg-cyan-500' },
  { href: '/quality', icon: ShieldCheck, label: 'Quality Gate', desc: 'Traceability, coverage, cybersecurity & compliance', color: 'bg-emerald-500' },
  { href: '/release', icon: Package, label: 'Release Factory', desc: 'OTA package generation & phased deployment plan', color: 'bg-amber-500' },
  { href: '/fleet', icon: Car, label: 'Fleet Intelligence', desc: 'Real-time telemetry, failure clusters & AI insights', color: 'bg-rose-500' },
];

const IMPACT_METRICS = [
  { label: 'Cycle Time Reduction', from: '18 Days', to: '6 Days', icon: Clock, color: 'text-ford-600' },
  { label: 'Automation Coverage', value: '82%', icon: Zap, color: 'text-violet-600' },
  { label: 'Virtual Validation Coverage', value: '95%', icon: CheckCircle2, color: 'text-emerald-600' },
  { label: 'Production Defect Reduction', value: '40%', icon: TrendingDown, color: 'text-amber-600' },
];

export default function Dashboard() {
  const { stats } = useFactory();

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Software Factory Dashboard</h1>
            <p className="text-slate-500 mt-1">AI-powered vehicle software delivery — from feature request to fleet deployment</p>
          </div>
          <Link
            href="/intake"
            className="flex items-center gap-2 bg-ford-600 hover:bg-ford-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            New Feature
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <MetricCard
          label="Features Processed"
          value={stats.featuresProcessed}
          sub="This quarter"
          icon={<BarChart3 className="w-5 h-5" />}
          accent="blue"
        />
        <MetricCard
          label="Requirements Generated"
          value={stats.requirementsGenerated.toLocaleString()}
          sub="System + user stories"
          icon={<FileText className="w-5 h-5" />}
          accent="purple"
        />
        <MetricCard
          label="Validation Runs"
          value={stats.validationRuns.toLocaleString()}
          sub="1,000 vehicles each"
          icon={<FlaskConical className="w-5 h-5" />}
          accent="green"
        />
        <MetricCard
          label="Release Packages"
          value={stats.releasePackages}
          sub="OTA packages delivered"
          icon={<Package className="w-5 h-5" />}
          accent="amber"
        />
        <MetricCard
          label="Fleet Insights"
          value={stats.fleetInsights}
          sub="AI recommendations generated"
          icon={<Car className="w-5 h-5" />}
          accent="blue"
        />
        <MetricCard
          label="User Stories"
          value={stats.storiesGenerated}
          sub="Auto-generated artifacts"
          icon={<Zap className="w-5 h-5" />}
          accent="purple"
        />
      </div>

      <div className="mb-6">
        <PipelineBar />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {IMPACT_METRICS.map((m) => (
          <div key={m.label} className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
            <m.icon className={`w-5 h-5 ${m.color} mb-3`} />
            <p className="text-xs text-slate-500 font-medium mb-1">{m.label}</p>
            {'from' in m ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400 line-through">{m.from}</span>
                <ArrowRight className="w-3 h-3 text-slate-300" />
                <span className="text-xl font-bold text-slate-900">{m.to}</span>
              </div>
            ) : (
              <p className="text-2xl font-bold text-slate-900">{m.value}</p>
            )}
            <p className="text-xs text-slate-400 mt-1">Illustrative benchmark</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-700">Factory Stages</h2>
          <p className="text-xs text-slate-400">Click any stage to explore</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {FACTORY_STAGES.map(({ href, icon: Icon, label, desc, color }) => (
            <Link
              key={href}
              href={href}
              className="group bg-white border border-slate-200 rounded-xl shadow-sm p-4 hover:shadow-md hover:border-ford-200 transition-all"
            >
              <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-3`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm font-semibold text-slate-800 group-hover:text-ford-600 transition-colors">{label}</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
              <div className="flex items-center gap-1 mt-3 text-xs text-ford-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Open <ArrowRight className="w-3 h-3" />
            </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
