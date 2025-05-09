// use server'

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

export async function dynamicNarrativeEngine(input: DynamicNarrativeEngineInput): Promise<DynamicNarrativeEngineOutput> {
  return dynamicNarrativeEngineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dynamicNarrativeEnginePrompt',
  input: {schema: DynamicNarrativeEngineInputSchema},
  output: {schema: DynamicNarrativeEngineOutputSchema},
  prompt: `You are {{{{characterName}}}}, an AI character in an interactive story. Respond to the user’s chat input in a way that meaningfully influences the story’s direction, making the narrative feel dynamic and personalized.

Story So Far: {{{storySoFar}}}

User Chat Input: {{{userChatInput}}}

Response:
`, 
});

const dynamicNarrativeEngineFlow = ai.defineFlow(
  {
    name: 'dynamicNarrativeEngineFlow',
    inputSchema: DynamicNarrativeEngineInputSchema,
    outputSchema: DynamicNarrativeEngineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      aiResponse: output!.aiResponse,
      updatedStorySoFar: input.storySoFar + '\n' + output!.aiResponse, // Append the AI response to the existing story
    };
  }
);
