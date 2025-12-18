import fs from "fs";
import path from "path";
import dotenv from "dotenv";

let loaded = false;

export function loadCharacterPrompts() {
  if (loaded) return;

  const envDir = path.join(process.cwd(), "env", "characters");
  const files = fs.readdirSync(envDir);

  files.forEach(file => {
    const filePath = path.join(envDir, file);
    dotenv.config({ path: filePath });
  });

  loaded = true;
}
