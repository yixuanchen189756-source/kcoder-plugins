# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/spotify/confidence-ai-plugins.git (path `.`), commit `f416826fde819978ab90f1d7ae27513667aa5d0f`
- License: Apache-2.0 (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/*/SKILL.md (analyze-project, explore-metric, instrument-events, migrate-eppo, migrate-optimizely, migrate-posthog, migrate-statsig, onboard-confidence, setup-warehouse, setup-warehouse-bigquery, -databricks, -redshift, -snowflake): rewrote all 134 hard-coded `mcp__<server>__<tool>` names as tool + server references (prose: 'the `T` tool from the `S` MCP server'; tables: '`T` (`S` MCP server)'; code samples: `S/T(...)`) and added a KCoder note explaining the notation and KCoder's plugin MCP naming
- skills/migrate-*/SKILL.md: KCoder note also explains that the `confidence` server named there is the Confidence flags server that this plugin ships as `confidence-flags`
- skills/{analyze-project,explore-metric,instrument-events,migrate-*}/SKILL.md: replaced 13 `claude mcp add ... --transport http --url ...` blocks with KCoder `mcp_servers` HTTP entries for `~/.config/kcoder/settings.json` / `.kcoder/settings.json` (original command kept as the Claude Code equivalent); for bundled confidence-flags/confidence-docs, first check the server is enabled and authorized
- skills/onboard-confidence/SKILL.md, onboard-confidence-dry-run/SKILL.md, setup-warehouse/SKILL.md: replaced Claude Code `/mcp` -> Authenticate instructions and the `<local-command-caveat>` explanation with KCoder MCP authorization (KCoder Studio MCP management page; `/mcp verbose` to check registration); 'inside Claude Code' -> 'inside KCoder'; replaced the `.claude/skills/onboard-confidence` example path with a neutral one

## Not changed

- `.claude/plans/*.md` plan-file paths used across skills/commands are a self-contained plugin data location, not Claude config; left unchanged
- skills/onboard-confidence/SKILL.md tells the model to call Bash with `dangerouslyDisableSandbox: true`, a Claude Code-only parameter that KCoder's `bash` tool does not define; left unchanged because the KCoder sandbox escalation path depends on the session's permission settings
- test-fixtures READMEs and migrate-optimizely mention 'Claude Code / Cursor' UI as examples; left unchanged
- KCoder OAuth for HTTP MCP servers is completed from KCoder Studio's MCP management page; REPL-only users have no in-terminal 'Authenticate' action equivalent to Claude Code's `/mcp`
