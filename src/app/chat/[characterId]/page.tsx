import ChatInterface from '@/components/chat/ChatInterface';
import { placeholderCharacters } from '@/lib/placeholder-data';
import type { Character } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, BookOpenText } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';


async function getCharacterById(id: string): Promise<Character | undefined> {
  // In a real app, this would fetch from a database or API
  return placeholderCharacters.find((char) => char.id === id);
}

export default async function ChatPage({ params }: { params: { characterId: string } }) {
  const character = await getCharacterById(params.characterId);

  if (!character) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <BookOpenText className="w-24 h-24 text-destructive mb-4" />
        <h1 className="text-3xl font-bold mb-2">Character Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The character you are looking for does not exist or has vanished into the mists of time.
        </p>
        <Button asChild>
          <Link href="/characters">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Characters
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow space-y-6">
       <Button asChild variant="outline" className="mb-4 self-start rounded-full shadow-sm">
        <Link href="/characters">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Characters
        </Link>
      </Button>

      <Card className="overflow-hidden shadow-xl rounded-xl border">
        <div className="relative h-60 w-full md:h-72 bg-muted">
          <Image
            src={character.imageUrl}
            alt={`${character.name}'s story scene`}
            layout="fill"
            objectFit="cover"
            className="rounded-t-xl"
            data-ai-hint={character.imageHint || 'story scene'}
            priority
          />
        </div>
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-primary mb-2">{character.name}</h1>
          <p className="text-muted-foreground mb-4 text-sm">{character.longDescription || character.description}</p>
          <div>
            <h3 className="text-lg font-semibold text-accent mb-1">Your Quest:</h3>
            <p className="text-foreground">
              {character.questObjective || "The path ahead is shrouded in mystery. Discover your purpose by talking to " + character.name + "."}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <ChatInterface character={character} />
    </div>
  );
}

// Optional: Generate static paths if characters are known at build time
// export async function generateStaticParams() {
//   return placeholderCharacters.map((character) => ({
//     characterId: character.id,
//   }));
// }
