import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'docs/map');
const runtime = path.join(root, '.tools/understand-anything');
if (!fs.existsSync(path.join(output, 'index.html'))) throw new Error('Build dashboard first.');
for (const name of ['knowledge-graph.json', 'meta.json', 'config.json', 'source-evidence.json']) {
  fs.copyFileSync(path.join(root, '.ua', name), path.join(output, name));
}
fs.writeFileSync(path.join(output, 'domain-graph.json'), 'null\n');
fs.writeFileSync(path.join(output, 'diff-overlay.json'), '{"changedNodeIds":[],"affectedNodeIds":[]}\n');
fs.copyFileSync(path.join(root, 'LICENSE'), path.join(output, 'LICENSE'));
fs.copyFileSync(path.join(runtime, 'LICENSE'), path.join(output, 'UNDERSTAND-ANYTHING-LICENSE.txt'));
fs.copyFileSync(path.join(root, 'THIRD_PARTY_NOTICES.md'), path.join(output, 'THIRD_PARTY_NOTICES.md'));
// Preserve available copyright/license texts for the installed dependency tree.
const licenses = [], seen = new Set(), missing = [];
const store = path.join(runtime, 'node_modules/.pnpm');
for (const dir of fs.readdirSync(store).sort()) {
  const modules = path.join(store, dir, 'node_modules');
  if (!fs.existsSync(modules)) continue;
  for (const name of fs.readdirSync(modules).sort()) {
    const base = path.join(modules, name);
    const candidates = name.startsWith('@') ? fs.readdirSync(base).map(n => path.join(base, n)) : [base];
    for (const packageDir of candidates) {
      const manifest = path.join(packageDir, 'package.json');
      if (!fs.existsSync(manifest)) continue;
      const pkg = JSON.parse(fs.readFileSync(manifest, 'utf8'));
      const key = `${pkg.name}@${pkg.version}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const files = fs.readdirSync(packageDir).filter(f => /^(license|licence|copying|notice)([.-]|$)/i.test(f) && fs.statSync(path.join(packageDir, f)).isFile());
      let text = `\n${'='.repeat(72)}\n${key}\nLicense: ${JSON.stringify(pkg.license ?? 'not declared')}\n`;
      for (const f of files) text += `\n--- ${f} ---\n${fs.readFileSync(path.join(packageDir, f), 'utf8')}\n`;
      if (!files.length) {
        missing.push(key);
        text += '\nNo top-level license file shipped. Preserve the package metadata and README notices below.\n';
        text += JSON.stringify({author:pkg.author,contributors:pkg.contributors,repository:pkg.repository,license:pkg.license},null,2)+'\n';
        for (const f of fs.readdirSync(packageDir).filter(f => /^readme([.-]|$)/i.test(f) && fs.statSync(path.join(packageDir,f)).isFile())) {
          text += `\n--- ${f} (includes any upstream attribution) ---\n${fs.readFileSync(path.join(packageDir,f),'utf8')}\n`;
        }
      }
      licenses.push(text);
    }
  }
}
fs.writeFileSync(path.join(output, 'THIRD_PARTY_LICENSES.txt'), 'Dependency notices collected from the pinned upstream installation. Includes build dependencies.\n' + licenses.join('\n'));
fs.writeFileSync(path.join(root, '.ua/license-audit.json'), JSON.stringify({packages: seen.size, packagesWithoutTopLevelLicenseFile: missing}, null, 2) + '\n');
const htmlPath = path.join(output, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace('<html lang="en">', '<html lang="zh-CN">');
html = html.replace(/<title>.*?<\/title>/s, '<title>Any Retry 项目地图 · 设计与文档</title>');
html = html.replace(/<style>#any-retry-notice[\s\S]*?<\/style>/, '');
  html = html.replace('</head>', '<style>#any-retry-notice{box-sizing:border-box;flex:none;padding:8px 12px;background:#172b3a;color:#fff;font:12px/1.5 system-ui;display:flex;gap:12px;flex-wrap:wrap}#any-retry-notice a{color:#9ee8c4}html,body{height:100%;overflow:hidden}body{margin:0;display:flex;flex-direction:column}#root{flex:1;min-height:0}#root>div{height:100%!important}</style></head>');
if (!html.includes('id="any-retry-notice"')) {
  html = html.replace('<body>', '<body><aside id="any-retry-notice" aria-label="项目状态与许可"><strong>Any Retry｜文档与设计地图 · 重试引擎尚未实现</strong><a href="https://github.com/YHonc/any-retry">项目与 README</a><a href="https://github.com/Egonex-AI/Understand-Anything">Powered by Understand-Anything</a><a href="UNDERSTAND-ANYTHING-LICENSE.txt">上游 MIT</a><a href="THIRD_PARTY_LICENSES.txt">第三方许可</a></aside>');
}
fs.writeFileSync(htmlPath, html.replace(/\r+\n/g, '\n').replace(/\r/g, '\n'));
fs.writeFileSync(path.join(root, 'docs/.nojekyll'), '');
console.log(`Packaged static map; preserved notices for ${seen.size} packages. ${missing.length} packages have no top-level license file (see .ua/license-audit.json).`);
