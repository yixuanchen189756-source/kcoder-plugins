# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/microsoft/azure-skills.git (path `.`), commit `5b4f0c0778079a2f568581107f23349ce9a0a9b2`
- License: MIT (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/azure-compute/SKILL.md: description now says 'the azure MCP get_azure_bestpractices tool' instead of the hard-coded `mcp__azure__get_azure_bestpractices`
- skills/azure-compute/workflows/vm-creator/references/mcp-tools.md: the compute proxy is described as the `compute` tool from the `azure` MCP server with KCoder's `mcp__<server id>__compute` naming; the call example uses `compute({...})`

## Not adapted

- .github/plugins/azure-skills/skills/** is a duplicate tree not loaded by the plugin manifest (skills: ./skills/); left unchanged
