import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const graph = JSON.parse(fs.readFileSync(path.join(root, '.ua/knowledge-graph.json'), 'utf8'));
const schemaPath = path.join(root, '.tools/understand-anything/understand-anything-plugin/packages/core/dist/schema.js');
const { KnowledgeGraphSchema, validateGraph } = await import(pathToFileURL(schemaPath));
KnowledgeGraphSchema.parse(graph);
const parsed = validateGraph(graph);
assert(parsed.success && parsed.issues.length === 0, JSON.stringify(parsed.issues));
const ids = new Set();
for (const n of graph.nodes) {
  assert(!ids.has(n.id), `Duplicate node ${n.id}`); ids.add(n.id);
  assert(n.tags.length && n.summary.trim());
  assert(['document', 'concept'].includes(n.type), `Unexpected implementation node: ${n.id}`);
  const source = path.resolve(root, n.filePath);
  assert(source.startsWith(root + path.sep) && fs.existsSync(source), `Missing source ${n.filePath}`);
  const lines = fs.readFileSync(source, 'utf8').split(/\r?\n/).length;
  assert(n.lineRange && n.lineRange[0] >= 1 && n.lineRange[1] >= n.lineRange[0] && n.lineRange[1] <= lines, `Invalid evidence range ${n.id}`);
  if (n.type === 'concept') assert(n.tags.some(t => /待实现|已确认|已确定|建议|设计/.test(t)), `Missing status ${n.id}`);
}
const connected = new Set();
for (const e of graph.edges) {
  assert(ids.has(e.source) && ids.has(e.target), 'Dangling edge');
  assert(['documents', 'related'].includes(e.type), `Unproven runtime relation ${e.type}`);
  connected.add(e.source); connected.add(e.target);
}
const assigned = new Set();
for (const l of graph.layers) for (const id of l.nodeIds) {
  assert(ids.has(id) && !assigned.has(id), `Invalid layer membership ${id}`); assigned.add(id);
}
for (const id of ids) assert(assigned.has(id) && connected.has(id), `Unassigned/orphan ${id}`);
for (const s of graph.tour) for (const id of s.nodeIds) assert(ids.has(id), 'Invalid tour reference');
const evidence = JSON.parse(fs.readFileSync(path.join(root, '.ua/source-evidence.json'), 'utf8'));
const { createHash } = await import('node:crypto');
for (const entry of evidence.files) {
  const actual = createHash('sha256').update(fs.readFileSync(path.join(root, entry.path), 'utf8').replace(/\r\n/g, '\n')).digest('hex');
  assert.equal(actual, entry.sha256, `Source changed since graph review: ${entry.path}. Regenerate/review the graph.`);
}
console.log(`PASS: upstream schema; ${ids.size} nodes; ${graph.edges.length} edges; ${graph.layers.length} layers; ${graph.tour.length} tour steps; source references and hashes verified.`);
