# Basalt Core

The shared foundation for the Basalt family of offline-first Android apps. Each app is its own repository; this package gives them one look, one settings store and one way to update themselves.

## What is in here

| Area | What it provides |
|---|---|
| `theme/` | Design tokens (colour, spacing, radius, type), light and dark palettes, per-app accent, `ThemeProvider` with a persisted system/light/dark preference |
| `ui/` | `Screen`, `Text`, `Button`, `Card`, `ListItem`, `ProgressBar`, `SegmentedControl`, `EmptyState`, `Toast`, `ErrorBoundary`, spring-animated `Pressable` |
| `storage/` | `createSetting()` — typed, persisted settings that React components subscribe to |
| `updater/` | Self-update from GitHub Releases: check, download, verify, hand to the Android installer |
| `utils/` | Version comparison, byte/duration formatting, user-facing errors |

## How the updater works

The apps are distributed as APKs attached to GitHub Releases, not through an app store.

1. On launch (at most once every 6 hours) the app asks the GitHub API for the repository's latest release.
2. If the release tag is newer than the installed version, the user sees an update card with the release notes.
3. The APK is downloaded to the app's cache. Its size is checked, and its SHA-256 is compared with the digest GitHub publishes for the asset.
4. The verified file is handed to Android's package installer, where the user confirms.

Android itself refuses an update that is not signed with the same key as the installed app, so a tampered APK cannot replace a genuine install. The only network request any Basalt app makes on its own is this update check.

## Using it in an app

```jsonc
// package.json
"dependencies": {
  "@basalt/core": "github:muhammadahmad545-code/basalt-core#v0.1.0"
}
```

```tsx
import { ThemeProvider, ToastProvider, ErrorBoundary, useUpdater, UpdateCard } from '@basalt/core';

const accent = { dark: '#2DE1C2', light: '#0B8F7A' };

export default function Root() {
  return (
    <ErrorBoundary>
      <ThemeProvider accent={accent}>
        <ToastProvider>{/* app */}</ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
```

The package ships TypeScript source and is compiled by the consuming app's Metro bundler. It contains no native code.

## Development

```bash
npm install
npm test
```

## License

MIT
