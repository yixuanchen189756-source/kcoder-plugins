# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/anthropics/claude-plugins-official.git (path `plugins/claude-code-setup`), commit `73c8cf3ea7e296057b467990f2f5d61b4c922260`
- License: Apache-2.0 (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/claude-automation-recommender/SKILL.md: added a "Running in KCoder" mapping table (AGENTS.md/KCODER.md, .kcoder/skills, hooks in .kcoder/settings.json with lowercase exact matchers, permission_rules, kcoder mcp add/list/test, headless `kcoder "PROMPT"` with --json, no project agents dir -> spawn_agent, kcoder plugin install); Phase 1 also inspects .kcoder/, AGENTS.md, KCODER.md; template, headless and permissions sections point to KCoder equivalents
- skills/claude-automation-recommender/references/hooks-patterns.md: KCoder hook placement and matcher note
- skills/claude-automation-recommender/references/mcp-servers.md: KCoder MCP add/diagnose note next to `claude --mcp-debug`
- skills/claude-automation-recommender/references/skills-reference.md: KCoder skill locations, relative script paths and plugin install note
- skills/claude-automation-recommender/references/subagent-templates.md: KCoder has no project agents directory; recommend role/prompt for spawn_agent; existing text labelled as Claude Code
- skills/claude-automation-recommender/references/plugins-reference.md: KCoder plugin install command next to /plugin commands

## Notes

- The plugin's purpose and name remain Claude Code-oriented (description, README); KCoder equivalents for some features (output styles, /plugin info, slash-command subagents, `context: fork`, `disable-model-invocation`) were not verified and are not mapped
- KCoder hook/permission field details beyond `hooks` matcher shape and `permission_rules` (tool, input_pattern, action) were not verified against a running KCoder
