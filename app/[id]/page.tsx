import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { SnippetViewer } from '@/components/snippet-viewer'

async function getSnippet(id: string) {
  try {
    const snippetsRef = collection(db, 'snippets')
    const q = query(
      snippetsRef,
      where('id', '==', id),
      where('deleted', '==', false)
    )
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) return null

    const snippetDoc = querySnapshot.docs[0].data()
    const now = new Date()

    if (snippetDoc.expires_at && snippetDoc.expires_at.toDate() < now) {
      return null
    }

    const snippet = {
      id: snippetDoc.id,
      title: snippetDoc.title,
      content: snippetDoc.content,
      language: snippetDoc.language,
      created_at: snippetDoc.created_at?.toDate().toISOString() || new Date().toISOString(),
      expires_at: snippetDoc.expires_at?.toDate().toISOString() || null,
    }

    return snippet
  } catch (error) {
    console.error('Error fetching snippet:', error)
    return null
  }
}

export default async function SnippetPage({
  params,
}: {
  params: { id: string }
}) {
  const snippet = await getSnippet(params.id)

  if (!snippet) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className='flex items-center gap-2'>
            <img src="https://i.ibb.co/J7ThL56/Screenshot-2025-01-17-044341-removebg-preview.png" alt="CodeShare Logo" className="h-8 w-8" />
            <Link href="/"><h1 className="text-2xl font-bold text-foreground">CodeShare</h1></Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <SnippetViewer snippet={snippet} />
        </div>
      </main>
    </div>
  )
}