import { getBlockedDependants } from "./buildDependencies";

export function explainJob(job, jobs) {
  if (!job) return "Select a building to inspect its workflow job.";

  if (job.status === "failure") {
    const dependants = getBlockedDependants(job.id, jobs);
    if (!dependants.length) {
      return `${job.name} failed. No downstream jobs in this workflow depend on it.`;
    }
    const names = dependants
      .map((id) => jobs.find((item) => item.id === id)?.name || id)
      .join(", ");
    return `${job.name} failed. The following downstream job(s) depend on it and may be blocked: ${names}. Check the failed job's logs to find the underlying cause.`;
  }

  if (job.status === "blocked") {
    const failedDependencies = job.needs
      .map((id) => jobs.find((item) => item.id === id))
      .filter((item) => item && ["failure", "blocked"].includes(item.status));

    if (failedDependencies.length) {
      return `${job.name} is blocked because ${failedDependencies.map((item) => item.name).join(", ")} did not complete successfully.`;
    }
    return `${job.name} is marked as blocked in this demo.`;
  }

  if (job.status === "success") {
    return `${job.name} completed successfully. Its status is shown in green.`;
  }
  if (job.status === "running") {
    return `${job.name} is currently running in this demo.`;
  }
  return `${job.name} is waiting to run. Its dependencies must complete first.`;
}
