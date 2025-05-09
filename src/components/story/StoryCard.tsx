import type { Character } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

interface StoryCardProps {
  character: Character;
}

export default function StoryCard({ character }: StoryCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto shadow-xl rounded-xl overflow-hidden border-border">
      <CardHeader className="flex flex-row items-center space-x-4 p-4 border-b">
        <Avatar className="h-12 w-12 border-2 border-primary">
          <AvatarImage 
            src={character.imageUrl} 
            alt={`${character.name} avatar`} 
            data-ai-hint={character.imageHint || 'character avatar'}
          />
          <AvatarFallback>{character.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
            <h2 className="text-xl font-semibold text-primary">{character.name}</h2>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Main Story Image with 4:5 aspect ratio */}
        <div className="relative w-full aspect-[4/5] bg-muted">
          <Image
            src={character.imageUrl}
            alt={`Story image for ${character.name}`}
            layout="fill"
            objectFit="cover"
            data-ai-hint={character.imageHint || 'story scene'}
            priority={character.id === placeholderCharacters[0]?.id} // Prioritize loading for the first image
          />
        </div>
        
        {/* Story Teaser/Caption */}
        <div className="p-4">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {character.description}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-4 border-t bg-muted/30">
        <Button asChild className="w-full rounded-lg shadow-md hover:shadow-lg transition-shadow bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href={`/chat/${character.id}`}>
            <MessageCircle className="mr-2 h-5 w-5" />
            Chat with {character.name}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

// Need to import placeholderCharacters to use for priority loading logic, 
// or pass a boolean like isFirstCard. For simplicity, access it directly.
import { placeholderCharacters } from '@/lib/placeholder-data';
