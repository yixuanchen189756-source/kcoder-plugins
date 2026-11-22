# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/datadog-labs/claude-code-plugin.git (path `.`), commit `a1603119c813f528b2d925a0ccadd73bf930550b`
- License: Apache-2.0 (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/ddsetup/SKILL.md: `${CLAUDE_PLUGIN_DATA}` -> `<PLUGIN_DATA>` with a definition (KCoder plugin store data dir, normally `~/.config/kcoder/plugin_store/data/<marketplace-id>/datadog/`; skip saving if absent); added KCoder steps (new session, Studio MCP page **Authorize**) next to `/reload-plugins` and `/mcp`; KCoder server id `plugin.datadog@<marketplace-id>.mcp`
- skills/ddtoolsets/SKILL.md: same `<PLUGIN_DATA>` rewrite, KCoder confirm steps and server id
- skills/ddconfig/SKILL.md: KCoder alternatives (Studio **Sign out** / **Authorize**, new session) for each `/mcp` authentication step; server id
- skills/{ddsetup,ddconfig,ddtoolsets}/references/mcp-settings.md: added KCoder server id
- skills/ddviz/SKILL.md: `${CLAUDE_PLUGIN_ROOT}/skills/ddviz/scripts/*.sh` -> `<SKILL_BASE>/scripts/*.sh` with `<PLUGIN_ROOT>` passed to status.sh; explained absolute paths
- README.md: KCoder install and key-auth environment notes
