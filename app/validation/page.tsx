'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useFactory } from '@/context/FactoryContext';
import { getMockValidation } from '@/data/mockData';
import { FlaskConical, ArrowRight, AlertCircle, PlayCircle, Zap } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const severityColors = {
  Critical: 'bg-red-100 text-red-700 border-red-200',
  Major: 'bg-amber-100 text-amber-700 border-amber-200',
  Minor: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function ValidationPage() {
  const router = useRouter();
  const { feature, validation, setValidation } = useFactory();
  const [isRunning, setIsRunning] = useState(false);
  const [processed, setProcessed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const runSimulation = () => {
    if (!feature) return;
    setIsRunning(true);
    setProcessed(0);

    const result = getMockValidation(feature.name);
    const total = result.totalVehicles;

    let current = 0;
    intervalRef.current = setInterval(() => {
      current = Math.min(current + Math.floor(Math.random() * 25) + 10, total);
      setProcessed(current);
      if (current >= total) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRunning(false);
        setValidation(result);
      }
    }, 40);
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

  const passedDuringRun = validation
    ? validation.passed
    : Math.round(processed * 0.952);
  const failedDuringRun = processed - passedDuringRun;

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-ford-700 flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold text-ford-600 uppercase tracking-wider">Stage 4</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Virtual Validation Factory</h1>
          <p className="text-slate-500 mt-1">Feature: <span className="font-semibold text-slate-700">{feature.name}</span></p>
        </div>
        <div className="flex gap-3">
          {validation && (
            <button
              onClick={() => router.push('/quality')}
              className="flex items-center gap-2 bg-ford-600 hover:bg-ford-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              Next: Quality Gate <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="flex items-center gap-2 bg-ford-600 hover:bg-ford-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <PlayCircle className="w-4 h-4" />
            {isRunning ? 'Running Simulation…' : validation ? 'Re-run Simulation' : 'Run Validation'}
          </button>
        </div>
      </div>

      {(isRunning || validation) && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 text-center">
            <p className="text-xs text-slate-500 font-medium mb-1">Vehicles Processed</p>
            <p className="text-3xl font-bold text-slate-900">{processed.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">of 1,000 total</p>
            {isRunning && (
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
                <div
                  className="bg-ford-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${(processed / 1000) * 100}%` }}
                />
              </div>
            )}
          </div>
          <div className="bg-white border border-emerald-200 rounded-xl shadow-sm p-5 text-center">
            <p className="text-xs text-slate-500 font-medium mb-1">Passed</p>
            <p className="text-3xl font-bold text-emerald-600">{passedDuringRun.toLocaleString()}</p>
            <p className="text-xs text-emerald-500 mt-1">
              {processed > 0 ? ((passedDuringRun / processed) * 100).toFixed(1) : '0.0'}% pass rate
            </p>
          </div>
          <div className="bg-white border border-red-200 rounded-xl shadow-sm p-5 text-center">
            <p className="text-xs text-slate-500 font-medium mb-1">Failed</p>
            <p className="text-3xl font-bold text-red-500">{failedDuringRun.toLocaleString()}</p>
            <p className="text-xs text-red-400 mt-1">
              {processed > 0 ? ((failedDuringRun / processed) * 100).toFixed(1) : '0.0'}% fail rate
            </p>
          </div>
        </div>
      )}

      {!isRunning && !validation && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-12 flex flex-col items-center text-center">
          <FlaskConical className="w-12 h-12 text-slate-200 mb-4" />
          <p className="text-slate-600 font-semibold mb-1">Simulation not yet started</p>
          <p className="text-slate-400 text-sm mb-6">Click "Run Validation" to simulate 1,000 virtual vehicles.</p>
          <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-400">
            {['Timing conditions', 'Sensor noise profiles', 'Temperature extremes', 'Network load', 'Edge-case thresholds', 'Hardware variants'].map(t => (
              <span key={t} className="bg-slate-50 border border-slate-200 rounded-full px-3 py-1">{t}</span>
            ))}
          </div>
        </div>
      )}

      {validation && !isRunning && (
        <div className="space-y-5 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <h2 className="font-semibold text-slate-800 mb-4">Failure Distribution</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={validation.failureDistribution} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
                    formatter={(val: unknown) => [`${val} vehicles`, 'Failed']}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {validation.failureDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <h2 className="font-semibold text-slate-800 mb-4">Overall Result</h2>
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto">
                    <svg viewBox="0 0 120 120" className="w-32 h-32 -rotate-90">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                      <circle
                        cx="60" cy="60" r="50" fill="none"
                        stroke="#10B981" strokeWidth="12"
                        strokeDasharray={`${2 * Math.PI * 50 * validation.passRate / 100} ${2 * Math.PI * 50}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-slate-900">{validation.passRate}%</span>
                      <span className="text-xs text-slate-500">Pass Rate</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">OEM target: 93% · Achieved: {validation.passRate}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">Root Cause Analysis</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {validation.rootCauses.map(rc => (
                <div key={rc.id} className="px-6 py-4">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <span className="text-xs font-mono font-bold text-slate-400">{rc.id}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${severityColors[rc.severity]}`}>{rc.severity}</span>
                        <span className="text-xs text-slate-500">{rc.affectedVehicles} vehicles affected</span>
                      </div>
                      <p className="text-sm text-slate-700 font-medium mb-1">{rc.cause}</p>
                      <p className="text-xs text-slate-500"><span className="font-medium text-slate-600">Recommendation:</span> {rc.recommendation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-cyan-600" />
              <p className="text-sm font-semibold text-cyan-800">AI Validation Insight</p>
            </div>
            <p className="text-sm text-cyan-800 leading-relaxed">{validation.aiInsights}</p>
          </div>
        </div>
      )}
    </div>
  );
}
