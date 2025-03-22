import { GoogleGenerativeAI } from "@google/generative-ai";

interface Dependency {
	"Package name": string;
	"Package version"?: string;
	"Functionality/APIs": string;
	"which part of the repo it is used in": string;
}

interface JsonData {
	dependencies: Dependency[];
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
	throw new Error("GEMINI_API_KEY is not defined");
}
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
	model: "gemini-2.0-flash",
});

function createGeminiPrompt(jsonData: JsonData): string {
	const techStack = jsonData.dependencies
		.map(
			(dep) => `
Package: ${dep["Package name"]} (v${dep["Package version"] || "N/A"})
Purpose: ${dep["Functionality/APIs"]}
Used in: ${dep["which part of the repo it is used in"]}
`,
		)
		.join("");

	const prompt = `As a senior developer, create an engaging onboarding script that explains our tech stack to a new team member.
The script should be conversational and well-structured.

Here's our tech stack:
${techStack}

Please create a script that:
1. Gives a high-level overview of our architecture
2. Explains key technologies and why we chose them
3. Highlights important development tools and practices
4. Provides a clear path for getting started
5. Includes specific examples of how different parts work together

Make it engaging and practical, like you're having a conversation with the new team member.
Keep it concise but informative, focusing on what's most important for them to know first.
`;
	return prompt;
}

export async function generateOnboardingScript(jsonData: JsonData) {
	const prompt = createGeminiPrompt(jsonData);

	try {
		const result = await model.generateContent(prompt);
		const response = result.response;
		return response;
	} catch (e) {
		console.error("❌ Error generating script:", e);
		return null;
	}
}
