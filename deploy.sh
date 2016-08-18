#!/bin/bash

# For deploying on Travis-CI

set -o errexit -o nounset

if [ "$TRAVIS_BRANCH" != "master" ]
then
  echo "This commit was made against the $TRAVIS_BRANCH and not the master! No deploy!"
  exit 0
fi

rev=$(git rev-parse --short HEAD)

cd _site

git init
git config user.name "rajrsingh"
git config user.email "rrsingh@us.ibm.com"

git remote add upstream "https://$GH_TOKEN@github.com/ibm-cds-labs/ibm-cds-labs.github.io.git"
git fetch upstream
git reset upstream/gh-pages

touch .

git add -A .
git commit -m "rebuild pages at ${rev}"
git push -q upstream HEAD:gh-pages