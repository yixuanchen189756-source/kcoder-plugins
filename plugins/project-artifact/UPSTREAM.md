# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/anthropics/claude-plugins-official.git (path `plugins/project-artifact`), commit `73c8cf3ea7e296057b467990f2f5d61b4c922260`
- License: Apache-2.0 (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/project-artifact/SKILL.md: added "Running in KCoder" (no Artifact tool or claude.ai login in KCoder: build page + config locally, publishing happens from Claude Code); `${CLAUDE_PLUGIN_DATA}` -> `<PLUGIN_DATA>` with the KCoder plugin store location; headless note mentions non-interactive `kcoder "..."` runs (an earlier draft wrote `kcoder -p`, corrected since `-p` is `--permission-mode` in KCoder)
- README.md: note that KCoder has no Artifact tool
