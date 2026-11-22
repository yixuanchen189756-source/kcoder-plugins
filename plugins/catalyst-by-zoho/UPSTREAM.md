# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/catalystbyzoho/claude-plugin.git (path `.`), commit `9670b79d72fe4923cc845ca0414d009ef3684ccb`
- License: Apache-2.0 (see the license file in this directory, unchanged)

## Changes for KCoder

- commands/switch-dc.md: added a KCoder procedure (do not edit KCoder's managed plugin copy; `kcoder mcp list`, switch off the plugin server on Studio's MCP page, add a user-level `mcp_servers` HTTP entry for the DC, new session + browser login); labelled the `~/.claude/` steps as Claude Code only
- skills/catalyst-zoho-mcp/references/dc-switching.md: added the same KCoder section and a KCoder troubleshooting row
- skills/catalyst-basics/references/setup/claude-code.md: added a KCoder note (plugin already loads `.mcp.json`; custom URL via user-level `mcp_servers`, keep token URLs out of committed settings; tool names carry a server prefix)

## Not adapted

- `${CLAUDE_PLUGIN_ROOT}` is not used by these files; hooks/ not reviewed for KCoder behavior (no findings)
- the exact KCoder disable step relies on Studio's MCP page toggle; there is no `kcoder mcp` CLI subcommand to disable a plugin server
