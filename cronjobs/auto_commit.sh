#!/bin/bash
source /root/cnc-node/.env
cd /root/make-account


git config --global user.email "${GITHUB_EMAIL}"
git config --global user.name "${GITHUB_USERNAME}"


git remote set-url origin https://chklff:${GITHUB_DEV_TOKEN}@github.com/chklff/make-account.git

git add .
git commit -m "Sync From Make Commit as of "$(date)
git push origin main

echo "Script ended at $(date)"
