# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/aws/agent-toolkit-for-aws.git (path `plugins/aws-data-analytics`), commit `0d6167ad2e6dfb858098c4162fe74d04c975532f`
- License: Apache-2.0 (the license file is at the upstream repository root and is not part of this plugin directory)

## Changes for KCoder

- skills/{amazon-opensearch-service,authoring-mwaa-workflow,debugging-mwaa-workflow,testing-mwaa-workflow,upgrading-mwaa-environments}/SKILL.md: the "Installed locally" example now also covers a KCoder plugin or skills directory whose base directory KCoder reports, so the model reads packaged files locally instead of via retrieve_skill

The license file was copied unchanged from the upstream repository root at the same commit.
