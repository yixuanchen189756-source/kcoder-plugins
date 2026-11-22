---
name: honeycomb-setup
description: Set up the Honeycomb MCP server connection for KCoder
---

# Honeycomb MCP Setup

Guide the user through connecting KCoder to Honeycomb's MCP server. Use `AskUserQuestion`
to walk through the setup interactively.

## Step 1: Prerequisites

Ask the user:
1. Do they have a Honeycomb account?
2. Is Honeycomb Intelligence enabled on their team? (Required for MCP)

If they're unsure about Honeycomb Intelligence, it's an add-on feature that enables AI-powered
tools. They can check with their Honeycomb team admin.

## Step 2: Choose Region

Use `AskUserQuestion` to ask: "Which Honeycomb region are you using?"
- **US** (default): `https://mcp.honeycomb.io/mcp`
- **EU**: `https://mcp.eu1.honeycomb.io/mcp`

## Step 3: Choose Authentication Method

Use `AskUserQuestion` to ask: "How would you like to authenticate?"

### Option A: OAuth (Recommended)

This plugin already bundles a `honeycomb` MCP server for the **US** region
(`https://mcp.honeycomb.io/mcp`, declared in the plugin's `.mcp.json`). For US, no extra
configuration is needed: select **Authorize** on the plugin's `honeycomb` server in KCoder Studio's MCP management page,
complete the Honeycomb OAuth sign-in in the browser, then start a new session.

For **EU**, or to manage the server yourself, add an HTTP entry to the `mcp_servers` array in
the user settings file `~/.config/kcoder/settings.json`. `kcoder mcp add` only creates stdio
servers, so edit the file directly. `mcp_servers` replaces lower-priority arrays rather than
merging, so append to the existing array instead of overwriting other servers:

**EU:**
```json
{
  "mcp_servers": [
    {
      "name": "honeycomb-eu",
      "transport": "http",
      "url": "https://mcp.eu1.honeycomb.io/mcp"
    }
  ]
}
```

(Use the same shape with `https://mcp.honeycomb.io/mcp` for a self-managed US entry.) Then
select **Authorize** on that server in KCoder Studio's MCP management page and complete the
sign-in in the browser.

### Option B: API Key (Headless/Unattended Only)

For headless environments where OAuth is not available, use `AskUserQuestion` to confirm:
1. That they have an API key (format: `<Key ID>:<Secret Key>`). Do not ask them to paste the
   key into the conversation.
2. Their region (from Step 2)

Do not write the key into settings files. Instead, have the user set it in the environment
KCoder runs in, for example `HONEYCOMB_API_KEY=<KEY_ID>:<SECRET_KEY>`, and add an entry that
reads it through `policy.bearer_token_env_var` (KCoder sends it as
`Authorization: Bearer <value>`):

**US:**
```json
{
  "mcp_servers": [
    {
      "name": "honeycomb-apikey",
      "transport": "http",
      "url": "https://mcp.honeycomb.io/mcp",
      "policy": { "bearer_token_env_var": "HONEYCOMB_API_KEY" }
    }
  ]
}
```

**EU:** use the same entry with `"url": "https://mcp.eu1.honeycomb.io/mcp"`.

**API Key requirements:**
- Must be a Management API Key (not Ingest key)
- Must have "Model Context Protocol" scope (read)
- Must have "Environments" scope (read)
- For `create_board`: also need "Model Context Protocol" scope (write)
- Format: `<Key ID>:<Secret Key>` (with colon separator)

If you add your own entry, disable the plugin's bundled `honeycomb` server (for example in
Studio's MCP page) so the same tools are not registered twice.

## Step 4: Verify Connection

Use `AskUserQuestion` to ask: "Would you like me to verify the connection now?"

If yes:
1. Ask the user to start a new KCoder session and run `/mcp verbose` to confirm the Honeycomb server appears with its tools (sessions started before the change do not pick up new MCP servers)
2. Call `get_workspace_context` to verify data access
3. Show the user their available environments and datasets

## Step 5: Context Priming (Recommended)

Use `AskUserQuestion` to ask: "Would you like me to add Honeycomb context priming to your AGENTS.md?"

If yes, add this to their project's `AGENTS.md` (KCoder reads project instructions from `AGENTS.md` or `KCODER.md`):

```markdown
## Honeycomb MCP Usage

When working with Honeycomb:
- Always call `get_workspace_context` first to understand available environments and datasets
- Use `find_columns` or `get_dataset_columns` to discover fields before running queries
- Use human-readable time ranges (e.g., "last 2 hours", "24h") — avoid epoch timestamps
- Specify the environment and dataset explicitly in every query
```

## Troubleshooting

- **OAuth errors**: Report to Honeycomb support or Pollinators Slack
- **API key format error**: Ensure format is `<Key ID>:<Secret Key>` with colon
- **No tools found**: Verify Honeycomb Intelligence is enabled for your team
- **Session timeout**: MCP sessions may time out after 24 hours — re-authenticate
- **"list_environments" or similar errors**: The MCP server uses `get_workspace_context` and `get_environment`, not `list_environments`
