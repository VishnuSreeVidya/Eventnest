import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const file = join(
  import.meta.dirname,
  "node_modules/@tanstack/router-plugin/dist/esm/core/router-hmr-plugin.js",
);

let content = readFileSync(file, "utf-8");

// Replace the problematic React HMR path that calls compileCodeSplitReferenceRoute
// which triggers "Duplicate declaration 'hot'" in babel-dead-code-elimination
const oldBlock = `\t\t\t\tif (userConfig.target === "react") {
\t\t\t\t\tconst compilerPlugins = getReferenceRouteCompilerPlugins({
\t\t\t\t\t\ttargetFramework: "react",
\t\t\t\t\t\taddHmr: true,
\t\t\t\t\t\thmrStyle
\t\t\t\t\t});
\t\t\t\t\tconst compiled = compileCodeSplitReferenceRoute({
\t\t\t\t\t\tcode,
\t\t\t\t\t\tfilename: normalizedId,
\t\t\t\t\t\tid: normalizedId,
\t\t\t\t\t\taddHmr: true,
\t\t\t\t\t\thmrStyle,
\t\t\t\t\t\thmrRouteId: routeEntry.routeId,
\t\t\t\t\t\tcodeSplitGroupings: [],
\t\t\t\t\t\ttargetFramework: "react",
\t\t\t\t\t\tcompilerPlugins
\t\t\t\t\t});
\t\t\t\t\tif (compiled) {
\t\t\t\t\t\tif (debug) {
\t\t\t\t\t\t\tlogDiff(code, compiled.code);
\t\t\t\t\t\t\tconsole.log("Output:\\n", compiled.code + "\\n\\n");
\t\t\t\t\t\t}
\t\t\t\t\t\treturn compiled;
\t\t\t\t\t}
\t\t\t\t}`;

const newBlock = `\t\t\t\tif (false) {
\t\t\t\t}`;

if (content.includes(oldBlock)) {
  content = content.replace(oldBlock, newBlock);
  writeFileSync(file, content, "utf-8");
  console.log("Patched router-hmr-plugin.js successfully");
} else {
  console.log("Patch already applied or file format changed");
}
