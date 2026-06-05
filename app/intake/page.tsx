'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFactory } from '@/context/FactoryContext';
import { Upload, Zap, ArrowRight, Lightbulb, Globe } from 'lucide-react';

const PROGRAM_CODES = ['CX7272', 'P550', 'P702'] as const;
const MODEL_YEARS = [2026, 2027, 2028] as const;

const EXAMPLE_FEATURES = [
  'Low Tire Pressure Alert',
  'Automatic Emergency Braking',
  'Lane Departure Warning',
  'Adaptive Cruise Control',
  'Blind Spot Monitoring',
  'Automatic Headlight Control',
];

export default function IntakePage() {
  const router = useRouter();
  const { setFeature } = useFactory();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [isGlobal, setIsGlobal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCode = (c: string) =>
    setSelectedCodes(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  const toggleYear = (y: number) =>
    setSelectedYears(prev => prev.includes(y) ? prev.filter(x => x !== y) : [...prev, y]);
  const toggleGlobal = () => {
    setIsGlobal(g => !g);
    if (!isGlobal) { setSelectedCodes([]); setSelectedYears([]); }
  };

  const isTagged = isGlobal || (selectedCodes.length > 0 && selectedYears.length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 600));

    setFeature({
      id: `FEAT-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || `AI-assisted implementation of ${name.trim()} for modern vehicle platforms.`,
      programCodes: isGlobal ? [] : selectedCodes,
      modelYears: isGlobal ? [] : selectedYears,
      isGlobal,
      createdAt: new Date().toISOString(),
    });

    router.push('/requirements');
  };

  const handleExample = (ex: string) => {
    setName(ex);
    setDescription(`Implement ${ex} functionality to improve driver safety and vehicle awareness. The system should detect the relevant condition in real-time, notify the driver through HMI, and log telemetry for fleet analysis.`);
  };

  return (
    <div className="p-8 max-w-3xl animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-ford-600 flex items-center justify-center">
            <Upload className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-semibold text-ford-600 uppercase tracking-wider">Stage 1</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Feature Intake</h1>
        <p className="text-slate-500 mt-1">Describe the vehicle feature and the AI factory will generate all engineering artifacts automatically.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Feature Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Low Tire Pressure Alert"
            className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-ford-600 focus:border-transparent transition-all"
            required
          />

          <div className="mt-5 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">
                  Program &amp; Model Year <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={toggleGlobal}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                    isGlobal
                      ? 'bg-ford-600 border-ford-600 text-white'
                      : 'border-slate-200 text-slate-500 hover:border-ford-300 hover:text-ford-600'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  Global
                </button>
              </div>

              {!isGlobal && (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1.5">Program Code</p>
                    <div className="flex flex-wrap gap-2">
                      {PROGRAM_CODES.map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => toggleCode(c)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            selectedCodes.includes(c)
                              ? 'bg-ford-600 border-ford-600 text-white'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-ford-300 hover:text-ford-700'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1.5">Model Year</p>
                    <div className="flex flex-wrap gap-2">
                      {MODEL_YEARS.map(y => (
                        <button
                          key={y}
                          type="button"
                          onClick={() => toggleYear(y)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            selectedYears.includes(y)
                              ? 'bg-slate-700 border-slate-700 text-white'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-800'
                          }`}
                        >
                          MY{y}
                        </button>
                      ))}
                    </div>
                  </div>
                  {!isTagged && name.trim() && (
                    <p className="text-xs text-amber-600">Select at least one Program Code and one Model Year, or mark as Global.</p>
                  )}
                </div>
              )}

              {isGlobal && (
                <p className="text-xs text-ford-600 mt-1">This feature will apply across all programs and model years.</p>
              )}
            </div>
          </div>

          <label className="block text-sm font-semibold text-slate-700 mb-2 mt-5">
            Feature Description
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the feature purpose, expected behavior, and any known constraints. The AI will use this context to generate engineering artifacts."
            rows={5}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-ford-600 focus:border-transparent transition-all resize-none"
          />

          <button
            type="submit"
            disabled={!name.trim() || !isTagged || isSubmitting}
            className="mt-5 w-full flex items-center justify-center gap-2 bg-ford-600 hover:bg-ford-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors text-sm"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Initializing Factory...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Generate Factory Artifacts
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <p className="text-sm font-semibold text-slate-700">Example Features</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {EXAMPLE_FEATURES.map(ex => (
            <button
              key={ex}
              onClick={() => handleExample(ex)}
              className="text-left px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:border-ford-300 hover:bg-ford-50 hover:text-ford-700 transition-all"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-ford-50 border border-ford-100 rounded-xl p-5">
        <p className="text-xs font-semibold text-ford-700 mb-2">What happens next</p>
        <div className="space-y-1.5">
          {[
            'AI generates ISO 26262-aligned system requirements & user stories',
            'Service design, API contract, and unit test scaffolding created',
            '1,000-vehicle virtual validation simulation runs automatically',
            'Quality gate scores computed across 4 dimensions',
            'OTA release package with phased deployment plan generated',
            'Fleet intelligence simulation closes the software lifecycle loop',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-ford-400 text-xs font-bold mt-0.5">{i + 1}.</span>
              <p className="text-xs text-ford-700">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
