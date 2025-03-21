
# filezord 🦾

> archetype: Node.js package  

**filezord** merges all text-based files in a project into **one structured document**. It supports both a **CLI** and a **programmatic API** for flexibility.

## Definitions

- **filezord**🦾 - A process that combines multiple documents into a **single super-document**.

- **.filezord** - While technically a `.txt` file, `.filezord` is a **custom extension** to indicate aggregated output and simplify `.gitignore` filtering.

## Details

✅ **Minimal CLI & programmatic API** – Easy to use in any Node.js project.  
✅ **Respects `.gitignore`** – Excludes ignored files automatically.  
✅ **Smart filtering** – Skips lock files & binary files to keep output clean.  
✅ **Structured output** – Helps **LLMs & AI** process an entire project efficiently.  
✅ **Fast & Parallelized** – Optimized for speed using **asynchronous file reads**.

## Installation

```sh
npm  install  filezord
```
## Example Output

```txt
======================================================
 * 🦾 FILEZORD AGGREGATION
 * Filezord: A superfile combining multiple sources into one.
 * Generated on: 2025-03-16T03:06:13.136Z
 * Start Path: ./

 * Total Files: 6
 * --Filezords are meant only for communication and review.
======================================================

──────────────────────────────────────────────────────
 FILE: package.json
 START: ./
──────────────────────────────────────────────────────
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "An example project.",
  "main": "index.js",
  "license": "Apache-2.0"
}

──────────────────────────────────────────────────────
 FILE: src/index.js
 START: ./
──────────────────────────────────────────────────────
import { start } from './core.js';

start();
console.log('Hello, world!');

```


## Usage

### Programmatic

```js
import { filezordDir } from "filezord";
const zord = await filezordDir("./");
console.log(zord);
```

#### **📌 Add a Custom ID**

You can pass an ID for tracking:

```js
await filezord("/my/project", { id: "session-123" });
```

### CLI
After installation, you can use **filezord** from the command line:

```sh
filezord [directory] [options]
```

#### Example

```
filezord 
```

### CLI Options  

| Option               | Description |
|----------------------|-------------|
| `[directory]`       | Root directory to process (default: current directory). |
| `--output <file>`   | Write output to a file instead of printing (default: `./.filezord`). |
| `--ignoreFile <file>` | Custom ignore file (default: `.gitignore`). |
| `--noAutoIgnore`    | Disable automatic ignores (default: `false`). |
| `--id <id>`         | Optional identifier for file headers. |
| `--include <patterns>` | List of file patterns to include (e.g., `*.py`, `*.md`). |
| `--exclude <patterns>` | List of file patterns to exclude (e.g., `*.log`, `*.tmp`). |
| `--maxFileSize <size>` | Max file size in bytes (default: `5MB`). |
| `--ignore-hidden`   | Skip hidden folders. |


## Related Links

**Development**:
[https://github.com/alexstevovich/filezord-node](https://github.com/alexstevovich/filezord-node)  

**NPM**
[https://www.npmjs.com/package/filezord](https://www.npmjs.com/package/filezord)  

## Final Thoughts

Filezord is a **powerful utility** for **merging project files** into a single structured document.  
Perfect for **AI-powered code analysis, review workflows, and project documentation**.

Try it out, and let’s **unleash the Filezord! 🦾**

> ### _“Deploying full file merge—let’s finish this!”_

## License

Licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
