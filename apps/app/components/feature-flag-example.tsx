"use client";

import { useFeatureFlag } from "@/hooks/use-feature-flags";

export const FeatureFlagExample = () => {
  const { value: showNewFeature } = useFeatureFlag("betaFeatures", false);

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Feature Flags Demo</h3>

      {showNewFeature && (
        <div className="bg-green-100 dark:bg-green-900 p-3 rounded mb-2">
          <p className="text-green-800 dark:text-green-200">
            🎉 New feature is enabled!
          </p>
        </div>
      )}

      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p>Show New Feature: {showNewFeature ? "✅" : "❌"}</p>
      </div>
    </div>
  );
};
