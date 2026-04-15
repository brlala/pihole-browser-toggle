const statusEl    = document.getElementById("status");
const statusLabel = statusEl.querySelector(".status__label");
const statusMeta  = document.getElementById("statusMeta");
const statusHost  = document.getElementById("statusHost");

const unconfigured = document.getElementById("unconfigured");
const controls     = document.getElementById("controls");
const errorEl      = document.getElementById("error");
const enableBtn    = document.getElementById("enableBtn");
const customBtn    = document.getElementById("customBtn");
const customRow    = document.getElementById("customRow");
const customValue  = document.getElementById("customValue");
const customUnit   = document.getElementById("customUnit");
const customGo     = document.getElementById("customGo");

let countdownTimer = null;

function send(msg) {
  return new Promise((resolve) => chrome.runtime.sendMessage(msg, resolve));
}

function showError(text) {
  errorEl.textContent = text;
  errorEl.classList.remove("hidden");
}
function clearError() {
  errorEl.textContent = "";
  errorEl.classList.add("hidden");
}

function formatTime(seconds) {
  if (seconds == null || seconds < 0) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function setState(state) {
  statusEl.dataset.state = state;
}

function renderHost(host) {
  if (!host) { statusHost.textContent = ""; return; }
  try {
    const u = new URL(host);
    statusHost.textContent = u.host;
  } catch {
    statusHost.textContent = host.replace(/^https?:\/\//, "");
  }
}

function renderStatus(data) {
  clearInterval(countdownTimer);

  const blocking = data?.blocking === "enabled" || data?.blocking === true;

  if (blocking) {
    setState("blocking");
    statusLabel.textContent = "Protected";
    statusMeta.textContent = "blocking enabled";
    enableBtn.classList.add("hidden");
    return;
  }

  setState("disabled");
  enableBtn.classList.remove("hidden");

  const timer = data?.timer;
  if (timer == null) {
    statusLabel.textContent = "Open";
    statusMeta.textContent = "held open indefinitely";
    return;
  }

  statusLabel.textContent = "Open";
  let remaining = Math.max(0, Math.ceil(timer));
  const tick = () => {
    statusMeta.textContent = `resumes in ${formatTime(remaining)}`;
    if (remaining <= 0) {
      clearInterval(countdownTimer);
      loadStatus();
      return;
    }
    remaining -= 1;
  };
  tick();
  countdownTimer = setInterval(tick, 1000);
}

async function loadStatus() {
  clearError();
  const { host } = await chrome.storage.local.get(["host"]);
  if (!host) {
    statusEl.classList.add("hidden");
    unconfigured.classList.remove("hidden");
    controls.classList.add("hidden");
    return;
  }
  statusEl.classList.remove("hidden");
  unconfigured.classList.add("hidden");
  controls.classList.remove("hidden");
  renderHost(host);

  const res = await send({ type: "status" });
  if (!res?.ok) {
    setState("error");
    statusLabel.textContent = "Unreachable";
    statusMeta.textContent = "check settings";
    showError(res?.error || "Failed to query Pi-hole.");
    return;
  }
  renderStatus(res.data);
}

async function handleDisable(button, seconds) {
  clearError();
  if (button) button.classList.add("is-pressed");
  const res = await send({ type: "disable", seconds });
  if (!res?.ok) {
    if (button) button.classList.remove("is-pressed");
    showError(res?.error || "Failed.");
    return;
  }
  // brief confirmation flash before close
  setTimeout(() => window.close(), 180);
}

document.querySelectorAll("[data-seconds]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const raw = btn.dataset.seconds;
    const seconds = raw === "null" ? null : Number(raw);
    handleDisable(btn, seconds);
  });
});

customBtn.addEventListener("click", () => {
  const nowHidden = customRow.classList.contains("hidden");
  customRow.classList.toggle("hidden");
  customBtn.classList.toggle("is-pressed", nowHidden);
  if (nowHidden) customValue.focus();
});

customGo.addEventListener("click", () => {
  const v = Number(customValue.value);
  const unit = Number(customUnit.value);
  if (!Number.isFinite(v) || v <= 0) {
    showError("Enter a positive number.");
    return;
  }
  handleDisable(customGo, Math.round(v * unit));
});

customValue.addEventListener("keydown", (e) => {
  if (e.key === "Enter") customGo.click();
});

enableBtn.addEventListener("click", async () => {
  clearError();
  const res = await send({ type: "enable" });
  if (!res?.ok) {
    showError(res?.error || "Failed.");
    return;
  }
  loadStatus();
});

document.getElementById("openOptions").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

document.getElementById("settingsLink").addEventListener("click", (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});

loadStatus();
