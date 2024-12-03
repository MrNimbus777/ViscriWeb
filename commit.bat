@echo off
if exist %1 (
    cd %1
    git add .
    git commit "commit"
    git branch -M main
    git push -u origin main
)