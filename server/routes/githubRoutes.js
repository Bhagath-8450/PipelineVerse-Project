
import express from "express";
import {
  getWorkflowRuns,
  getWorkflowJobs
} from "../services/githubService.js";

const router = express.Router();

// Get recent GitHub workflow runs
router.get("/runs", async (req, res) => {
  try {
    const runs = await getWorkflowRuns();

    res.json({
      success: true,
      total: runs.length,
      runs
    });
  } catch (error) {
    console.error("Workflow runs error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get jobs for a particular workflow run
router.get("/runs/:runId/jobs", async (req, res) => {
  try {
    const jobs = await getWorkflowJobs(req.params.runId);

    res.json({
      success: true,
      total: jobs.length,
      jobs
    });
  } catch (error) {
    console.error("Workflow jobs error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
