# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/netlify/context-and-tools.git (path `.`), commit `dc9ebf1b994420a4791e9d5d7cd68f62e07a0a41`
- License: MIT (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/netlify-mcp-servers/SKILL.md, agent-plugin/skills/netlify-mcp-servers/SKILL.md, codex/skills/netlify-mcp-servers/SKILL.md: added a KCoder client entry (mcp_servers HTTP entry with policy.bearer_token_env_var, token from the environment, kcoder mcp test) and a KCoder local-test hint next to `claude mcp add`
- skills/netlify-mcp-servers/references/connecting-clients.md (and the agent-plugin/ and codex/ copies): added a KCoder native-connection section with a JSON example; noted `kcoder mcp add` is stdio-only

## Notes

- The three skill copies may be generated from one source upstream; all three were edited identically
