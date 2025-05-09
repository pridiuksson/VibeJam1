'use server';

import { dynamicNarrativeEngine, type DynamicNarrativeEngineInput, type DynamicNarrativeEngineOutput } from '@/ai/flows/narrative-engine';
import { generateFullStoryCharacter, type GenerateFullStoryCharacterInput, type GenerateFullStoryCharacterOutput } from '@/ai/flows/generate-full-story-character';


export async function getAiResponse(input: DynamicNarrativeEngineInput): Promise<{ success: boolean, data?: DynamicNarrativeEngineOutput, error?: string }> {
  try {
    const result = await dynamicNarrativeEngine(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in dynamicNarrativeEngine:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to get AI response.';
    return { success: false, error: errorMessage };
  }
}

export async function conjureNewCharacterStory(input: GenerateFullStoryCharacterInput): Promise<{ success: boolean, data?: GenerateFullStoryCharacterOutput, error?: string }> {
  try {
    const result = await generateFullStoryCharacter(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in generateFullStoryCharacter flow:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to conjure AI character story.';
    return { success: false, error: errorMessage };
  }
}
