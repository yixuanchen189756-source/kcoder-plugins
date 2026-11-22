# Upstream

- Project: https://github.com/anthropics/claude-plugins-official
- Source: https://github.com/voxel51/fiftyone-skills.git (path `.`), commit `8b87befcce6cfb86e73b4ccc1f692a0a2b6a4218`
- License: Apache-2.0 (see the license file in this directory, unchanged)

## Changes for KCoder

- skills/fiftyone-create-notebook/SKILL.md: replaced every `NotebookEdit` instruction (Directives 2 and 4, Phase 3 example, troubleshooting) with appending cells to the `.ipynb` JSON via `edit` (valid single-line cell objects, unique end-of-file anchor, ordering preserved); made the Phase 3 `Write` template end with a newline before the closing brace so the anchor matches
- skills/fiftyone-sdk-guidance/SKILL.md: added an 'On KCoder' branch that offers to add the fiftyone-docs HTTP server to `~/.config/kcoder/settings.json` after confirmation, with new-session and OAuth notes
- skills/fiftyone-sdk-guidance/README.md: added KCoder setup instructions
