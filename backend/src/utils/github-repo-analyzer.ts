import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import { config } from "dotenv";
import type { Dependency, FileInfo, RepoAnalysis } from "../types/github";

// Load environment variables
config();

// Constants and configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers = {
	Authorization: `token ${GITHUB_TOKEN}`,
};

// Parse GitHub URL
export function parseGithubUrl(url: string): [string, string] {
	console.log(`🔍 Parsing GitHub URL: ${url}`);

	let pattern: RegExp;
	if (url.startsWith("git@")) {
		pattern = /git@github\.com:([^/]+)\/([^/.]+)/;
	} else {
		pattern = /github\.com\/([^/]+)\/([^/.]+)/;
	}

	const match = url.match(pattern);
	if (!match) {
		throw new Error("Invalid GitHub URL");
	}

	console.log(`✅ Parsed successfully: owner=${match[1]}, repo=${match[2]}`);
	return [match[1], match[2]];
}

// Get repository contents
async function getRepoContents(
	owner: string,
	repo: string,
	path = "",
): Promise<FileInfo[]> {
	console.log(`🔄 Fetching contents for: ${owner}/${repo} at path: ${path}`);
	const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

	try {
		const response = await axios.get(url, { headers });
		console.log(`✅ Successfully fetched ${response.data.length} items.`);
		return response.data;
	} catch (error) {
		console.error("❌ Error fetching contents:", error);
		throw error;
	}
}

// Scan repository structure
async function scanRepo(owner: string, repo: string): Promise<FileInfo[]> {
	console.log(`📂 Scanning repository structure for: ${owner}/${repo}`);
	const repoStructure: FileInfo[] = [];
	const queue: string[] = [""]; // Start with root directory

	while (queue.length > 0) {
		const currentPath = queue.shift();
		const contents = await getRepoContents(owner, repo, currentPath);

		for (const item of contents) {
			const fileInfo: FileInfo = {
				name: item.name,
				path: item.path,
				type: item.type,
			};

			if (item.type === "dir") {
				queue.push(item.path);
			} else if (item.type === "file") {
				fileInfo.download_url = item.download_url;
			}
			repoStructure.push(fileInfo);
		}
	}

	console.log(
		`✅ Scanned ${repoStructure.length} items in the repo structure.`,
	);
	return repoStructure;
}

// Extract relevant files
function extractRelevantFiles(repoData: FileInfo[]): FileInfo[] {
	console.log(
		`🔍 Extracting relevant files from ${repoData.length} files/directories.`,
	);
	const importantExtensions = [
		"README.md",
		".py",
		".js",
		".java",
		"package.json",
		"requirements.txt",
		"Dockerfile",
	];

	const importantFiles = repoData.filter((file) =>
		importantExtensions.some((ext) => file.name.endsWith(ext)),
	);

	console.log(
		`✅ Extracted ${importantFiles.length} relevant files for analysis.`,
	);
	return importantFiles;
}

// Fetch file content
async function getFileContent(url: string): Promise<string> {
	console.log(`🔄 Fetching file content from: ${url}`);
	try {
		const response = await axios.get(url);
		console.log("✅ Successfully fetched file content.");
		return response.data;
	} catch (error) {
		console.error("❌ Error fetching file content:", error);
		throw error;
	}
}

interface PackageJson {
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
}

// Extract dependencies
function extractDependencies(filesData: Record<string, string>): {
	dependencies: Dependency[];
} {
	const dependencies: Dependency[] = [];

	// Extract from package.json
	const packageJson = filesData["package.json"] as string | PackageJson;

	if (typeof packageJson === "string") {
		try {
			const parsedJson = JSON.parse(packageJson);
			if (parsedJson.dependencies) {
				for (const [name, version] of Object.entries(parsedJson.dependencies)) {
					const cleanVersion = (version as string)
						.replace("^", "")
						.replace("~", "");
					dependencies.push({
						name,
						version: cleanVersion,
						description:
							"Used in the frontend. Part of the React/Node.js ecosystem.",
					});
				}
			}
		} catch (error) {
			console.error("❌ Error parsing package.json");
			throw error;
		}
	} else if (packageJson && typeof packageJson === "object") {
		if (packageJson.dependencies) {
			for (const [name, version] of Object.entries(packageJson.dependencies)) {
				const cleanVersion = (version as string)
					.replace("^", "")
					.replace("~", "");
				dependencies.push({
					name,
					version: cleanVersion,
					description:
						"Used in the frontend. Part of the React/Node.js ecosystem.",
				});
			}
		}
	}

	// Extract from requirements.txt
	if ("requirements.txt" in filesData) {
		const lines = filesData["requirements.txt"].split("\n");
		for (const line of lines) {
			const trimmedLine = line.trim();
			if (trimmedLine && !trimmedLine.startsWith("#")) {
				const parts = trimmedLine.split("==");
				if (parts.length === 2) {
					dependencies.push({
						name: parts[0].trim(),
						version: parts[1].trim(),
						description: "Used in the Python backend/agent system.",
					});
				}
			}
		}
	}

	return { dependencies };
}

// Generate summary using Gemini AI
async function summarizeRepo(
	filesData: Record<string, string>,
): Promise<string> {
	console.log("🔍 Generating summary using Gemini AI...");

	if (!GEMINI_API_KEY) {
		throw new Error("GEMINI_API_KEY is not set");
	}

	try {
		const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
		const model = genAI.getGenerativeModel({
			model: "models/gemini-2.0-flash-lite",
		});

		const depsJson = extractDependencies(filesData);

		const prompt = `
      The following are files from a GitHub repo. Analyze the usage of packages used in different parts of the repo,
      categorizing by frontend/backend/etc. Summarize what are the major functionalities/APIs of packages that are 
      used in different parts of the repo.
      Output in a valid json format with a list of objects with the following fields:
      - Package name
      - Package version
      - Functionality/APIs
      - which part of the repo it is used in

      Files:
      ${JSON.stringify(filesData, null, 2)}
    `;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();

		if (text) {
			console.log("✅ Summary generated successfully.");

			const output: RepoAnalysis = {
				summary: text,
				dependencies: depsJson.dependencies,
			};

			return JSON.stringify(output, null, 2);
		}
		console.error("❌ Failed to generate summary.");
		return "";
	} catch (error) {
		console.error("❌ Error in Gemini API:", error);
		throw error;
	}
}

// Main function to analyze GitHub repository
export async function analyzeGithubRepo(githubUrl: string): Promise<string> {
	try {
		// Parse GitHub URL to get owner and repo name
		const [owner, repo] = parseGithubUrl(githubUrl);
		console.log(`📂 Analyzing repository: ${owner}/${repo}`);

		// Scan repository structure
		const repoData = await scanRepo(owner, repo);
		console.log(`Found ${repoData.length} files/directories`);

		// Extract and analyze relevant files
		const relevantFiles = extractRelevantFiles(repoData);
		console.log(`Analyzing ${relevantFiles.length} relevant files...`);

		// Fetch content for relevant files
		const filesContent: Record<string, string> = {};
		for (const file of relevantFiles) {
			if (file.download_url) {
				filesContent[file.name] = await getFileContent(file.download_url);
			}
		}

		// Generate summary and analysis
		const analysis = await summarizeRepo(filesContent);
		return analysis;
	} catch (error) {
		console.error("Error analyzing repository:", error);
		throw error;
	}
}
