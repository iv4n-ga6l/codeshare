"use client"

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Clipboard, Trash2, Edit2, Check, X, Download, Palette } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import * as themes from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { formatDistanceToNow, isFuture } from 'date-fns';
import { Snippet } from '@/types/snippet';
import html2canvas from 'html2canvas';

const availableThemes: any = {
  tomorrow: themes.tomorrow,
  twilight: themes.twilight,
  synthwave84: themes.synthwave84,
  materialDark: themes.materialDark,
  dracula: themes.dracula,
  atomDark: themes.atomDark,
  nightOwl: themes.nightOwl,
  vscDarkPlus: themes.vscDarkPlus
};

function getExpirationText(expires_at: string) {
  if (!expires_at) return null;
  const expirationDate = new Date(expires_at);
  if (isFuture(expirationDate)) {
    return `Expires in ${formatDistanceToNow(expirationDate, { addSuffix: false })}`;
  } else {
    return 'Expired';
  }
}

export function SnippetViewer({ snippet } : { snippet: Snippet }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(snippet.content);
  const [selectedTheme, setSelectedTheme] = useState('tomorrow');
  const snippetRef = useRef(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.content);
    toast({
      title: "Copied to clipboard",
      description: "The snippet has been copied to your clipboard.",
    });
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/snippets/${snippet.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete snippet');

      toast({
        title: "Snippet deleted",
        description: "The snippet has been successfully deleted.",
      });
      router.push('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the snippet. Please try again.",
        variant: "destructive",
      });
    }
  };

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
      });

      if (!response.ok) throw new Error('Failed to update snippet');

      toast({
        title: "Changes saved",
        description: "Your changes have been saved successfully.",
      });
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportAsImage = async (format: string) => {
    if (!snippetRef.current) return;

    try {
      const canvas = await html2canvas(snippetRef.current, {
        backgroundColor: null,
        scale: 2,
      });

      const image = canvas.toDataURL(format === 'png' ? 'image/png' : 'image/jpeg');
      const link = document.createElement('a');
      link.href = image;
      link.download = `snippet-${snippet.id}.${format}`;
      link.click();

      toast({
        title: "Export successful",
        description: `Snippet exported as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export the snippet. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">
            {snippet.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            Created {new Date(snippet.created_at).toLocaleDateString()}
            {snippet.expires_at && ` • ${getExpirationText(snippet.expires_at)}`}
          </p>
          <h3 className="text-sm text-cyan-500 font-semibold">
            [*] {snippet.language.charAt(0).toUpperCase() + snippet.language.slice(1)}
          </h3>
        </div>
        <div className="flex gap-2 items-center">
          <Select value={selectedTheme} onValueChange={setSelectedTheme}>
            <SelectTrigger className="w-38">
              <Palette className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(availableThemes).map((theme) => (
                <SelectItem key={theme} value={theme}>
                  {theme.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleCopy}>
            <Clipboard className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setIsEditing(!isEditing)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Select onValueChange={exportAsImage}>
            <SelectTrigger className="w-28">
              <Download className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Export" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpeg">JPEG</SelectItem>
            </SelectContent>
          </Select>
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
        <div className="rounded-lg overflow-x-auto" ref={snippetRef}>
          <SyntaxHighlighter
            language={snippet.language.toLowerCase()}
            style={availableThemes[selectedTheme]}
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
  );
}

export default SnippetViewer;