# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/aws/agent-toolkit-for-aws.git (path `plugins/aws-core`), commit `34b3eccfd8b619ea0cb4ba04a9be9dfefebd94e7`
- License: Apache-2.0 (the installed plugin root ships no license file; see the upstream repository)

## Changes for KCoder

- skills/amazon-bedrock/SKILL.md, skills/aws-cloudformation/SKILL.md, skills/aws-containers/SKILL.md: added 'the skill base directory KCoder shows when it loads the skill' to the 'Installed locally' examples
- skills/aws-observability/references/cloudwatch/dynamic-instrumentation.md: noted that in KCoder `SKILL_DIR` is the skill base directory shown when the skill loaded

The license file was copied unchanged from the upstream repository root at the same commit.
