#!/bin/bash
set -euo pipefail

# 远程主机与目录（与 deploy/docker-compose 中 nginx 挂载 html/dist 一致）
REMOTE_USER_HOST="${REMOTE_USER_HOST:-root@139.224.68.145}"
REMOTE_DIST_DIR="${REMOTE_DIST_DIR:-~/private_chef_server/nginx/html/dist}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "build client"
npm run build

if [[ ! -d dist ]]; then
  echo "error: dist 目录不存在，构建可能失败" >&2
  exit 1
fi

echo "sync dist -> ${REMOTE_USER_HOST}:${REMOTE_DIST_DIR}/"
ssh "${REMOTE_USER_HOST}" "mkdir -p ${REMOTE_DIST_DIR}"
rsync -avz --delete -e ssh dist/ "${REMOTE_USER_HOST}:${REMOTE_DIST_DIR}/"

echo "deploy complete: ${REMOTE_USER_HOST}:${REMOTE_DIST_DIR}"
