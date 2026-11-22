# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/intuit/quickbooks-claude-plugin.git (path `.`), commit `c8daa17a64d4d0fdeabdf0516524f72549b6ad19`
- License: Apache-2.0 (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/setup/SKILL.md: added a KCoder note that the QuickBooks tools come only from a Claude-account connector, that adding the MCP URL to KCoder settings is not expected to authenticate, and that the model should tell the user the tools are unavailable in KCoder

## Not changed

- The plugin depends on the claude.ai QuickBooks connector; KCoder has no equivalent, so the Claude connector / `/mcp` / `claude mcp remove` setup steps were kept as Claude-only
