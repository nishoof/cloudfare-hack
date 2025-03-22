export interface RepoInfo {
  owner: string
  name: string
  url: string
}

export function parseGitHubUrl(url: string): RepoInfo | null {
  try {
    const parsedUrl = new URL(url)

    // Check if it's a GitHub URL
    if (!parsedUrl.hostname.includes("github.com")) {
      return null
    }

    // Extract path segments
    const pathSegments = parsedUrl.pathname.split("/").filter(Boolean)

    // GitHub repository URLs have at least owner and repo name
    if (pathSegments.length < 2) {
      return null
    }

    return {
      owner: pathSegments[0],
      name: pathSegments[1],
      url: url,
    }
  } catch (error) {
    return null
  }
}

