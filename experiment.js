import { filezordDir } from "./src/index.js";
import fs from "fs/promises";

fs.writeFile(".zord", await filezordDir("."), "utf-8");
