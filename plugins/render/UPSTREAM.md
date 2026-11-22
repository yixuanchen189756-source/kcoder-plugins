# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/render-oss/render-plugin-claude-code.git (path `.`), commit `d7ecf826c5971eb7dfdb5aed79fa838a8d67ff46`
- License: MIT (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/render-mcp/SKILL.md: added a KCoder manual setup next to Cursor/Claude Code/Codex: an http `mcp_servers` entry in `~/.config/kcoder/settings.json` with `policy.bearer_token_env_var: RENDER_API_KEY` (no key in the settings file), restart, `kcoder mcp test render`, and `kcoder mcp remove render` for stale configs
- skills/render-mcp/references/troubleshooting.md: added the KCoder replacement step to the 401 fix and a '### KCoder' troubleshooting section

## Not adapted

- render.tmp.1054422/ is a leftover temporary copy inside the installed plugin root (not loaded); left unchanged rather than deleted. It still contains the original Claude Code-only text
