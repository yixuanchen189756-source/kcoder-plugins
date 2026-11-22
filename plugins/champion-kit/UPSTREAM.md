# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/anthropics/claude-plugins-official.git (path `plugins/champion-kit`), commit `73c8cf3ea7e296057b467990f2f5d61b4c922260`
- License: Apache-2.0 (see the license file in this directory, unchanged)

## Changes for KCoder

- agents/repo-scout.md: also excludes ~/.config/kcoder from reads and lists KCoder shared-context equivalents (AGENTS.md/KCODER.md, .kcoder/skills/, .kcoder/settings*.json)
- skills/faq/SKILL.md: Glob check also covers AGENTS.md and .kcoder/settings.json for KCoder teams; never copy values from .kcoder/settings*.json
- skills/maturity/SKILL.md: evidence list includes KCoder equivalents
- skills/patterns/SKILL.md: good-practice scan includes .kcoder/skills/ and AGENTS.md/KCODER.md
- skills/routines/SKILL.md: unattended-edit ban also names AGENTS.md and .kcoder/
- skills/hackathon/SKILL.md: added a KCoder translation paragraph for the starter ideas (skills/hooks locations, kcoder mcp add, git worktree + kcoder --cwd, headless `kcoder "PROMPT"` since -p is --permission-mode, spawn_agent instead of .claude/agents)

## Notes

- skills/climb/SKILL.md: transcript analysis targets Claude Code transcripts (~/.claude/projects/, /insights) and its tool name list (including NotebookEdit) is a vocabulary for counting Claude Code transcript entries, not a tool call; left unchanged, KCoder session history is not covered
- README.md install steps and code.claude.com links are Claude Code-specific; the plugin is a Claude Code champion program, so left unchanged
