import {run} from "demi-cmd"
import fsys from "demi-fs"
import nodepkg from 'demi-nodepkg'
import { toOmniExec } from 'omniscript'
import { filezordProjectExec } from "filezord"
import { applyShipmastTemplateExec } from "shipmast"

await run(`npm pkg fix`)
applyShipmastTemplateExec('src/**/*.js')
await run(`npx prettier --write ./src/`)
await run(`npx eslint --fix ./src/`)
//await toOmniExec('src/','dist/')
const pkg = await fsys.readJson('./package.json')
nodepkg.sortData(pkg);
await fsys.writeJson('./package.json',pkg);
await filezordProjectExec(".")
await run(`npm run test`)