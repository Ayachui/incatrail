/**
 * next/og (bundled @vercel/og) resolves its wasm/font assets with
 * `path.join(import.meta.url, "../file")`, which produces an invalid file URL on
 * Windows and breaks `next build` / OG image rendering. Fixed upstream in
 * Next.js 15.3; this patch can be removed together with the postinstall hook
 * once the project moves to that version.
 */
import { readFile, writeFile } from "node:fs/promises";

const TARGET = "node_modules/next/dist/compiled/@vercel/og/index.node.js";
const BROKEN = /fileURLToPath\(join\(import\.meta\.url,\s*"\.\.\/([^"]+)"\)\)/g;

let source;
try {
  source = await readFile(TARGET, "utf8");
} catch {
  process.exit(0);
}

const patched = source.replace(
  BROKEN,
  (_match, file) => `fileURLToPath(new URL("./${file}", import.meta.url))`,
);

if (patched === source) {
  process.exit(0);
}

await writeFile(TARGET, patched);
console.log("patched @vercel/og asset resolution for cross-platform builds");
