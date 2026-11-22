# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/wingspanHQ/mcp-claude-plugin.git (path `.`), commit `7f99cb3d1789a91390fa7abf1571328736b5e0a6`
- License: MIT (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/finding-contractors/SKILL.md: ${CLAUDE_PLUGIN_ROOT}/skills/finding-contractors/requirement-types.md -> requirement-types.md in this skill's directory
- skills/using-wingspan-tools/SKILL.md: ${CLAUDE_PLUGIN_ROOT} glossary path -> glossary.md in this skill's directory; tool-list note says the mcp__plugin_wingspan_wingspan__ prefix is Claude Code's and KCoder uses its own prefix
- skills/connect/SKILL.md and skills/troubleshooting-connection/SKILL.md: KCoder re-authorization via the MCP management page in KCoder Studio; status via /mcp verbose or kcoder mcp list
- README.md: KCoder install and sign-in note

## Notes

- Whether KCoder honors the plugin .mcp.json `oauth` block (scopes, authServerMetadataUrl) was not verified
