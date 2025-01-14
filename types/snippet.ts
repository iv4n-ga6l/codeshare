export type Snippet = {
    id: string
    content: string
    language: string
    deleted: boolean
    created_at: string // ISO string
    expires_at: string | null // ISO string or null
}