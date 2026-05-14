import readline from "node:readline"
import { stdin as input, stdout as output } from 'node:process';
import fs from "node:fs";
import path from "node:path";

const isObject = (val: any) => typeof val === "object" && val !== null && !Array.isArray(val);

function compareKeys(base: any, target: any, path = ""): {
     untranslated: number,
     translated: number
} {
     let untranslated = 0, translated = 0;

     if (typeof target !== "object" || target === null) {
          console.error(`❌ Invalid structure at: ${path}`);
          return { untranslated: 0, translated: 0 };
     }

     for (const key in base) {
          const fullPath = path ? `${path}.${key}` : key;
          const baseVal = base[key];

          if (!(key in target)) {
               console.error(`❌ Missing key: ${fullPath}`);
               if (!isObject(baseVal)) untranslated++;
               continue;
          } else if (!isObject(baseVal)) {
               translated++;
          }

          const targetVal = target[key];

          if (typeof targetVal === "string" && targetVal.trim() === "") {
               console.error(`❌ Empty translation: ${fullPath}`);
               if (!isObject(baseVal)) untranslated++;
               translated = Math.max(0, translated - 1);
          }

          if (typeof baseVal !== typeof targetVal) {
               console.warn(`⚠️ Type mismatch at ${fullPath}`);
          }

          if (isObject(baseVal)) {
               const nested = compareKeys(baseVal, targetVal, fullPath);
               untranslated += nested.untranslated;
               translated += nested.translated;
          }
     }

     return { untranslated, translated };
}

interface CheckKeysOptions{
     basePath: string,
     targetPath: string,
     targetLang: string,
     file: string
}
function checkKeys({
     basePath,
     targetPath,
     file,
     targetLang
}: CheckKeysOptions){
     if (!fs.existsSync(targetPath)) {
          console.error(`❌ Missing file: ${targetLang}/${file}`);
          return { untranslated: 0, translated: 0 };
     }

     // Public translations
     const baseJSON = JSON.parse(fs.readFileSync(basePath, "utf-8"));
     const targetJSON = JSON.parse(fs.readFileSync(targetPath, "utf-8"));

     console.log(`\n🔍 Checking: ${file}`);
     return compareKeys(baseJSON, targetJSON, file.replace(".json", ""));
}

function compareLocales(baseLang: string, targetLang: string): {
     untranslated: number,
     translated: number
} {
     const baseDir = path.join(process.cwd(), "public", "locales", baseLang);
     const targetDir = path.join(process.cwd(), "public", "locales", targetLang);

     const baseFiles = fs.readdirSync(baseDir);
     let untranslated = 0, translated = 0
     for (const file of baseFiles) {
          const basePath = path.join(baseDir, file);
          const targetPath = path.join(targetDir, file);
          const obj = checkKeys({ basePath, targetPath, targetLang, file });
          untranslated+=obj.untranslated;
          translated+=obj.translated;
     }
     // System tray translations
     const sysTrayObj = checkKeys({
          basePath: path.join(process.cwd(), "src-tauri", "assets", "i18n", `${baseLang}.json`),
          targetPath: path.join(process.cwd(), "src-tauri", "assets", "i18n", `${targetLang}.json`),
          targetLang, file: `sys-tray.json (src-tauri/assets/i18n/${targetLang}.json)`
     })
     untranslated+=sysTrayObj.untranslated;
     translated+=sysTrayObj.translated;
     return {untranslated, translated}
}

function printOutput(lang: string){
     try {
          const {untranslated, translated} = compareLocales("en", lang);
          const total = translated + untranslated;
          const percentage = total > 0 ? Math.min(100,Math.floor((translated / total) * 100)) : 0;
          console.log("\n✅ Done");
          console.log("- - - - - - - - - -");
          console.log(`Translated: ${translated} strings`);
          console.log(`Untranslated: ${untranslated} strings`);
          console.log(`Percentage: ${Math.round(percentage)}%`)
     } catch (err) {
          console.error("❌ Error:", err);
     }
}

const langCodes = process.argv.slice(2)

if(langCodes.length > 0) {
     for(const lang of langCodes){
          console.log(`\n🌍 Checking ${lang}...`)
          printOutput(lang)
     }
} else {
     const rl = readline.createInterface({ input, output });
     rl.question("Enter a lang code (e.g. es, pl, hy, or ru): ",lang=>{
          printOutput(lang)
          rl.close();
     })
}