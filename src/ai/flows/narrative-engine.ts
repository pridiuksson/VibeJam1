'use server';

/**
 * @fileOverview Dynamic Narrative Engine for AI character interactions.
 *
 * - dynamicNarrativeEngine - A function that processes user chat input and generates AI character responses to influence the story's direction.
 * - DynamicNarrativeEngineInput - The input type for the dynamicNarrativeEngine function.
 * - DynamicNarrativeEngineOutput - The return type for the dynamicNarrativeEngine function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DynamicNarrativeEngineInputSchema = z.object({
  characterName: z.string().describe('The name of the AI character interacting with the user.'),
  userChatInput: z.string().describe('The latest chat input from the user.'),
  storySoFar: z.string().describe('The narrative context / story so far.'),
});
export type DynamicNarrativeEngineInput = z.infer<typeof DynamicNarrativeEngineInputSchema>;

const DynamicNarrativeEngineOutputSchema = z.object({
  aiResponse: z.string().describe('The AI character’s response to the user, influencing the narrative direction.'),
  updatedStorySoFar: z.string().describe('The updated narrative context / story so far, after incorporating the AI response.'),
});
export type DynamicNarrativeEngineOutput = z.infer<typeof DynamicNarrativeEngineOutputSchema>;

// Schema for the direct output expected from the LLM via the prompt
const LLMCharacterResponseSchema = z.object({
  characterResponse: z.string().describe('The AI character’s direct textual response to the user input. This response should be in character, engaging, and aim to progress the narrative based on the story so far and the user\'s latest input.'),
});

export async function dynamicNarrativeEngine(input: DynamicNarrativeEngineInput): Promise<DynamicNarrativeEngineOutput> {
  return dynamicNarrativeEngineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dynamicNarrativeEnginePrompt',
  input: {schema: DynamicNarrativeEngineInputSchema},
  output: {schema: LLMCharacterResponseSchema}, // LLM is tasked to produce this simpler schema
  prompt: `You are an AI character named {{{characterName}}}.
Your personality, goals, and the world you inhabit are established by the narrative.
The story so far is:
{{{storySoFar}}}

The user, with whom you are interacting, has just said:
"{{{userChatInput}}}"

Respond as {{{characterName}}}. Your response should be directly to the user.
Ensure your response is in character, advances the story or explores the world, and is engaging.
`,
});

const dynamicNarrativeEngineFlow = ai.defineFlow(
  {
    name: 'dynamicNarrativeEngineFlow',
    inputSchema: DynamicNarrativeEngineInputSchema,
    outputSchema: DynamicNarrativeEngineOutputSchema, // The flow's public output remains the same
  },
  async (input: DynamicNarrativeEngineInput): Promise<DynamicNarrativeEngineOutput> => {
    const {output: llmOutput} = await prompt(input);

    if (!llmOutput || typeof llmOutput.characterResponse !== 'string' || llmOutput.characterResponse.trim() === '') {
      console.error('LLM did not return a valid characterResponse. Output:', llmOutput);
      // This error will be caught by the calling action (getAiResponse)
      throw new Error('AI failed to generate a meaningful response.');
    }

    const aiCharacterActualResponse = llmOutput.characterResponse;

    // Construct the updated story by appending the current interaction
    // This ensures the next turn has the full context.
    const newStorySegment = `\nUser: ${input.userChatInput}\n${input.characterName}: ${aiCharacterActualResponse}`;
    const updatedStorySoFar = input.storySoFar + newStorySegment;

    return {
      aiResponse: aiCharacterActualResponse,
      updatedStorySoFar: updatedStorySoFar,
    };
  }
);