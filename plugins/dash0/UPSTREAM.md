# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/dash0hq/dash0-agent-plugin.git (path `.`), commit `72a84179e6c64871ad5b6fceb09e00f502de415a`
- License: Apache-2.0 (see the license file in this directory, unchanged)

## Changes for KCoder

- claude/skills/dash0-configure/SKILL.md: added KCoder notes: no `/plugin → Configure` UI or `pluginConfigs` (use the keychain keys or DASH0_AUTH_TOKEN in the environment instead), precedence items 1-2 do not apply, config files intentionally stay under `.claude/` because the plugin binary's Claude harness reads them there, and `/reload-plugins` is replaced by starting a new KCoder session

## Not adapted

- .claude/skills/copilot-local-dev/SKILL.md and qa/specs/claude/skills/*.md are repository development/QA files not exposed by the plugin manifest (skills: ./claude/skills/); left unchanged
- The plugin is Claude Code session telemetry: its hooks run claude/claude-on-event.sh with the Claude harness and parse Claude Code event payloads; whether KCoder's hook payloads produce complete spans is not verified
- userConfig options in .claude-plugin/plugin.json have no KCoder UI
