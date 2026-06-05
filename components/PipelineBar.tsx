'use client';

import { useFactory } from '@/context/FactoryContext';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';

const STAGES = [
  { key: 'intake', label: 'Feature Intake' },
  { key: 'requirements', label: 'Requirements' },
  { key: 'development', label: 'Development' },
  { key: 'validation', label: 'Validation' },
  { key: 'quality', label: 'Quality Gate' },
  { key: 'release', label: 'Release' },
  { key: 'fleet', label: 'Fleet Intel' },
];

const stageOrder = STAGES.map(s => s.key);

export default function PipelineBar() {
  const { currentStage } = useFactory();

  const currentIdx = stageOrder.indexOf(currentStage);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700">Factory Pipeline</h3>
        <span className="text-xs text-slate-400">
          {currentStage === 'idle' ? 'Awaiting feature input' : `Active: ${currentStage}`}
        </span>
      </div>
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {STAGES.map((stage, idx) => {
          const isComplete = currentIdx > idx;
          const isActive = currentIdx === idx;
          const isPending = currentIdx < idx;

          return (
            <div key={stage.key} className="flex items-center gap-1 shrink-0">
              <div className={`flex flex-col items-center gap-1`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isComplete ? 'bg-emerald-500' : isActive ? 'bg-ford-600' : 'bg-slate-100'
                }`}>
                  {isComplete ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <Circle className={`w-4 h-4 ${isActive ? 'text-white fill-ford-600' : 'text-slate-300'}`} />
                  )}
                </div>
                <span className={`text-xs font-medium whitespace-nowrap ${
                  isComplete ? 'text-emerald-600' : isActive ? 'text-ford-600' : 'text-slate-400'
                }`}>
                  {stage.label}
                </span>
              </div>
              {idx < STAGES.length - 1 && (
                <ArrowRight className={`w-3 h-3 mb-4 shrink-0 ${
                  isComplete ? 'text-emerald-400' : 'text-slate-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
