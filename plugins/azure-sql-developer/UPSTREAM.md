# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/microsoft/azure-sql-database-container.git (path `.`), commit `c1e8167e4c1d5979d7fc4a6ea11a6ce885a9398b`
- License: MIT (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/azuresql-db-*/SKILL.md (17 files): the "Staying current" line now names the `microsoft_docs_search` / `microsoft_docs_fetch` tools of the `microsoft-learn` MCP server, keeping the Claude Code `mcp__microsoft-learn__...` names visible as an example, because KCoder prefixes MCP tool names differently
- skills/README.md: added KCoder verify command, manual-install example and install-matrix row (.kcoder/skills/, ~/.config/kcoder/skills/); added a KCoder `mcp_servers` HTTP entry for Microsoft Learn with `kcoder mcp test`; reworded the authoring rule and tool-name paragraph to name tool plus server instead of only the Claude Code fully-qualified form

## Notes

- README.md (root): `/plugin marketplace add` install line is Claude Code/Codex-specific; left as is because the KCoder marketplace id for this plugin is not known here
