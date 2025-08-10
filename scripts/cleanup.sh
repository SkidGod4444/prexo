
PARENT_FOLDERS=(
  "."
  "./apps/api"
  "./apps/changelogs"
  "./apps/console"
  "./apps/docs"
  "./apps/www"
)

ITEMS_TO_DELETE=(
  "node_modules"
  ".turbo"
  ".next"
  ".source"
  "tsconfig.tsbuildinfo"
)

for parent in "${PARENT_FOLDERS[@]}"; do
  for item in "${ITEMS_TO_DELETE[@]}"; do
    TARGET="$parent/$item"
    if [ -d "$TARGET" ]; then
      echo ">> Deleting '$TARGET' ..."
      rm -rf "$TARGET"
    else
      echo ">> Folder/File '$TARGET' does not exist, skipping..."
    fi
  done
done
