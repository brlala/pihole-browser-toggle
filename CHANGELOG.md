# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.1] - 2026-04-19

### Removed
- Dropped the `tabs` permission from the manifest. Reloading the active tab
  after disabling only needs `activeTab`, so the broader permission was
  unnecessary. Fixes Chrome Web Store rejection "Purple Potassium".

## [1.0.0] - 2026-04-15

### Added
- Initial release for Pi-hole v6.
- Toolbar popup with duration presets (10s, 30s, 1m, 5m), custom duration
  (seconds / minutes / hours), and "Hold" mode to disable blocking
  indefinitely.
- Live status indicator with a tabular-mono countdown to auto-resume.
- "Resume blocking" action surfaced automatically when blocking is disabled.
- Options page with host, optional password, and "reload active tab after
  disabling" preference.
- Test-connection flow that surfaces Pi-hole's own error hints.
- Dynamic host permission request on save, so the extension only has access
  to the Pi-hole origin the user configures.
- Dark-only refined-minimal interface (Host Grotesk + Geist Mono, warm amber
  accent).
- `package.bat` / `package.ps1` to build a store-ready zip with the version
  taken from `manifest.json`.
- `icons/generate.html` — one-click generator for the three toolbar icons
  and the 440×280 promo tile.

[Unreleased]: ./CHANGELOG.md
[1.0.1]: ./CHANGELOG.md#101---2026-04-19
[1.0.0]: ./CHANGELOG.md#100---2026-04-15
