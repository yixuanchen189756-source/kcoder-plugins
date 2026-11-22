# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/ClickHouse/agent-skills.git (path `.`), commit `356a8c1b9a7392adb389a132f5ad3fec38532a03`
- License: Apache-2.0 (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/clickhouse-best-practices/rules/agent-connect-mcp.md: replaced `claude mcp add --transport http ...` with a KCoder `mcp_servers` HTTP entry in `~/.config/kcoder/settings.json` (kcoder mcp add is stdio-only) and Studio **Authorize** for OAuth
- skills/clickhouse-best-practices/AGENTS.md: same change in the compiled rule copy
