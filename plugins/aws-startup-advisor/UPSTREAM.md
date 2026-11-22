# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/aws/agent-toolkit-for-aws.git (path `plugins/aws-startup-advisor`), commit `b310d1c46b4ced6423a737542c92a3a22cfe9e96`
- License: Apache-2.0 (no top-level license file is included in this installed copy; see the upstream repository. Any license files present are unchanged)

## Changes for KCoder

- skills/agent-advisor/SKILL.md: rewrote the `$PLUGIN` definition: KCoder does not substitute `${CLAUDE_PLUGIN_ROOT}` in skills, plugin-root paths are written `../../...` relative to the skill base directory and must be resolved to absolute paths before reading or running; the skill-local fallback is kept
- skills/agent-advisor/references/diagram/build-diagram.md: `${CLAUDE_PLUGIN_ROOT}` -> `../..` in the build_diagram command
- skills/agent-advisor/references/phases/add-capabilities/add-capabilities.md: `${CLAUDE_PLUGIN_ROOT}` -> `../..` in decision-ref paths
- skills/agent-advisor/references/phases/clarify/clarify-business.md: `${CLAUDE_PLUGIN_ROOT}` -> `../..`
- skills/agent-advisor/references/phases/clarify/clarify-technical.md: `${CLAUDE_PLUGIN_ROOT}` -> `../..`
- skills/agent-advisor/references/phases/clarify/clarify.md: `${CLAUDE_PLUGIN_ROOT}` -> `../..` (model-selection ref and SCRIPTS directory)
- skills/agent-advisor/references/phases/design/design.md: `${CLAUDE_PLUGIN_ROOT}` -> `../..` in four decision-ref paths
- skills/agent-advisor/references/phases/generate/generate.md: `${CLAUDE_PLUGIN_ROOT}` -> `../..`
- skills/agent-advisor/references/phases/migration-plan/migration-plan.md: `$GCP_BASE` now uses `../../skills/gcp-to-aws` resolved against the agent-advisor skill base directory; the fallback condition now triggers when that path lacks gcp-to-aws instead of when the variable fails to expand
- skills/agent-advisor/references/phases/poc/poc.md: `${CLAUDE_PLUGIN_ROOT}` -> `../..`

## Not adapted

- skills/llm-to-bedrock/SKILL.md mentions `${CLAUDE_PLUGIN_ROOT}` only to say the skill does not depend on it and to expand `$HELPERS` to an absolute path for subagents; both are correct in KCoder and were left unchanged
- The upstream development checker tools/check-skill-refs.py recognizes `${CLAUDE_PLUGIN_ROOT}/` prefixes; it may resolve the new `../..` paths relative to each reference file rather than the skill base directory. It is a repository tool, not used at runtime
- commands/usage-data.md keeps `${CLAUDE_PLUGIN_ROOT}`, which KCoder expands in commands
- No license file is present in this installed copy; see the upstream repository

The license file was copied unchanged from the upstream repository root at the same commit.
