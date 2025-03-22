"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Github, Link, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  githubUrl: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .refine((url) => url.includes("github.com"), { message: "URL must be a GitHub repository link" }),
})

export default function Home() {
  const [savedLinks, setSavedLinks] = useState<string[]>([])
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      githubUrl: "",
    },
  })

  // Load saved links from localStorage on component mount
  useEffect(() => {
    const storedLinks = localStorage.getItem("githubLinks")
    if (storedLinks) {
      setSavedLinks(JSON.parse(storedLinks))
    }
  }, [])

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSavedLinks((prev) => [...prev, values.githubUrl])
    form.reset()

    // Store in localStorage for persistence
    const existingLinks = JSON.parse(localStorage.getItem("githubLinks") || "[]")
    localStorage.setItem("githubLinks", JSON.stringify([...existingLinks, values.githubUrl]))

    // Use Sonner toast
    toast.success("GitHub link saved", {
      description: "Your GitHub link has been saved successfully.",
    })

    // Refresh the page data
    router.refresh()
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-6 w-6" />
            GitHub Link Saver
          </CardTitle>
          <CardDescription>Enter a GitHub repository URL to save it to your collection.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/username/repository" {...field} />
                    </FormControl>
                    <FormDescription>Enter the full URL of the GitHub repository.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save GitHub Link"}
              </Button>
            </form>
          </Form>
        </CardContent>
        {savedLinks.length > 0 && (
          <CardFooter className="flex flex-col items-start">
            <h3 className="text-lg font-medium mb-2">Saved Links</h3>
            <div className="w-full space-y-2">
              {savedLinks.map((link, index) => (
                <Card key={index} className="p-3 w-full">
                  <div className="flex items-center gap-2">
                    <Link className="h-4 w-4 flex-shrink-0" />
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline truncate"
                    >
                      {link}
                    </a>
                    <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>
          </CardFooter>
        )}
      </Card>
    </main>
  )
}

