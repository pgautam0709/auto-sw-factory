import OpenAI, { AzureOpenAI } from 'openai';
import { REQUIREMENTS_PROMPT, DEVELOPMENT_PROMPT, QUALITY_PROMPT, RELEASE_PROMPT, FLEET_PROMPT } from '@/prompts';
import {
  getMockRequirements,
  getMockDevelopment,
  getMockQuality,
  getMockRelease,
  getMockFleet,
} from '@/data/mockData';
import type { GenerateType, Requirements, DevelopmentArtifacts, QualityMetrics, ReleasePackage, FleetIntelligence } from '@/types';

type GenerateResult = Requirements | DevelopmentArtifacts | QualityMetrics | ReleasePackage | FleetIntelligence;

type ClientConfig =
  | { client: AzureOpenAI; model: string; isAzure: true }
  | { client: OpenAI; model: string; isAzure: false };

function getClient(): ClientConfig | null {
  const azureKey      = process.env.AZURE_OPENAI_API_KEY;
  const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const azureDeployment = process.env.AZURE_OPENAI_DEPLOYMENT ?? 'gpt-4o';
  const azureApiVersion = process.env.AZURE_OPENAI_API_VERSION ?? '2024-02-01';

  if (azureKey && azureEndpoint) {
    return {
      isAzure: true,
      model: azureDeployment,
      client: new AzureOpenAI({
        apiKey: azureKey,
        endpoint: azureEndpoint,
        deployment: azureDeployment,
        apiVersion: azureApiVersion,
      }),
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    return { isAzure: false, model: 'gpt-4o', client: new OpenAI({ apiKey }) };
  }

  return null;
}

async function callAI(config: ClientConfig, prompt: string): Promise<unknown> {
  const response = await config.client.chat.completions.create({
    model: config.model,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });
  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Empty response from AI');
  return JSON.parse(content);
}

export async function generateArtifact(
  type: GenerateType,
  featureName: string,
  context?: Record<string, unknown>
): Promise<GenerateResult> {
  const config = getClient();

  try {
    if (!config) throw new Error('No API key configured — using simulation data');

    switch (type) {
      case 'requirements': {
        const data = await callAI(config, REQUIREMENTS_PROMPT(featureName));
        return data as Requirements;
      }
      case 'development': {
        const data = await callAI(config, DEVELOPMENT_PROMPT(featureName));
        return data as DevelopmentArtifacts;
      }
      case 'quality': {
        const passRate = (context?.passRate as number) ?? 95.2;
        const data = await callAI(config, QUALITY_PROMPT(featureName, passRate));
        return data as QualityMetrics;
      }
      case 'release': {
        const qualityScore = (context?.qualityScore as number) ?? 92;
        const data = await callAI(config, RELEASE_PROMPT(featureName, qualityScore));
        return data as ReleasePackage;
      }
      case 'fleet': {
        const data = await callAI(config, FLEET_PROMPT(featureName));
        return data as FleetIntelligence;
      }
      default:
        throw new Error(`Unknown generation type: ${type}`);
    }
  } catch {
    switch (type) {
      case 'requirements': return getMockRequirements(featureName);
      case 'development': return getMockDevelopment(featureName);
      case 'quality': return getMockQuality((context?.passRate as number) ?? 95.2);
      case 'release': return getMockRelease(featureName);
      case 'fleet': return getMockFleet(featureName);
      default: return getMockRequirements(featureName);
    }
  }
}
