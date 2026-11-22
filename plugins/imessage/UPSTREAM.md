# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/anthropics/claude-plugins-official.git (path `external_plugins/imessage`), commit `73c8cf3ea7e296057b467990f2f5d61b4c922260`
- License: Apache-2.0 (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/access/SKILL.md: explains that ~/.claude/channels/imessage is the server's own default state directory (unchanged under KCoder) and that IMESSAGE_STATE_DIR overrides it
- skills/configure/SKILL.md: same state-directory note; Full Disk Access hint mentions the app where Claude Code or KCoder runs
- README.md: KCoder note with install command and the lack of channel delivery

## Notes

- KCoder does not implement Claude Code channels (`claude --channels`), so inbound iMessages are not pushed into a KCoder session; whether the server's tools work without channel delivery was not verified (no plugin code was run)
