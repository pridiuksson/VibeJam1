import CharacterCard from '@/components/character/CharacterCard';
import { placeholderCharacters } from '@/lib/placeholder-data';
import type { Character } from '@/lib/types';

export default function CharactersPage() {
  const characters: Character[] = placeholderCharacters;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Choose Your Companion</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Each character holds a unique story. Who will you journey with?
        </p>
      </div>
      {characters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {characters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No characters available at the moment. Check back soon!</p>
      )}
    </div>
  );
}
