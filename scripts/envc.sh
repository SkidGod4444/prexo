#!/bin/bash
set -e

# Customizable paths
ROOT_ENV_FILE="./.env"  # You can change this to your actual root env path
APP_ENV_PATHS=(./apps/www ./apps/api ./apps/console)  # Replace with your actual app-level paths

if [ ! -f "$ROOT_ENV_FILE" ]; then
  echo "Root .env file not found at $ROOT_ENV_FILE"
  exit 1
fi

for app_path in "${APP_ENV_PATHS[@]}"; do
  if [ -d "$app_path" ]; then
    APP_ENV_FILE="$app_path/.env"
    cp "$ROOT_ENV_FILE" "$APP_ENV_FILE"
    echo "Copied $ROOT_ENV_FILE to $APP_ENV_FILE"
  else
    echo "Directory not found: $app_path"
  fi
done

echo "All specified app .env files updated."
