#!/usr/bin/env bash
# One-time, additive setup of ziyara.vip on the web server. Run as root:  ./setup-ziyara-vip.sh [--https]
# It NEVER edits or deletes existing nginx files or sites. It only:
#   1. makes a dated backup of /etc/nginx and /etc/letsencrypt/renewal
#   2. creates the system user ziyara-deploy (no sudo, no password) and /var/www/ziyara-vip
#   3. installs /usr/local/bin/ziyara-deploy-shell (the only thing the CI key may run)
#   4. adds /etc/nginx/sites-available/ziyara.vip (+ symlink) and reloads nginx ONLY if `nginx -t` passes
# Stage 2 (--https) swaps in the HTTPS config once /etc/letsencrypt/live/ziyara.vip exists.
# Env: DEPLOY_PUBKEY_FILE=/path/to/ci_key.pub   (public key of the GitHub Actions deploy key)
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
repo="$(cd "$here/../.." && pwd)"
[ "$(id -u)" -eq 0 ] || { echo "run as root"; exit 1; }
stage=http; [ "${1:-}" = "--https" ] && stage=https
site=/etc/nginx/sites-available/ziyara.vip
link=/etc/nginx/sites-enabled/ziyara.vip

echo "== backup"
b=/root/backup-nginx-$(date +%Y%m%d-%H%M%S).tgz
tar czf "$b" /etc/nginx /etc/letsencrypt/renewal 2>/dev/null && echo "saved $b"

if [ "$stage" = http ]; then
  echo "== user and directories"
  id ziyara-deploy >/dev/null 2>&1 || useradd --system --create-home --shell /bin/sh --home-dir /home/ziyara-deploy ziyara-deploy
  install -d -o ziyara-deploy -g ziyara-deploy -m 755 /var/www/ziyara-vip /var/www/ziyara-vip/releases
  if [ ! -e /var/www/ziyara-vip/current ]; then
    install -d -o ziyara-deploy -g ziyara-deploy /var/www/ziyara-vip/releases/0.0.0
    printf '<!doctype html><meta charset="utf-8"><title>ziyara.vip</title><p>@ziyarago/ui docs: first deploy pending.</p>\n' > /var/www/ziyara-vip/releases/0.0.0/index.html
    printf '<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><title>404</title><p>Not found</p>\n' > /var/www/ziyara-vip/releases/0.0.0/404.html
    chown -R ziyara-deploy:ziyara-deploy /var/www/ziyara-vip/releases/0.0.0
    ln -s /var/www/ziyara-vip/releases/0.0.0 /var/www/ziyara-vip/current; chown -h ziyara-deploy:ziyara-deploy /var/www/ziyara-vip/current
  fi

  echo "== deploy shell and key"
  install -m 755 "$here/ziyara-deploy-shell" /usr/local/bin/ziyara-deploy-shell
  if [ -n "${DEPLOY_PUBKEY_FILE:-}" ]; then
    install -d -o ziyara-deploy -g ziyara-deploy -m 700 /home/ziyara-deploy/.ssh
    key="$(cat "$DEPLOY_PUBKEY_FILE")"
    printf 'restrict,command="/usr/local/bin/ziyara-deploy-shell" %s\n' "$key" > /home/ziyara-deploy/.ssh/authorized_keys
    chown ziyara-deploy:ziyara-deploy /home/ziyara-deploy/.ssh/authorized_keys; chmod 600 /home/ziyara-deploy/.ssh/authorized_keys
    echo "deploy key installed"
  else echo "DEPLOY_PUBKEY_FILE not set: key NOT installed"; fi
  conf="$repo/deploy/nginx/ziyara.vip.http.conf"
else
  [ -s /etc/letsencrypt/live/ziyara.vip/fullchain.pem ] || { echo "no certificate for ziyara.vip yet, issue it first (see docs/DEPLOY.md)"; exit 1; }
  conf="$repo/deploy/nginx/ziyara.vip.https.conf"
fi

echo "== nginx ($stage)"
[ -e "$site" ] && cp -a "$site" "$site.bak-$(date +%Y%m%d-%H%M%S)"
install -m 644 "$conf" "$site"
ln -sfn "$site" "$link"
if nginx -t; then systemctl reload nginx && echo "nginx reloaded"; else
  echo "nginx -t FAILED: rolling back"; rm -f "$link"; ls -t "$site".bak-* 2>/dev/null | head -1 | xargs -r -I{} cp -a {} "$site"; [ -e "$site.bak-"* ] && ln -sfn "$site" "$link"; nginx -t && systemctl reload nginx; exit 1
fi
echo "done: stage $stage"
