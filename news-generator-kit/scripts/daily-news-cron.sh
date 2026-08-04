#!/usr/bin/env bash
#
# 每日新闻自动生成（Linux cron）
#
#   chmod +x scripts/daily-news-cron.sh
#   0 7 * * * /绝对路径/news-generator-kit/scripts/daily-news-cron.sh
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_FILE="${NEWS_CRON_LOG:-$PROJECT_ROOT/logs/news-cron.log}"

mkdir -p "$(dirname "$LOG_FILE")"

log() {
  local msg="[$(date '+%Y-%m-%d %H:%M:%S')] $*"
  echo "$msg" | tee -a "$LOG_FILE"
}

export PATH="/usr/local/bin:/usr/bin:/bin:$HOME/.nvm/versions/node/current/bin:$HOME/.local/share/fnm/current/bin:$PATH"

cd "$PROJECT_ROOT"

log "=== daily news generation start ==="
log "project root: $PROJECT_ROOT"

if ! command -v node >/dev/null 2>&1; then
  log "✗ node not found on PATH"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  log "✗ npm not found on PATH"
  exit 1
fi

log "node: $(node --version)"
log "npm:  $(npm --version)"

if npm run news:generate:daily >>"$LOG_FILE" 2>&1; then
  log "✓ generation succeeded"
else
  log "✗ generation failed (see log above)"
  exit 1
fi

if [ "${NEWS_CRON_GIT_PUSH:-}" = "1" ]; then
  if command -v git >/dev/null 2>&1 && git -C "$PROJECT_ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    log "→ git commit & push content/news"
    git -C "$PROJECT_ROOT" add content/news/
    if git -C "$PROJECT_ROOT" diff --cached --quiet; then
      log "  (no new files to commit)"
    else
      git -C "$PROJECT_ROOT" commit -m "chore(news): daily auto-generated article $(date '+%F')"
      git -C "$PROJECT_ROOT" push
      log "✓ git push done"
    fi
  else
    log "⚠ NEWS_CRON_GIT_PUSH=1 but git repo not found"
  fi
fi

if [ -n "${NEXT_REBUILD_HOOK_URL:-}" ]; then
  log "→ triggering rebuild hook"
  if curl -fsSL -X POST "$NEXT_REBUILD_HOOK_URL" >>"$LOG_FILE" 2>&1; then
    log "✓ rebuild triggered"
  else
    log "⚠ rebuild hook returned non-zero"
  fi
fi

log "=== done ==="
