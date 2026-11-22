# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/aws/agent-toolkit-for-aws.git (path `plugins/aws-agents-for-devsecops`), commit `7bde20faede49dd5764c02b54f5e306849f7e3ca`
- License: Apache-2.0 (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/setup-devops-agent/SKILL.md: added a "Running in KCoder" section (bundled `.mcp.json` env expansion, do not edit installed plugin files, write SigV4/fallback entries to `~/.config/kcoder/settings.json` or `.kcoder/settings.local.json` `mcp_servers` array with example, `timeout` -> `policy.tool_timeout_secs`, KCoder config locations, new session + `/mcp verbose` instead of `/reload-plugins`, routing guide at `.kcoder/aws-agents-for-devsecops.md`); `${CLAUDE_PLUGIN_ROOT}/.mcp.json` and `/README.md` -> `../../` paths; restart/troubleshooting lines mention KCoder
- skills/coordinating-multi-space-devops-agent/SKILL.md, commands/spaces.md: routing-guide lookup also lists `.kcoder/aws-agents-for-devsecops.md`
- README.md: added KCoder install (`kcoder plugin install --marketplace <marketplace-id> --name aws-agents-for-devsecops`) and how to trigger setup skills

The license file was copied unchanged from the upstream repository root at the same commit.
