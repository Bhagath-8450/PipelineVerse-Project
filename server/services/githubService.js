
const GITHUB_API = "https://api.github.com";

async function githubRequest(endpoint) {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !token) {
    throw new Error("GitHub environment variables are missing.");
  }

  const response = await fetch(`${GITHUB_API}${endpoint}`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || `GitHub API error: ${response.status}`
    );
  }

  return data;
}

export async function getWorkflowRuns() {
  const data = await githubRequest(
    `/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/actions/runs?per_page=10`
  );

  return data.workflow_runs;
}

export async function getWorkflowJobs(runId) {
  if (!/^\d+$/.test(String(runId))) {
    throw new Error("Invalid workflow run ID.");
  }

  const data = await githubRequest(
    `/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/actions/runs/${runId}/jobs?per_page=100`
  );

  return data.jobs;
}
