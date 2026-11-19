import yaml from "js-yaml";

/**
 * Convert GitHub Actions-style YAML into a predictable job model.
 * demo_status is a PipelineVerse-only field in the sample file.
 * Real GitHub Actions YAML does not contain this field.
 */
export function parseWorkflow(yamlText) {
  const parsed = yaml.load(yamlText) || {};
  const rawJobs = parsed.jobs || {};

  const jobs = Object.entries(rawJobs).map(([id, job], index) => ({
    id,
    name: job.name || id,
    status: normalizeStatus(job.demo_status || "pending"),
    needs: Array.isArray(job.needs)
      ? job.needs
      : job.needs
        ? [job.needs]
        : [],
    runner: job["runs-on"] || "Not specified",
    order: index
  }));

  return {
    workflowName: parsed.name || "Unnamed workflow",
    jobs
  };
}

function normalizeStatus(status) {
  const value = String(status).toLowerCase();
  if (["success", "completed", "passed"].includes(value)) return "success";
  if (["failure", "failed", "error"].includes(value)) return "failure";
  if (["running", "in_progress"].includes(value)) return "running";
  if (["blocked", "skipped"].includes(value)) return "blocked";
  return "pending";
}
