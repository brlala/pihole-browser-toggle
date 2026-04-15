# Pi-hole Toggle

Chrome extension to temporarily disable Pi-hole blocking from the toolbar. Targets **Pi-hole v6** (REST API).

## Install (unpacked)

1. Open `chrome://extensions`.
2. Toggle **Developer mode** on.
3. Click **Load unpacked** and select this folder.
4. Click the extension icon → **Configure Pi-hole**.
5. Enter your Pi-hole address (e.g. `http://pi.hole`) and web/app password.
6. Click **Test connection**. Chrome will prompt for permission to access that host — allow it.
7. Save.

## Usage

Click the toolbar icon → pick a duration:

- **10s / 30s / 1m / 5m** — quick presets.
- **Custom…** — any number of seconds / minutes / hours.
- **Permanent** — disable until re-enabled.

When blocking is disabled, the popup shows a countdown and a **Re-enable blocking** button.

## Settings

- **Pi-hole address** — must include `http://` or `https://`.
- **Password** — Pi-hole web / app password.
- **Reload the active tab after disabling** — on by default.

Credentials live in `chrome.storage.local` on this device only (not synced).

## Notes

- Self-signed HTTPS on your Pi-hole: Chrome will block `fetch` to it. Either use `http://` on your LAN, or install the Pi-hole cert as trusted on this machine.
- Mixed content isn't an issue — requests come from the service worker, not the active page.
- Icons are omitted; Chrome uses a default placeholder. Drop PNGs in an `icons/` folder and wire them into `manifest.json` if you want custom art.
