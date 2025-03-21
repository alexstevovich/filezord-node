import { describe, it, expect, vi, beforeEach } from "vitest";
import fs from "fs/promises";
import { filezordProject } from "../dist/index.mjs";

vi.mock("fs/promises");

describe("filezordProject", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should generate a file aggregation report", async () => {
    // Mock directory structure
    fs.readdir.mockResolvedValue([
      { name: "file1.txt", isDirectory: () => false },
      { name: "file2.js", isDirectory: () => false },
    ]);

    // Mock file sizes
    fs.stat.mockResolvedValue({ size: 1000 });

    // Mock file contents
    fs.readFile.mockImplementation(async (file) => {
      if (file.includes("file1.txt")) return "File 1 content";
      if (file.includes("file2.js")) return "console.log('Hello');";
      throw new Error("File not found");
    });

    // Call filezordProject
    const output = await filezordProject("/test-dir");

    // Check that the output contains file metadata and content
    expect(output).toContain("🦾 FILEZORD AGGREGATION");
    expect(output).toContain("FILE: file1.txt");
    expect(output).toContain("File 1 content");
    expect(output).toContain("FILE: file2.js");
    expect(output).toContain("console.log('Hello');");
  });

  it("should return an empty report if directory is empty", async () => {
    fs.readdir.mockResolvedValue([]);

    const output = await filezordProject("/empty-dir");

    expect(output).toContain("🦾 FILEZORD AGGREGATION");
    expect(output).toContain("Total Files: 0");
  });

  it("should ignore files based on default ignore rules", async () => {
    fs.readdir.mockResolvedValue([
      { name: "file1.txt", isDirectory: () => false },
      { name: "node_modules", isDirectory: () => true },
    ]);

    fs.stat.mockResolvedValue({ size: 1000 });
    fs.readFile.mockResolvedValue("File content");

    const output = await filezordProject("/test-dir");

    expect(output).toContain("FILE: file1.txt");
    expect(output).not.toContain("node_modules");
  });
});
