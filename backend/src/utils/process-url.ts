import { processDependencies } from "../Dep-Agent";
import { analyzeGithubRepo } from "./github-repo-analyzer";

export async function processURL(githubUrl: string) {
	const analysis = await analyzeGithubRepo(githubUrl);

	const batchSize = 10;
	const allDependencies = JSON.parse(analysis).dependencies;
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
	const result = {
		summary: JSON.parse(analysis).summary,
		dependencies: results,
	};

	return result;
}
