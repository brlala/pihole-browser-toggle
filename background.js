const SESSION_KEYS = ["sid", "csrf", "expiresAt"];
const API = "/api";

async function getSettings() {
  const { host, password, reloadTab } = await chrome.storage.local.get([
    "host",
    "password",
    "reloadTab",
  ]);
  if (!host) {
    const err = new Error("Pi-hole is not configured.");
    err.code = "NOT_CONFIGURED";
    throw err;
  }
  return {
    host: host.replace(/\/+$/, ""),
    password: password || "",
    reloadTab: reloadTab !== false,
  };
}

async function getCachedSession() {
  const s = await chrome.storage.session.get(SESSION_KEYS);
  if (s.expiresAt && Date.now() < s.expiresAt) return s;
  return null;
}

async function clearSession() {
  await chrome.storage.session.remove(SESSION_KEYS);
}

function piholeError(body, res) {
  const msg = body?.error?.message;
  const hint = body?.error?.hint;
  if (msg && hint) return `${msg} — ${hint}`;
  if (msg) return msg;
  return `HTTP ${res.status}`;
}

async function authenticate() {
  const { host, password } = await getSettings();

  let res;
  try {
    res = await fetch(`${host}${API}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
  } catch {
    const err = new Error("Can't reach Pi-hole. Check the address and that it's online.");
    err.code = "NETWORK";
    throw err;
  }

  const body = await res.json().catch(() => ({}));

  if (res.status === 401 || body?.session?.valid === false) {
    const err = new Error(body?.error?.hint || "Wrong password.");
    err.code = "AUTH";
    throw err;
  }

  if (!res.ok || !body?.session?.valid) {
    const err = new Error(piholeError(body, res));
    err.code = "API";
    throw err;
  }

  const { sid, csrf, validity } = body.session;
  const expiresAt = Date.now() + Math.max((validity || 300) - 30, 30) * 1000;
  await chrome.storage.session.set({ sid: sid || "", csrf: csrf || "", expiresAt });
  return { sid: sid || "", csrf: csrf || "", expiresAt };
}

async function ensureSession() {
  return (await getCachedSession()) || (await authenticate());
}

async function apiFetch(path, init = {}, retry = true) {
  const { host } = await getSettings();
  const session = await ensureSession();
  const headers = new Headers(init.headers || {});
  if (session.sid) headers.set("sid", session.sid);
  if (init.method && init.method !== "GET") {
    headers.set("Content-Type", "application/json");
    if (session.csrf) headers.set("X-FTL-CSRF", session.csrf);
  }

  let res;
  try {
    res = await fetch(`${host}${API}${path}`, { ...init, headers });
  } catch {
    const err = new Error("Can't reach Pi-hole.");
    err.code = "NETWORK";
    throw err;
  }

  if (res.status === 401 && retry) {
    await clearSession();
    return apiFetch(path, init, false);
  }

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(piholeError(body, res));
    err.code = "API";
    throw err;
  }
  return body;
}

async function status() {
  return apiFetch("/dns/blocking", { method: "GET" });
}

async function setBlocking(blocking, seconds) {
  return apiFetch("/dns/blocking", {
    method: "POST",
    body: JSON.stringify({ blocking, timer: seconds ?? null }),
  });
}

async function reloadActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id != null) {
    try {
      await chrome.tabs.reload(tab.id, { bypassCache: true });
    } catch {}
  }
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    try {
      switch (msg?.type) {
        case "status": {
          const data = await status();
          sendResponse({ ok: true, data });
          break;
        }
        case "disable": {
          await setBlocking(false, msg.seconds ?? null);
          const { reloadTab } = await getSettings();
          if (reloadTab) await reloadActiveTab();
          sendResponse({ ok: true });
          break;
        }
        case "enable": {
          await setBlocking(true, null);
          sendResponse({ ok: true });
          break;
        }
        case "testConnection": {
          await clearSession();
          await authenticate();
          const data = await status();
          sendResponse({ ok: true, data });
          break;
        }
        default:
          sendResponse({ ok: false, error: "Unknown message." });
      }
    } catch (e) {
      sendResponse({ ok: false, error: e.message, code: e.code || "UNKNOWN" });
    }
  })();
  return true;
});
