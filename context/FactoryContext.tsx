'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type {
  FactoryFeature,
  Requirements,
  DevelopmentArtifacts,
  ValidationResult,
  QualityMetrics,
  ReleasePackage,
  FleetIntelligence,
  FactoryStage,
  FactoryStats,
  FeatureRecord,
} from '@/types';

function makeRecord(feature: FactoryFeature): FeatureRecord {
  return {
    feature,
    requirements: null,
    development: null,
    validation: null,
    quality: null,
    release: null,
    fleet: null,
    stage: 'intake',
    updatedAt: new Date().toISOString(),
  };
}

function patchHistory(
  prev: FeatureRecord[],
  id: string,
  patch: Partial<Omit<FeatureRecord, 'feature'>>
): FeatureRecord[] {
  return prev.map(r =>
    r.feature.id === id ? { ...r, ...patch, updatedAt: new Date().toISOString() } : r
  );
}

const KEYS = {
  feature:      'asf_feature',
  requirements: 'asf_requirements',
  development:  'asf_development',
  validation:   'asf_validation',
  quality:      'asf_quality',
  release:      'asf_release',
  fleet:        'asf_fleet',
  stage:        'asf_stage',
  stats:        'asf_stats',
  history:      'asf_history',
} as const;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

function save(key: string, value: unknown) {
  try {
    value === null || value === undefined
      ? localStorage.removeItem(key)
      : localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

interface FactoryContextValue {
  history: FeatureRecord[];
  loadRecord: (record: FeatureRecord) => void;
  feature: FactoryFeature | null;
  requirements: Requirements | null;
  development: DevelopmentArtifacts | null;
  validation: ValidationResult | null;
  quality: QualityMetrics | null;
  release: ReleasePackage | null;
  fleet: FleetIntelligence | null;
  currentStage: FactoryStage;
  stats: FactoryStats;
  setFeature: (f: FactoryFeature) => void;
  setRequirements: (r: Requirements) => void;
  setDevelopment: (d: DevelopmentArtifacts) => void;
  setValidation: (v: ValidationResult) => void;
  setQuality: (q: QualityMetrics) => void;
  setRelease: (r: ReleasePackage) => void;
  setFleet: (f: FleetIntelligence) => void;
  resetFactory: () => void;
  clearHistory: () => void;
  updateFeatureMetadata: (id: string, programCodes: string[], modelYears: number[], isGlobal: boolean) => void;
}

const defaultStats: FactoryStats = {
  featuresProcessed: 47,
  requirementsGenerated: 284,
  storiesGenerated: 193,
  validationRuns: 1041,
  releasePackages: 38,
  fleetInsights: 512,
};

const FactoryContext = createContext<FactoryContextValue | null>(null);

export function FactoryProvider({ children }: { children: ReactNode }) {
  const [feature, setFeatureState] = useState<FactoryFeature | null>(
    () => load<FactoryFeature | null>(KEYS.feature, null)
  );
  const [requirements, setRequirementsState] = useState<Requirements | null>(
    () => load<Requirements | null>(KEYS.requirements, null)
  );
  const [development, setDevelopmentState] = useState<DevelopmentArtifacts | null>(
    () => load<DevelopmentArtifacts | null>(KEYS.development, null)
  );
  const [validation, setValidationState] = useState<ValidationResult | null>(
    () => load<ValidationResult | null>(KEYS.validation, null)
  );
  const [quality, setQualityState] = useState<QualityMetrics | null>(
    () => load<QualityMetrics | null>(KEYS.quality, null)
  );
  const [release, setReleaseState] = useState<ReleasePackage | null>(
    () => load<ReleasePackage | null>(KEYS.release, null)
  );
  const [fleet, setFleetState] = useState<FleetIntelligence | null>(
    () => load<FleetIntelligence | null>(KEYS.fleet, null)
  );
  const [currentStage, setCurrentStage] = useState<FactoryStage>(
    () => load<FactoryStage>(KEYS.stage, 'idle')
  );
  const [stats, setStats] = useState<FactoryStats>(
    () => load<FactoryStats>(KEYS.stats, defaultStats)
  );
  const [history, setHistory] = useState<FeatureRecord[]>(
    () => load<FeatureRecord[]>(KEYS.history, [])
  );

  useEffect(() => { save(KEYS.feature, feature); }, [feature]);
  useEffect(() => { save(KEYS.requirements, requirements); }, [requirements]);
  useEffect(() => { save(KEYS.development, development); }, [development]);
  useEffect(() => { save(KEYS.validation, validation); }, [validation]);
  useEffect(() => { save(KEYS.quality, quality); }, [quality]);
  useEffect(() => { save(KEYS.release, release); }, [release]);
  useEffect(() => { save(KEYS.fleet, fleet); }, [fleet]);
  useEffect(() => { save(KEYS.stage, currentStage); }, [currentStage]);
  useEffect(() => { save(KEYS.stats, stats); }, [stats]);
  useEffect(() => { save(KEYS.history, history); }, [history]);

  const setFeature = useCallback((f: FactoryFeature) => {
    setFeatureState(f);
    setCurrentStage('intake');
    setRequirementsState(null);
    setDevelopmentState(null);
    setValidationState(null);
    setQualityState(null);
    setReleaseState(null);
    setFleetState(null);
    setHistory(prev => {
      const exists = prev.some(r => r.feature.id === f.id);
      return exists ? prev : [makeRecord(f), ...prev];
    });
    setStats(prev => ({ ...prev, featuresProcessed: prev.featuresProcessed + 1 }));
  }, []);

  const setRequirements = useCallback((r: Requirements) => {
    setRequirementsState(r);
    setCurrentStage('requirements');
    setHistory(prev => patchHistory(prev, feature?.id ?? '', { requirements: r, stage: 'requirements' }));
    setStats(prev => ({
      ...prev,
      requirementsGenerated: prev.requirementsGenerated + r.systemRequirements.length,
      storiesGenerated: prev.storiesGenerated + r.userStories.length,
    }));
  }, [feature]);

  const setDevelopment = useCallback((d: DevelopmentArtifacts) => {
    setDevelopmentState(d);
    setCurrentStage('development');
    setHistory(prev => patchHistory(prev, feature?.id ?? '', { development: d, stage: 'development' }));
  }, [feature]);

  const setValidation = useCallback((v: ValidationResult) => {
    setValidationState(v);
    setCurrentStage('validation');
    setHistory(prev => patchHistory(prev, feature?.id ?? '', { validation: v, stage: 'validation' }));
    setStats(prev => ({ ...prev, validationRuns: prev.validationRuns + 1 }));
  }, [feature]);

  const setQuality = useCallback((q: QualityMetrics) => {
    setQualityState(q);
    setCurrentStage('quality');
    setHistory(prev => patchHistory(prev, feature?.id ?? '', { quality: q, stage: 'quality' }));
  }, [feature]);

  const setRelease = useCallback((r: ReleasePackage) => {
    setReleaseState(r);
    setCurrentStage('release');
    setHistory(prev => patchHistory(prev, feature?.id ?? '', { release: r, stage: 'release' }));
    setStats(prev => ({ ...prev, releasePackages: prev.releasePackages + 1 }));
  }, [feature]);

  const setFleet = useCallback((f: FleetIntelligence) => {
    setFleetState(f);
    setCurrentStage('fleet');
    setHistory(prev => patchHistory(prev, feature?.id ?? '', { fleet: f, stage: 'fleet' }));
    setStats(prev => ({ ...prev, fleetInsights: prev.fleetInsights + 3 }));
  }, [feature]);

  const loadRecord = useCallback((record: FeatureRecord) => {
    setFeatureState(record.feature);
    setRequirementsState(record.requirements);
    setDevelopmentState(record.development);
    setValidationState(record.validation);
    setQualityState(record.quality);
    setReleaseState(record.release);
    setFleetState(record.fleet);
    setCurrentStage(record.stage);
  }, []);

  const resetFactory = useCallback(() => {
    setFeatureState(null);
    setRequirementsState(null);
    setDevelopmentState(null);
    setValidationState(null);
    setQualityState(null);
    setReleaseState(null);
    setFleetState(null);
    setCurrentStage('idle');
    Object.values(KEYS).filter(k => k !== KEYS.history && k !== KEYS.stats).forEach(k => { try { localStorage.removeItem(k); } catch {} });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try { localStorage.removeItem(KEYS.history); } catch {}
  }, []);

  const updateFeatureMetadata = useCallback((id: string, programCodes: string[], modelYears: number[], isGlobal: boolean) => {
    setFeatureState(prev => prev?.id === id ? { ...prev, programCodes, modelYears, isGlobal } : prev);
    setHistory(prev => prev.map(r =>
      r.feature.id === id
        ? { ...r, feature: { ...r.feature, programCodes, modelYears, isGlobal }, updatedAt: new Date().toISOString() }
        : r
    ));
  }, []);

  return (
    <FactoryContext.Provider value={{
      feature, requirements, development, validation, quality, release, fleet,
      currentStage, stats, history,
      setFeature, setRequirements, setDevelopment, setValidation,
      setQuality, setRelease, setFleet, resetFactory, loadRecord, clearHistory, updateFeatureMetadata,
    }}>
      {children}
    </FactoryContext.Provider>
  );
}

export function useFactory() {
  const ctx = useContext(FactoryContext);
  if (!ctx) throw new Error('useFactory must be used within FactoryProvider');
  return ctx;
}
