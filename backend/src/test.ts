import dotenv from "dotenv";
dotenv.config();
import fs from "node:fs";
import path from "node:path";
import type { DependencyInput } from "./types/dependencies";
import { processDependencies } from "./utils/dep-agent";
import { generateOnboardingScript } from "./utils/gemini_onboarding_script";
import {
	analyzeGithubRepo,
	parseGithubUrl,
} from "./utils/github-repo-analyzer";
import { processURL } from "./utils/process-url";

const input: DependencyInput = {
	dependencies: [
		{
			"Package name": "vite",
			"Package version": "^5.4.1",
			"Functionality/APIs":
				"A build tool that aims to provide a faster and leaner development experience for modern web projects.  Handles bundling, hot module replacement (HMR), and development server.",
			"which part of the repo it is used in":
				"Frontend (development and build process)",
		},
		{
			"Package name": "typescript",
			"Package version": "^5.5.3",
			"Functionality/APIs":
				"A typed superset of JavaScript that compiles to plain JavaScript. Provides static typing, interfaces, and other features to improve code maintainability and error detection.",
			"which part of the repo it is used in": "Frontend (codebase)",
		},
	],
};

// Process the dependencies
export async function test1() {
	// Process dependencies in batches of 10
	const batchSize = 10;
	const allDependencies = input.dependencies;
	const results = [];

	for (let i = 0; i < allDependencies.length; i += batchSize) {
		const batch = allDependencies.slice(i, i + batchSize);
		const batchInput = { dependencies: batch };
		try {
			const result = await processDependencies(batchInput);
			results.push(...result.dependencies);
		} catch (error) {
			console.error(`Failed to process batch ${i / batchSize + 1}:`, error);
		}
	}

	// Print the results and save to file
	const fs = require("node:fs");
	const path = require("node:path");

	// Create output directory if it doesn't exist
	const outputDir = path.join(__dirname, "..", "output");
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir);
	}

	// Save results to JSON file
	const outputPath = path.join(outputDir, "dependencies-docs.json");
	fs.writeFileSync(
		outputPath,
		JSON.stringify({ dependencies: results }, null, 2),
	);
	console.log(`Results saved to ${outputPath}`);

	// Print results to console
	for (const dependency of results) {
		console.log(JSON.stringify(dependency, null, 2));
		console.log("---");
	}
}

export async function test2() {
	try {
		// Test with a sample GitHub repository URL
		const githubUrl = "https://github.com/PaulGustafson/clone-o-matic-45/";
		console.log("🚀 Testing GitHub Repo Analysis");
		console.log(`Repository URL: ${githubUrl}`);

		const [owner, repo] = parseGithubUrl(githubUrl);
		console.log("\nParsed URL:");
		console.log(`Owner: ${owner}`);
		console.log(`Repo: ${repo}`);

		const analysis = await analyzeGithubRepo(githubUrl);
		console.log("\nRepository Analysis:");
		console.log(JSON.stringify(JSON.parse(analysis), null, 2));
	} catch (error) {
		console.error("❌ Error during test:", error);
		throw error;
	}
}

export async function test3() {
	const githubUrl = "https://github.com/joseAcevesG/Purple_2048";
	const result = await processURL(githubUrl);

	for (const dependency of result.dependencies) {
		console.log(JSON.stringify(dependency, null, 2));
		console.log("---");
	}

	// Save results to JSON file
	const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
	const filename = `dependency-analysis-${timestamp}.json`;
	const outputPath = path.join(__dirname, "..", "output", filename);

	// Create output directory if it doesn't exist
	fs.mkdirSync(path.join(__dirname, "..", "output"), { recursive: true });

	// Write the results to file
	fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
	console.log(`Results saved to: ${outputPath}`);
}

export async function test4() {
	const githubUrl = "https://github.com/PaulGustafson/clone-o-matic-45/";
	const result = await processURL(githubUrl);

	// Save results to JSON file
	let timestamp = new Date().toISOString().replace(/[:.]/g, "-");
	let filename = `dependency-analysis-${timestamp}.json`;
	let outputPath = path.join(__dirname, "..", "output", filename);

	// Create output directory if it doesn't exist
	fs.mkdirSync(path.join(__dirname, "..", "output"), { recursive: true });

	// Write the results to file
	fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
	console.log(`Results saved to: ${outputPath}`);

	const response = await generateOnboardingScript({
		dependencies: result.dependencies,
	});

	if (!response) {
		console.error("Failed to generate onboarding script");
		return;
	}

	const onboardingScript = response.text();

	// Save onboarding script to file
	timestamp = new Date().toISOString().replace(/[:.]/g, "-");
	filename = `onboarding-script-${timestamp}.txt`;
	outputPath = path.join(__dirname, "..", "output", filename);

	// Create output directory if it doesn't exist
	fs.mkdirSync(path.join(__dirname, "..", "output"), { recursive: true });

	// Write the onboarding script to file
	fs.writeFileSync(outputPath, onboardingScript);
	console.log(`Onboarding script saved to: ${outputPath}`);
}

// Run dependency analysis test
test4();

// Run GitHub repo analysis test (uncomment to run)
// test2();
