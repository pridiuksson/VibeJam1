import { BookMarked, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-accent transition-colors">
          <BookMarked className="h-7 w-7" />
          <h1 className="text-2xl font-bold tracking-tight">Magic Tales</h1>
        </Link>
        <Button asChild variant="outline" className="rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <Link href="/admin/create-story">
            <Sparkles className="mr-2 h-4 w-4 text-accent" />
            Magic Button
          </Link>
        </Button>
      </div>
    </header>
  );
}
