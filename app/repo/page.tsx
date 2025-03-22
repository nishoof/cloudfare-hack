"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, Github, VideoOff } from "lucide-react"
import { parseGitHubUrl } from "@/lib/github-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import VideoPlayer from "@/components/ui/videoPlayer"

export default function RepoPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const url = searchParams.get("url")
  const [repoName, setRepoName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const streamUrl = "https://stream.mux.com/AWWy02FYNOe02MWgtEBJUsXoNHHGyhR8DYtHBZLBMeGdI.m3u8"

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

  const script = `You gave a repo called ${repoName}. Onboard yes.`
  const postOptions = {
    method: 'POST',
    headers: {
      'x-api-key': process.env.NEXT_PUBLIC_TAVUS_API_KEY || '',
      'Content-Type': 'application/json'
    },
    body: `{
      "background_url":"",
      "replica_id":"rb17cf590e15",
      "script":"${script}",
      "video_name":""
      }`
  };
  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (repoName) {
      fetch('https://tavusapi.com/v2/videos', postOptions)
        .then(response => response.json())
        .then(response => {
          console.log(response);
          if (response.video_id) {
            setVideoId(response.video_id);
          }
        })
        .catch(err => console.error(err));
    }
  }, [repoName]);

  let streamLink = "";

  useEffect(() => {
    if (!videoId) return;
    console.log(`Got video id: ${videoId}`)

    const getOptions = {
      method: 'GET',
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_TAVUS_API_KEY || ''
      }
    };

    const checkVideoStatus = () => {
      fetch(`https://tavusapi.com/v2/videos/${videoId}`, getOptions)
        .then(response => response.json())
        .then(response => {
          console.log(response);
          //
          // streamLink = "https://stream.mux.com/gxok3F14154gRG6PtQcRe4QvtCEPw71JESGrYhwRiA4.m3u8"
          // clearInterval(intervalId);
          //
          if (response.status === 'ready') {
            streamLink = response.stream_url;
            console.log("lasldaldsla", streamLink, response);
            clearInterval(intervalId);
          }
        })
        .catch(err => console.error(err));
    };

    const intervalId = setInterval(() => {
      console.log("Checking video status...");
      const ready = checkVideoStatus();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [videoId]);

  useEffect(() => {
    const waitForStreamLink = () => {
      const intervalId = setInterval(() => {
        if (streamLink) {
          console.log("Stream Link:", streamLink);
          clearInterval(intervalId);
        }
      }, 1000);
    };

    waitForStreamLink();
  }, []);

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-md mx-auto mb-12">
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

      <div className="max-w-3xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4 text-center">Onboarding Video</h2>
        <div className="aspect-video overflow-hidden bg-black/5 rounded-xl shadow-xl">
          <VideoPlayer
            streamUrl={streamUrl}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  )
}
