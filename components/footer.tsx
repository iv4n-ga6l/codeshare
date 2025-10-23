import Link from 'next/link'
import { Github, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container mx-auto px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">CodeShare</h2>
            <p>Share your code snippets with the world</p>
          </div>
        </div>
        <div className="mt-8 flex justify-center space-x-4">
          <a href="https://github.com/iv4n-ga6l" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            <Github className="h-6 w-6" />
          </a>
        </div>
        <div className="mt-8 text-center text-sm">
          © {new Date().getFullYear()} CodeShare. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

