"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <h2 className="text-xl font-bold">Something went wrong!</h2>
      <p className="text-muted-foreground">There was an error loading the application.</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  )
}

