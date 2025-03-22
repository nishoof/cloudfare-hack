import dotenv from "dotenv";
dotenv.config();
import { processDependencies } from "./Dep-Agent";
import type { DependencyInput } from "./types/dependencies";

const input: DependencyInput = {
	dependencies: [
		{
		  "Package name": "vite",
		  "Package version": "^5.4.1",
		  "Functionality/APIs": "A build tool that aims to provide a faster and leaner development experience for modern web projects.  Handles bundling, hot module replacement (HMR), and development server.",
		  "which part of the repo it is used in": "Frontend (development and build process)"
		},
		{
		  "Package name": "typescript",
		  "Package version": "^5.5.3",
		  "Functionality/APIs": "A typed superset of JavaScript that compiles to plain JavaScript. Provides static typing, interfaces, and other features to improve code maintainability and error detection.",
		  "which part of the repo it is used in": "Frontend (codebase)"
		},
		{
		  "Package name": "react",
		  "Package version": "^18.3.1",
		  "Functionality/APIs": "A JavaScript library for building user interfaces. Provides components, virtual DOM, and a declarative programming model.",
		  "which part of the repo it is used in": "Frontend (UI components and application structure)"
		},
		{
		  "Package name": "react-dom",
		  "Package version": "^18.3.1",
		  "Functionality/APIs": "Provides methods to interact with the DOM in React applications, such as rendering components.",
		  "which part of the repo it is used in": "Frontend (rendering React components into the DOM)"
		},
		{
		  "Package name": "eslint",
		  "Package version": "^9.9.0",
		  "Functionality/APIs": "A tool for identifying and reporting on patterns found in ECMAScript/JavaScript code. Helps enforce coding style and prevent bugs.",
		  "which part of the repo it is used in": "Frontend (code linting)"
		},
		{
		  "Package name": "eslint-plugin-react-hooks",
		  "Package version": "^5.1.0-rc.0",
		  "Functionality/APIs": "ESLint plugin that checks the rules of Hooks in React components.  Enforces best practices when using React Hooks.",
		  "which part of the repo it is used in": "Frontend (code linting)"
		},
		{
		  "Package name": "eslint-plugin-react-refresh",
		  "Package version": "^0.4.9",
		  "Functionality/APIs": "An ESLint plugin for fast refresh (HMR) in React.  Helps provide immediate feedback during development.",
		  "which part of the repo it is used in": "Frontend (code linting)"
		},
		{
		  "Package name": "@typescript-eslint/eslint-plugin",
		  "Package version": "^8.0.1",
		  "Functionality/APIs": "An ESLint plugin that provides linting rules specifically for TypeScript code.",
		  "which part of the repo it is used in": "Frontend (code linting)"
		},
		{
		  "Package name": "@typescript-eslint/parser",
		  "Package version": "^8.0.1",
		  "Functionality/APIs": "An ESLint parser that allows ESLint to parse TypeScript code.",
		  "which part of the repo it is used in": "Frontend (code linting)"
		},
		{
		  "Package name": "tailwindcss",
		  "Package version": "^3.4.11",
		  "Functionality/APIs": "A utility-first CSS framework for rapidly building custom designs.",
		  "which part of the repo it is used in": "Frontend (styling)"
		},
		{
		  "Package name": "postcss",
		  "Package version": "^8.4.47",
		  "Functionality/APIs": "A tool for transforming CSS with JavaScript plugins. Used as part of the Tailwind CSS build process.",
		  "which part of the repo it is used in": "Frontend (styling, build process)"
		},
		{
		  "Package name": "autoprefixer",
		  "Package version": "^10.4.20",
		  "Functionality/APIs": "A PostCSS plugin that automatically adds vendor prefixes to CSS rules.",
		  "which part of the repo it is used in": "Frontend (styling, build process)"
		},
		{
		  "Package name": "@vitejs/plugin-react-swc",
		  "Package version": "^3.5.0",
		  "Functionality/APIs": "A Vite plugin for using SWC (Speedy Web Compiler) for fast React development, especially for bundling.",
		  "which part of the repo it is used in": "Frontend (build process)"
		},
		{
		  "Package name": "@hookform/resolvers",
		  "Package version": "^3.9.0",
		  "Functionality/APIs": "Integrates various validation libraries with react-hook-form, for form validation.",
		  "which part of the repo it is used in": "Frontend (form validation)"
		},
		{
		  "Package name": "@radix-ui/react-accordion",
		  "Package version": "^1.2.0",
		  "Functionality/APIs": "Provides accessible and customizable accordion UI components.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "@radix-ui/react-alert-dialog",
		  "Package version": "^1.1.1",
		  "Functionality/APIs": "Provides accessible and customizable alert dialog UI components.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "@radix-ui/react-aspect-ratio",
		  "Package version": "^1.1.0",
		  "Functionality/APIs": "Provides an aspect ratio UI component.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "@radix-ui/react-avatar",
		  "Package version": "^1.1.0",
		  "Functionality/APIs": "Provides an avatar UI component.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "@radix-ui/react-checkbox",
		  "Package version": "^1.1.1",
		  "Functionality/APIs": "Provides an accessible and customizable checkbox UI component.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "@radix-ui/react-collapsible",
		  "Package version": "^1.1.0",
		  "Functionality/APIs": "Provides an accessible and customizable collapsible UI component.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "@radix-ui/react-context-menu",
		  "Package version": "^2.2.1",
		  "Functionality/APIs": "Provides accessible and customizable context menu UI components.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "@radix-ui/react-dialog",
		  "Package version": "^1.1.2",
		  "Functionality/APIs": "Provides accessible and customizable dialog UI components.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "@radix-ui/react-dropdown-menu",
		  "Package version": "^2.1.1",
		  "Functionality/APIs": "Provides accessible and customizable dropdown menu UI components.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "@radix-ui/react-hover-card",
		  "Package version": "^1.1.1",
		  "Functionality/APIs": "Provides accessible and customizable hover card UI components.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "@radix-ui/react-label",
		  "Package version": "^2.1.0",
		  "Functionality/APIs": "Provides accessible and customizable label UI components.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "@radix-ui/react-menubar",
		  "Package version": "^1.1.1",
		  "Functionality/APIs": "Provides accessible and customizable menubar UI components.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "@radix-ui/react-navigation-menu",
		  "Package version": "^1.2.0",
		  "Functionality/APIs": "Provides accessible and customizable navigation menu UI components.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "@radix-ui/react-popover",
		  "Package version": "^1.1.1",
		  "Functionality/APIs": "Provides accessible and customizable popover UI components.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "@radix-ui/react-progress",
		  "Package version": "^1.1.0",
		  "Functionality/APIs": "Provides accessible and customizable progress UI components.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "@radix-ui/react-radio-group",
		  "Package version": "^1.2.0",
		  "Functionality/APIs": "Provides accessible and customizable radio group UI components.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "@radix-ui/react-scroll-area",
		  "Package version": "^1.1.0",
		  "Functionality/APIs": "Provides an accessible and customizable scroll area UI component.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "@radix-ui/react-select",
		  "Package version": "^2.1.1",
		  "Functionality/APIs": "Provides an accessible and customizable select UI component.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "@radix-ui/react-separator",
		  "Package version": "^1.1.0",
		  "Functionality/APIs": "Provides an accessible and customizable separator UI component.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "@radix-ui/react-slider",
		  "Package version": "^1.2.0",
		  "Functionality/APIs": "Provides an accessible and customizable slider UI component.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "@radix-ui/react-slot",
		  "Package version": "^1.1.0",
		  "Functionality/APIs": "A utility component to render children in a specific location.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "@radix-ui/react-switch",
		  "Package version": "^1.1.0",
		  "Functionality/APIs": "Provides an accessible and customizable switch UI component.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "@radix-ui/react-tabs",
		  "Package version": "^1.1.0",
		  "Functionality/APIs": "Provides accessible and customizable tab UI components.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "@radix-ui/react-toast",
		  "Package version": "^1.2.1",
		  "Functionality/APIs": "Provides accessible and customizable toast UI components for notifications.",
		  "which part of the repo it is used in": "Frontend (UI components, notifications)"
		},
		{
		  "Package name": "@radix-ui/react-toggle",
		  "Package version": "^1.1.0",
		  "Functionality/APIs": "Provides an accessible and customizable toggle UI component.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "@radix-ui/react-toggle-group",
		  "Package version": "^1.1.0",
		  "Functionality/APIs": "Provides an accessible and customizable toggle group UI components.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "@radix-ui/react-tooltip",
		  "Package version": "^1.1.4",
		  "Functionality/APIs": "Provides accessible and customizable tooltip UI components.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "@tanstack/react-query",
		  "Package version": "^5.56.2",
		  "Functionality/APIs": "A powerful library for fetching, caching, and updating asynchronous data in React applications.",
		  "which part of the repo it is used in": "Frontend (data fetching and management)"
		},
		{
		  "Package name": "class-variance-authority",
		  "Package version": "^0.7.1",
		  "Functionality/APIs": "A utility for creating composable class names, which are very common in modern React component styling, especially with Tailwind.",
		  "which part of the repo it is used in": "Frontend (styling)"
		},
		{
		  "Package name": "clsx",
		  "Package version": "^2.1.1",
		  "Functionality/APIs": "A utility for conditionally joining class names together, creating dynamic class strings.",
		  "which part of the repo it is used in": "Frontend (styling)"
		},
		{
		  "Package name": "cmdk",
		  "Package version": "^1.0.0",
		  "Functionality/APIs": "A command menu component, likely for providing search or quick actions within the UI.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "date-fns",
		  "Package version": "^3.6.0",
		  "Functionality/APIs": "A modern JavaScript date utility library that provides many functions for date manipulation and formatting.",
		  "which part of the repo it is used in": "Frontend (date manipulation and formatting)"
		},
		{
		  "Package name": "embla-carousel-react",
		  "Package version": "^8.3.0",
		  "Functionality/APIs": "React components for creating accessible and customizable carousels (sliders).",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "input-otp",
		  "Package version": "^1.2.4",
		  "Functionality/APIs": "A component for handling one-time password (OTP) input.",
		  "which part of the repo it is used in": "Frontend (UI components, potentially authentication)"
		},
		{
		  "Package name": "lucide-react",
		  "Package version": "^0.462.0",
		  "Functionality/APIs": "React components for a wide range of icons.",
		  "which part of the repo it is used in": "Frontend (icons)"
		},
		{
		  "Package name": "next-themes",
		  "Package version": "^0.3.0",
		  "Functionality/APIs": "A library to handle themes in a React application.",
		  "which part of the repo it is used in": "Frontend (theme management, dark/light mode)"
		},
		{
		  "Package name": "react-day-picker",
		  "Package version": "^8.10.1",
		  "Functionality/APIs": "A React component for selecting dates, offering a calendar UI.",
		  "which part of the repo it is used in": "Frontend (UI components, date selection)"
		},
		{
		  "Package name": "react-hook-form",
		  "Package version": "^7.53.0",
		  "Functionality/APIs": "A performant, flexible and extensible forms with easy to use validation.",
		  "which part of the repo it is used in": "Frontend (form management)"
		},
		{
		  "Package name": "react-resizable-panels",
		  "Package version": "^2.1.3",
		  "Functionality/APIs": "A React library to create resizable panels or split views in your UI.",
		  "which part of the repo it is used in": "Frontend (UI components, panel layout)"
		},
		{
		  "Package name": "react-router-dom",
		  "Package version": "^6.26.2",
		  "Functionality/APIs": "A library for routing and navigation in React applications. Allows building multi-page applications.",
		  "which part of the repo it is used in": "Frontend (routing, navigation)"
		},
		{
		  "Package name": "recharts",
		  "Package version": "^2.12.7",
		  "Functionality/APIs": "A composable charting library built on React. Supports many chart types.",
		  "which part of the repo it is used in": "Frontend (data visualization)"
		},
		{
		  "Package name": "sonner",
		  "Package version": "^1.5.0",
		  "Functionality/APIs": "A toast notification library for React. Used for displaying notifications to the user.",
		  "which part of the repo it is used in": "Frontend (UI, notifications)"
		},
		{
		  "Package name": "tailwind-merge",
		  "Package version": "^2.5.2",
		  "Functionality/APIs": "A utility for merging Tailwind CSS class names, handling conflicts and overrides.",
		  "which part of the repo it is used in": "Frontend (styling)"
		},
		{
		  "Package name": "tailwindcss-animate",
		  "Package version": "^1.0.7",
		  "Functionality/APIs": "Adds animation utilities to Tailwind CSS.",
		  "which part of the repo it is used in": "Frontend (styling)"
		},
		{
		  "Package name": "vaul",
		  "Package version": "^0.9.3",
		  "Functionality/APIs": "A component library, potentially similar to Radix UI, providing accessible and customizable UI elements.",
		  "which part of the repo it is used in": "Frontend (UI components)"
		},
		{
		  "Package name": "zod",
		  "Package version": "^3.23.8",
		  "Functionality/APIs": "A TypeScript-first schema validation library. Defines data structures and validates data against them.",
		  "which part of the repo it is used in": "Frontend (data validation)"
		},
		{
		  "Package name": "@eslint/js",
		  "Package version": "^9.9.0",
		  "Functionality/APIs": "Recommended configurations for ESLint.",
		  "which part of the repo it is used in": "Frontend (code linting)"
		},
		{
		  "Package name": "@tailwindcss/typography",
		  "Package version": "^0.5.15",
		  "Functionality/APIs": "Adds typography styles to Tailwind CSS for better readability.",
		  "which part of the repo it is used in": "Frontend (styling)"
		},
		{
		  "Package name": "@types/node",
		  "Package version": "^22.5.5",
		  "Functionality/APIs": "Type definitions for Node.js.",
		  "which part of the repo it is used in": "Frontend (development)"
		},
		{
		  "Package name": "@types/react",
		  "Package version": "^18.3.3",
		  "Functionality/APIs": "Type definitions for React.",
		  "which part of the repo it is used in": "Frontend (development)"
		},
		{
		  "Package name": "@types/react-dom",
		  "Package version": "^18.3.0",
		  "Functionality/APIs": "Type definitions for React DOM.",
		  "which part of the repo it is used in": "Frontend (development)"
		},
		{
		  "Package name": "globals",
		  "Package version": "^15.9.0",
		  "Functionality/APIs": "Provides a list of global variables for ESLint.",
		  "which part of the repo it is used in": "Frontend (code linting)"
		},
		{
		  "Package name": "lovable-tagger",
		  "Package version": "^1.1.3",
		  "Functionality/APIs": "Likely a custom package, potentially related to the 'Lovable' platform mentioned in README.  Could be used for tagging or labeling functionality.",
		  "which part of the repo it is used in": "Unknown - likely related to the Lovable platform"
		},
		{
		  "Package name": "yfinance",
		  "Package version": "N/A",
		  "Functionality/APIs": "Python library to fetch stock data from Yahoo Finance",
		  "which part of the repo it is used in": "Backend (fetching stock data - main.py)"
		},
		{
		  "Package name": "fastapi",
		  "Package version": "N/A",
		  "Functionality/APIs": "A modern, fast (high-performance), web framework for building APIs with Python 3.7+ based on standard Python type hints.",
		  "which part of the repo it is used in": "Backend (API - main.py)"
		},
		{
		  "Package name": "uvicorn",
		  "Package version": "N/A",
		  "Functionality/APIs": "An ASGI web server implementation for Python, used to run FastAPI applications.",
		  "which part of the repo it is used in": "Backend (likely used for running the API - main.py)"
		},
		{
		  "Package name": "pandas",
		  "Package version": "N/A",
		  "Functionality/APIs": "A powerful data analysis and manipulation library for Python.",
		  "which part of the repo it is used in": "Backend (data manipulation - main.py)"
		},
		{
		  "Package name": "requests",
		  "Package version": "2.31.0",
		  "Functionality/APIs": "A Python library for making HTTP requests. Used to interact with web APIs.",
		  "which part of the repo it is used in": "Backend (fetching news articles - stock_news.py, dl.py)"
		},
		{
		  "Package name": "google-generativeai",
		  "Package version": "0.3.2",
		  "Functionality/APIs": "Python library for interacting with Google's Generative AI models (like Gemini).  Used for generating questions from news articles.",
		  "which part of the repo it is used in": "Backend (generating questions,  - stock_news.py)"
		},
		{
		  "Package name": "agno",
		  "Package version": ">=1.1.3",
		  "Functionality/APIs": "Likely a custom library related to the overall project, possibly for creating agents or knowledge bases.  Includes functionality for embedding, vector databases, and agent interactions.",
		  "which part of the repo it is used in": "Backend (stock news agent, knowledge base - stock_news_agent.py)"
		},
		{
		  "Package name": "psycopg",
		  "Package version": "3.1.18",
		  "Functionality/APIs": "A PostgreSQL database adapter for Python.",
		  "which part of the repo it is used in": "Backend (database interaction - stock_news_agent.py)"
		},
		{
		  "Package name": "psycopg-binary",
		  "Package version": "3.1.18",
		  "Functionality/APIs": "A version of Psycopg that includes pre-compiled binaries, making installation easier.",
		  "which part of the repo it is used in": "Backend (database interaction - stock_news_agent.py)"
		},
		{
		  "Package name": "json",
		  "Package version": "N/A",
		  "Functionality/APIs": "Python built-in for working with JSON data.",
		  "which part of the repo it is used in": "Backend (loading and saving data - stock_news.py, stock_news_agent.py)"
		},
		{
		  "Package name": "pathlib",
		  "Package version": "N/A",
		  "Functionality/APIs": "Python built-in for working with file paths in an object-oriented way.",
		  "which part of the repo it is used in": "Backend (file path operations - stock_news.py, stock_news_agent.py)"
		},
		{
		  "Package name": "google.generativeai",
		  "Package version": "N/A",
		  "Functionality/APIs": "Python library to use Google's Gemini models.",
		  "which part of the repo it is used in": "Backend (generating questions - stock_news.py, stock_news_agent.py)"
		},
		{
		  "Package name": "os",
		  "Package version": "N/A",
		  "Functionality/APIs": "Python built-in for interacting with the operating system, including environment variables.",
		  "which part of the repo it is used in": "Backend (stock_news.py, stock_news_agent.py)"
		},
		{
		  "Package name": "datetime",
		  "Package version": "N/A",
		  "Functionality/APIs": "Python built-in for working with dates and times.",
		  "which part of the repo it is used in": "Backend (stock_news.py)"
		},
		{
		  "Package name": "typing",
		  "Package version": "N/A",
		  "Functionality/APIs": "Python built-in for type hinting.",
		  "which part of the repo it is used in": "Backend (stock_news.py)"
		},
		{
		  "Package name": "sqlalchemy",
		  "Package version": "N/A",
		  "Functionality/APIs": "SQL toolkit and Object-Relational Mapper for Python, often used for database interactions.",
		  "which part of the repo it is used in": "Backend (database interactions - stock_news_agent.py)"
		},
		{
		  "Package name": "rich",
		  "Package version": "N/A",
		  "Functionality/APIs": "Provides enhanced console output with colors, styles, and more.  Used for more visually appealing logging and user interaction.",
		  "which part of the repo it is used in": "Backend (console output - stock_news_agent.py)"
		},
		{
		  "Package name": "hashlib",
		  "Package version": "N/A",
		  "Functionality/APIs": "Python's module for cryptographic hashing, used to create unique identifiers.",
		  "which part of the repo it is used in": "Backend (generating unique document IDs - stock_news_agent.py)"
		}
	  ]
};

// Process the dependencies
async function test() {
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
	const fs = require('fs');
	const path = require('path');
	
	// Create output directory if it doesn't exist
	const outputDir = path.join(__dirname, '..', 'output');
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir);
	}

	// Save results to JSON file
	const outputPath = path.join(outputDir, 'dependencies-docs.json');
	fs.writeFileSync(outputPath, JSON.stringify({ dependencies: results }, null, 2));
	console.log(`Results saved to ${outputPath}`);

	// Print results to console
	results.forEach(dependency => {
		console.log(JSON.stringify(dependency, null, 2));
		console.log("---");
	});
}

test();
