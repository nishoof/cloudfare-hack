import { GoogleGenerativeAI } from "@google/generative-ai";
import type { DependencyInput } from "../types/dependencies";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
	throw new Error("GEMINI_API_KEY is not defined");
}
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
	model: "gemini-2.0-flash",
});

const generationConfig = {
	temperature: 1,
	topP: 0.95,
	topK: 40,
	maxOutputTokens: 8192,
	responseMimeType: "text/plain",
};

async function processDependencies(
	inputJson: DependencyInput,
): Promise<DependencyInput> {
	const chatSession = model.startChat({
		generationConfig,
		history: [
			{
				role: "user",
				parts: [
					{
						text: `Here is a JSON that lists the dependencies for our project:\n\n${JSON.stringify(
							inputJson,
							null,
							2,
						)}\n\nYour task is to search for the most relevant official documentation for each dependency, taking into account how they are used in this project. For each dependency, output a JSON object that includes the original fields along with a new field named 'documentation'. This field should be an array of objects where each object contains:\n\n• 'title': The title of the documentation\n• 'url': The link to the official documentation page\n• 'explanation': A brief explanation of why this documentation is important given how the dependency is used in the project.\n\nIMPORTANT: Return ONLY a valid JSON object with the following structure: { \"dependencies\": [...] }. Do not include any markdown code blocks or additional text.`,
					},
				],
			},
			{
				role: "model",
				parts: [
					{
						text: JSON.stringify({
							dependencies: [
								{
									"Package name": "@google/generative-ai",
									"Package version": "^0.2.0",
									"Functionality/APIs": "Google's Generative AI SDK for accessing Gemini models. Provides chat functionality, text generation, and model configuration.",
									"which part of the repo it is used in": "Backend (AI service)",
									documentation: [
										{
											title: "Google AI SDK Documentation",
											url: "https://ai.google.dev/tutorials/node_quickstart",
											explanation: "Essential for understanding how to set up and use the Gemini models, configure chat sessions, and handle responses in Node.js applications."
										}
									]
								}
							]
						}, null, 2),
					},
				],
			},
		],
	});

	const result = await chatSession.sendMessage(
		`Add documentation links to these dependencies. For each dependency, add a 'documentation' array with ONE object containing: title (name of docs), url (official docs URL), and explanation (why it's important for this use case). Return a JSON object like: {"dependencies":[...]}. Keep explanations brief.`,
	);
	const response = result.response.text();

	try {
		// Try to parse the response directly first
		try {
			const parsed = JSON.parse(response);
			if (!parsed.dependencies) {
				throw new Error("Response missing dependencies array");
			}
			return parsed;
		} catch (e: unknown) {
			// If direct parsing fails, try to extract JSON from markdown code block
			const jsonMatch = response.match(/```(?:json)?\n?([\s\S]*?)(?:\n```|$)/);
			if (!jsonMatch) {
				// Try one last time with any content that looks like JSON
				const jsonCandidate = response.match(/\{\s*"dependencies"\s*:\s*\[[\s\S]*\]\s*\}/);
				if (!jsonCandidate) {
					throw new Error("No valid JSON found in response");
				}
				try {
					const parsed = JSON.parse(jsonCandidate[0]);
					if (!parsed.dependencies) {
						throw new Error("Response missing dependencies array");
					}
					return parsed;
				} catch {
					throw new Error("Failed to parse JSON candidate");
				}
			}
			
			// Try to parse the extracted content
			try {
				const extracted = jsonMatch[1].trim();
				// If the JSON appears to be truncated, try to fix it
				const fixedJson = extracted.replace(/,\s*$/, '') + // Remove trailing comma if present
					(extracted.match(/\{[^}]*$/) ? '}' : '') + // Close unclosed object if needed
					(extracted.match(/\[[^\]]*$/) ? ']' : ''); // Close unclosed array if needed
				
				const parsed = JSON.parse(fixedJson);
				if (!parsed.dependencies) {
					throw new Error("Response missing dependencies array");
				}
				return parsed;
			} catch (parseError) {
				console.error("Failed to parse extracted JSON:", parseError);
				throw new Error("Failed to parse extracted JSON content");
			}
		}
	} catch (error) {
		console.error("Failed to parse Gemini response:", error);
		throw new Error("Failed to parse Gemini response as JSON");
	}
}

export { processDependencies };
