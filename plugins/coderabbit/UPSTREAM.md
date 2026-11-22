# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/coderabbitai/skills.git (path `.`), commit `45bd1ae2c471cd861b8b6903f7dcab7c57aa0e59`
- License: MIT (see the license file in this directory, unchanged)

## Changes for KCoder

- commands/setup.md: added KCoder MCP sign-in guidance (Studio MCP page, `kcoder mcp list`) next to the Claude Code `/mcp` line
- packaging/mcp/skills/setup/SKILL.md: no change; it is the template for an independently assembled Claude-native package (plugin-qualified hook and `mcp__plugin_coderabbit_coderabbit__start_code_review`), is not part of this plugin's loaded `skills/`, and is Claude-specific by design

## Not adapted

- packaging/mcp/** remains Claude Code-specific (hook-based local review keyed on a Claude plugin-qualified MCP tool name)
