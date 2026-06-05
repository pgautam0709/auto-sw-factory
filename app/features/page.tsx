'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFactory } from '@/context/FactoryContext';
import type { FeatureRecord } from '@/types';
import {
  Upload, FileText, Code2, FlaskConical, ShieldCheck, Package, Car,
  ChevronDown, ChevronUp, PlayCircle, Trash2, AlertCircle, CheckCircle2,
  Clock, Zap, AlertTriangle, Tag, Globe,
} from 'lucide-react';

const PROGRAM_CODES = ['CX7272', 'P550', 'P702'] as const;
const MODEL_YEARS = [2026, 2027, 2028] as const;

const STAGE_ORDER = ['intake', 'requirements', 'development', 'validation', 'quality', 'release', 'fleet'] as const;

const STAGE_META = [
  { key: 'intake',       label: 'Intake',       icon: Upload,       color: 'bg-ford-600' },
  { key: 'requirements', label: 'Reqs',          icon: FileText,     color: 'bg-violet-500' },
  { key: 'development',  label: 'Dev',           icon: Code2,        color: 'bg-indigo-500' },
  { key: 'validation',   label: 'Validation',    icon: FlaskConical, color: 'bg-cyan-500' },
  { key: 'quality',      label: 'Quality',       icon: ShieldCheck,  color: 'bg-emerald-500' },
  { key: 'release',      label: 'Release',       icon: Package,      color: 'bg-amber-500' },
  { key: 'fleet',        label: 'Fleet',         icon: Car,          color: 'bg-rose-500' },
];

function stageIndex(stage: string) {
  return STAGE_ORDER.indexOf(stage as typeof STAGE_ORDER[number]);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function StagePipeline({ record }: { record: FeatureRecord }) {
  const currentIdx = stageIndex(record.stage);
  return (
    <div className="flex items-center gap-1">
      {STAGE_META.map(({ key, label, icon: Icon, color }, i) => {
        const complete = i <= currentIdx;
        return (
          <div key={key} className="flex items-center gap-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
              complete ? color : 'bg-slate-100'
            }`} title={label}>
              <Icon className={`w-3 h-3 ${complete ? 'text-white' : 'text-slate-300'}`} />
            </div>
            {i < STAGE_META.length - 1 && (
              <div className={`w-4 h-0.5 ${i < currentIdx ? 'bg-slate-300' : 'bg-slate-100'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ArtifactSummary({ record }: { record: FeatureRecord }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-4 pt-4 border-t border-slate-100">
      {/* Requirements */}
      <div className="bg-violet-50 rounded-lg p-3">
        <p className="text-xs font-semibold text-violet-700 mb-1.5 flex items-center gap-1">
          <FileText className="w-3 h-3" /> Requirements
        </p>
        {record.requirements ? (
          <div className="space-y-0.5">
            <p className="text-xs text-slate-600">{record.requirements.systemRequirements.length} system reqs</p>
            <p className="text-xs text-slate-600">{record.requirements.userStories.length} user stories</p>
            <p className="text-xs text-slate-600">{record.requirements.acceptanceCriteria.length} ACs</p>
          </div>
        ) : <p className="text-xs text-slate-400 italic">Not generated</p>}
      </div>

      {/* Development */}
      <div className="bg-indigo-50 rounded-lg p-3">
        <p className="text-xs font-semibold text-indigo-700 mb-1.5 flex items-center gap-1">
          <Code2 className="w-3 h-3" /> Development
        </p>
        {record.development ? (
          <div className="space-y-0.5">
            <p className="text-xs text-slate-600 truncate">{record.development.serviceDesign.name}</p>
            <p className="text-xs text-slate-600">{record.development.apiContract.length} endpoints</p>
            <p className="text-xs text-slate-600">{record.development.unitTests.length} tests</p>
          </div>
        ) : <p className="text-xs text-slate-400 italic">Not generated</p>}
      </div>

      {/* Validation */}
      <div className="bg-cyan-50 rounded-lg p-3">
        <p className="text-xs font-semibold text-cyan-700 mb-1.5 flex items-center gap-1">
          <FlaskConical className="w-3 h-3" /> Validation
        </p>
        {record.validation ? (
          <div className="space-y-0.5">
            <p className="text-xs text-slate-600">{record.validation.totalVehicles.toLocaleString()} vehicles</p>
            <p className="text-xs font-semibold text-emerald-600">{record.validation.passRate}% pass</p>
            <p className="text-xs text-slate-600">{record.validation.failed} failures</p>
          </div>
        ) : <p className="text-xs text-slate-400 italic">Not run</p>}
      </div>

      {/* Quality */}
      <div className="bg-emerald-50 rounded-lg p-3">
        <p className="text-xs font-semibold text-emerald-700 mb-1.5 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Quality
        </p>
        {record.quality ? (
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-slate-800 text-base">{record.quality.overallScore}</p>
            <p className="text-xs text-slate-600">/ 100 overall</p>
            <p className={`text-xs font-semibold ${record.quality.overallScore >= 85 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {record.quality.overallScore >= 85 ? 'Gate Passed' : 'Gate Review'}
            </p>
          </div>
        ) : <p className="text-xs text-slate-400 italic">Not assessed</p>}
      </div>

      {/* Release */}
      <div className="bg-amber-50 rounded-lg p-3">
        <p className="text-xs font-semibold text-amber-700 mb-1.5 flex items-center gap-1">
          <Package className="w-3 h-3" /> Release
        </p>
        {record.release ? (
          <div className="space-y-0.5">
            <p className="text-xs text-slate-600 font-mono">{record.release.version}</p>
            <p className="text-xs text-slate-600">{record.release.targetVehicles.toLocaleString()} vehicles</p>
            <p className="text-xs text-slate-600">{record.release.deploymentPlan.length} phases</p>
          </div>
        ) : <p className="text-xs text-slate-400 italic">Not generated</p>}
      </div>

      {/* Fleet */}
      <div className="bg-rose-50 rounded-lg p-3">
        <p className="text-xs font-semibold text-rose-700 mb-1.5 flex items-center gap-1">
          <Car className="w-3 h-3" /> Fleet
        </p>
        {record.fleet ? (
          <div className="space-y-0.5">
            <p className="text-xs text-slate-600">{record.fleet.totalDeployed.toLocaleString()} vehicles</p>
            <p className="text-xs font-semibold text-emerald-600">{record.fleet.successRate}% success</p>
            <p className="text-xs text-slate-600">{record.fleet.aiRecommendations.length} insights</p>
          </div>
        ) : <p className="text-xs text-slate-400 italic">Not loaded</p>}
      </div>
    </div>
  );
}

function FeatureCard({ record, isActive }: { record: FeatureRecord; isActive: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [draftGlobal, setDraftGlobal] = useState(false);
  const [draftCodes, setDraftCodes] = useState<string[]>([]);
  const [draftYears, setDraftYears] = useState<number[]>([]);
  const router = useRouter();
  const { loadRecord, updateFeatureMetadata } = useFactory();

  const toggleDraftCode = (c: string) =>
    setDraftCodes(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  const toggleDraftYear = (y: number) =>
    setDraftYears(prev => prev.includes(y) ? prev.filter(x => x !== y) : [...prev, y]);
  const toggleDraftGlobal = () => {
    setDraftGlobal(g => {
      if (!g) { setDraftCodes([]); setDraftYears([]); }
      return !g;
    });
  };
  const draftTagged = draftGlobal || (draftCodes.length > 0 && draftYears.length > 0);

  const missingTags = !record.feature.isGlobal &&
    (!(record.feature.programCodes?.length) || !(record.feature.modelYears?.length));

  const handleAssign = () => {
    updateFeatureMetadata(record.feature.id, draftGlobal ? [] : draftCodes, draftGlobal ? [] : draftYears, draftGlobal);
    setAssigning(false);
  };

  const stageIdx = stageIndex(record.stage);
  const stageLabel = STAGE_META[stageIdx]?.label ?? 'Intake';
  const stageColor = STAGE_META[stageIdx]?.color ?? 'bg-ford-600';
  const isComplete = record.stage === 'fleet';

  const handleResume = () => {
    loadRecord(record);
    const stageRoutes: Record<string, string> = {
      intake: '/requirements', requirements: '/requirements',
      development: '/development', validation: '/validation',
      quality: '/quality', release: '/release', fleet: '/fleet',
    };
    router.push(stageRoutes[record.stage] ?? '/requirements');
  };

  return (
    <div className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-all ${
      isActive ? 'border-ford-300 ring-1 ring-ford-200' : 'border-slate-200'
    }`}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {isActive && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-ford-600 bg-ford-50 border border-ford-200 px-2 py-0.5 rounded-full">
                  <Zap className="w-3 h-3" /> Active
                </span>
              )}
              {missingTags && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  <AlertTriangle className="w-3 h-3" /> Missing Tags
                </span>
              )}
              {isComplete && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Complete
                </span>
              )}
              <span className={`inline-flex items-center text-xs font-semibold text-white px-2 py-0.5 rounded-full ${stageColor}`}>
                {stageLabel}
              </span>
            </div>
            <h3 className="font-semibold text-slate-900 text-base truncate">{record.feature.name}</h3>
            <div className="flex items-center flex-wrap gap-1.5 mt-0.5">
              {record.feature.isGlobal ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-ford-50 text-ford-700 border border-ford-200 px-2 py-0.5 rounded-full">
                  <Globe className="w-3 h-3" /> Global
                </span>
              ) : (
                <>
                  {(record.feature.programCodes ?? []).map(c => (
                    <span key={c} className="inline-flex items-center text-xs font-semibold bg-ford-50 text-ford-700 border border-ford-200 px-2 py-0.5 rounded font-mono">{c}</span>
                  ))}
                  {(record.feature.modelYears ?? []).map(y => (
                    <span key={y} className="inline-flex items-center text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">MY{y}</span>
                  ))}
                </>
              )}
              {!record.feature.isGlobal && !(record.feature.programCodes?.length) && !(record.feature.modelYears?.length) && null}
              <span className="text-slate-300 text-xs">·</span>
              <span className="text-xs text-slate-400 font-mono">{record.feature.id}</span>
              <span className="text-slate-300 text-xs">·</span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />{formatDate(record.feature.createdAt)}
              </span>
            </div>
            {record.feature.description && (
              <p className="text-xs text-slate-500 mt-2 line-clamp-2">{record.feature.description}</p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleResume}
              className="flex items-center gap-1.5 bg-ford-600 hover:bg-ford-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              {isActive ? 'Continue' : 'Load'}
            </button>
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-colors"
            >
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {expanded ? 'Hide' : 'Artifacts'}
            </button>
          </div>
        </div>

        <div className="mt-3">
          <StagePipeline record={record} />
        </div>

        {missingTags && (
          <div className="mt-3 pt-3 border-t border-amber-100">
            {!assigning ? (
              <button
                onClick={() => setAssigning(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Tag className="w-3.5 h-3.5" />
                Assign Program Code &amp; Model Year
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={toggleDraftGlobal}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                      draftGlobal ? 'bg-ford-600 border-ford-600 text-white' : 'border-slate-200 text-slate-500 hover:border-ford-300'
                    }`}
                  >
                    <Globe className="w-3 h-3" /> Global
                  </button>
                  {!draftGlobal && (
                    <>
                      <div className="flex flex-wrap gap-1.5">
                        {PROGRAM_CODES.map(c => (
                          <button key={c} onClick={() => toggleDraftCode(c)}
                            className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all font-mono ${
                              draftCodes.includes(c) ? 'bg-ford-600 border-ford-600 text-white' : 'border-slate-200 text-slate-600 hover:border-ford-300'
                            }`}>{c}</button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {MODEL_YEARS.map(y => (
                          <button key={y} onClick={() => toggleDraftYear(y)}
                            className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
                              draftYears.includes(y) ? 'bg-slate-700 border-slate-700 text-white' : 'border-slate-200 text-slate-600 hover:border-slate-400'
                            }`}>MY{y}</button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAssign}
                    disabled={!draftTagged}
                    className="bg-ford-600 hover:bg-ford-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Save
                  </button>
                  <button onClick={() => setAssigning(false)} className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1.5">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {expanded && <ArtifactSummary record={record} />}
      </div>
    </div>
  );
}

export default function FeaturesPage() {
  const router = useRouter();
  const { history, feature, clearHistory } = useFactory();

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Feature Registry</h1>
          <p className="text-slate-500 mt-1">
            All features processed through the factory —&nbsp;
            <span className="font-semibold text-slate-700">{history.length}</span> total
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/intake')}
            className="flex items-center gap-2 bg-ford-600 hover:bg-ford-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            New Feature
          </button>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 border border-slate-200 hover:border-red-200 hover:text-red-600 text-slate-500 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <AlertCircle className="w-12 h-12 text-slate-200 mb-4" />
          <h2 className="text-lg font-semibold text-slate-700 mb-2">No Features Yet</h2>
          <p className="text-slate-500 text-sm mb-6 max-w-sm">
            Submit a feature through the intake form and it will appear here with all its generated artifacts.
          </p>
          <button
            onClick={() => router.push('/intake')}
            className="bg-ford-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-ford-700 transition-colors"
          >
            Go to Feature Intake
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map(record => (
            <FeatureCard
              key={record.feature.id}
              record={record}
              isActive={feature?.id === record.feature.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
