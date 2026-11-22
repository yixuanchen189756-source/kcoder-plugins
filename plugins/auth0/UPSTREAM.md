# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/auth0/agent-skills.git (path `plugins/auth0`), commit `7b3821d533430eef35fd7406a87b7b8d02302bdf`
- License: Apache-2.0 (no top-level license file is included in this installed copy; see the upstream repository. Any license files present are unchanged)

## Changes for KCoder

- skills/auth0/references/feature-custom-domains/index.md: added KCoder Cloudflare MCP setup (http `mcp_servers` entry in `~/.config/kcoder/settings.json`, restart, browser authorization in KCoder) next to the `claude mcp add` command in the DNS tier list and the Cloudflare pre-flight message; the pre-flight no longer assumes a Claude Code session

## Not adapted

- No license file is present in this installed copy; see the upstream repository

The license file was copied unchanged from the upstream repository root at the same commit.
