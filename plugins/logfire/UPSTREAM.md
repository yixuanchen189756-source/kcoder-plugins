# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/pydantic/skills.git (path `plugins/logfire`), commit `238d97102650c1caa51f35027aee13c469c59542`
- License: MIT (the installed plugin root ships no license file; see the upstream repository)

## Changes for KCoder

- commands/dev-session.md: `mcp__logfire__local_dev_session` -> the `local_dev_session` tool from the `logfire` MCP server, with a note on KCoder's prefixed names
- skills/logfire-ui/SKILL.md: added a KCoder line: no Codex in-app browser / Node REPL `js`, so return the clean Logfire URL; do not substitute `WebBrowser` unless asked

## Not changed

- .mcp.json uses `${LOGFIRE_MCP_URL:-https://logfire-us.pydantic.dev/mcp}` as the remote URL; KCoder does not expand placeholders in remote MCP URLs, so the bundled server needs a manifest change (manifests left unchanged)
- skills/logfire-ui/SKILL.md keeps its Codex Desktop browser workflow (including `mcp__node_repl__js`), which only applies in Codex

The license file was copied unchanged from the upstream repository root at the same commit.
