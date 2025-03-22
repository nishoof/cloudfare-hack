"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Github } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { parseGitHubUrl } from "@/lib/github-utils"

const formSchema = z.object({
  githubUrl: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .refine((url) => url.includes("github.com"), { message: "URL must be a GitHub repository link" })
    .refine(
      (url) => {
        const repoInfo = parseGitHubUrl(url)
        return repoInfo !== null
      },
      { message: "Invalid GitHub repository URL format" },
    ),
})

export default function Home() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      githubUrl: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)

      // Navigate to the repository page
      const encodedUrl = encodeURIComponent(values.githubUrl)
      router.push(`/repo?url=${encodedUrl}`)
    } catch (error) {
      toast.error("An error occurred")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-6 w-6" />
            GitHub Link
          </CardTitle>
          <CardDescription>Enter a GitHub repository URL</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/username/repository" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "View Repository"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  )
}

