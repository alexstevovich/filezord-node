import {run} from "demi-cmd"
import git from "demi-git"
import fsys from "demi-fs"

const USER_NAME = 'Alex Stevovich'
const USER_EMAIL = "alex.stevovich@gmail.com"
await git.setLocalUser(".",USER_NAME, USER_EMAIL)
