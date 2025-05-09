import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 md:py-24">
      <Sparkles className="h-24 w-24 text-accent mb-6" />
      <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
        Magic Tales
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
        Step into a world of wonder. Interact with AI-driven characters and shape unique, unfolding narratives. Your adventure awaits!
      </p>
      <Button asChild size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-shadow">
        <Link href="/characters">
          Discover Stories
          <Sparkles className="ml-2 h-5 w-5" />
        </Link>
      </Button>
    </div>
  );
}
