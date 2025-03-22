import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { test3 } from "./test";

// Load environment variables
dotenv.config();

const app = express();
// const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (_req, res) => {
	res.json({ message: "Welcome to the API" });
});

// Health check endpoint
app.get("/health", (_req, res) => {
	res.json({ status: "healthy" });
});

// Start server
/* app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); */

test3();
