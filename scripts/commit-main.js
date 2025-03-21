import { run, ask } from "demi-cmd";
import fsys from "demi-fs";
import git from "demi-git";

// Check if dry-run mode is enabled
const dryRun = process.argv.includes("--dry-run");

console.log("🔄 Fetching latest `main`...");
await run(`git fetch origin main`);

console.log("🔍 Checking current branch...");
const currentBranch = await git.getBranch(".");
if (currentBranch !== "dev") {
  console.error("⚠️ You must be on the `dev` branch to merge into `main`.");
  process.exit(1);
}

// Get version info for commit message
const data = await fsys.readJson("./package.json");
const message = `Merge dev into main for version: ${data.version}`;

console.log(`⚠️ Merge message: ${message}`);
const confirmMerge = await ask(
  "⚠️ Are you sure you want to squash-merge `dev` into `main`? (y/n)\n"
);
if (confirmMerge.toLowerCase() !== "y") {
  console.log("❌ Merge canceled.");
  process.exit(0);
}

// 🚀 **Merge into main WITHOUT switching branches**
console.log("📦 Squash merging all `dev` changes...");

// 1️⃣ Get latest `main` from remote
console.log("🔄 Switching to `main` branch...");
if (!dryRun) await run(`git checkout main`);

console.log("🔄 Pulling latest `main`...");
if (!dryRun) await run(`git pull origin main`);

// 2️⃣ Merge `dev` into `main` as a single commit
console.log("🔄 Squash merging `dev` into `main`...");
try {
  if (!dryRun) await run(`git merge --squash dev`);
} catch (error) {
  console.error("❌ Merge conflict detected! Resolve manually and re-run the script.");
  process.exit(1);
}

console.log(`📝 Committing merge: "${message}"`);
if (!dryRun) await run(`git commit -m "${message}"`);

// 3️⃣ Push cleanly (no force-push needed)
console.log("🚀 Pushing new main...");
if (!dryRun) await run(`git push origin main`);

// 4️⃣ Switch back to `dev`
console.log("🔄 Switching back to dev...");
if (!dryRun) await run(`git checkout dev`);

console.log("✅ Successfully merged `dev` into `main`!");

// ✅ Dry-run message
if (dryRun) console.log("🟡 Dry-run mode: No changes were made.");
