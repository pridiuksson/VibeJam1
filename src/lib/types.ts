export interface Character {
  id: string;
  name: string;
  description: string; // Short description for the card
  longDescription?: string; // Longer description for chat page header or modal
  imageUrl: string;
  imageHint?: string; // For data-ai-hint
  initialGreeting: string; // First message from AI
  storyPrompt: string; // Backend prompt for AI (used by admin)
  initialStoryContext: string; // The "storySoFar" to begin with
  questObjective?: string; // User's goal in the interaction
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: Date;
}
