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
      let changed = false;

      // Fix 1: delete child.object.__r3f
      if (content.includes("delete child.object.__r3f;")) {
        console.log(`Patching delete crash in: ${fullPath}`);
        content = content.replace(
          /delete child\.object\.__r3f;/g,
          "if (child && child.object) delete child.object.__r3f;"
        );
        changed = true;
      }

      // Fix 2: child.object.type check in dispose logic
      if (content.includes("child.object.type !== 'Scene'")) {
        console.log(`Patching dispose crash in: ${fullPath}`);
        content = content.replace(
          /child\.object\.type !== 'Scene'/g,
          "(child.object && child.object.type !== 'Scene')"
        );
        changed = true;
      }
      
      // Fix 3: disposeOnIdle(child.object)
      if (content.includes("disposeOnIdle(child.object)")) {
        console.log(`Patching disposeOnIdle crash in: ${fullPath}`);
        content = content.replace(
          /disposeOnIdle\(child\.object\)/g,
          "if (child.object) disposeOnIdle(child.object)"
        );
        changed = true;
      }

      // Fix 4: Ignore data- and aria- attributes in applyProps
      // This prevents R3F from trying to pierce props like "data-dyad-name"
      if (content.includes("if (RESERVED_PROPS.includes(prop)) continue;")) {
        console.log(`Patching applyProps data-attribute crash in: ${fullPath}`);
        content = content.replace(
          /if \(RESERVED_PROPS\.includes\(prop\)\) continue;/g,
          "if (RESERVED_PROPS.includes(prop) || prop.startsWith('data-') || prop.startsWith('aria-')) continue;"
        );
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, "utf8");
      }
    }
  }
}

console.log("Applying enhanced React Three Fiber v9 crash patches...");
patchFiles(r3fPath);
console.log("Patches applied successfully!");