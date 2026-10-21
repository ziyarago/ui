#!/usr/bin/env node
import { mkdirSync, writeFileSync, readFileSync, existsSync, appendFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const tpl = f => readFileSync(join(here, '../templates', f), 'utf8');
const cmd = process.argv[2];

if (cmd === 'init') {
  const cwd = process.cwd();
  const wrote = [];
  const mcpPath = join(cwd, '.mcp.json');
  const mcp = existsSync(mcpPath) ? JSON.parse(readFileSync(mcpPath, 'utf8')) : {};
  mcp.mcpServers = { ...(mcp.mcpServers || {}), 'ziyarago-ui': { command: 'npx', args: ['-y', '@ziyarago/ui-mcp'] } };
  writeFileSync(mcpPath, JSON.stringify(mcp, null, 2) + '\n'); wrote.push('.mcp.json');
  for (const f of ['AGENTS.md', 'CLAUDE.md']) {
    const p = join(cwd, f);
    if (existsSync(p) && readFileSync(p, 'utf8').includes('@ziyarago/ui')) continue;
    if (f === 'CLAUDE.md' && !existsSync(p)) continue;
    appendFileSync(p, (existsSync(p) ? '\n' : '') + tpl('agent-rules.md')); wrote.push(f);
  }
  const skill = join(cwd, '.claude/skills/ziyarago-ui/SKILL.md');
  mkdirSync(dirname(skill), { recursive: true }); writeFileSync(skill, tpl('SKILL.md')); wrote.push('.claude/skills/ziyarago-ui/SKILL.md');
  const cursor = join(cwd, '.cursor/rules/ziyarago-ui.mdc');
  mkdirSync(dirname(cursor), { recursive: true }); writeFileSync(cursor, tpl('cursor-rule.mdc')); wrote.push('.cursor/rules/ziyarago-ui.mdc');
  console.log('ziyarago-ui: wrote\n  ' + wrote.join('\n  ') + '\nRestart your AI tool to load the MCP server.');
} else if (cmd === 'help' || cmd === '--help') {
  console.log('ziyarago-ui-mcp            start the MCP server on stdio\nziyarago-ui-mcp init       add .mcp.json, AGENTS.md rules, a Claude skill and a Cursor rule to this project');
} else {
  const { startServer } = await import('./server.mjs');
  await startServer();
}
