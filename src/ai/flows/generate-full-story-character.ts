'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a complete AI character
 * and initial story setup, including name, teaser, quest, AI definition, greeting,
 * suggested questions, and an image hint.
 *
 * @module generate-full-story-character
 *
 * @typedef {Object} GenerateFullStoryCharacterInput
 * @property {string} [themeKeywords] - Optional theme or keywords to guide the generation.
 *
 * @typedef {Object} GenerateFullStoryCharacterOutput
 * @property {string} characterName - The generated AI character's name.
 * @property {string} storyTeaser - A brief, enticing summary for the story feed card.
 * @property {string} playerQuest - The player's quest or goal with this AI.
 * @property {string} aiDefinition - The detailed base prompt for the AI.
 * @property {string} initialGreeting - The AI's first message to the user.
 * @property {string} suggestedQuestion1 - An optional suggested question for the player.
 * @property {string} suggestedQuestion2 - A second optional suggested question.
 * @property {string} suggestedQuestion3 - A third optional suggested question.
 * @property {string} imageHint - A two-word hint for the main story image.
 *
 * @function generateFullStoryCharacter
 * @param {GenerateFullStoryCharacterInput} input - The input for generating the character and story.
 * @returns {Promise<GenerateFullStoryCharacterOutput>}
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFullStoryCharacterInputSchema = z.object({
  themeKeywords: z
    .string()
    .optional()
    .describe('Optional theme or keywords to guide the generation (e.g., "friendly alien AI", "haunted artifact AI").'),
});

export type GenerateFullStoryCharacterInput = z.infer<typeof GenerateFullStoryCharacterInputSchema>;

const GenerateFullStoryCharacterOutputSchema = z.object({
  characterName: z.string().describe("The generated AI character's name."),
  storyTeaser: z.string().describe('A brief, enticing summary for the story feed card (max 250 characters).'),
  playerQuest: z.string().describe("The player's quest or goal when interacting with this AI (max 500 characters)."),
  aiDefinition: z.string().describe("The detailed base prompt defining the AI's personality, knowledge, conversational style, and goals (min 150 words)."),
  initialGreeting: z.string().describe("The AI's first message to the user (max 300 characters)."),
  suggestedQuestion1: z.string().describe("An optional insightful question the player could ask the AI to get started (max 150 characters).").optional().or(z.literal('')),
  suggestedQuestion2: z.string().describe("A second optional suggested question (max 150 characters).").optional().or(z.literal('')),
  suggestedQuestion3: z.string().describe("A third optional suggested question (max 150 characters).").optional().or(z.literal('')),
  imageHint: z.string().describe("A two-word hint for the main story image (e.g., 'fantasy character', 'space nebula'). This will be used for finding an appropriate image and for the data-ai-hint attribute."),
});

export type GenerateFullStoryCharacterOutput = z.infer<typeof GenerateFullStoryCharacterOutputSchema>;

export async function generateFullStoryCharacter(input: GenerateFullStoryCharacterInput): Promise<GenerateFullStoryCharacterOutput> {
  return generateFullStoryCharacterFlow(input);
}

const generateCharacterPrompt = ai.definePrompt({
  name: 'generateFullStoryCharacterPrompt',
  input: {schema: GenerateFullStoryCharacterInputSchema},
  output: {schema: GenerateFullStoryCharacterOutputSchema},
  prompt: `You are an expert creative writer and AI character designer for an interactive storytelling game called "Magic Tales".
Your task is to generate all the necessary components for a new AI character and their story setup.

{{#if themeKeywords}}
The user has provided the following theme/keywords to inspire the generation: "{{{themeKeywords}}}"
Please base your generation on this theme.
{{else}}
Please generate a unique and creative character and story without specific keywords.
{{/if}}

Generate the following fields precisely as described:
1.  **characterName**: A unique and engaging name for the AI character.
2.  **storyTeaser**: A brief, captivating teaser for the story feed (around 30-40 words, strictly under 250 characters). Example: "Unravel cosmic mysteries with an ancient celestial guide."
3.  **playerQuest**: The player's main quest or goal when interacting with this AI (around 40-60 words, strictly under 500 characters). Example: "Discover the location of the legendary Heart of the Cosmos."
4.  **aiDefinition**: A detailed base prompt defining the AI's personality, knowledge, conversational style, specific goals, information it should convey or seek, and how it should interact with the player. This is the core instruction for the AI. Be detailed (at least 150 words, ideally 200-300 words). Example: "Elara is an ancient, wise, mystical being who guides the player to find the Heart of the Cosmos. She speaks poetically, knows much about celestial events, and her primary goal is to test the player's worthiness by presenting riddles about constellations. She avoids direct answers but offers cryptic clues. She should sound ethereal and patient. She refers to the player as 'Seeker of Truths'."
5.  **initialGreeting**: The AI's first message to the user upon starting a chat (1-2 sentences, strictly under 300 characters). Example: "Greetings, traveler. The stars have foretold your arrival. What secrets of the cosmos do you seek?"
6.  **suggestedQuestion1**: An optional insightful question the player could ask the AI to get started (under 150 characters). If not applicable, provide an empty string. Example: "What can you tell me about the ancient prophecy?"
7.  **suggestedQuestion2**: A second optional suggested question (under 150 characters). If not applicable, provide an empty string.
8.  **suggestedQuestion3**: A third optional suggested question (under 150 characters). If not applicable, provide an empty string.
9.  **imageHint**: A two-word hint for the main story image (e.g., 'fantasy character', 'space nebula'). This will be used for finding an appropriate image.

Ensure the generated content is coherent, engaging, and forms a compelling basis for an interactive story.
Adhere to any character limits mentioned. Make sure aiDefinition is substantial.
Return ONLY the JSON object adhering to the output schema.
`,
});

const generateFullStoryCharacterFlow = ai.defineFlow(
  {
    name: 'generateFullStoryCharacterFlow',
    inputSchema: GenerateFullStoryCharacterInputSchema,
    outputSchema: GenerateFullStoryCharacterOutputSchema,
  },
  async (input: GenerateFullStoryCharacterInput) => {
    const {output} = await generateCharacterPrompt(input);
    if (!output) {
      throw new Error('AI failed to generate character story details.');
    }
    // Ensure optional fields are empty strings if not provided or null/undefined
    return {
      ...output,
      suggestedQuestion1: output.suggestedQuestion1 || '',
      suggestedQuestion2: output.suggestedQuestion2 || '',
      suggestedQuestion3: output.suggestedQuestion3 || '',
    };
  }
);
