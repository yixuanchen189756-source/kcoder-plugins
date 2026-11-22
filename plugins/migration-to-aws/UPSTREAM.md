# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/awslabs/startups.git (path `migrate/plugins/migration-to-aws`), commit `ec681ba5d49b039dbf1ef9d87d3304205b824f3d`
- License: Apache-2.0 (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/agent-advisor/SKILL.md: rewrote the `$PLUGIN` definition: KCoder does not expand `${CLAUDE_PLUGIN_ROOT}`; `$PLUGIN` = two levels above the reported skill base directory, always expanded to an absolute path before reads/shell commands
- skills/agent-advisor/references/{diagram/build-diagram,phases/add-capabilities/add-capabilities,phases/clarify/clarify-business,phases/clarify/clarify-technical,phases/clarify/clarify,phases/design/design,phases/generate/generate,phases/migration-plan/migration-plan,phases/poc/poc}.md: `${CLAUDE_PLUGIN_ROOT}` -> `$PLUGIN`; shell snippets note that `$PLUGIN` must be substituted (not a shell variable); migration-plan fallback paragraph reworded around `$PLUGIN`
- skills/llm-to-bedrock/SKILL.md: added `kcoder plugin install --marketplace <marketplace-id> --name migration-to-aws` next to `/plugin install`, noted KCoder's `skill` tool and its "Skill base directory" line

The license file was copied unchanged from the upstream repository root at the same commit.
