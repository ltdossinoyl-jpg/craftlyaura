#!/usr/bin/env bash
set -e

CHANGED_FILES="$(git diff --name-only HEAD^ HEAD)"

if [ -z "$CHANGED_FILES" ]; then
  echo "No changed files detected. Proceeding with build."
  exit 1
fi

ONLY_IMAGE_CHANGES=true
for file in $CHANGED_FILES; do
  case "$file" in
    frontend/public/images/uploads/*)
      ;;
    *)
      ONLY_IMAGE_CHANGES=false
      break
      ;;
  esac
done

if [ "$ONLY_IMAGE_CHANGES" = "true" ]; then
  echo "Skipping Vercel build because this commit only changes uploaded images."
  exit 0
fi

echo "Proceeding with Vercel build."
exit 1
