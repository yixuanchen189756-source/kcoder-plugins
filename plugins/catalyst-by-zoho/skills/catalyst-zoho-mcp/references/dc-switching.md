## DC Switching — Catalyst Zoho MCP

Use this reference when the user wants to switch the Catalyst MCP server to a different data center.

---

## DC URL Map

| DC | Region | MCP URL |
|----|--------|---------|
| US | United States | `https://catalyst.zohomcp.com/mcp/message` |
| EU | Europe | `https://catalyst.zohomcp.eu/mcp/message` |
| IN | India | `https://catalyst.zohomcp.in/mcp/message` |
| AU | Australia | `https://catalyst.zohomcp.com.au/mcp/message` |
| CA | Canada | `https://catalyst.zohomcp.ca/mcp/message` |
| SA | Saudi Arabia | `https://catalyst.zohomcp.sa/mcp/message` |
| JP | Japan | `https://catalyst.zohomcp.jp/mcp/message` |
| UAE | United Arab Emirates | `https://catalyst.zohomcp.ae/mcp/message` |

---

## KCoder

In KCoder, the plugin's `.mcp.json` comes from KCoder's managed plugin install. Do not edit installed plugin files or look for `~/.claude/` paths (they do not exist in KCoder). Instead:

1. Run `kcoder mcp list` to see the plugin's `catalyst-by-zoho` server and any server you added earlier for another DC.
2. Turn off the plugin's US-endpoint server: the user can switch it off on Studio's MCP page (it is saved to `mcp_disabled_servers` in the user settings). Do not delete the plugin.
3. Add a user-level HTTP server for the new DC to the `mcp_servers` array in `~/.config/kcoder/settings.json`, keeping any existing entries (replace an earlier `catalyst-by-zoho-<dc>` entry instead of adding a second one):

   ```json
   { "name": "catalyst-by-zoho-<dc>", "transport": "http", "url": "<new DC MCP URL>" }
   ```

   Do not add tokens or headers; the server signs in through the browser.
4. Tell the user which setting was changed and what URL was set, that new KCoder sessions use the new server (start a new session or restart KCoder), that the new DC prompts for a browser login on first connection, and that their session on the old DC is not affected.

---

## Claude Code

Claude Code loads the MCP server URL from the catalyst-by-zoho plugin. The plugin config is cached in multiple locations — **all of them must be updated** or the switch has no effect.

**Files to update:**

1. **Plugin source** — find the source `.mcp.json` by checking `~/.claude/settings.json` under `extraKnownMarketplaces.catalyst-by-zoho.source.path`, then read the `.mcp.json` at that path.

2. **Marketplace cache:**
   `~/.claude/plugins/marketplaces/catalyst-by-zoho/.mcp.json`

3. **Version cache** — find it with:
   ```
   find ~/.claude/plugins/cache/catalyst-by-zoho -name ".mcp.json"
   ```

In each file, update the `url` field to the new DC's MCP URL. Do not change any other fields.

**After updating:** Instruct the user to restart Claude Code. The new DC server will require re-authentication — a browser login prompt appears on the next connection. Credentials on the old DC are not affected.

---

## Claude Desktop

Edit `claude_desktop_config.json`:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Update the `url` field under `mcpServers.catalyst-by-zoho` to the new DC's MCP URL. Restart Claude Desktop.

---

## Cursor

Edit `.cursor/mcp.json` in the project root. Update the `url` field under `mcpServers.catalyst-by-zoho`. Restart Cursor.

---

## GitHub Copilot (VS Code)

Edit `.vscode/mcp.json` in the workspace root. Update the `url` field under `servers.catalyst-by-zoho`. Reload the VS Code window.

---

## What to Tell the User After Switching

- Config files have been updated to `<new-dc>` DC.
- Restart your AI client to apply the change.
- After restart, you'll be prompted to log in to your Zoho account for the new DC — this is expected.
- Your session on the old DC is not affected.
- Until authentication completes, only `authenticate` and `complete_authentication` tools will be visible.

---

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| DC switch has no effect after restart | Plugin cache not updated | Find and update all `.mcp.json` files under `~/.claude/plugins/` referencing `zohomcp` |
| Only `authenticate` tool visible after switch | Not yet authorized on the new DC | Complete the browser login flow that appears after restarting |
| Org data from wrong DC appears | Cache was partially updated | Verify all three Claude Code cache paths have the new URL |
| KCoder still connects to the old DC | Plugin server still enabled, or session started before the change | Confirm with `kcoder mcp list` that the plugin's `catalyst-by-zoho` server is off and the `catalyst-by-zoho-<dc>` entry is present, then start a new session |
