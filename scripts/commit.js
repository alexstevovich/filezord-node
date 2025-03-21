import { run, ask } from "demi-cmd";
import git from "demi-git";

function getArg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return false;
  return process.argv[index + 1] || true;
}
const dryRun = process.argv.includes('--dry-run');


async function ensureOnDev() {
  const currentBranch = await git.getBranch(".");
  if (currentBranch !== "dev") {
    console.log("🚨 You must be on `dev` to commit. Switching...");
    await run(`git switch dev`);
  }
}

await ensureOnDev();
  
  console.log("Current branch: "+await git.getBranch('.'));
  
  const commitMessage = await ask("✏️ Commit message: ");
  
  console.log("🚀 Running Git operations...");
  await run(`git add . ${dryRun ? "--dry-run" : ""}`);
  await run(`git commit -m "${commitMessage}" ${dryRun ? "--dry-run" : ""}`);
  await run(`git push origin dev ${dryRun ? "--dry-run" : ""}`);
  
  console.log("✅ Pushed to `dev`");