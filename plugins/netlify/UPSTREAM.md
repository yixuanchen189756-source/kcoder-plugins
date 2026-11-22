# Upstream

- Project: https://github.com/xai-org/plugin-marketplace
- Source: https://github.com/netlify/context-and-tools.git (path `.`), commit `905256ef236890a842be1ff1c5fd6bb07baa1890`
- License: MIT (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/netlify-mcp-servers/SKILL.md (and identical agent-plugin/ and codex/ copies): added a KCoder client line (`mcp_servers` HTTP entry with `policy.bearer_token_env_var`) next to the Claude Code one, and a KCoder option for testing against localhost
- skills/netlify-mcp-servers/references/connecting-clients.md (and identical copies): added a KCoder native Streamable HTTP section with a settings example that keeps the token in the environment, plus `kcoder mcp test`

## Not changed

- Claude Code / Claude Desktop client entries are kept because the skill documents several clients
