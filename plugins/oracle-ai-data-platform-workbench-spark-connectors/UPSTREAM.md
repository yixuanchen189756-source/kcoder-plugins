# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/oracle-samples/oracle-aidp-samples.git (path `ai/claude-code-plugins/oracle-ai-data-platform-workbench-spark-connectors`), commit `a7225cbdd935ad47ed9a17ee8f1533e324f42623`
- License: MIT (see `LICENSE` and `NOTICE` in this directory, unchanged)

## Changes for KCoder

- skills/aidp-connectors-bootstrap/SKILL.md: Step 1 adds the KCoder location (../../scripts/... and ../../examples/... relative to the skill base directory); Steps 2-4 name the create_directory, upload_file, nb_save_file, nb_create_session and nb_execute_code tools of the `aidp` MCP server, keeping the Claude Code mcp__aidp__* names visible

## Notes

- The `aidp` MCP server is not shipped by this plugin; the user must configure it in KCoder separately
