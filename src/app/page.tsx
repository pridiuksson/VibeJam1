import StoryCard from '@/components/story/StoryCard';
import { placeholderCharacters } from '@/lib/placeholder-data';
import type { Character } from '@/lib/types';

export default function StoryFeedPage() {
  const characters: Character[] = placeholderCharacters;
  // Assuming placeholderCharacters are already sorted with newest first.
  // If they are sorted oldest first, uncomment the next line:
  // const displayedCharacters = [...characters].reverse();
  // For now, we'll use the original order:
  const displayedCharacters = characters;

  return (
    <div className="flex flex-col items-center space-y-8">
      {displayedCharacters.length > 0 ? (
        displayedCharacters.map((character) => (
          <StoryCard key={character.id} character={character} />
        ))
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No Stories Yet</h2>
          <p className="text-muted-foreground">
            It looks a bit quiet here... Check back soon for new adventures!
          </p>
        </div>
      )}
    </div>
  );
}
