#!/usr/bin/env node
// Regenerate the plugin tables in README.md from catalog/plugins.json.
// Usage: node scripts/render-catalog.mjs [--check]
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const catalog = JSON.parse(readFileSync(`${root}catalog/plugins.json`, 'utf8'));
const readmePath = `${root}README.md`;
const readme = readFileSync(readmePath, 'utf8');
const START = '<!-- catalog:start -->';
const END = '<!-- catalog:end -->';
const GROUP_ORDER = ['办公文档', '办公与协作', '数据与数据库', '开发工具', '测试', '安全', '云与部署', '运维与监控', '设计与创意', '学习与研究'];
const CAPABILITY = { skills: '技能', mcp_servers: 'MCP', hooks: 'Hook', commands: '命令', agents: '子代理', apps: '应用' };
const cell = text => String(text ?? '').replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
const short = text => { const t = cell(text); return t.length > 80 ? `${t.slice(0, 77)}…` : t; };

const groups = new Map();
for (const plugin of catalog) {
  if (!groups.has(plugin.group)) groups.set(plugin.group, []);
  groups.get(plugin.group).push(plugin);
}
const order = [...GROUP_ORDER.filter(g => groups.has(g)), ...[...groups.keys()].filter(g => !GROUP_ORDER.includes(g))];
const count = status => catalog.filter(p => p.contentReview?.status === status).length;
const lines = [
  `共收录 ${catalog.length} 个上游插件，全部在 KCoder 中验证为 \`fully_supported\`。其中 ${count('adapted')} 个已针对 KCoder 改编，放在本仓库的 [\`packages\` 分支](https://github.com/yixuanchen189756-source/kcoder-plugins/tree/packages)；其余固定到上游的具体提交。`,
  '',
  `内容审查：${count('clean')} 个未发现其他客户端专属写法，${count('no_change_needed')} 个经人工判断无需修改，${count('adapted')} 个已改编，${count('not_adapted')} 个因许可证未改编（仍可安装，但说明中可能提到 Claude Code 的命令或路径）。`,
  '',
];
lines.push('| 分类 | 数量 |', '| --- | --- |');
for (const g of order) lines.push(`| [${g}](#${g}) | ${groups.get(g).length} |`);
for (const g of order) {
  lines.push('', `### ${g}`, '', '| 插件 | 说明 | 能力 | MCP 测试 | 需要 | 许可证 | 来源 |', '| --- | --- | --- | --- | --- | --- | --- |');
  for (const p of groups.get(g).sort((a, b) => a.name.localeCompare(b.name))) {
    const caps = p.capabilities.map(c => CAPABILITY[c] ?? c).join('、');
    const needs = p.requirements.length ? p.requirements.join('；') : '—';
    const review = p.contentReview?.status;
    const nameCell = review === 'adapted'
      ? `[\`${p.name}\`](${p.packageUrl}/UPSTREAM.md)（已改编）`
      : review === 'not_adapted' ? `\`${p.name}\`（含 Claude 专属说明）` : `\`${p.name}\``;
    const sourceCell = review === 'adapted' ? `[本仓库改编](${p.packageUrl})自 [${p.upstream}](${p.upstreamUrl})` : `[${p.upstream}](${p.upstreamUrl})`;
    const mcp = p.mcpTest?.length ? [...new Set(p.mcpTest.map(t => t.label))].join('；') : '—';
    lines.push(`| ${nameCell} | ${short(p.description)} | ${caps} | ${cell(mcp)} | ${cell(needs)} | ${cell(p.license ?? '未声明')} | ${sourceCell} |`);
  }
}
const body = `${START}\n${lines.join('\n')}\n${END}`;
const start = readme.indexOf(START);
const end = readme.indexOf(END);
if (start < 0 || end < start) throw new Error('README.md is missing the catalog markers');
const next = readme.slice(0, start) + body + readme.slice(end + END.length);
if (process.argv.includes('--check')) {
  if (next !== readme) { console.error('README.md catalog is stale; run node scripts/render-catalog.mjs'); process.exit(1); }
  console.log('README.md catalog is current');
} else {
  writeFileSync(readmePath, next);
  console.log(`rendered ${catalog.length} plugins in ${order.length} groups`);
}
