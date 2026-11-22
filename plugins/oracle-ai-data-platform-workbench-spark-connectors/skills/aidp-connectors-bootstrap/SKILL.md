---
name: aidp-connectors-bootstrap
description: First-time setup. Use when the user wants to install/upload the AIDP Spark connectors helper package into their AIDP workspace, or has just installed this plugin and asks "how do I set it up", "first-time setup", "install the helpers", "bootstrap aidp connectors". Drives the AIDP MCP tools to push the helper package to /Workspace/Shared/ and runs a sanity import.
allowed-tools: Read, Bash
---

# `aidp-connectors-bootstrap` — first-time setup of the helper package in AIDP

## When to use
- The user just installed the plugin and asks "how do I set this up?", "what's the first step?", "install the helpers".
- The user runs a connector skill for the first time and gets `ModuleNotFoundError: No module named 'oracle_ai_data_platform_connectors'`.
- The user explicitly asks to upload the helper package to AIDP.

## Outcome of running this skill
- `/Workspace/Shared/oracle_ai_data_platform_connectors/scripts/oracle_ai_data_platform_connectors/` exists in the user's AIDP workspace, populated from the plugin's local `scripts/` directory.
- The user has run `examples/00_bootstrap_helpers.ipynb` once and it printed `BOOTSTRAP OK`.
- From that point on, every connector skill works without further setup.

## What the assistant should do

### Step 1 — locate the plugin's `scripts/` directory on disk

The plugin lives wherever the user installed it. Common locations:
- `~/.claude/plugins/<marketplace>/oracle-ai-data-platform-workbench-spark-connectors/scripts/oracle_ai_data_platform_connectors/`
- `~/.codex/plugins/<marketplace>/oracle-ai-data-platform-workbench-spark-connectors/scripts/oracle_ai_data_platform_connectors/`
- A local clone or repo checkout when developing.
- In KCoder, resolve it from this skill's base directory (KCoder reports it when the skill loads): the plugin root is two levels up, so the package is `../../scripts/oracle_ai_data_platform_connectors/` and the notebook is `../../examples/00_bootstrap_helpers.ipynb` relative to that directory.

Search the installed plugin cache and the local repo checkout for `scripts/oracle_ai_data_platform_connectors/`. Confirm the source and destination paths with the user before uploading.

### Step 2 — create the destination directory in AIDP

Use the AIDP MCP tools. The calls below use the `create_directory` tool from the `aidp` MCP server (Claude Code names it `mcp__aidp__create_directory`; KCoder and other clients prefix MCP tools differently, so pick the `create_directory` tool of the `aidp` server from your tool list):

```
create_directory(
  workspace_id="<user's workspace id>",
  path="/Workspace/Shared/oracle_ai_data_platform_connectors"
)
create_directory(
  workspace_id=...,
  path="/Workspace/Shared/oracle_ai_data_platform_connectors/scripts"
)
```

(If the workspace_id isn't already known from the conversation, ask the user.)

### Step 3 — upload the package files

For each `.py` file under the local `scripts/oracle_ai_data_platform_connectors/`, upload to the matching path under `/Workspace/Shared/oracle_ai_data_platform_connectors/scripts/`. Use the `upload_file` tool from the `aidp` MCP server (`mcp__aidp__upload_file` in Claude Code), or the equivalent in this MCP server.

The package layout to preserve:
```
oracle_ai_data_platform_connectors/
├── __init__.py
├── auth/{__init__,wallet,dbtoken,oci_config,user_principal,secrets}.py
├── jdbc/{__init__,oracle,hive}.py
├── rest/{__init__,fusion,epm,essbase}.py
└── streaming/{__init__,kafka}.py
```

### Step 4 — push the bootstrap notebook to AIDP and run it

Upload `examples/00_bootstrap_helpers.ipynb` to `Shared/connectors-tests/00_bootstrap_helpers.ipynb` via the `nb_save_file` tool from the `aidp` MCP server. Then call its `nb_create_session` tool against the user's chosen cluster (typically `tpcds`), and its `nb_execute_code` tool for each cell. (Claude Code names these `mcp__aidp__nb_save_file`, `mcp__aidp__nb_create_session` and `mcp__aidp__nb_execute_code`.) The final cell prints `BOOTSTRAP OK` if everything works.

### Step 5 — confirm

Tell the user:
- Where the helpers landed.
- That every connector skill in this plugin will now work.
- The next step is to pick a connector (e.g., `aidp-atp`) and supply that connector's env vars / Vault secrets.

## Alternative: ask the user to install via PyPI (v1.0+)

Once the package is published to PyPI, this skill should pivot to telling the user to run `%pip install oracle-ai-data-platform-connectors` in any AIDP cell instead of uploading. Until v1.0 ships, the Workspace-upload path above is the only way.

## What NOT to do
- Do not upload anything to `/Workspace/Shared/` without confirming the path with the user (in case they have an existing convention).
- Do not write secrets, .env contents, or PEM keys anywhere in `/Workspace/Shared/`. The helper package is code-only.
- Do not skip the sanity-import notebook — it's how you (and the user) confirm the upload worked, not just that files exist.

## References
- Bootstrap notebook: [`examples/00_bootstrap_helpers.ipynb`](../../examples/00_bootstrap_helpers.ipynb)
- Plugin README install section: [`README.md`](../../README.md)
