#!/bin/bash

cd /root/make-account


git config --global user.email "chklff@gmail.com"
git config --global user.name "chklff"


git remote set-url origin https://chklff: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@github.com/chklff/make-account.git

git add .
git commit -m "Sync From Make Commit as of $(date)"
git push origin main

echo "Script ended at $(date)"
