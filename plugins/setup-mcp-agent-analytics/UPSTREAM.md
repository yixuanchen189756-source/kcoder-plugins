# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/pendo-io/claude-pendo-plugin.git (path `plugins/setup-mcp-agent-analytics`), commit `a0f85260c61b93c4511f59545612323a41c3f845`
- License: MIT (the installed plugin root ships no license file; see the upstream repository)

## Changes for KCoder

- skills/setup-mcp-agent-analytics/SKILL.md: added the KCoder equivalent of the `claude -p --mcp-config --allowedTools` verification run (`kcoder "<use the tools>" --settings-file <cfg> --json` with the server declared in `mcp_servers`)
- skills/setup-mcp-agent-analytics/SKILL.md: corrected the KCoder headless command from `kcoder -p "..."` (`-p` is `--permission-mode`) to `kcoder "<use the tools>" --settings-file <cfg> --json` (positional prompt, JSONL output)

The license file was copied unchanged from the upstream repository root at the same commit.
