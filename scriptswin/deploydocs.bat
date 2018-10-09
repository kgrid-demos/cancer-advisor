#!/usr/bin/env sh

cd docs
cd .vuepress
cd dist

git init
git add -A
git commit -m "Deployment to GitHub Pages"

git push -f https://github.com/kgrid-demos/cancer-advisor.git master:gh-pages
