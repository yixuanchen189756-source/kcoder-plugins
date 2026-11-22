#!/bin/sh
# Install marketplace entries with a real KCoder CLI and require a healthy,
# fully supported result for each one.
#
# Usage:
#   KCODER_BIN=/path/to/kcoder scripts/kcoder-smoke.sh            # every entry
#   KCODER_BIN=/path/to/kcoder scripts/kcoder-smoke.sh NAME ...   # selected entries
#   JOBS=8 ...                                                    # parallel installs (default 4)
#
# Every entry is installed into its own throwaway profile: HOME, KCODER_HOME and
# KCODER_CONFIG_DIR point into a private temporary directory removed on exit, so
# your personal KCoder configuration is never touched. Remote entries are cloned
# from their pinned commit. Plugin hooks and MCP servers are not executed.
set -eu

KCODER_BIN=${KCODER_BIN:-kcoder}
command -v "$KCODER_BIN" >/dev/null 2>&1 || { echo "kcoder CLI not found; set KCODER_BIN" >&2; exit 2; }
KCODER_BIN=$(command -v "$KCODER_BIN")
REPO=$(cd "$(dirname "$0")/.." && pwd)
MANIFEST="$REPO/.agents/plugins/marketplace.json"
export KCODER_BIN REPO MANIFEST

if [ "${1:-}" = "--one" ]; then
  name=$2
  sandbox=$(mktemp -d "${TMPDIR:-/tmp}/kcoder-plugins-smoke.XXXXXX")
  chmod 700 "$sandbox"
  trap 'rm -rf "$sandbox"' EXIT INT TERM
  export HOME="$sandbox/home" KCODER_HOME="$sandbox/kcoder-home" KCODER_CONFIG_DIR="$sandbox/config" GIT_TERMINAL_PROMPT=0
  mkdir -p "$HOME" "$KCODER_HOME" "$KCODER_CONFIG_DIR"
  # Entries whose MCP servers need credentials are checked with placeholder
  # values; nothing is sent anywhere because MCP servers are not started.
  for var in $(node -e 'const c=require(process.argv[1]).find(p => p.name === process.argv[2]); console.log((c?.env ?? []).join(" "))' "$REPO/catalog/plugins.json" "$name" 2>/dev/null); do
    export "$var=kcoder-placeholder-not-a-secret"
  done
  # KCoder requires the registered id to equal the manifest name. Run outside
  # the repository so it is a user marketplace, not an untrusted project one.
  market=$(node -e 'console.log(require(process.argv[1]).name)' "$MANIFEST")
  cd "$HOME"
  if ! "$KCODER_BIN" marketplace add "$market" --path "$REPO" > "$sandbox/log" 2>&1 ||
     ! "$KCODER_BIN" plugin install --marketplace "$market" --name "$name" >> "$sandbox/log" 2>&1 ||
     ! "$KCODER_BIN" plugin doctor --json > "$sandbox/doctor.json" 2>> "$sandbox/log"; then
    echo "FAIL $name: install failed"; sed 's/^/  /' "$sandbox/log" | tail -20; exit 1
  fi
  node -e '
    const report = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
    // Match the installed entry id; a package may use a different manifest name.
    const plugin = report.plugins.find(p => p.id === `${process.argv[2]}@${process.argv[3]}`);
    const level = plugin?.compatibility?.level;
    if (report.healthy !== true || level !== "fully_supported") {
      console.log(`FAIL ${process.argv[2]}: healthy=${report.healthy} level=${level}`);
      for (const issue of plugin?.compatibility?.issues ?? []) console.log(`  ${issue.code}: ${issue.message}`);
      process.exit(1);
    }
    console.log(`ok   ${process.argv[2]} (${plugin.compatibility.supported_capabilities.join(", ")})`);
  ' "$sandbox/doctor.json" "$name" "$market"
  exit
fi

if [ "$#" -gt 0 ]; then
  NAMES=$*
else
  NAMES=$(node -e 'console.log(require(process.argv[1]).plugins.map(p => p.name).join(" "))' "$MANIFEST")
fi
RESULTS=$(mktemp "${TMPDIR:-/tmp}/kcoder-plugins-results.XXXXXX")
trap 'rm -f "$RESULTS"' EXIT INT TERM
# shellcheck disable=SC2086
printf '%s\n' $NAMES | xargs -P "${JOBS:-4}" -I{} sh "$0" --one {} > "$RESULTS" || true
sort "$RESULTS"
total=$(grep -c '^ok \|^FAIL ' "$RESULTS" || true)
failed=$(grep -c '^FAIL ' "$RESULTS" || true)
echo "$((total - failed))/$total entries healthy and fully supported"
[ "$failed" -eq 0 ]
