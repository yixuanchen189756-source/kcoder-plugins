# Upstream

- Project: https://github.com/openai/plugins
- Source: https://github.com/openai/plugins.git (path `plugins/hyperframes`), commit `981b02c0c44058b595f3b4180002c3ae3c806d40`
- License: Apache-2.0 (no top-level license file is included in this installed copy; see the upstream repository. Any license files present are unchanged)

## Changes for KCoder

- skills/website-to-hyperframes/references/step-5-vo.md: ElevenLabs tools are now named as `search_voices` / `text_to_speech` from the `elevenlabs` MCP server; the HeyGen option names the `text_to_speech` tool from a HeyGen MCP server and explains that the original `mcp__claude_ai_HeyGen__` name is a Claude.ai connector

## Not adapted

- HeyGen is a Claude.ai connector; in KCoder it is only available if the user configures a HeyGen MCP server
- No license file is present in this installed copy; see the upstream repository

Upstream declares Apache-2.0 without shipping the license text; the standard Apache License 2.0 text is included as the license requires.
