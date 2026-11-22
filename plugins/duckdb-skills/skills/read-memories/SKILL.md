---
name: read-memories
description: >
  Search past Claude Code or KCoder session logs to recall prior decisions, patterns, or unresolved work.
  Use when user says "do you remember", "what did we do", references past conversations, or you need context from prior sessions.
argument-hint: <keyword> [--here]
allowed-tools: Bash
---

Search past session logs silently — do NOT narrate the process. Absorb the results and continue with enriched context.

`$0` is the keyword. Pass `--here` as `$1` to scope to the current project only.

## Step 1 — Query

```bash
duckdb :memory: -c "
SELECT
  regexp_extract(filename, 'projects/([^/]+)/', 1) AS project,
  strftime(timestamp::TIMESTAMPTZ, '%Y-%m-%d %H:%M') AS ts,
  message.role AS role,
  left(message.content::VARCHAR, 500) AS content
FROM read_ndjson('<SEARCH_PATH>', auto_detect=true, ignore_errors=true, filename=true)
WHERE message::VARCHAR ILIKE '%<KEYWORD>%'
  AND message.role IS NOT NULL
ORDER BY timestamp
LIMIT 40;
"
```

Search paths (Claude Code):
- All projects: `$HOME/.claude/projects/*/*.jsonl`
- Current only (`--here`): `$HOME/.claude/projects/$(echo "$PWD" | sed 's|[/_]|-|g')/*.jsonl`

Replace `<SEARCH_PATH>` and `<KEYWORD>` before running.

### When running in KCoder

KCoder stores session logs under `$HOME/.config/kcoder/projects/<project-key>/*.jsonl`, and each
line has top-level `role`, `content` and `timestamp_ms` fields (no `message` wrapper), so use
this query instead:

```bash
duckdb :memory: -c "
SELECT
  regexp_extract(filename, 'projects/([^/]+)/', 1) AS project,
  strftime(epoch_ms(timestamp_ms), '%Y-%m-%d %H:%M') AS ts,
  role,
  left(content::VARCHAR, 500) AS content
FROM read_ndjson('<SEARCH_PATH>', auto_detect=true, ignore_errors=true, filename=true)
WHERE content::VARCHAR ILIKE '%<KEYWORD>%'
  AND role IS NOT NULL
ORDER BY timestamp_ms
LIMIT 40;
"
```

Search paths (KCoder):
- All projects: `$HOME/.config/kcoder/projects/*/*.jsonl`
- Current only (`--here`): `$HOME/.config/kcoder/projects/$(printf '%s' "$PWD" | sed 's/[^A-Za-z0-9]/-/g')/*.jsonl`
  (KCoder replaces every non-alphanumeric character of the project path with `-`; very long
  paths get a hash suffix. If that directory does not exist, list `$HOME/.config/kcoder/projects/`
  and pick the directory matching the current project.)

## Step 2 — Internalize

From the results, extract decisions, patterns, unresolved TODOs, and user corrections. Use this to inform your current response — do not repeat raw logs to the user.
