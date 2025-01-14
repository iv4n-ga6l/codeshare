"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Clipboard, Trash2, Edit2, Check, X } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { formatDistanceToNow, isFuture } from 'date-fns'


interface Snippet {
  id: string
  title: string
  content: string
  language: string
  created_at: string
  expires_at: string | null
}

function getExpirationText(expires_at: string) {
  if (!expires_at) return null;
  const expirationDate = new Date(expires_at);
  if (isFuture(expirationDate)) {
    return `Expires in ${formatDistanceToNow(expirationDate, { addSuffix: false })}`;
  } else {
    return 'Expired';
  }
}

export function SnippetViewer({ snippet }: { snippet: Snippet }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(snippet.content)
  const router = useRouter()
  const { toast } = useToast()

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.content)
    toast({
      title: "Copied to clipboard",
      description: "The snippet has been copied to your clipboard.",
    })
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/snippets/${snippet.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete snippet')

      toast({
        title: "Snippet deleted",
        description: "The snippet has been successfully deleted.",
      })
      router.push('/')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the snippet. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/snippets/${snippet.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editedContent,
          language: snippet.language,
        }),
      })

      if (!response.ok) throw new Error('Failed to update snippet')

      toast({
        title: "Changes saved",
        description: "Your changes have been saved successfully.",
      })
      setIsEditing(false)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">
            {/* {snippet.language.charAt(0).toUpperCase() + snippet.language.slice(1)} Snippet */}
            {snippet.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            Created {new Date(snippet.created_at).toLocaleDateString()}
            {snippet.expires_at && ` • ${getExpirationText(snippet.expires_at)}`}
          </p>
          <h3 className="text-sm text-cyan-500 font-semibold">
            [*] {snippet.language.charAt(0).toUpperCase() + snippet.language.slice(1)}
            {/* {snippet.title} */}
          </h3>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleCopy}>
            <Clipboard className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the snippet.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="font-mono min-h-[300px]"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setEditedContent(snippet.content)
                setIsEditing(false)
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg overflow-x-auto">
          <SyntaxHighlighter
            language={snippet.language.toLowerCase()}
            style={tomorrow}
            customStyle={{
              margin: 0,
              borderRadius: '0.5rem',
            }}
          >
            {snippet.content}
          </SyntaxHighlighter>
        </div>
      )}
    </Card>
  )
}