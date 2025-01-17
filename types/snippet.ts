export interface Snippet {
    id: string;
    title: string;
    content: string;
    language: string;
    created_at: string;
    expires_at: string | null;
}