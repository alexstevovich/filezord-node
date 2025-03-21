/*˹*******************************************************
 * filezord-node
 * 
 * @license
 * 
 * Apache-2.0
 * 
 * Copyright 2022-2025 Alex Stevovich
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 
 * @meta
 *
 * package_name: filezord
 * file_name: index.js
 * purpose: Core functionality and exports.
 *  
 * @system
 *
 * generated_on: 2025-03-21T03:58:04.688Z
 * file_uuid: 9d7e6dc0-58bf-40e6-a8a2-c1c0953bab70
 * file_size: 10094 bytes
 * file_hash: 5203129650a88ecb51ec6ebe964286649cd94a148acabdd2b735d8736254f596
 * mast_hash: a66611e4ca32a8cfe4f9640d99b61351c7b8b1e04b9842fbdfc5179fa987ff3c
 * generated_by: shipmast on npm
 *
*******************************************************˼*/

import fs from "fs/promises";
import path from "path";
import ignore from "ignore";
const chalk = (await import("chalk")).default;

const CONFIG = {
  DEFAULT_FILE_SIZE_LIMIT: 5 * 1024 * 1024, // 5MB default
  SKIP_LOCK_FILES: [
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "bun.lockb",
  ],
};

const BINARY_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".exe",
  ".dll",
  ".zip",
  ".tar",
  ".gz",
  ".pdf",
  ".mp4",
  ".mp3",
  ".avi",
  ".mov",
  ".woff",
  ".woff2",
  ".ttf",
]);

const AUTO_IGNORE_LIST = [
  "node_modules/",
  "__pycache__",
  "*.pyc",
  "*.pyo",
  "*.class",
  "*.o",
  "*.so",
  "*.dylib",
  "target/",
  "dist/",
  "build/",
  "venv/",
  ".idea/",
  ".vscode/",
  ".DS_Store",
  "Cargo.lock",
  "*.lock",
  ".pytest_cache/",
  "cmake-build-*/",
  "*.egg-info/",
];

const hasBinaryExtension = (filePath) => {
  return BINARY_EXTENSIONS.has(path.extname(filePath).toLowerCase());
};

const hasBinaryContent = async (filePath) => {
  try {
    const buffer = await fs.readFile(filePath);
    return buffer.includes(0); // Presence of null bytes indicates binary
  } catch {
    return true;
  }
};

const readIgnoreFile = async (
  root,
  ignoreFile = ".gitignore",
  extraIgnores = [],
  autoIgnore = true,
) => {
  let patterns = autoIgnore ? [...AUTO_IGNORE_LIST] : [];
  const ignorePath = path.join(root, ignoreFile);

  try {
    const content = await fs.readFile(ignorePath, "utf8");
    patterns.push(
      ...content
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#")),
    );
  } catch {
    // Ignore errors (file may not exist)
  }

  patterns.push(...extraIgnores);
  return ignore().add(patterns);
};

const walk = async (
  dirPath,
  pathSpec,
  root,
  include = [],
  exclude = [],
  maxFileSize = null,
  includeHidden = true,
) => {
  let collectedFiles = [];

  let files;
  try {
    files = await fs.readdir(dirPath, { withFileTypes: true });
  } catch {
    return collectedFiles; // Return empty if directory cannot be read
  }

  for (const file of files) {
    const fullPath = path.join(dirPath, file.name);
    const relPath = path.relative(root, fullPath).replace(/\\/g, "/");

    if (!includeHidden && file.name.startsWith(".")) continue;
    if (pathSpec.ignores(relPath)) continue;

    if (file.isDirectory()) {
      collectedFiles.push(
        ...(await walk(
          fullPath,
          pathSpec,
          root,
          include,
          exclude,
          maxFileSize,
          includeHidden,
        )),
      );
    } else {
      if (CONFIG.SKIP_LOCK_FILES.includes(file.name)) continue;
      if (exclude.some((pattern) => new RegExp(pattern).test(relPath)))
        continue;
      if (
        include.length > 0 &&
        !include.some((pattern) => new RegExp(pattern).test(relPath))
      )
        continue;
      if (hasBinaryExtension(fullPath) || (await hasBinaryContent(fullPath)))
        continue;

      try {
        const fileSize = (await fs.stat(fullPath)).size;
        if (maxFileSize && fileSize > maxFileSize) continue;
      } catch {
        continue; // Skip files that cannot be accessed
      }

      collectedFiles.push(fullPath);
    }
  }
  return collectedFiles;
};

const readFileContent = async (file) => {
  try {
    return [file, await fs.readFile(file, "utf8")];
  } catch (e) {
    return [file, `⚠️ Failed to read file: ${e.message}`];
  }
};

const defaultFilezordHeader = `======================================================
* 🦾 FILEZORD AGGREGATION
* Filezord: A superfile combining multiple sources into one.
* Generated on: {generated_on}
* Start Path: {dir}
* ID: {id}
* Total Files: {file_count}
* --Filezords are meant only for communication and review.
======================================================
`;

const defaultFileHeader = `──────────────────────────────────────────────────────
FILE: {file}
START: {dir}
ID: {id}
──────────────────────────────────────────────────────
`;

/**
 * Aggregates all non-binary text files in a project into a single structured output.
 *
 * @param {string} dir - The root directory to process.
 * @param {Object} [options] - Configuration options for file aggregation.
 * @param {string} [options.ignoreFile=".gitignore"] - Ignore file to use (default is `.gitignore`).
 * @param {boolean} [options.autoIgnore=true] - Whether to apply automatic ignores.
 * @param {string|null} [options.id=null] - Optional identifier for the aggregation.
 * @param {string[]} [options.include=[]] - List of file patterns to include (e.g., `["*.md", "*.js"]`).
 * @param {string[]} [options.exclude=[]] - List of file patterns to exclude (e.g., `["*.log", "*.tmp"]`).
 * @param {number} [options.maxFileSize=5242880] - Max file size in bytes (default is `5MB`).
 * @param {boolean} [options.includeHidden=true] - Whether to include hidden files.
 * @param {string} [options.globalHeader] - Custom header template for the output file.
 * @param {string} [options.fileHeader] - Custom per-file header template.
 * @returns {Promise<string>} A promise that resolves to the aggregated string output.
 */
export async function filezordProject(
  dir,
  {
    ignoreFile = ".gitignore",
    autoIgnore = true,
    id = null,
    include = [],
    exclude = [],
    maxFileSize = CONFIG.DEFAULT_FILE_SIZE_LIMIT,
    includeHidden = true,
    globalHeader = defaultFilezordHeader,
    fileHeader = defaultFileHeader,
  } = {},
) {
  const projectRoot = path.resolve(dir);
  const pathSpec = await readIgnoreFile(
    projectRoot,
    ignoreFile,
    [],
    autoIgnore,
  );

  const files = (
    await walk(
      projectRoot,
      pathSpec,
      projectRoot,
      include,
      exclude,
      maxFileSize,
      includeHidden,
    )
  ).sort();

  const timestamp = new Date().toISOString();

  let outputData = [
    globalHeader
      .replace("{generated_on}", timestamp)
      .replace("{dir}", projectRoot.replace(/\\/g, "/"))
      .replace("{id}", id || "None")
      .replace("{file_count}", files.length),
  ];

  const results = await Promise.all(files.map(readFileContent));

  for (const [file, content] of results) {
    const normalizedFile = path.relative(projectRoot, file).replace(/\\/g, "/");
    const header = fileHeader
      .replace("{file}", normalizedFile)
      .replace("{dir}", projectRoot.replace(/\\/g, "/"))
      .replace("{id}", id || "None");

    outputData.push(`\n${header}\n`);
    outputData.push(content);
  }

  return outputData.join("\n");
}

/**
 * Executes the filezordProject function and handles output logic (console or file writing).
 *
 * @param {string} dir - The root directory to process.
 * @param {Object} [options] - Configuration options for file aggregation and output handling.
 * @param {string} [options.output] - If provided, writes the output to the specified file instead of logging it.
 * @returns {Promise<void>} A promise that resolves when execution is complete.
 */
export async function filezordProjectExec(dir, options = {}) {
  const {
    ignoreFile = ".gitignore",
    noAutoIgnore = false,
    id,
    include,
    exclude,
    maxFileSize = 5 * 1024 * 1024,
    includeHidden = false,
    output = "./.filezord",
  } = options;

  const finalOutput = await filezordProject(dir, {
    ignoreFile,
    autoIgnore: !noAutoIgnore,
    id,
    include,
    exclude,
    maxFileSize,
    includeHidden,
  });

  const colorKey = "AAAAFF";
  const colorValue = "CCCCFF";
  //const logBranch = chalk.hex(colorKey).bold("├──");
  const logDown = chalk.hex(colorKey).bold("│  ");
  const logEnd = chalk.hex(colorKey).bold("└──");
  const logValue = (value) => chalk.hex(colorValue).bold(String(value));
  const logHeavyOp = `${chalk.hex("FFFF00")("★")} HEAVY OP`;
  const logAsync = chalk.hex("FFFF00")("⧗");

  console.info(
    `${logAsync}${chalk.hex(colorKey).bold("filezord.projectExec")}`,
  );
  console.info(`${logDown} ${logHeavyOp}`);
  console.info(`${logDown} id ${logValue(id)}`);
  console.info(`${logDown} ignoreFile ${logValue(ignoreFile)}`);
  console.info(`${logDown} autoIgnore ${logValue(!noAutoIgnore)}`);
  console.info(`${logDown} include ${logValue(include)}`);
  console.info(`${logDown} exclude ${logValue(exclude)}`);
  console.info(`${logDown} maxFileSize ${logValue(maxFileSize)}`);
  console.info(`${logDown} includeHidden ${logValue(includeHidden)}`);

  if (output) {
    await fs.writeFile(path.resolve(output), finalOutput, "utf8");
    console.info(`${logEnd} ${chalk.hex("0fff87")("✓ Filezord Complete!")}`);
  } else {
    console.info(finalOutput);
  }
}
