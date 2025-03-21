#!/usr/bin/env node
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
 * file_name: cli.js
 * purpose: Implements CLI commands.
 *  
 * @system
 *
 * generated_on: 2025-03-20T20:33:49.280Z
 * file_uuid: 847d2a0e-b1a0-413f-aa75-0aa92cb174ca
 * file_size: 2700 bytes
 * file_hash: 4c723a5b83391457e4a3839ffbec935ad8ff635bad88ab8c1943f51e556a5a25
 * mast_hash: 79ae27b46e06a29ab482a6b8b3c2e437d4363c23d9e12a2415d2014172f649a1
 * generated_by: shipmast on npm
 *
*******************************************************˼*/

import { filezordProjectExec } from "filezord";
import { program } from "commander";

program
  .name("filezord")
  .description(
    "Filezord: Aggregate non-binary text files into a single output.",
  )
  .argument(
    "[dir]",
    "Root directory to process (default: current directory)",
    ".",
  )
  .option("--ignoreFile <file>", "Ignore file to use", ".gitignore")
  .option("--noAutoIgnore", "Disable automatic ignores", false)
  .option("--id <id>", "Optional identifier for file headers")
  .option(
    "--include <patterns...>",
    "List of file patterns to include (e.g., '*.py' '*.md')",
  )
  .option(
    "--exclude <patterns...>",
    "List of file patterns to exclude (e.g., '*.log' '*.tmp')",
  )
  .option(
    "--maxFileSize <size>",
    "Max file size in bytes (default: 5MB)",
    (val) => parseInt(val, 10),
    5 * 1024 * 1024,
  )
  .option("--include-hidden", "Skip hidden folders", false)
  .option(
    "--output <file>",
    "Write output to a file instead of printing",
    "./.filezord",
  )
  .parse(process.argv);

const options = program.opts();
const directory = program.args[0] || ".";

async function main() {
  await filezordProjectExec(directory, {
    ignoreFile: options.ignoreFile,
    autoIgnore: options.noAutoIgnore,
    id: options.id,
    include: options.include,
    exclude: options.exclude,
    maxFileSize: options.maxFileSize,
    includeHidden: options.includeHidden,
    output: options.output,
  });
}

main();
