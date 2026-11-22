#!/bin/sh
# Load this marketplace with a real KCoder CLI in a throwaway profile.
# Usage: KCODER_BIN=/path/to/kcoder scripts/kcoder-smoke.sh
# Nothing touches your personal KCoder configuration: HOME, KCODER_HOME and
# KCODER_CONFIG_DIR all point into a private temporary directory that is
# removed on exit. Plugin hooks and MCP servers are not executed.
set -eu

KCODER_BIN=${KCODER_BIN:-kcoder}
command -v "$KCODER_BIN" >/dev/null 2>&1 || { echo "kcoder CLI not found; set KCODER_BIN" >&2; exit 2; }
REPO=$(cd "$(dirname "$0")/.." && pwd)
SANDBOX=$(mktemp -d "${TMPDIR:-/tmp}/kcoder-plugins-smoke.XXXXXX")
chmod 700 "$SANDBOX"
trap 'rm -rf "$SANDBOX"' EXIT INT TERM
export HOME="$SANDBOX/home" KCODER_HOME="$SANDBOX/kcoder-home" KCODER_CONFIG_DIR="$SANDBOX/config"
mkdir -p "$HOME" "$KCODER_HOME" "$KCODER_CONFIG_DIR"
# KCoder requires the registered id to equal the manifest name.
MARKET=$(node -e 'console.log(require(process.argv[1]).name)' "$REPO/.agents/plugins/marketplace.json")
# Run outside the repository so it is registered as a user marketplace,
# not discovered as an untrusted project marketplace.
cd "$HOME"

run() { echo "+ kcoder $*" >&2; "$KCODER_BIN" "$@"; }

run marketplace add "$MARKET" --path "$REPO"
run marketplace refresh "$MARKET" --json > "$SANDBOX/refresh.json"
cat "$SANDBOX/refresh.json"

PLUGINS=$(node -e 'const m=require(process.argv[1]); console.log(m.plugins.filter(p => (typeof p.source === "string") || p.source.source === "local").map(p => p.name).join(" "))' "$REPO/.agents/plugins/marketplace.json")
for name in $PLUGINS; do
  run plugin install --marketplace "$MARKET" --name "$name"
  run plugin doctor --json > "$SANDBOX/doctor-$name.json"
  cat "$SANDBOX/doctor-$name.json"
  node -e '
    const report = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
    const plugin = report.plugins.find(p => p.name === process.argv[2]);
    if (report.healthy !== true || !plugin || plugin.compatibility?.level !== "fully_supported") {
      console.error(`doctor did not report ${process.argv[2]} as healthy and fully supported`);
      process.exit(1);
    }
  ' "$SANDBOX/doctor-$name.json" "$name"
done
run plugin list --json
echo "smoke test passed for: $PLUGINS"
