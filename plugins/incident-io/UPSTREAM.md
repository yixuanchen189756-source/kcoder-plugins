# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/incident-io/skills.git (path `plugins/incident-io`), commit `00f7d1dc80892deb1656f1cf577dd073a4a2de10`
- License: MIT (no top-level license file is included in this installed copy; see the upstream repository. Any license files present are unchanged)

## Changes for KCoder

- skills/skill-authoring/references/agent-environments.md: added how KCoder exposes the skill base directory (plugin root two levels up) next to the Claude Code `${CLAUDE_PLUGIN_ROOT}` description, in both places
- skills/extensions/references/extensions-product.md: example of existing team skill folders now lists `.kcoder/skills` beside `.claude/skills`

## Not adapted

- skills/skill-authoring/SKILL.md and references/format.md already say `${CLAUDE_PLUGIN_ROOT}` in Claude Code, otherwise two directories above the skill folder; correct for KCoder, left unchanged
- No license file is present in this installed copy; see the upstream repository

The license file was copied unchanged from the upstream repository root at the same commit.
