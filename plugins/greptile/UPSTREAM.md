# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/greptileai/skills.git (path `plugins/greptile`), commit `4a13eb124ab175d018869fe7cc4d203e374571dc`
- License: MIT (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/login/SKILL.md, skills/review/SKILL.md: `${CLAUDE_PLUGIN_ROOT}/scripts/greptile.mjs` -> `../../scripts/greptile.mjs` resolved from the skill base directory to an absolute path; replaced the Codex-only path note
- skills/login/SKILL.md: MCP sign-in now points at KCoder's MCP sign-in (Studio MCP page; `/mcp` in Claude Code); bash timeout wording names the `timeout` parameter
- skills/review/SKILL.md: `/greptile:login` -> this plugin's `login` skill; MCP review tools named with their `greptile` server; 'Claude Code runs this without a TTY' -> 'The agent runs ...'

## Not adapted

- frontmatter `allowed-tools` left unchanged (metadata, not rewritten); it still lists Claude-style `mcp__...` names that will not match KCoder's generated MCP tool names if a KCoder path enforces that list (also contains `Bash(node ${CLAUDE_PLUGIN_ROOT}/...)`)
