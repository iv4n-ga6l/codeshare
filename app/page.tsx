import Link from 'next/link'
import { Scissors } from 'lucide-react'
import { CreateSnippetForm } from '@/components/create-snippet-form'
import { ThemeToggle } from '@/components/theme-toggle'
import { ListSnipped } from '@/components/list-snippet'
import Hero from '@/components/hero'
import Footer from '@/components/footer'
import CodeAnimation from '@/components/code-animation'

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className='flex items-center gap-2'>
            <img src="https://i.ibb.co/J7ThL56/Screenshot-2025-01-17-044341-removebg-preview.png" alt="CodeShare Logo" className="h-8 w-8" />
            <Link href="/"><h1 className="text-2xl font-bold text-foreground">CodeShare</h1></Link>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-grow">
        <Hero />
        <section className="container mx-auto px-8 py-16" id='create'>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-foreground">Share Your Code</h2>
              <CreateSnippetForm />
            </div>
            <CodeAnimation />
          </div>
        </section>
        <section className="container mx-auto px-8 py-16 bg-muted">
          <div className='flex items-center gap-1 space-x-2 mb-6'>
            <Scissors className="h-6 w-6" />
            <h2 className="text-3xl font-bold text-foreground">Shared Snippets</h2>
          </div>
          <ListSnipped />
        </section>
      </main>
      <Footer />
    </div>
  )
}

