# Pi-hole Toggle — Privacy Policy

_Last updated: 2026-04-15_

Pi-hole Toggle is a Chrome extension that communicates with a Pi-hole instance you
own and control. It does not contain analytics, telemetry, ad networks, remote
logging, or any third-party services.

## What the extension stores

The extension stores the following on your device only, via
`chrome.storage.local`:

- **Pi-hole address** (e.g. `http://pihole.home`) — the URL of your Pi-hole.
- **Password** — your Pi-hole web/app password, if you set one. Stored in
  plain text in the browser's local storage. Leave blank if your Pi-hole has no
  password.
- **Reload-tab preference** — whether to refresh the active tab after
  disabling blocking.

A short-lived session identifier (`sid`) returned by your Pi-hole is cached in
`chrome.storage.session` so that you don't need to re-authenticate on every
action. It is cleared when the browser session ends.

## What the extension transmits

The extension sends HTTP(S) requests **only** to the Pi-hole address you
configure. Specifically:

- `POST /api/auth` — to authenticate.
- `GET /api/dns/blocking` — to read the current blocking status.
- `POST /api/dns/blocking` — to disable or re-enable blocking.

No data is sent to the extension author, to Google, or to any third party.

## What the extension collects

Nothing. The extension does not collect, aggregate, upload, or share any
information about you, your browsing, your Pi-hole, or your device.

## Permissions

- `storage` — to persist your settings locally.
- `activeTab`, `tabs` — to reload the currently active tab after you disable
  blocking, if that preference is enabled.
- `optional_host_permissions` (`*://*/*`) — requested on-demand for the
  specific Pi-hole origin you configure, and for no other host.

## Contact

Questions? Open an issue on the project's repository.
