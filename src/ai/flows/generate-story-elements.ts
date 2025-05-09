'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating story elements (plot points, dialogue snippets, character interactions)
 * based on a character's prompt.
 *
 * @module generate-story-elements
 *
 * @typedef {Object} GenerateStoryElementsInput
 * @property {string} characterPrompt - The prompt defining the character's personality, knowledge, and goals.
 *
 * @typedef {Object} GenerateStoryElementsOutput
 * @property {string} storyElements - The generated story elements (plot points, dialogue snippets, character interactions).
 *
 * @function generateStoryElements
 * @param {GenerateStoryElementsInput} input - The input for generating story elements.
 * @returns {Promise<GenerateStoryElementsOutput>}
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStoryElementsInputSchema = z.object({
  characterPrompt: z
    .string()
    .describe("The prompt defining the character's personality, knowledge, and goals."),
});

export type GenerateStoryElementsInput = z.infer<typeof GenerateStoryElementsInputSchema>;

const GenerateStoryElementsOutputSchema = z.object({
  storyElements: z
    .string()
    .describe('The generated story elements (plot points, dialogue snippets, character interactions).'),
});

export type GenerateStoryElementsOutput = z.infer<typeof GenerateStoryElementsOutputSchema>;

export async function generateStoryElements(input: GenerateStoryElementsInput): Promise<GenerateStoryElementsOutput> {
  return generateStoryElementsFlow(input);
}

const generateStoryElementsPrompt = ai.definePrompt({
  name: 'generateStoryElementsPrompt',
  input: {schema: GenerateStoryElementsInputSchema},
  output: {schema: GenerateStoryElementsOutputSchema},
  prompt: `You are a creative writing assistant helping to generate story elements for a new character.\n  Based on the character prompt provided, generate a variety of story elements, including plot points, dialogue snippets, and character interactions.\n  Character Prompt: {{{characterPrompt}}}\n  Story Elements:`, // Provide clear instructions to the LLM.
});

const generateStoryElementsFlow = ai.defineFlow(
  {
    name: 'generateStoryElementsFlow',
    inputSchema: GenerateStoryElementsInputSchema,
    outputSchema: GenerateStoryElementsOutputSchema,
  },
  async input => {
    const {output} = await generateStoryElementsPrompt(input);
    return output!;
  }
);
