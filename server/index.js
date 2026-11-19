
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import githubRoutes from "./routes/githubRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to PipelineVerse Backend!");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "PipelineVerse backend is running!",
    status: "healthy"
  });
});

// GitHub API routes
app.use("/api/github", githubRoutes);

app.listen(PORT, () => {
  console.log(`PipelineVerse backend running at http://localhost:${PORT}`);
});
