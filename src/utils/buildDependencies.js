export function getDependencyEdges(jobs) {
  const known = new Set(jobs.map((job) => job.id));
  return jobs.flatMap((job) =>
    job.needs
      .filter((dependencyId) => known.has(dependencyId))
      .map((dependencyId) => ({
        from: dependencyId,
        to: job.id
      }))
  );
}

export function getBlockedDependants(jobId, jobs) {
  const blocked = new Set();
  const queue = [jobId];

  while (queue.length) {
    const current = queue.shift();
    jobs.forEach((job) => {
      if (job.needs.includes(current) && !blocked.has(job.id)) {
        blocked.add(job.id);
        queue.push(job.id);
      }
    });
  }
  return [...blocked];
}
