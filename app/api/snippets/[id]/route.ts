import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const snippetsRef = collection(db, 'snippets')
    const q = query(
      snippetsRef,
      where('id', '==', id),
      where('deleted', '==', false)
    )

    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Snippet not found or expired' },
        { status: 404 }
      )
    }

    const snippet = querySnapshot.docs[0].data()
    const now = new Date()
    
    if (snippet.expires_at && snippet.expires_at.toDate() < now) {
      return NextResponse.json(
        { error: 'Snippet has expired' },
        { status: 404 }
      )
    }

    return NextResponse.json(snippet)
  } catch (error) {
    console.error('Error retrieving snippet:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve snippet' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { content, language } = await request.json()

    const snippetsRef = collection(db, 'snippets')
    const q = query(
      snippetsRef,
      where('id', '==', id),
      where('deleted', '==', false)
    )

    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Snippet not found or expired' },
        { status: 404 }
      )
    }

    const snippetDoc = querySnapshot.docs[0]
    const snippet = snippetDoc.data()
    
    if (snippet.expires_at && snippet.expires_at.toDate() < new Date()) {
      return NextResponse.json(
        { error: 'Snippet has expired' },
        { status: 404 }
      )
    }

    await updateDoc(doc(db, 'snippets', snippetDoc.id), {
      content,
      language
    })

    return NextResponse.json({ ...snippet, content, language })
  } catch (error) {
    console.error('Error updating snippet:', error)
    return NextResponse.json(
      { error: 'Failed to update snippet' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const snippetsRef = collection(db, 'snippets')
    const q = query(
      snippetsRef,
      where('id', '==', id),
      where('deleted', '==', false)
    )

    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Snippet not found or expired' },
        { status: 404 }
      )
    }

    const snippetDoc = querySnapshot.docs[0]
    const snippet = snippetDoc.data()
    
    if (snippet.expires_at && snippet.expires_at.toDate() < new Date()) {
      return NextResponse.json(
        { error: 'Snippet has expired' },
        { status: 404 }
      )
    }

    await updateDoc(doc(db, 'snippets', snippetDoc.id), {
      deleted: true
    })

    return NextResponse.json({ message: 'Snippet deleted successfully' })
  } catch (error) {
    console.error('Error deleting snippet:', error)
    return NextResponse.json(
      { error: 'Failed to delete snippet' },
      { status: 500 }
    )
  }
}