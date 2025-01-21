import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore'

// Add this export to explicitly mark the route as dynamic
export const dynamic = 'force-dynamic'

const snippetSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  language: z.string(),
  expiresIn: z.string(),
})

function calculateExpiryDate(expiresIn: string): Date | null {
  if (expiresIn === 'never') return null
  const now = new Date()
  switch (expiresIn) {
    case '1h':
      return new Date(now.getTime() + 60 * 60 * 1000)
    case '1d':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000)
    case '1w':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    case '1m':
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    default:
      return null
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content, language, expiresIn } = snippetSchema.parse(body)
    const id = nanoid(10)
    const expiresAt = calculateExpiryDate(expiresIn)
    
    const snippetsRef = collection(db, 'snippets')
    await addDoc(snippetsRef, {
      id,
      title,
      content,
      language,
      created_at: serverTimestamp(),
      expires_at: expiresAt,
      deleted: false
    })

    return NextResponse.json({ id }, { status: 201 })
  } catch (error) {
    console.error('Error creating snippet:', error)
    return NextResponse.json(
      { error: 'Failed to create snippet' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const snippetsRef = collection(db, 'snippets')
    const q = query(
      snippetsRef,
      where('deleted', '==', false)
    )

    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'No snippet created yet' },
        { status: 404 }
      )
    }

    // get all the snippets
    const snippets = querySnapshot.docs.map(doc => doc.data())
    // replace for each snippet of snippets the fields created_at and expires_at respectively snippet.created_at?.toDate().toISOString() || new Date().toISOString() and snippet.expires_at?.toDate().toISOString() || null
    snippets.forEach(snippet => {
      snippet.created_at = snippet.created_at?.toDate().toISOString() || new Date().toISOString()
      snippet.expires_at = snippet.expires_at?.toDate().toISOString() || null
    })
    return NextResponse.json(snippets)
  } catch (error) {
    console.error('Error retrieving snippets:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve snippets' },
      { status: 500 }
    )
  }
}