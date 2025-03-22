import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express, { type Request, type Response } from "express";
import { generateOnboardingScript } from "./utils/gemini_onboarding_script";
import { processURL } from "./utils/process-url";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (_req, res) => {
	res.json({ message: "Welcome to the API" });
});

app.post("/onboardingScript", (req: Request, res: Response) => {
	const githubUrl = req.body.githubUrl;
	processURL(githubUrl)
		.then((result) => {
			console.log("🚀 Generated onboarding script");
			return generateOnboardingScript({
				dependencies: result.dependencies,
			});
		})
		.then((response) => {
			console.log("🚀 Generated onboarding script");
			if (!response) {
				console.error("Failed to generate onboarding script");
				return;
			}

			const onboardingScript = response.text();

			res.json({ onboardingScript });
		});
});

// Health check endpoint
app.get("/health", (_req, res) => {
	res.json({ status: "healthy" });
});

// Start server
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
