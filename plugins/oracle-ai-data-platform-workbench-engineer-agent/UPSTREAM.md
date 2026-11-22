# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/oracle-samples/oracle-aidp-samples.git (path `ai/claude-code-plugins/oracle-ai-data-platform-workbench-engineer-agent`), commit `a7225cbdd935ad47ed9a17ee8f1533e324f42623`
- License: MIT (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/aidp-engineer-bootstrap/SKILL.md: `$PLUGIN_DIR` is now resolved from the skill base directory (`../..`) instead of `${CLAUDE_PLUGIN_ROOT}` / `claude plugin list`; `claude mcp list` -> `kcoder mcp list`
- skills/aidp-engineer-overview/SKILL.md, skills/aidp-notebooks/SKILL.md, skills/aidp-federate/SKILL.md: `claude plugin list` -> `kcoder plugin list`

## Not adapted

- hooks/ and scripts/check_env.py still reference `CLAUDE_PLUGIN_ROOT` (executable code, not modified; KCoder sets it for hooks)
- README not changed
