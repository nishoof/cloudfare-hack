"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, Github } from "lucide-react"
import { parseGitHubUrl } from "@/lib/github-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RepoPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const url = searchParams.get("url")
  const [repoName, setRepoName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!url) {
      setError("No repository URL provided")
      return
    }

    try {
      const repoInfo = parseGitHubUrl(decodeURIComponent(url))
      if (!repoInfo) {
        setError("Invalid GitHub repository URL")
        return
      }

      setRepoName(`${repoInfo.owner}/${repoInfo.name}`)
    } catch (err) {
      setError("Failed to parse repository URL")
    }
  }, [url])

  const handleBackClick = () => {
    router.push("/")
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-6 w-6" />
            Repository
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? <div className="text-red-500">{error}</div> : <div className="text-xl font-medium">{repoName}</div>}

          <Button variant="outline" onClick={handleBackClick} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

