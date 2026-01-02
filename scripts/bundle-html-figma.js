// Bundle html-figma/browser for use in ui.html
import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'fs';

// First, bundle the library
const result = await build({
  entryPoints: ['node_modules/html-figma/browser/index.js'],
  bundle: true,
  format: 'iife',
  globalName: 'HtmlFigma',
  write: false,
  platform: 'browser',
});

const bundledCode = result.outputFiles[0].text;
console.log('Bundled html-figma/browser, size:', bundledCode.length, 'bytes');

// Now inline it into ui.html
const uiHtmlPath = 'src/claude_mcp_plugin/ui.html';
let uiHtml = readFileSync(uiHtmlPath, 'utf-8');

// Find and replace the placeholder script
const placeholderRegex = /<!-- HTML-to-Figma browser library \(inlined\) -->\s*<script>[\s\S]*?<\/script>/;

if (placeholderRegex.test(uiHtml)) {
  uiHtml = uiHtml.replace(
    placeholderRegex,
    `<!-- HTML-to-Figma browser library (inlined) -->
    <script>
${bundledCode}
    </script>`
  );
  writeFileSync(uiHtmlPath, uiHtml);
  console.log('Inlined html-figma library into ui.html');
} else {
  console.error('Could not find placeholder in ui.html');
  process.exit(1);
}
