import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, Bot, GitBranch, Layers3, Play, RotateCcw, Workflow } from "lucide-react";
import CityScene from "./components/CityScene";
import JobDetails from "./components/JobDetails";
import StatusLegend from "./components/StatusLegend";
import StatCard from "./components/StatCard";
import workflowYaml from "./data/sampleWorkflow.yml?raw";
import { parseWorkflow } from "./utils/parseWorkflow";
import { getDependencyEdges } from "./utils/buildDependencies";

const initial = parseWorkflow(workflowYaml);

const replayStates = [
  { checkout: "running", install: "pending", lint: "pending", test: "pending", build: "pending", deploy: "pending" },
  { checkout: "success", install: "running", lint: "pending", test: "pending", build: "pending", deploy: "pending" },
  { checkout: "success", install: "success", lint: "running", test: "running", build: "pending", deploy: "pending" },
  { checkout: "success", install: "success", lint: "success", test: "failure", build: "blocked", deploy: "pending" }
];

export default function App() {
  const [jobs, setJobs] = useState(initial.jobs);
  const [selectedId, setSelectedId] = useState("test");
  const [playing, setPlaying] = useState(false);
  const [replayIndex, setReplayIndex] = useState(3);
  const timer = useRef(null);

  const selectedJob = jobs.find((job) => job.id === selectedId) || null;
  const edges = useMemo(() => getDependencyEdges(jobs), [jobs]);
  const counts = useMemo(() => jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {}), [jobs]);

  useEffect(() => {
    if (!playing) return undefined;
    timer.current = window.setInterval(() => {
      setReplayIndex((current) => {
        const next = current >= replayStates.length - 1 ? 0 : current + 1;
        const state = replayStates[next];
        setJobs((currentJobs) => currentJobs.map((job) => ({
          ...job,
          status: state[job.id] || "pending"
        })));
        return next;
      });
    }, 1500);
    return () => window.clearInterval(timer.current);
  }, [playing]);

  useEffect(() => () => window.clearInterval(timer.current), []);

  function startReplay() {
    setPlaying(true);
  }

  function resetDemo() {
    setPlaying(false);
    window.clearInterval(timer.current);
    setReplayIndex(3);
    setJobs(initial.jobs);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><Workflow size={21} /></div>
          <div>
            <div className="brand-name">Pipeline<span>Verse</span></div>
            <div className="brand-caption">CI/CD WORKFLOW UNIVERSE</div>
          </div>
        </div>
        <div className="topbar-right">
          <span className="connection-dot" />
          <span className="topbar-label">SAMPLE WORKFLOW</span>
          <span className="repo-chip"><GitBranch size={13} /> main</span>
        </div>
      </header>

      <section className="page-heading">
        <div>
          <div className="eyebrow"><Layers3 size={14} /> DIGITAL TWIN EXPERIENCE</div>
          <h1>Workflow Universe</h1>
          <p>Explore jobs, dependencies and execution impact in a living 3D pipeline.</p>
        </div>
        <div className="heading-actions">
          <button className="secondary-button" onClick={resetDemo}><RotateCcw size={15} /> Reset demo</button>
          <button className="primary-button" onClick={startReplay} disabled={playing}><Play size={15} fill="currentColor" /> {playing ? "Replaying..." : "Replay workflow"}</button>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard label="TOTAL JOBS" value={jobs.length} hint="In this workflow" />
        <StatCard label="SUCCESSFUL" value={counts.success || 0} accent="green" hint="Completed successfully" />
        <StatCard label="FAILED" value={counts.failure || 0} accent="red" hint="Needs attention" />
        <StatCard label="DEPENDENCIES" value={edges.length} accent="blue" hint="Job connections" />
      </section>

      <section className="workspace">
        <div className="city-card">
          <div className="card-heading">
            <div>
              <div className="panel-kicker">3D PIPELINE MAP</div>
              <h2>{initial.workflowName}</h2>
            </div>
            <div className="live-tag"><span /> {playing ? "REPLAYING" : "DEMO STATE"}</div>
          </div>
          <CityScene jobs={jobs} selectedId={selectedId} onSelect={setSelectedId} />
          <div className="city-footer">
            <StatusLegend />
            <span className="job-count"><Activity size={13} /> {jobs.length} jobs · {edges.length} links</span>
          </div>
        </div>

        <JobDetails job={selectedJob} jobs={jobs} onClose={() => setSelectedId(null)} />
      </section>

      <section className="bottom-grid">
        <div className="info-card">
          <div className="info-icon"><GitBranch size={18} /></div>
          <div>
            <h3>Dependency intelligence</h3>
            <p>Lines connect prerequisite jobs to the jobs that depend on them. Select a failed job to inspect its downstream impact.</p>
          </div>
        </div>
        <div className="info-card">
          <div className="info-icon purple"><Bot size={18} /></div>
          <div>
            <h3>Explainable insights</h3>
            <p>PipelineVerse uses transparent, rule-based explanations in this offline demo. No paid AI API or subscription is needed.</p>
          </div>
        </div>
      </section>

      <footer className="footer-note">
        <span>PIPELINEVERSE PROTOTYPE</span>
        <span>Sample data · Not connected to a live GitHub run</span>
      </footer>
    </main>
  );
}
