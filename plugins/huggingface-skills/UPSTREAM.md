# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/huggingface/skills.git (path `.`), commit `c3ff942be3e07116b475253f0a8fc4f54682c1a8`
- License: Apache-2.0 (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/huggingface-llm-trainer/SKILL.md: `mcp__huggingface__hf_whoami()` -> the `hf_whoami` tool from the Hugging Face MCP server (match by name) or `hf auth whoami`
- skills/huggingface-llm-trainer/references/troubleshooting.md: same rewrite
