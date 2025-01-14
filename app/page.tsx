import Link from 'next/link'
import { CreateSnippetForm } from '@/components/create-snippet-form';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/"><h1 className="text-2xl font-bold text-foreground">CodeShare</h1></Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Share Your Code</h2>
          <CreateSnippetForm />
        </div>
      </main>
    </div>
  );
}