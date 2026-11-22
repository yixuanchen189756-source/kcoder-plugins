# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/Snowflake-Labs/snowflake-ai-kit.git (path `plugins/cortex-code`), commit `e2a3cbb45a9a62b5648266c5777c1b2edb3f8579`
- License: Apache-2.0 (no top-level license file is included in this installed copy; see the upstream repository. Any license files present are unchanged)

## Changes for KCoder

- skills/cortex-setup/SKILL.md: the Snowflake MCP conflict check now reads KCoder's `~/.config/kcoder/settings.json` `mcp_servers` array instead of `~/.claude/settings.json` `mcpServers`; the remediation steps use `kcoder mcp list` / `kcoder mcp remove` and restarting KCoder; `${CLAUDE_PLUGIN_ROOT}` -> `../..` with a path-resolution note; the conflict condition also accepts `CONFLICT:` output because the script's bare `except` swallows `sys.exit(1)`
- skills/cortex-run/SKILL.md: `${CLAUDE_PLUGIN_ROOT}` -> `../..` (8 occurrences) with a path-resolution note
- skills/cortex-router/SKILL.md: `${CLAUDE_PLUGIN_ROOT}` -> `../..` (6 occurrences) with a path-resolution note

## Not adapted

- The router skill depends on the plugin's UserPromptSubmit/SessionStart hooks (hooks/hooks.json) and its script output `route: claude`; skill text still says to stay in 'Claude Code' for non-Snowflake work, which reads as 'handle it yourself' in KCoder
- The conflict check only inspects user-level KCoder settings, not project `.kcoder/settings.json` or plugin-provided MCP servers
- The skills reference LICENSE-SKILLS.md, which is not present in this installed copy

The license file was copied unchanged from the upstream repository root at the same commit.
