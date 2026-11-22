# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/anthropics/claude-plugins-official.git (path `plugins/receipts`), commit `73c8cf3ea7e296057b467990f2f5d61b4c922260`
- License: Apache-2.0 (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/receipts/SKILL.md: added a KCoder note that the report covers Claude Code transcripts only (~/.claude/projects/), KCoder session history is not counted, and <skill-dir> is the base directory KCoder reports

## Notes

- The miner script only reads Claude Code transcripts; a KCoder session-history report is not supported (script not modified)
