# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/GoogleCloudPlatform/data-agent-kit-plugin.git (path `.`), commit `83c53b5f129cdeecabe149ff4ba82645d3e51745`
- License: Apache-2.0 (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/resolving-mcp-region-configs/SKILL.md: added a KCoder branch (look for the plugin's `dak-spark` server tools; do not edit KCoder's managed plugin copy; KCoder does not expand `$GCP_REGION`; switch off the plugin server and `kcoder mcp add dak-spark-<region> ...` with the region filled in; new session instead of `claude --resume`)
- skills/google-cloud-storage-basics/references/mcp-usage.md: added a KCoder `mcp_servers` HTTP example that takes the bearer token from an environment variable via `policy.bearer_token_env_var` instead of a literal header

## Not adapted

- Claude Code/Codex/Antigravity paths kept as multi-client documentation
- the KCoder workaround duplicates the plugin's stdio proxy as a user-level server; the user must switch off the plugin's `dak-spark` server in Studio
