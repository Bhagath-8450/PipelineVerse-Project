# 🚀 PipelineVerse
### Interactive 3D CI/CD Workflow Visualization Platform

PipelineVerse is an interactive 3D digital twin prototype that visualizes CI/CD workflows as a 3D pipeline environment. It helps developers understand workflow jobs, dependencies, execution status, and the impact of failures through an interactive visual interface.

**Live Demo:** https://bhagath-8450.github.io/PipelineVerse-Project/

**GitHub Repository:** https://github.com/Bhagath-8450/PipelineVerse-Project

---

## 🌟 Key Features

- **Interactive 3D Visualization:** Represents workflow jobs as interactive 3D buildings.
- **Workflow Parsing:** Reads YAML workflow definitions and extracts jobs and dependencies.
- **Dependency Mapping:** Visualizes relationships between jobs using dependency connections.
- **Job Inspector:** Displays job details, runner information, and dependencies.
- **Failure Impact Analysis:** Explains how a failed job can affect downstream jobs.
- **Workflow Replay:** Simulates workflow execution by changing job statuses.
- **Dashboard Statistics:** Displays total jobs, successful jobs, failed jobs, and dependencies.
- **Reset Demo:** Restores the initial demonstration workflow.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend application |
| Vite | Development server and build tool |
| Three.js | 3D rendering |
| React Three Fiber | React integration for Three.js |
| Drei | 3D helpers and controls |
| JavaScript | Application logic |
| YAML / js-yaml | Workflow parsing |
| Vitest | Automated testing |
| Git & GitHub | Version control and source hosting |
| GitHub Actions | CI/CD automation |
| Docker | Application containerization |
| Nginx | Production web server |
| GitHub Container Registry | Docker image publishing |
| GitHub Pages | Live application hosting |

## 🏗️ System Architecture

The project follows this workflow:

1. A YAML workflow file provides job definitions.
2. The workflow parser extracts job information.
3. The dependency engine identifies relationships between jobs.
4. The React application displays the workflow in a 3D environment.
5. Users interact with buildings to inspect jobs and failure impacts.
6. The replay engine demonstrates execution status changes.

### CI/CD Architecture

The automated delivery pipeline follows these stages:

```text
Developer pushes code
        |
        v
   GitHub Repository
        |
        v
   GitHub Actions
        |
        v
 Install Dependencies
        |
        v
   Run Automated Tests
        |
        v
   Build Application
        |
        v
 Verify Build Output
        |
        v
 Build Docker Image
        |
        v
 Publish Image to GHCR
```

The Docker publishing job runs after the test and build job succeeds, and only on pushes to the main branch.

A separate GitHub Pages workflow builds, uploads, and deploys the frontend application.

## 🧪 Automated Testing

PipelineVerse uses Vitest to test important workflow-engine functionality.

Current automated tests cover:

- Parsing workflow jobs.
- Extracting job dependencies.
- Identifying independent jobs.

Run the tests locally:

```bash
npm test -- --run
```

Build the production application:

```bash
npm run build
```

## 🐳 Docker Deployment

PipelineVerse uses a multi-stage Docker build:

- Stage 1: Builds the React application using Node.js.
- Stage 2: Serves the production build using Nginx.

### Build the Docker image

```bash
docker build -t pipelineverse .
```

### Run the local container

```bash
docker run -d -p 8080:80 --name pipelineverse-app pipelineverse
```

Open:

http://localhost:8080

### Pull the published image

```bash
docker pull ghcr.io/bhagath-8450/pipelineverse-project:latest
```

### Run the published image

```bash
docker run -d -p 8081:80 --name pipelineverse-demo ghcr.io/bhagath-8450/pipelineverse-project:latest
```

Open:

http://localhost:8081

**Docker Image:** `ghcr.io/bhagath-8450/pipelineverse-project:latest`

## ⚙️ Run Locally

### Requirements

- Node.js 22
- npm
- Git
- Docker Desktop (for Docker operations)

### Installation

Clone the repository:

```bash
git clone https://github.com/Bhagath-8450/PipelineVerse-Project.git
```

Navigate into the project:

```bash
cd PipelineVerse-Project
```

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Open:

http://localhost:5173

### Production Build

```bash
npm run build
```

## 📁 Project Structure

```text
PipelineVerse/
│
├── .github/
│   └── workflows/
│       ├── ci-cd.yml
│       └── deploy.yml
│
├── src/
│   ├── components/
│   │   ├── CityScene.jsx
│   │   ├── JobDetails.jsx
│   │   ├── StatusLegend.jsx
│   │   └── StatCard.jsx
│   │
│   ├── data/
│   │   └── sampleWorkflow.yml
│   │
│   ├── utils/
│   │   ├── parseWorkflow.js
│   │   ├── buildDependencies.js
│   │   └── explainStatus.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── style.css
│
├── tests/
│   └── workflow.test.js
│
├── Dockerfile
├── .dockerignore
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## 🎮 Demo Instructions

1. Open the live application.
2. Explore the 3D workflow environment.
3. Select a building to inspect its job details.
4. Examine job dependencies.
5. Select the failed job to understand its downstream impact