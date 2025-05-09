'use server';

import { dynamicNarrativeEngine, type DynamicNarrativeEngineInput } from '@/ai/flows/narrative-engine';

export async function getAiResponse(input: DynamicNarrativeEngineInput) {
  try {
    const result = await dynamicNarrativeEngine(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in dynamicNarrativeEngine:', error);
    return { success: false, error: 'Failed to get AI response.' };
  }
}
