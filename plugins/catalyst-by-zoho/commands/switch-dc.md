---
description: Switch the Catalyst by Zoho MCP server to a specified data center
argument-hint: <US|EU|IN|AU|CA|SA|JP|UAE>
---
Switch the Catalyst by Zoho MCP server to the data center specified in: $ARGUMENTS

Follow these steps exactly:

## Step 1 — Resolve the target DC

Valid values: US, EU, IN, AU, CA, SA, JP, UAE (case-insensitive).
If $ARGUMENTS is empty or unrecognized, ask the user which DC they want before proceeding.

Map the DC to its MCP URL:
- US  → `https://catalyst.zohomcp.com/mcp/message`
- EU  → `https://catalyst.zohomcp.eu/mcp/message`
- IN  → `https://catalyst.zohomcp.in/mcp/message`
- AU  → `https://catalyst.zohomcp.com.au/mcp/message`
- CA  → `https://catalyst.zohomcp.ca/mcp/message`
- SA  → `https://catalyst.zohomcp.sa/mcp/message`
- JP  → `https://catalyst.zohomcp.jp/mcp/message`
- UAE → `https://catalyst.zohomcp.ae/mcp/message`

## KCoder — switch through KCoder settings

In KCoder, the plugin's `.mcp.json` comes from KCoder's managed plugin install. Do not edit installed plugin files or look for `~/.claude/` paths (they do not exist in KCoder). Instead:

1. Run `kcoder mcp list` to see the plugin's `catalyst-by-zoho` server and any server you added earlier for another DC.
2. Turn off the plugin's US-endpoint server: the user can switch it off on Studio's MCP page (it is saved to `mcp_disabled_servers` in the user settings). Do not delete the plugin.
3. Add a user-level HTTP server for the new DC to the `mcp_servers` array in `~/.config/kcoder/settings.json`, keeping any existing entries (replace an earlier `catalyst-by-zoho-<dc>` entry instead of adding a second one):

   ```json
   { "name": "catalyst-by-zoho-<dc>", "transport": "http", "url": "<new DC MCP URL>" }
   ```

   Do not add tokens or headers; the server signs in through the browser.
4. Tell the user which setting was changed and what URL was set, that new KCoder sessions use the new server (start a new session or restart KCoder), that the new DC prompts for a browser login on first connection, and that their session on the old DC is not affected.

Steps 2–4 below apply only to Claude Code.

## Step 2 — Find all config files to update (Claude Code)

The plugin URL is cached in multiple locations. Find them all:

1. **Plugin source** — read `~/.claude/settings.json`, get the path at
   `extraKnownMarketplaces.catalyst-by-zoho.source.path`, then open `.mcp.json` at that path.

2. **Marketplace cache:**
   `~/.claude/plugins/marketplaces/catalyst-by-zoho/.mcp.json`

3. **Version cache** — run:
   `find ~/.claude/plugins/cache/catalyst-by-zoho -name ".mcp.json"`
   and update every file returned.

## Step 3 — Update the URL in every file (Claude Code)

In each file, set the `url` field to the new DC's MCP URL. Do not modify any other fields.

## Step 4 — Confirm and instruct the user (Claude Code)

Tell the user:
- Which files were updated and what URL was set.
- To restart Claude Code for the change to take effect.
- That after restart, the new DC will prompt for a browser login — this is expected and required.
- That their existing session on the old DC is not affected.
