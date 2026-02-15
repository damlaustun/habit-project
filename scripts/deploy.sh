#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ ! -f .env.deploy ]]; then
  echo "Missing .env.deploy in project root."
  exit 1
fi

set -a
source .env.deploy
set +a

if [[ -z "${VERCEL_DEPLOY_HOOK:-}" ]]; then
  echo "VERCEL_DEPLOY_HOOK is empty in .env.deploy"
  exit 1
fi

echo "Triggering Vercel deploy..."
curl -sS -X POST "$VERCEL_DEPLOY_HOOK"
echo

echo "Deploy trigger sent. Check Vercel Deployments page."
