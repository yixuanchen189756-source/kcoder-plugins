# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/mongodb/agent-skills.git (path `plugins/mongodb`), commit `c370a63b27075008a92134686b24af3817edeb00`
- License: Apache-2.0 (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/mongodb-natural-language-querying/SKILL.md: replaced `mcp__mongodb__<tool>` calls with the `mongodb` MCP server's bare tool names and added a KCoder tool-name note
- skills/mongodb-schema-design/SKILL.md: `mcp__mongodb__collection-schema/aggregate/db-stats` -> named tools of the `mongodb` MCP server
- skills/mongodb-schema-design/references/source-query-stats.md: `mcp__mongodb__aggregateDB` -> the `aggregateDB` tool from the `mongodb` MCP server
- skills/mongodb-schema-design/references/source-slow-query-logs.md: `mcp__plugin_mongodb_mongodb__atlas-get-performance-advisor` -> `atlas-get-performance-advisor` from the `mongodb` MCP server
- skills/mongodb-mcp-setup/SKILL.md: listed KCoder among shell-based clients and said credentials must be in the environment KCoder runs in
- .agy-plugin/skills/**: same edits applied so the duplicate skill tree stays identical to skills/

## Not adapted

- skills/mongodb-natural-language-querying/SKILL.md (both copies): frontmatter `allowed-tools` left unchanged (metadata, not rewritten); `allowed-tools: mcp__mongodb__*` still uses Claude-style `mcp__...` names that will not match KCoder's generated MCP tool names if a KCoder path enforces that list

The license file was copied unchanged from the upstream repository root at the same commit.
