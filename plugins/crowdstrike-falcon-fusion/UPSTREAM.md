# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/CrowdStrike/fusion-skills.git (path `.`), commit `d4e2abf93b1f0900fcc67fe040e98d086fa1fb0c`
- License: MIT (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/{authoring,deployment,execution,lookup-files,setup}/SKILL.md: "Running the scripts" notes now say KCoder uses its reported absolute skill base directory for `<dir>` (no `$CLAUDE_PLUGIN_ROOT` expansion)
- skills/authoring/SKILL.md, skills/workflows/SKILL.md: added `kcoder plugin install --marketplace <marketplace-id> --name crowdstrike-falcon-foundry` next to `claude plugin install`
