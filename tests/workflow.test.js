
import { describe, it, expect } from "vitest";
import { parseWorkflow } from "../src/utils/parseWorkflow";
import { getDependencyEdges } from "../src/utils/buildDependencies";

describe("PipelineVerse Workflow Engine", () => {

  it("should parse workflow jobs correctly", () => {
    const yamlText = `
name: Test Workflow
jobs:
  checkout:
    runs-on: ubuntu-latest
  build:
    needs: checkout
    runs-on: ubuntu-latest
`;

    const result = parseWorkflow(yamlText);

    expect(result.workflowName).toBe("Test Workflow");
    expect(result.jobs).toHaveLength(2);
    expect(result.jobs[1].needs).toEqual(["checkout"]);
  });

  it("should generate dependency edges", () => {
    const jobs = [
      { id: "checkout", needs: [] },
      { id: "build", needs: ["checkout"] },
      { id: "deploy", needs: ["build"] }
    ];

    const edges = getDependencyEdges(jobs);

    expect(edges).toEqual([
      { from: "checkout", to: "build" },
      { from: "build", to: "deploy" }
    ]);
  });

  it("should identify independent jobs", () => {
    const jobs = [
      { id: "checkout", needs: [] },
      { id: "test", needs: ["checkout"] },
      { id: "lint", needs: [] }
    ];

    const edges = getDependencyEdges(jobs);

    expect(edges).toHaveLength(1);
  });

});
