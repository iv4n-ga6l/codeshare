'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Snippet } from '@/types/snippet';
import { format } from 'date-fns';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
                        <div className='flex items-center space-x-2'>
                        <img src={`https://skillicons.dev/icons?i=${language}`} style={{ width: '20px', height: '20px', objectFit: 'cover' }} />
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
                                        className="block p-3 rounded-lg hover:bg-muted transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">{snippet.title}</h4>
                                            <span
                                                className={`text-sm font-bold px-2 border-dashed border-2 ${isExpired(snippet.expires_at)
                                                        ? 'text-rose-500 border-rose-500'
                                                        : 'text-teal-500 border-teal-500'
                                                    }`}
                                            >
                                                {isExpired(snippet.expires_at) ? 'Expired' : 'Active'}
                                            </span>
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