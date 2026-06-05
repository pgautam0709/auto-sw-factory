import { NextRequest, NextResponse } from 'next/server';
import { generateArtifact } from '@/services/ai/openAIService';
import type { GenerateType } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, featureName, context } = body as {
      type: GenerateType;
      featureName: string;
      context?: Record<string, unknown>;
    };

    if (!type || !featureName) {
      return NextResponse.json(
        { error: 'Missing required fields: type and featureName' },
        { status: 400 }
      );
    }

    const result = await generateArtifact(type, featureName, context);
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: 'Generation failed' },
      { status: 500 }
    );
  }
}
