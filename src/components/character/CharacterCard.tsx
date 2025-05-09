import type { Character } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
}

export default function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
      <CardHeader className="p-0">
        <div className="aspect-[3/4] relative w-full">
          <Image
            src={character.imageUrl}
            alt={character.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint={character.imageHint || 'fantasy character'}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-2xl font-semibold mb-2 text-primary">{character.name}</CardTitle>
        <p className="text-muted-foreground text-sm line-clamp-3">{character.description}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full rounded-lg shadow hover:shadow-md transition-shadow">
          <Link href={`/chat/${character.id}`}>
            Start Adventure
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
