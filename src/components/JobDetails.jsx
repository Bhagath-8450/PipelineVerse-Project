import { explainJob } from "../utils/explainStatus";
import { getBlockedDependants } from "../utils/buildDependencies";

export default function JobDetails({ job, jobs, onClose }) {
  if (!job) {
    return (
      <aside className="details-panel empty-details">
        <div className="panel-kicker">JOB INSPECTOR</div>
        <h2>Select a building</h2>
        <p>Click any building in the 3D city to inspect its job, status and dependencies.</p>
        <div className="inspector-placeholder">⌖</div>
      </aside>
    );
  }

  const dependencies = job.needs.map((id) => jobs.find((item) => item.id === id)).filter(Boolean);
  const affected = getBlockedDependants(job.id, jobs);

  return (
    <aside className="details-panel">
      <div className="details-top">
        <div className="panel-kicker">JOB INSPECTOR</div>
        <button className="icon-button" onClick={onClose} aria-label="Close details">×</button>
      </div>
      <h2>{job.name}</h2>
      <p className="muted small">{job.id}</p>
      <div className={`status-pill ${job.status}`}>
        <span className="status-dot" /> {job.status.toUpperCase()}
      </div>

      <div className="detail-section">
        <h3>Runner</h3>
        <p>{job.runner}</p>
      </div>
      <div className="detail-section">
        <h3>Depends on</h3>
        {dependencies.length ? (
          <div className="chip-list">
            {dependencies.map((item) => <span className="chip" key={item.id}>{item.name}</span>)}
          </div>
        ) : <p className="muted">No dependencies — this is a starting job.</p>}
      </div>
      <div className="detail-section">
        <h3>Impact analysis</h3>
        <p>{explainJob(job, jobs)}</p>
        {affected.length > 0 && (
          <div className="impact-box">
            <strong>{affected.length} downstream job(s)</strong>
            <span>{affected.map((id) => jobs.find((item) => item.id === id)?.name || id).join(" · ")}</span>
          </div>
        )}
      </div>
      <p className="data-note">Demo workflow data · Not a live GitHub run</p>
    </aside>
  );
}
