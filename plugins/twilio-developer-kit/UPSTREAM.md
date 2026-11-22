# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/twilio/ai.git (path `.`), commit `803790a281f0ef11d2928ffb41bc8422237fb434`
- License: MIT (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/twilio/twilio-conversation-intelligence/SKILL.md, skills/twilio/twilio-conversation-orchestrator/SKILL.md: replaced `/.claude/skills/<name>/SKILL.md` links with relative `../<skill>/SKILL.md` links to the bundled sibling skills

## Not changed

- The 'Twilio Conversations (unified stack)' skill is not bundled in this plugin; its dead `/.claude/skills/conversations` link was turned into plain text marked as not bundled
