---
name: login
description: Sign the Greptile CLI in to your Greptile account
metadata:
  internal: true
allowed-tools: Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/greptile.mjs:*)
---

Sign the Greptile CLI in to the user's Greptile account.

Tell the user a browser window will open and that they need to finish signing
in there, then run:

```
GREPTILE_NO_UPDATE_CHECK=1 node "../../scripts/greptile.mjs" login
```

`../../scripts/greptile.mjs` is relative to this skill's base directory (the plugin root is two folders above
this `SKILL.md`). Resolve it to an absolute path before running, because the shell's working directory is the
user's project.

Give the `bash` call a **600000 ms timeout** (the `timeout` parameter). The CLI waits up to ten minutes for
the browser round-trip to complete, far longer than the two-minute default.

This opens `auth.greptile.com` and completes an OAuth flow. It signs in the
**CLI**, which keeps its own credentials in `~/.greptile/auth.json`.

The `greptile` MCP server in this plugin authenticates separately, through
KCoder's MCP sign-in (the MCP page in Studio; `/mcp` in Claude Code) — same Greptile account, same OAuth provider,
and the same audience, but a separate token store. A user who wants both
surfaces signs in twice, and signing in here does not authenticate the MCP
server (or the reverse).

If the user wanted MCP tools rather than the CLI, point them at KCoder's MCP sign-in for the `greptile`
server instead.
