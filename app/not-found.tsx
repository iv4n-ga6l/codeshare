import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Snippet Not Found</h2>
        <p className="text-muted-foreground">
          The snippet you're looking for might have been deleted or expired.
        </p>
        <Button asChild>
          <Link href="/">Create New Snippet</Link>
        </Button>
      </div>
    </div>
  )
}