yarn build
git add *
git commit -m "v1"
git tag -d v1
git push origin --delete v1
git tag -a v1 -m "v1"
git push --follow-tags