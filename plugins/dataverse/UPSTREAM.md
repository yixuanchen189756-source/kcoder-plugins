# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/microsoft/Dataverse-skills.git (path `.github/plugins/dataverse`), commit `669e71519886d4602753c34bff3db787d616d761`
- License: MIT (no top-level license file is included in this installed copy; see the upstream repository. Any license files present are unchanged)

## Changes for KCoder

- skills/dv-connect/references/mcp-configuration.md: added a `kcoder` TOOL_TYPE alongside copilot/claude/cursor/codex: tool choice, user-scope config path `~/.config/kcoder/settings.json`, existing-server check via `kcoder mcp list` or `mcp_servers`, a stdio `mcp_servers` JSON entry for the npx proxy (not `kcoder mcp add`, whose `--args` cannot take `-y`), Windows `cmd /c` form, restart/resume (`kcoder --resume latest`) instructions and troubleshooting with `kcoder mcp test`
- skills/dv-connect/SKILL.md: Step 6 skip check, host list, attribution env placement and a 'For KCoder' block; Step 7 Check 1 adds `kcoder mcp test dataverse-{orgid}`
- skills/dv-connect/references/tools-setup.md: added the KCoder resume hint next to the `claude --continue` reminder

## Not adapted

- KCoder registration is user-scope only; project-scope MCP in KCoder is subject to trusted-directory and inheritance rules and was not documented here
- KCoder is not in auth.py `_ALLOWED_AGENTS`, so the KCoder branch uses `agent=unknown` for attribution as the skill instructs for unrecognized hosts
- No license file is present in this installed copy; see the upstream repository

The license file was copied unchanged from the upstream repository root at the same commit.
