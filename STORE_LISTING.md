# Chrome Web Store — listing copy

Paste these into the corresponding fields in the developer console.

---

## Name
`Pi-hole Toggle`

## Summary (132 char limit)
`Temporarily disable Pi-hole blocking from your toolbar. Pick a preset duration, a custom time, or hold indefinitely. Pi-hole v6.`

## Category
`Productivity`

## Language
`English (United States)`

---

## Description

Pi-hole Toggle is a minimal browser-toolbar control for your Pi-hole. When a
site breaks because of ad/tracker blocking, click the toolbar icon, pick a
duration, and you're done.

**Features**
- Preset durations: 10 seconds, 30 seconds, 1 minute, 5 minutes.
- Custom duration in seconds, minutes, or hours.
- "Hold" mode to disable blocking indefinitely until you resume it.
- Live status indicator with a countdown to auto-resume.
- Optional: automatically reload the active tab after disabling.
- Dark, compact, cockpit-style popup. Keyboard-friendly.

**Privacy**
- No analytics, no telemetry, no third-party services.
- Your Pi-hole address and password are stored locally on your device only.
- The extension talks to your Pi-hole directly — nothing is ever sent
  anywhere else.

**Requirements**
- A Pi-hole **v6** instance you can reach from your browser.
- The Pi-hole web/app password (leave blank if your Pi-hole has no password).

**Setup**
1. Install the extension.
2. Click the toolbar icon and open Settings.
3. Enter your Pi-hole address (e.g. `http://pihole.home`) and password.
4. Click "Test connection" — grant permission to reach your Pi-hole when
   prompted.
5. You're ready. Click a duration any time.

**Open source**
Source code and privacy policy are available in the project repository.

---

## Single-purpose description
`Temporarily disable Pi-hole blocking for a chosen duration from the browser toolbar.`

## Permission justifications

**storage**
`Stores the user's Pi-hole address, password, and reload-tab preference locally on their device.`

**activeTab**
`Reloads the currently-active tab after disabling blocking, if the user has enabled that preference in settings.`

**Host permissions (optional)**
`Requested on-demand for the single Pi-hole origin the user configures. The extension communicates only with that host, and makes no other network requests.`

---

## Data-usage disclosure (Privacy practices form)

Tick ONLY the following:

- [x] **Authentication information** — the password used to connect to the user's own Pi-hole.
- [x] **Website content** — the domain/URL of the active tab, only if "reload after disabling" is enabled (used locally to call `tabs.reload`, never transmitted).

Declarations:
- [x] "I do not sell or transfer user data to third parties, apart from the approved use cases."
- [x] "I do not use or transfer user data for purposes unrelated to my item's single purpose."
- [x] "I do not use or transfer user data to determine creditworthiness or for lending purposes."

## Privacy policy URL
Upload `PRIVACY.md` to a public GitHub repo and link to the rendered file, e.g.
`https://github.com/<you>/pihole-toggle/blob/main/PRIVACY.md`

---

## Screenshots (1280×800 or 640×400, JPEG or 24-bit PNG, no alpha — at least one, up to 5)

Suggested captures:
1. **Popup — protected state**: open the extension while Pi-hole is blocking.
   Shows the green status dot + duration grid.
2. **Popup — disabled state**: disable for 5 minutes, then screenshot the
   countdown view with "Resume blocking" button.
3. **Options page**: the settings screen filled in with a sample address.

**How to capture (recommended):**
1. Click the extension icon to open the popup. Right-click inside it →
   **Inspect**. DevTools opens scoped to the popup document.
2. In DevTools press `Ctrl+Shift+P` → type **"Capture full size screenshot"** → Enter.
   A PNG of the popup downloads.
3. For the options page: right-click the icon → **Options** → DevTools → same command.

**Compose to 1280×800:**
Open `icons/screenshots.html`, drop the captured PNG in, tweak the caption,
and click **Download JPEG**. Output is a 1280×800 JPEG with no alpha, ready
to upload.

## Small promo tile (required)
Use the `promo-440x280.jpg` produced by `icons/generate.html`.

## Marquee promo tile (1400×560, optional)
Use the `marquee-1400x560.jpg` produced by `icons/generate.html`. Only needed
if you want to be eligible for featured placement.
