# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/honeycombio/agent-skill.git (path `honeycomb`), commit `6bb09279fc3fb69abf113228be939dbb929e34f1`
- License: MIT (see the license file in this directory, unchanged)

## Changes for KCoder

- commands/honeycomb-setup.md: replaced `claude mcp add` steps with KCoder steps (bundled US server + Studio MCP page **Authorize**; EU/self-managed HTTP entries in `~/.config/kcoder/settings.json` `mcp_servers`; API key via `policy.bearer_token_env_var` instead of a literal Authorization header); `/mcp` -> `/mcp verbose` in a new session; CLAUDE.md -> AGENTS.md; description now says KCoder
- skills/*/SKILL.md (beeline-migration, create-honeycomb-board, metrics-queries, observability-fundamentals, otel-genai-instrumentation, otel-instrumentation, otel-migration, production-investigation, query-patterns, slos-and-triggers): Replaced `${CLAUDE_PLUGIN_ROOT}/...` paths (not expanded in KCoder skill text) with paths relative to the skill base directory
- skills/otel-instrumentation/references/{local-collector-debug-test,sdk-setup-by-language,wide-event-attributes}.md, skills/otel-migration/references/verification-checklist.md: same replacement, annotated as relative to the skill base directory
- skills/create-honeycomb-board/SKILL.md, skills/verify-recent-trace/SKILL.md: added a note that the tools come from the `honeycomb` MCP server and must be matched by tool name (KCoder prefixes MCP tool names)

The license file was copied unchanged from the upstream repository root at the same commit.
