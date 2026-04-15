const hostEl = document.getElementById("host");
const passwordEl = document.getElementById("password");
const reloadTabEl = document.getElementById("reloadTab");
const resultEl = document.getElementById("result");

function send(msg) {
  return new Promise((resolve) => chrome.runtime.sendMessage(msg, resolve));
}

function setResult(text, kind) {
  resultEl.textContent = text;
  resultEl.className = `result ${kind || ""}`;
}

function normalizeHost(raw) {
  const trimmed = (raw || "").trim().replace(/\/+$/, "");
  if (!trimmed) return { error: "Address is required." };
  if (!/^https?:\/\//i.test(trimmed)) {
    return { error: "Address must start with http:// or https://" };
  }
  let u;
  try {
    u = new URL(trimmed);
  } catch {
    return { error: "Invalid URL." };
  }
  if (u.pathname && u.pathname !== "/") {
    return {
      error: `Remove the path "${u.pathname}" — use the origin only (e.g. ${u.origin}).`,
    };
  }
  if (u.search || u.hash) {
    return { error: "Remove the query or fragment — use the origin only." };
  }
  return { host: trimmed, origin: u.origin };
}

async function load() {
  const { host, password, reloadTab } = await chrome.storage.local.get([
    "host",
    "password",
    "reloadTab",
  ]);
  if (host) hostEl.value = host;
  if (password) passwordEl.value = password;
  reloadTabEl.checked = reloadTab !== false;
}

async function saveSettings() {
  const { host, origin, error } = normalizeHost(hostEl.value);
  if (error) {
    setResult(error, "err");
    return null;
  }
  const granted = await chrome.permissions.request({ origins: [`${origin}/*`] });
  if (!granted) {
    setResult("Permission to access the Pi-hole host was denied.", "err");
    return null;
  }

  const prev = await chrome.storage.local.get(["host"]);
  if (prev.host !== host) {
    await chrome.storage.session.clear();
  }

  await chrome.storage.local.set({
    host,
    password: passwordEl.value,
    reloadTab: reloadTabEl.checked,
  });
  return { host };
}

document.getElementById("save").addEventListener("click", async () => {
  const saved = await saveSettings();
  if (saved) setResult("Saved.", "ok");
});

document.getElementById("test").addEventListener("click", async () => {
  setResult("Contacting Pi-hole…", "pending");
  const saved = await saveSettings();
  if (!saved) return;
  const res = await send({ type: "testConnection" });
  if (res?.ok) {
    const state = res.data?.blocking === "enabled" ? "enabled" : "disabled";
    setResult(`Connected. Blocking is currently ${state}.`, "ok");
  } else {
    setResult(res?.error || "Connection failed.", "err");
  }
});

load();
