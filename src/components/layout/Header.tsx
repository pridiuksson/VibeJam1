import { BookMarked } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-accent transition-colors">
          <BookMarked className="h-7 w-7" />
          <h1 className="text-2xl font-bold tracking-tight">Magic Tales</h1>
        </Link>
      </div>
    </header>
  );
}
