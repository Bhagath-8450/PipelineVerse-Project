# PipelineVerse

An interactive 3D digital twin prototype for GitHub Actions workflows.

## What works in this starter

- Loads a sample GitHub Actions-style workflow from `src/data/sampleWorkflow.yml`.
- Parses jobs and `needs` dependencies.
- Renders jobs as interactive 3D buildings.
- Shows status through building colours and a status legend.
- Clicks a building to inspect job details and dependencies.
- Provides rule-based failure impact explanations (no paid AI API).
- Replays a sample execution by changing job statuses.

## Requirements

- Node.js 18 or newer
- npm
- Internet connection for the first `npm install` (dependencies are free open-source packages)

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

For a production build:

```bash
npm run build
npm run preview
```

## Project structure

```text
src/
  components/
    CityScene.jsx       # 3D scene, buildings and dependency links
    JobDetails.jsx      # selected job information
    StatusLegend.jsx    # status colour key
    StatCard.jsx        # summary cards
  data/
    sampleWorkflow.yml  # sample workflow used by the demo
  utils/
    parseWorkflow.js    # YAML -> normalized job records
    buildDependencies.js
    explainStatus.js   # transparent rule-based explanations
  App.jsx
  main.jsx
  style.css
```

## Demo controls

- Select a building in the 3D city to inspect it.
- Click **Replay workflow** to play a preconfigured sequence of job statuses.
- Click **Reset demo** to restore the initial example.

The sample intentionally includes a failed test job and a deployment job that becomes blocked. This demonstrates dependency impact.

## Important limitations

This is a working front-end prototype using sample workflow data. It does **not yet** connect to a live GitHub repository, receive real webhooks, fetch private logs, or call an AI model. Do not describe sample events as live GitHub data in a presentation.

## Next development steps

1. Replace sample YAML with a workflow file from a public test repository.
2. Add a small backend (for example FastAPI or Node/Express) to fetch public workflow files and workflow-run data from GitHub.
3. Add a GitHub App or OAuth flow only if repository access is needed. Keep tokens on the backend; never put secrets in frontend code.
4. Add webhook verification and event processing for real-time updates.
5. Store workflow runs and job history if persistent comparison is required.

## Team split for 3 people

- Member 1: UI, job details panel, stats, responsive layout.
- Member 2: 3D city, building models, camera and interactions.
- Member 3: workflow parsing, dependency logic, demo replay, testing and integration.

Agree on the job object format in `parseWorkflow.js` before changing components.
