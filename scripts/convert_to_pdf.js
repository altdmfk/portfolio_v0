import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { marked } from 'marked';

async function generatePdf() {
  const mdPath = path.resolve('docs/Verification_v2.md');
  let md = fs.readFileSync(mdPath, 'utf8');

  // Convert all local markdown images to embedded Base64 Data URIs
  md = md.replace(/!\[(.*?)\]\((\.\.\/IMG\/.*?\.png)\)/g, (match, alt, imgRelPath) => {
    const imgAbsPath = path.resolve('docs', imgRelPath);
    if (fs.existsSync(imgAbsPath)) {
      const b64 = fs.readFileSync(imgAbsPath).toString('base64');
      return `![${alt}](data:image/png;base64,${b64})`;
    }
    return match;
  });

  const bodyHtml = marked.parse(md);

  const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>Passkey 아키텍처 및 과제 검증 제출서 (Verification Document v2)</title>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Malgun Gothic', Roboto, sans-serif;
    color: #1f2328;
    line-height: 1.6;
    padding: 40px;
    max-width: 900px;
    margin: 0 auto;
    font-size: 14px;
  }
  h1 { font-size: 24px; border-bottom: 2px solid #d0d7de; padding-bottom: 8px; margin-top: 20px; color: #0969da; }
  h2 { font-size: 19px; border-bottom: 1px solid #d0d7de; padding-bottom: 6px; margin-top: 26px; color: #1f2328; }
  h3 { font-size: 16px; margin-top: 20px; color: #0969da; }
  h4 { font-size: 14px; margin-top: 18px; color: #1f2328; }
  p { margin: 8px 0; }
  ul, ol { padding-left: 24px; margin: 8px 0; }
  li { margin-bottom: 4px; }
  table { border-collapse: collapse; width: 100%; margin: 16px 0; font-size: 12.5px; }
  th, td { border: 1px solid #d0d7de; padding: 7px 10px; text-align: left; }
  th { background-color: #f6f8fa; font-weight: 600; color: #1f2328; }
  tr:nth-child(even) { background-color: #fcfcfc; }
  code { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; background-color: #eff1f3; padding: 2px 5px; border-radius: 4px; font-size: 85%; }
  pre { background-color: #f6f8fa; padding: 12px; border-radius: 6px; overflow-x: auto; font-size: 11.5px; border: 1px solid #d0d7de; line-height: 1.45; }
  pre code { background-color: transparent; padding: 0; }
  img { max-width: 95%; height: auto; display: block; margin: 14px auto; border: 1px solid #d0d7de; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.08); }
  hr { border: 0; height: 1px; background: #d0d7de; margin: 24px 0; }
  
  @page {
    size: A4;
    margin: 15mm;
  }
  @media print {
    body { padding: 0; max-width: 100%; }
    h1, h2, h3, h4 { page-break-after: avoid; }
    img { page-break-inside: avoid; }
    table { page-break-inside: avoid; }
    pre { page-break-inside: avoid; }
  }
</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;

  const htmlPath = path.resolve('docs/Verification_v2.html');
  fs.writeFileSync(htmlPath, fullHtml, 'utf8');

  // Try Chrome first, then Edge
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

  const pdfPath = path.resolve('docs/Verification_v2.pdf');
  const cmd = `"${browserPath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfPath}" --no-pdf-header-footer "${htmlPath}"`;

  console.log(`Converting to PDF using: ${browserPath}...`);
  execSync(cmd);

  const stats = fs.statSync(pdfPath);
  console.log(`[SUCCESS] PDF generated at: ${pdfPath}`);
  console.log(`File Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
}

generatePdf().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
