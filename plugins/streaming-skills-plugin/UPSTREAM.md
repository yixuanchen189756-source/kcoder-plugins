# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/confluentinc/agent-skills.git (path `.`), commit `204b36f10e9be41819557988e8f5291711fda986`
- License: Apache-2.0 (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/confluent-cloud-cdc-tableflow/SKILL.md: replaced hard-coded `mcp__confluent__*` tool names with the tool name plus the `confluent` MCP server, and added a note on matching tools by name because KCoder prefixes MCP tools with its own server id
- skills/confluent-cloud-cdc-tableflow/references/connector-configs.md: `mcp__confluent__create-connector` -> the `confluent` MCP tool `create-connector`
- skills/confluent-cloud-cdc-tableflow/references/flink-sql-patterns.md: rewrote the four `mcp__confluent__*` Flink statement tool references the same way
- skills/confluent-cloud-cdc-tableflow/references/troubleshooting.md: rewrote 17 `mcp__confluent__*` references (prose and code blocks) and added a header note that calls refer to tools from the `confluent` MCP server
- skills/confluent-skill-reviewer/SKILL.md: the skill-creator harness location now names KCoder's `~/.config/kcoder/skills/skill-creator/` alongside Claude Code's `~/.claude/skills/skill-creator/`

## Not adapted

- CLAUDE.md, CONTRIBUTING.md and .github/ISSUE_TEMPLATE mention ~/.claude paths for repository contributors; they are not model-facing plugin content and were left unchanged
- The confluent MCP server is not bundled by this plugin; the user must configure it separately
