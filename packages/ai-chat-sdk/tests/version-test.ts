// Test file to verify auto-versioning functionality
import { AIChatSDK, SDK_VERSION, SDK_NAME } from '../src/index';

console.log('=== Auto-Versioning Test ===\n');

// Test 1: Direct version access
console.log('1. Direct version access:');
console.log(`   SDK Name: ${SDK_NAME}`);
console.log(`   SDK Version: ${SDK_VERSION}`);
console.log(`   Type: ${typeof SDK_VERSION}\n`);

// Test 2: Version from SDK instance
console.log('2. Version from SDK instance:');
const sdk = new AIChatSDK();
const versionInfo = sdk.getVersionInfo();
console.log(`   Version Info:`, versionInfo);
console.log(`   Version Type: ${typeof versionInfo.version}\n`);

// Test 3: Telemetry without sdkVersion
console.log('3. Telemetry configuration test:');
const telemetrySDK = new AIChatSDK({
  telemetry: {
    enabled: true
    // No sdkVersion specified - should auto-detect
  }
});

const telemetry = telemetrySDK.getTelemetry();
if (telemetry) {
  console.log(`   Telemetry created successfully`);
  console.log(`   Telemetry SDK Version: ${(telemetry as any).sdkVersion}`);
} else {
  console.log(`   No telemetry configured`);
}

console.log('\n=== Test Complete ===');
console.log('✅ If you see version numbers above, auto-versioning is working!');
console.log('✅ The version should match your package.json version');
console.log('✅ Using professional constructor pattern: new AIChatSDK()');
