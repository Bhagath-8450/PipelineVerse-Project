
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Bot,
  GitBranch,
  Layers3,
  RefreshCw,
  Workflow
} from "lucide-react";

import CityScene from "./components/CityScene";
import JobDetails from "./components/JobDetails";
import StatusLegend from "./components/StatusLegend";
import StatCard from "./components/StatCard";
import { getDependencyEdges } from "./utils/buildDependencies";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function App() {
  const [runs, setRuns] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRun, setSelectedRun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const edges = useMemo(
    () => getDependencyEdges(jobs),
    [jobs]
  );

  const counts = useMemo(
    () =>
      jobs.reduce((acc, job) => {
        acc[job.status] = (acc[job.status] || 0) + 1;
        return acc;
      }, {}),
    [jobs]
  );

  const selectedJob =
    jobs.find((job) => job.id === selectedId) || null;

  async function fetchRuns() {
    try {
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/github/runs`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to fetch GitHub runs.");
      }

      setRuns(data.runs || []);
      setLastUpdated(new Date());

      if (data.runs?.length > 0) {
        const currentRun =
          data.runs.find((run) => run.id === selectedRun?.id) ||
          data.runs[0];

        setSelectedRun(currentRun);
        await fetchJobs(currentRun.id);
      } else {
        setJobs([]);
        setSelectedRun(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchJobs(runId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/github/runs/${runId}/jobs`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to fetch workflow jobs.");
      }

      const formattedJobs = (data.jobs || []).map((job) => ({
        id: String(job.id),
        name: job.name,
        status: normalizeStatus(job.status, job.conclusion),
        conclusion: job.conclusion,
        steps: job.steps || [],
        startedAt: job.started_at,
        completedAt: job.completed_at,
        htmlUrl: job.html_url,
        runId: job.run_id,
        dependencies: []
      }));

      setJobs(formattedJobs);
      setSelectedId(formattedJobs[0]?.id || null);
    } catch (err) {
      setError(err.message);
      setJobs([]);
    }
  }

  function normalizeStatus(status, conclusion) {
    if (conclusion === "success") return "success";
    if (conclusion === "failure") return "failure";
    if (conclusion === "cancelled") return "blocked";
    if (status === "in_progress") return "running";
    if (status === "queued" || status === "waiting") return "pending";
    return "pending";
  }

  async function handleRunChange(runId) {
    const run = runs.find((item) => String(item.id) === runId);

    if (!run) return;

    setSelectedRun(run);
    setJobs([]);
    setSelectedId(null);
    setLoading(true);

    await fetchJobs(run.id);

    setLoading(false);
  }

  useEffect(() => {
    fetchRuns();

    const interval = window.setInterval(fetchRuns, 15000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <Workflow size={21} />
          </div>
          <div>
            <div className="brand-name">
              Pipeline<span>Verse</span>
            </div>
            <div className="brand-caption">
              CI/CD WORKFLOW UNIVERSE
            </div>
          </div>
        </div>

        <div className="topbar-right">
          <span
            className="connection-dot"
            style={{
              background: error ? "#ef4444" : "#22c55e"
            }}
          />
          <span className="topbar-label">
            {error ? "CONNECTION ERROR" : "LIVE GITHUB"}
          </span>
          <span className="repo-chip">
            <GitBranch size={13} /> main
          </span>
        </div>
      </header>

      <section className="page-heading">
        <div>
          <div className="eyebrow">
            <Layers3 size={14} /> LIVE CI/CD DIGITAL TWIN
          </div>

          <h1>Workflow Universe</h1>

          <p>
            Explore real GitHub Actions runs, jobs and execution status
            in a living 3D pipeline.
          </p>
        </div>

        <div className="heading-actions">
          <button
            className="primary-button"
            onClick={fetchRuns}
            disabled={loading}
          >
            <RefreshCw size={15} />
            {loading ? "Refreshing..." : "Refresh GitHub"}
          </button>
        </div>
      </section>

      {error && (
        <div className="info-card">
          <div>
            <h3>GitHub connection error</h3>
            <p>{error}</p>
            <p>
              Make sure your backend is running at
              {" "}{API_BASE_URL}.
            </p>
          </div>
        </div>
      )}

      <section className="stats-grid">
        <StatCard
          label="TOTAL JOBS"
          value={jobs.length}
          hint="In selected workflow run"
        />

        <StatCard
          label="SUCCESSFUL"
          value={counts.success || 0}
          accent="green"
          hint="Completed successfully"
        />

        <StatCard
          label="FAILED"
          value={counts.failure || 0}
          accent="red"
          hint="Needs attention"
        />

        <StatCard
          label="DEPENDENCIES"
          value={edges.length}
          accent="blue"
          hint="Job connections"
        />
      </section>

      <section className="workspace">
        <div className="city-card">
          <div className="card-heading">
            <div>
              <div className="panel-kicker">
                3D LIVE PIPELINE MAP
              </div>

              <h2>
                {selectedRun?.name || "GitHub Actions"}
              </h2>
            </div>

            <div className="live-tag">
              <span />
              {loading ? "LOADING" : "LIVE DATA"}
            </div>
          </div>

          {runs.length > 0 && (
            <div style={{ padding: "0 18px 12px" }}>
              <label
                htmlFor="workflow-run"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "12px"
                }}
              >
                SELECT GITHUB WORKFLOW RUN
              </label>

              <select
                id="workflow-run"
                value={selectedRun ? String(selectedRun.id) : ""}
                onChange={(event) =>
                  handleRunChange(event.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  background: "#111827",
                  color: "white",
                  border: "1px solid #374151"
                }}
              >
                {runs.map((run) => (
                  <option key={run.id} value={String(run.id)}>
                    {run.name} — #{run.run_number} —{" "}
                    {run.conclusion || run.status}
                  </option>
                ))}
              </select>
            </div>
          )}

          {loading && jobs.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center" }}>
              Loading GitHub workflow jobs...
            </div>
          ) : jobs.length > 0 ? (
            <CityScene
              jobs={jobs}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          ) : (
            <div style={{ padding: "40px", textAlign: "center" }}>
              No workflow jobs available.
            </div>
          )}

          <div className="city-footer">
            <StatusLegend />
            <span className="job-count">
              <Activity size={13} />
              {jobs.length} jobs · {edges.length} links
            </span>
          </div>
        </div>

        <JobDetails
          job={selectedJob}
          jobs={jobs}
          onClose={() => setSelectedId(null)}
        />
      </section>

      <section className="bottom-grid">
        <div className="info-card">
          <div className="info-icon">
            <GitBranch size={18} />
          </div>

          <div>
            <h3>Live GitHub integration</h3>
            <p>
              Workflow runs and job statuses are retrieved from the
              actual GitHub Actions API through the PipelineVerse backend.
            </p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon purple">
            <Bot size={18} />
          </div>

          <div>
            <h3>Explainable insights</h3>
            <p>
              PipelineVerse uses transparent, rule-based logic.
              No AI or machine learning models are required.
            </p>
          </div>
        </div>
      </section>

      <footer className="footer-note">
        <span>PIPELINEVERSE LIVE</span>
        <span>
          {lastUpdated
            ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
            : "Waiting for GitHub data"}
        </span>
      </footer>
    </main>
  );
}
