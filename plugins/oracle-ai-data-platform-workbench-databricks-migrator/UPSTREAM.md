# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/oracle-samples/oracle-aidp-samples.git (path `ai/claude-code-plugins/oracle-ai-data-platform-workbench-databricks-migrator`), commit `a7225cbdd935ad47ed9a17ee8f1533e324f42623`
- License: MIT (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/aidp-acceptance-contract/SKILL.md: replaced `${CLAUDE_PLUGIN_ROOT}` with `../..` (plugin root relative to the skill base directory) and added a note to resolve these paths to absolute paths before running commands
- skills/aidp-build-dag/SKILL.md: replaced `${CLAUDE_PLUGIN_ROOT}` with `../..` (plugin root relative to the skill base directory) and added a note to resolve these paths to absolute paths before running commands
- skills/aidp-check-data/SKILL.md: replaced `${CLAUDE_PLUGIN_ROOT}` with `../..` (plugin root relative to the skill base directory) and added a note to resolve these paths to absolute paths before running commands
- skills/aidp-fixup-cell/SKILL.md: replaced `${CLAUDE_PLUGIN_ROOT}` with `../..` (plugin root relative to the skill base directory) and added a note to resolve these paths to absolute paths before running commands
- skills/aidp-migrate-catalog/SKILL.md: replaced `${CLAUDE_PLUGIN_ROOT}` with `../..` (plugin root relative to the skill base directory) and added a note to resolve these paths to absolute paths before running commands
- skills/aidp-migrate-job/SKILL.md: replaced `${CLAUDE_PLUGIN_ROOT}` with `../..` (plugin root relative to the skill base directory) and added a note to resolve these paths to absolute paths before running commands
- skills/aidp-migrator-bootstrap/SKILL.md: replaced `${CLAUDE_PLUGIN_ROOT}` with `../..` (plugin root relative to the skill base directory) and added a note to resolve these paths to absolute paths before running commands
- skills/aidp-migrator-overview/SKILL.md: replaced `${CLAUDE_PLUGIN_ROOT}` with `../..` (plugin root relative to the skill base directory) and added a note to resolve these paths to absolute paths before running commands
- skills/aidp-resume-migration/SKILL.md: replaced `${CLAUDE_PLUGIN_ROOT}` with `../..` (plugin root relative to the skill base directory) and added a note to resolve these paths to absolute paths before running commands

## Not adapted

- references/cli-map.md and references/ddl-rewrite-rules.md at the plugin root (linked from skills) and README.md/PRIVACY.md still use `${CLAUDE_PLUGIN_ROOT}`; they are outside skills/ and were not in the findings, so they were left unchanged. In KCoder the model should read them as the plugin root (two directories above any skill)
- commands/*.md keep `${CLAUDE_PLUGIN_ROOT}`, which KCoder expands there
