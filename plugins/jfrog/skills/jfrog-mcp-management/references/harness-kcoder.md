# Harness: KCoder

KCoder-specific config for the `jfrog-mcp-management` skill. Read this together
with [harness-common.md](harness-common.md) (shared entry shape and success
criterion). You reached this file because your system prompt identifies you as
**KCoder** (KCoder CLI/REPL or KCoder Studio).

> **KCoder differs from the map-based JSON harnesses:** MCP servers live in a
> JSON **array** named `mcp_servers`, one object per server with an explicit
> `name` and `transport`. Settings values are not `${VAR}`-expanded; forward
> secrets from KCoder's environment with `policy.env_vars`. Write the entry
> using **Full entry shape** below instead of the map template in
> harness-common.md.

## Config files

- **Default scope: project.** `.kcoder/settings.json` in the project root -
  shareable via git. Create it as `{}` if missing. KCoder loads project MCP
  servers only when the project directory is trusted; tell the user so.
  A project `mcp_servers` array **replaces** the user-level array (it is not
  merged). If the user also relies on user-level servers in this project, list
  their names in the project-only `mcp_inherited_servers` array instead of
  copying their definitions.
- **User (global):** `~/.config/kcoder/settings.json`, top-level `mcp_servers`.
  Use ONLY if the user says "personal only" / "do not commit".
- Never write MCP entries to `.kcoder/settings.local.json` unless the user asks
  for it. Do not ask which scope unless the user brings it up.

## Top-level key

`mcp_servers` - an array. Each entry's `name` is the raw `spec.packageName`.
Before appending, look for an existing entry whose `env._JF_ARGS` has
`mcp=<spec.packageName>`; if one exists you are updating that entry, not adding
a second one. Keep every other array element unchanged.

## Value reference (env / secrets)

- **`env` object** - inline literal values only. Use it for the non-secret
  `_JF_ARGS` string.
- **`policy.env_vars` array** - variable NAMES that KCoder forwards from the
  environment it runs in into the server process. Use it for **every secret**
  and every catalog input you keep out of the file. Copy each input `name`
  from `--inspect` verbatim, including case. The user sets the variable in the
  environment KCoder is started from (see
  [persisting-env-vars.md](persisting-env-vars.md)); it is read when a new
  session connects. **Never write a raw secret into `env`.**
- For a `Bearer` header exposed as a header input, have the user export the
  full header value under that exact name (e.g.
  `export Authorization="Bearer <token>"`) and list `Authorization` in
  `policy.env_vars`.

## Full entry shape

```json
{
  "mcp_servers": [
    {
      "name": "<spec.packageName>",
      "transport": "stdio",
      "command": "npx",
      "args": [
        "--yes",
        "--registry",
        "<REGISTRY_URL>",
        "@jfrog/agent-guard",
        "--server",
        "<SERVER_ID>"
      ],
      "env": {
        "_JF_ARGS": "project=<JFROG_PROJECT_KEY>&mcp=<spec.packageName>"
      },
      "policy": {
        "env_vars": ["<ENV_VAR_OR_HEADER_NAME>"]
      }
    }
  ]
}
```

All argument rules from harness-common.md apply unchanged (`--yes` and
`--registry` before `@jfrog/agent-guard`, conditional `--server`, never
`--project` / `--mcp` in `args`). Omit `policy` when there is nothing to
forward.

## Gateway entry shape

Use this shape ONLY when Step 2's `--inspect` output carried
`routing.target: "gateway"` and a non-empty `routing.url`. In every other case
write the Agent Guard entry above.

```json
{
  "mcp_servers": [
    {
      "name": "<spec.packageName>",
      "transport": "http",
      "url": "<routing.url, copied verbatim>"
    }
  ]
}
```

- `url` is `routing.url` copied verbatim - never build, normalise or re-encode
  it.
- No `command`, `args`, `env` or `policy.env_vars` - the Gateway holds the
  upstream credential.
- Skip Install Step 5 (`--login`). If the Gateway asks for OAuth, the user
  authorizes the server from the MCP management page in KCoder Studio.
- Enable, Restart and Verify are unchanged, including the >=1-tool criterion.

## Enable

There is no per-server approval list. A server in `mcp_servers` is enabled
unless its name appears in `mcp_disabled_servers` (user settings, or toggled on
KCoder Studio's MCP management page). If the user had disabled this name,
remove it from `mcp_disabled_servers` or ask them to re-enable it in Studio.
Project-scope entries additionally require the project directory to be trusted.

## Restart

Start a new KCoder session in the same directory (`/new` in the REPL, or a new
conversation in Studio). Existing sessions keep the tools they already
registered; only new sessions connect to added or changed servers.

## List installed

`kcoder mcp list` shows configured servers with their enabled state and
transport. For JFrog metadata, read `mcp_servers` from `.kcoder/settings.json`
(project) and `~/.config/kcoder/settings.json` (user) and match on
`env._JF_ARGS`.

## Verify

If you can already see or call at least one upstream tool from this server,
skip this check. Otherwise run `kcoder mcp test <name>` (it performs the
handshake and tool discovery and prints the tool count), or `/mcp verbose` in
the new session to see which tools were registered. Success: at least one
upstream tool. A successful handshake with 0 tools is not success - follow
[Connected but 0 tools](key-rules-and-troubleshooting.md#connected-but-0-tools).

## Remove cleanup

Remove only the matching element from the `mcp_servers` array. If that leaves
a project-level array empty and the key was created only for this entry,
delete the `mcp_servers` key: an explicit empty project array also hides every
user-level server. Also remove the name from `mcp_disabled_servers` if
present.
