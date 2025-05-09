import ChatInterface from '@/components/chat/ChatInterface';
import { placeholderCharacters } from '@/lib/placeholder-data';
import type { Character } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookOpenText } from 'lucide-react';


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
    <div className="flex flex-col h-full">
       <Button asChild variant="outline" className="mb-4 self-start rounded-full shadow-sm">
        <Link href="/characters">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Characters
        </Link>
      </Button>
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

