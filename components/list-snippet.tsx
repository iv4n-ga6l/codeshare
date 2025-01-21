'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Snippet } from '@/types/snippet';
import { format } from 'date-fns';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const StatusIndicator = ({ isExpired }: { isExpired: boolean }) => (
  <div className="flex items-center gap-2">
    <div 
      className={`w-2.5 h-2.5 rounded-full ${
        isExpired 
          ? 'bg-rose-500 shadow-sm shadow-rose-500/50' 
          : 'bg-teal-500 shadow-sm shadow-teal-500/50'
      }`}
    />
    <span className={`text-sm font-bold ${
      isExpired ? 'text-rose-500' : 'text-teal-500'
    }`}>
      {isExpired ? 'Expired' : 'Active'}
    </span>
  </div>
);

export const ListSnipped = () => {
    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [expandedLanguage, setExpandedLanguage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSnippets = async () => {
            try {
                const response = await fetch('/api/snippets/');
                if (!response.ok) throw new Error('Failed to fetch snippets');
                const data = await response.json();
                setSnippets(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load snippets');
            } finally {
                setLoading(false);
            }
        };

        fetchSnippets();
    }, []);

    const groupedSnippets = snippets.reduce((acc, snippet) => {
        if (!acc[snippet.language]) {
            acc[snippet.language] = [];
        }
        acc[snippet.language].push(snippet);
        return acc;
    }, {} as Record<string, Snippet[]>);

    const isExpired = (expiresAt: string | null) => {
        if (!expiresAt) return false;
        return new Date(expiresAt) < new Date();
    };

    if (loading) return <div className="text-muted-foreground">Loading snippets...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="space-y-4">
            {Object.entries(groupedSnippets).map(([language, languageSnippets]) => (
                <Card key={language} className="overflow-hidden">
                    <button
                        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                        onClick={() => setExpandedLanguage(expandedLanguage === language ? null : language)}
                    >
                        <div className="flex items-center space-x-2">
                            <img 
                                src={`https://skillicons.dev/icons?i=${language}`} 
                                alt={`${language} icon`}
                                className="w-5 h-5 object-cover" 
                            />
                            <h3 className="text-sm font-semibold">{language}</h3>
                        </div>
                        {expandedLanguage === language ? (
                            <ChevronDown className="h-5 w-5" />
                        ) : (
                            <ChevronRight className="h-5 w-5" />
                        )}
                    </button>
                    {expandedLanguage === language && (
                        <CardContent className="pt-4">
                            <div className="space-y-3">
                                {languageSnippets.map((snippet) => (
                                    <Link
                                        key={snippet.id}
                                        href={`/${snippet.id}`}
                                        className="block p-3 hover:bg-muted transition-colors border-x-4 border-y border-primary hover:border-primary"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">{snippet.title}</h4>
                                            <StatusIndicator isExpired={isExpired(snippet.expires_at)} />
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">
                                            Created: {format(new Date(snippet.created_at), 'PPp')}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    )}
                </Card>
            ))}
        </div>
    );
};

export default ListSnipped;