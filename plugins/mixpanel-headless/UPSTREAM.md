# Upstream

- Project: https://github.com/openai/plugins
- Source: https://github.com/openai/plugins.git (path `plugins/mixpanel-headless`), commit `981b02c0c44058b595f3b4180002c3ae3c806d40`
- License: MIT (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/setup/SKILL.md: added a note that `~/.claude/mixpanel/auth.json` is the Mixpanel tooling's default bridge location regardless of agent client (so it stays the same in KCoder) and that an explicit `MP_AUTH_FILE` path is also accepted

## Not adapted

- The bridge path is defined by the external mixpanel_headless library and the plugin's setup.sh, which only checks ~/.claude/mixpanel/auth.json; it was not changed
