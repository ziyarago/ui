# Deploying the docs site to your own server

The docs site is static (Nuxt `generate`, every page is real HTML). A GitHub Actions workflow builds it, ships it over SSH as a new release directory and switches the `current` symlink atomically. The last 5 releases stay on disk, so rollback is instant. Nothing on the server is deleted or edited: the setup only adds one nginx file, one system user and one directory.

## 1. Deploy key (your machine)
```bash
ssh-keygen -t ed25519 -N "" -C "docs-deploy" -f ~/.ssh/docs_deploy
```

## 2. Server setup (root, once, additive and idempotent)
```bash
scp -r deploy root@<server>:/root/docs-site/
scp ~/.ssh/docs_deploy.pub root@<server>:/root/docs-site/ci_key.pub
ssh root@<server> 'cd /root/docs-site && DEPLOY_PUBKEY_FILE=/root/docs-site/ci_key.pub ./deploy/server/setup-ziyara-vip.sh'
```
The script backs up `/etc/nginx`, creates the user `ziyara-deploy` (no sudo; the key may only run `receive`, `activate`, `rollback`, `status`), the directory `/var/www/ziyara-vip`, adds `sites-available/ziyara.vip` and reloads nginx only if `nginx -t` passes. Edit the domain in `deploy/nginx/*.conf` and the paths if you use another site name.

## 3. GitHub secrets and variables
- Secrets: `ZIYARA_DEPLOY_KEY` (the private key), `ZIYARA_KNOWN_HOSTS` (`ssh-keyscan -p <port> <server>`).
- Variables: `ZIYARA_DEPLOY_HOST`, `ZIYARA_DEPLOY_PORT`, optional `NUXT_PUBLIC_GA_ID`, `NUXT_PUBLIC_YM_ID`, `NUXT_PUBLIC_GOOGLE_VERIFICATION`, `NUXT_PUBLIC_YANDEX_VERIFICATION`.

## 4. DNS and HTTPS
1. Point the `A` record of the domain (and `www`) to the server. Do not touch MX or SPF records.
2. Issue the certificate without touching other sites: `certbot certonly --webroot -w /var/www/letsencrypt -d <domain> -d www.<domain>`.
3. Switch nginx to the HTTPS config: `./deploy/server/setup-ziyara-vip.sh --https`. It restores the previous config automatically if `nginx -t` fails.
4. Add `renew_hook = systemctl reload nginx` to `/etc/letsencrypt/renewal/<domain>.conf` and test with `certbot renew --dry-run --no-random-sleep-on-renew --cert-name <domain>`.

nginx older than 1.25.1 does not know the `http2 on;` directive: the provided config uses `listen 443 ssl http2;`.

## 5. Deploy and roll back
Every release deploys automatically (`release.yml` calls `deploy-docs.yml`). Manual runs: Actions → Deploy docs → Run workflow → `deploy` or `rollback`.
