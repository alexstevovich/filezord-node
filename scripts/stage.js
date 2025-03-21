import {ask} from "demi-cmd"
import path from 'path'
import fsys from "demi-fs"
import obj from 'demi-obj'
import nodepkg from 'demi-nodepkg'
import archive from 'demi-archive'


const publish = process.argv.includes("--publish");
const dryRun = process.argv.includes("--dry-run");

await import ('./build.js');

const stagingDir="./staging"
const publishingDir="./publish"
const stagingDirPackageJson = path.join(stagingDir,'package.json')


const archivalDir = process.env.CODE_ARCHIVAL_DIR_V1;
if(!archivalDir){process.exit(1)}

await nodepkg.stage('.', stagingDir)
const pkg = await fsys.readJson(stagingDirPackageJson);
const pkgDir = fsys.getCwdBasename('.');

const releaseArchiveName = `${pkgDir}-${pkg.version}.tar.gz`;
const devArchiveName = `${pkgDir}-${pkg.version}-dev.tar.gz`;

if(pkg.publishAssign)
{
    obj.assign(pkg,pkg.publishAssign)
}
nodepkg.pruneData(pkg)
await fsys.writeJson(stagingDirPackageJson,pkg);

await nodepkg.stage(stagingDir,publishingDir)

if(publish)
{
    const commitMessage = await ask("You are about to publish. 'y' to confirm: ");
    
    await nodepkg.publishWithNpm(publishingDir,true)

    if (commitMessage!='y')
    {
        process.exit(1)
    }
    await nodepkg.publishWithNpm(publishingDir,true)
    await archive.project(".",`${archivalDir}/${devArchiveName}`)
    await nodepkg.archive(publishingDir,path.join(archivalDir,releaseArchiveName))    
}