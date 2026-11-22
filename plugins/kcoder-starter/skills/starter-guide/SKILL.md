---
name: starter-guide
description: Explain how the kcoder-starter plugin is organized and how to build a new KCoder plugin from it. Use when the user asks how to create, structure or validate a KCoder plugin.
---

# KCoder plugin starter guide

Use this skill when the user wants to create or understand a KCoder plugin.

## Plugin layout

A plugin in this marketplace follows the Agent Plugins 1.0.0 layout:

| Path | Purpose |
| --- | --- |
| `plugin.json` | Required manifest. `$schema` must be `https://agent-plugins.org/schemas/1.0.0/plugin.schema.json`; `name` uses lowercase letters, digits, `.` and `-`. |
| `skills/<name>/SKILL.md` | One directory per skill, with `name` and `description` front matter. |
| `mcp.json` | Optional MCP servers. Requires the MCP `$schema` and an `mcpServers` object. |
| `.codex-plugin/plugin.json` | Optional overlay for hooks and display metadata (`interface`). |
| `hooks/hooks.json` | Optional hooks referenced from the overlay. |

## Rules to follow

1. Keep every path inside the plugin directory. Never use `..`, absolute paths or symlinks.
2. In `mcp.json`, refer to bundled files with `${PLUGIN_ROOT}` and to writable state with `${PLUGIN_DATA}`. These are only expanded in `args`, `env` values and `cwd`.
3. Do not put credentials in any manifest. Ask the user to configure secrets through KCoder's credential settings.
4. Hooks execute commands on the user's machine. Keep them minimal and describe exactly what they run.
5. Run `node scripts/validate.mjs` from the marketplace root before publishing.

## Tools from this plugin

The bundled `starter` MCP server provides:

- `starter_echo`: returns the text it receives. Use it to confirm the MCP connection works.
- `starter_plugin_info`: returns this plugin's name and version.

Both tools are read-only and make no network requests.
