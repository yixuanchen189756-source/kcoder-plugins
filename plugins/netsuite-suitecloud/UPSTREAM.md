# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/oracle/netsuite-suitecloud-sdk.git (path `anthropic/netsuite-suitecloud`), commit `23793a10a9bb557c684c5cb8a97f926eb3463f12`
- License: The Universal Permissive License (UPL), Version 1.0 (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/netsuite-sdf-safe-guide/SKILL.md, quick-reference.md, skills/netsuite-suitescript-learning/SKILL.md, skills/netsuite-suitescript-upgrade/SKILL.md: after each Claude Code `.claude/settings.local.json` `Skill(...)` example, added that KCoder makes installed plugin skills available, does not use those entries, and that default use is requested in the project's AGENTS.md
- skills/netsuite-sdf-safe-guide/quick-reference.md: added a KCoder skill install example (`~/.config/kcoder/skills/` or `.kcoder/skills/`)
- skills/netsuite-sdf-safe-guide/SKILL.md: `~/.claude/netsuite-connector-config.json` version lookup now says KCoder does not create the file and falls back to the 2026.1 default unless an older version is stated
- skills/netsuite-sdf-safe-guide/references/appendices/appendix-perf-queries.md: noted the connector config is absent in KCoder and that KCoder MCP tool names do not follow `mcp__<prefix>__`; use `ns_runCustomSuiteQL`/`runCustomSuiteQL` from the configured NetSuite MCP server

## Not adapted

- appendix-perf-queries.md keeps `~/.claude/docs/deployments/perf-baseline.json` and `governance-trend.json` as data file locations shared with the upstream deploy flow; not relocated
- SKILL.md line about the CustomTool format still refers to `~/.claude/netsuite-connector-config.json` (same fallback applies)
