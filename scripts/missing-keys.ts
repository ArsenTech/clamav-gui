import readline from "node:readline"
import { stdin as input, stdout as output } from 'node:process';
import fs from "node:fs";
import path from "node:path";

const isObject = (val: any) =>
  typeof val === "object" && val !== null && !Array.isArray(val);

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

          if (!(key in target)) {
               console.error(`❌ Missing key: ${fullPath}`);
               untranslated++;
               continue;
          } else {
               translated++;
          }

          const baseVal = base[key];
          const targetVal = target[key];

          if (typeof targetVal === "string" && targetVal.trim() === "") {
               console.error(`❌ Empty translation: ${fullPath}`);
               untranslated++;
               translated--;
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

          if (!fs.existsSync(targetPath)) {
               console.error(`❌ Missing file: ${targetLang}/${file}`);
               continue;
          }

          const baseJSON = JSON.parse(fs.readFileSync(basePath, "utf-8"));
          const targetJSON = JSON.parse(fs.readFileSync(targetPath, "utf-8"));

          console.log(`\n🔍 Checking: ${file}`);
          const obj = compareKeys(baseJSON, targetJSON, file.replace(".json", ""));
          untranslated+=obj.untranslated;
          translated+=obj.translated;
     }
     return {untranslated, translated}
}

function printOutput(lang: string){
     try {
          const {untranslated, translated} = compareLocales("en", lang);
          const total = translated + untranslated;
          const percentage = total > 0 ? (translated / total) * 100 : 0;
          console.log("\n✅ Done");
          console.log("- - - - - - - - - -");
          console.log(`Translated: ${translated} strings`);
          console.log(`Untranslated: ${untranslated} strings`);
          console.log(`Percentage: ${Math.round(percentage)}%`)
     } catch (err) {
          console.error("❌ Error:", err);
     }
}

const langCode = process.argv[2];

if(langCode) {
     printOutput(langCode)
} else {
     const rl = readline.createInterface({ input, output });
     rl.question("Enter a lang code (e.g. es, pl, hy, or ru): ",lang=>{
          printOutput(lang)
          rl.close();
     })
}