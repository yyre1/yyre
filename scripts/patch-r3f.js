import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const r3fPath = path.resolve(__dirname, "../node_modules/@react-three/fiber");

function patchFiles(dir) {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      patchFiles(fullPath);
    } else if (file.endsWith(".js")) {
      let content = fs.readFileSync(fullPath, "utf8");
      if (content.includes("delete child.object.__r3f;")) {
        console.log(`Patching R3F crash in: ${fullPath}`);
        content = content.replace(
          /delete child\.object\.__r3f;/g,
          "if (child && child.object) delete child.object.__r3f;"
        );
        fs.writeFileSync(fullPath, content, "utf8");
      }
    }
  }
}

console.log("Applying React Three Fiber v9 crash patches...");
patchFiles(r3fPath);
console.log("Patches applied successfully!");