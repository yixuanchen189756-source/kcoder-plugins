# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/CrowdStrike/foundry-skills.git (path `.`), commit `90082f829c6c2c4192b1459a01488863a1e82d1e`
- License: MIT (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/debugging-workflows/references/install-and-visual-debugging.md: added `kcoder mcp add playwright --command npx --args @playwright/mcp@latest` next to the Claude Code command
- skills/e2e-testing/references/debugging-with-mcp.md: added the KCoder Playwright MCP setup command and restart note

## Not adapted

- Surrounding prose still says 'Claude Code can read images'; KCoder can also read image files with `read`, so it was left unchanged
