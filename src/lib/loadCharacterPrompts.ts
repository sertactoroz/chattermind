import fs from "fs";
import path from "path";
import dotenv from "dotenv";

let loaded = false;

export function loadCharacterPrompts() {
  // Skip if already loaded
  if (loaded) return;

  try {
    const envDir = path.join(process.cwd(), "env", "characters");

    // Check if directory exists
    if (!fs.existsSync(envDir)) {
      console.warn(`⚠️ Character prompts directory not found: ${envDir}`);
      console.warn('⚠️ Skipping character prompt loading. Using environment variables only.');
      loaded = true;
      return;
    }

    // Read directory
    const files = fs.readdirSync(envDir);

    // Check if directory is empty
    if (files.length === 0) {
      console.warn('⚠️ No character prompt files found in env/characters');
      loaded = true;
      return;
    }

    // Load each .env file
    files.forEach(file => {
      // Only load .env files
      if (!file.endsWith('.env')) {
        return;
      }

      const filePath = path.join(envDir, file);
      
      try {
        dotenv.config({ path: filePath });
        console.log(`✅ Loaded character prompts from: ${file}`);
      } catch (fileError) {
        console.error(`❌ Failed to load ${file}:`, fileError);
      }
    });

    loaded = true;
    console.log('✅ Character prompts loading completed');
  } catch (error) {
    console.error('❌ Error in loadCharacterPrompts:', error);
    // Don't throw - let the app continue with env variables
    loaded = true;
  }
}
