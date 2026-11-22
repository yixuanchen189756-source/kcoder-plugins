# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/duckdb/duckdb-skills.git (path `.`), commit `7feda8e01e22bc0886c86123f3884947e36d8c69`
- License: MIT (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/read-memories/SKILL.md: description covers KCoder; added a KCoder query (top-level `role`/`content`/`timestamp_ms` records) and search paths under `~/.config/kcoder/projects/` with the non-alphanumeric-to-`-` project key rule; Claude Code paths kept and labeled
