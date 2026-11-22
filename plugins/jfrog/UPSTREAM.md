# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/jfrog/claude-plugin.git (path `.`), commit `9b1f8f6c883522a87502e5155abd593a8befe3c5`
- License: Apache-2.0 (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/jfrog-mcp-management/references/harness-kcoder.md (new): KCoder harness file for the plugin's per-harness design (config files `.kcoder/settings.json` / `~/.config/kcoder/settings.json`, `mcp_servers` array entry shape, `policy.env_vars` secret forwarding, Gateway HTTP entry, enable via `mcp_disabled_servers`, new-session restart, `kcoder mcp list` / `kcoder mcp test` verify, remove cleanup)
- skills/jfrog-mcp-management/references/harness-common.md: added a KCoder routing row and excluded KCoder from the VS Code row so detection stays non-overlapping
- skills/jfrog-mcp-management/SKILL.md: listed `harness-kcoder.md` among the harness files
- skills/jfrog-mcp-management/references/persisting-env-vars.md: added how KCoder picks up exported variables (`policy.env_vars`)

## Not changed

- Flagged `claude plugin` / `claude mcp` / `~/.claude` text in jfrog-init references, jfrog-ai-catalog/managing-installed-plugins.md, harness-claude.md and key-rules-and-troubleshooting.md is explicitly Claude Code-only (gated by harness detection or given as examples); left unchanged as false positives
- jfrog-init Step 5 scripts (jfrog-detect-jfrog-mcp.mjs, jfrog-resolve-mcp-config.mjs) and the plugin-owned config table have no KCoder row, so they cannot locate or patch KCoder's installed copy of the plugin `.mcp.json`; needs script changes outside this text-only scope
- .mcp.json uses `${JFROG_URL}/mcp` as a remote URL; KCoder does not expand placeholders in remote MCP URLs, so the bundled `jfrog` server needs a manifest/installer change (manifests left unchanged)
- hooks/hooks.json runs Claude-named session-start scripts (claude-session-start.mjs, claude-align-mcp-json.mjs); not evaluated or changed
