# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/anthropics/claude-plugins-official.git (path `plugins/skill-creator`), commit `73c8cf3ea7e296057b467990f2f5d61b4c922260`
- License: Apache-2.0 (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/skill-creator/SKILL.md: added a KCoder note at the start of Description Optimization: the bundled scripts call `claude -p` and stage `.claude/commands/`, so they measure Claude Code triggering; run them only with Claude Code installed, otherwise revise the description by hand

## Not adapted

- skill-creator description-optimization scripts (`run_loop.py`, `run_eval.py`, `improve_description.py`) hard-code the `claude` CLI; scripts were not modified, so automated description optimization stays Claude Code-only
