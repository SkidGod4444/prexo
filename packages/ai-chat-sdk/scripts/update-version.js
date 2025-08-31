#!/usr/bin/env node

/**
 * Script to automatically update the version.ts file with the current package.json version
 * This ensures the SDK always reports the correct version without manual updates
 */

const fs = require('fs');
const path = require('path');

function updateVersion() {
  try {
    // Read package.json
    const packagePath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const version = packageJson.version;
    const name = packageJson.name;

    // Read the current version.ts file
    const versionPath = path.join(__dirname, '..', 'src', 'version.ts');
    let versionContent = fs.readFileSync(versionPath, 'utf8');

    // Update the version
    versionContent = versionContent.replace(
      /export const SDK_VERSION = ['"`][^'"`]*['"`];/,
      `export const SDK_VERSION = '${version}';`
    );

    // Update the name if it changed
    versionContent = versionContent.replace(
      /export const SDK_NAME = ['"`][^'"`]*['"`];/,
      `export const SDK_NAME = '${name}';`
    );

    // Write the updated file
    fs.writeFileSync(versionPath, versionContent);

    console.log(`✅ Updated version.ts with version ${version}`);
  } catch (error) {
    console.error('❌ Failed to update version:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  updateVersion();
}

module.exports = { updateVersion };
