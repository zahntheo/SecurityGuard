(() => {
  const DEFAULT_IDLE_SETTINGS = {
    idleWarningSeconds: 30,
    idleResetSeconds: 120
  };
  const ACTIVITY_EVENTS = ["pointerdown", "keydown", "touchstart", "wheel"];

  let warningTimerId = null;
  let resetTimerId = null;
  let isWarningVisible = false;

  function configuredSeconds(key) {
    const value = Number(window.PRIVACYGUARD_GAME_CONFIG?.[key]);
    return Number.isFinite(value) && value > 0 ? value : DEFAULT_IDLE_SETTINGS[key];
  }

  function idleSettings() {
    const warningSeconds = configuredSeconds("idleWarningSeconds");
    const resetSeconds = Math.max(warningSeconds, configuredSeconds("idleResetSeconds"));
    return { warningSeconds, resetSeconds };
  }

  function gameIsActive() {
    const stage = document.getElementById("game-stage");
    return Boolean(stage && !stage.hidden);
  }

  function clearIdleTimers() {
    window.clearTimeout(warningTimerId);
    window.clearTimeout(resetTimerId);
    warningTimerId = null;
    resetTimerId = null;
  }

  function getOverlay() {
    let overlay = document.querySelector(".idle-overlay");
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.className = "idle-overlay";
    overlay.hidden = true;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "idle-warning-title");
    overlay.innerHTML = `
      <article class="idle-warning">
        <p class="idle-kicker">Session paused</p>
        <h2 id="idle-warning-title">Are you there?</h2>
        <p>Your game will return to the start screen if there is no activity.</p>
        <div class="idle-actions">
          <button class="idle-continue" type="button" data-idle-continue>Continue</button>
          <button class="idle-cancel" type="button" data-idle-cancel>Cancel</button>
        </div>
      </article>
    `;

    overlay.addEventListener("click", (event) => {
      if (event.target.closest("[data-idle-continue]")) {
        hideWarning();
        scheduleIdleTimers();
        return;
      }

      if (event.target.closest("[data-idle-cancel]")) {
        returnToStartScreen();
      }
    });

    document.body.appendChild(overlay);
    return overlay;
  }

  function showWarning() {
    if (!gameIsActive()) {
      clearIdleTimers();
      return;
    }

    const overlay = getOverlay();
    overlay.hidden = false;
    isWarningVisible = true;
    overlay.querySelector("[data-idle-continue]")?.focus();
  }

  function hideWarning() {
    const overlay = document.querySelector(".idle-overlay");
    if (overlay) overlay.hidden = true;
    isWarningVisible = false;
  }

  function returnToStartScreen() {
    window.location.reload();
  }

  function scheduleIdleTimers() {
    clearIdleTimers();

    if (!gameIsActive()) {
      hideWarning();
      return;
    }

    const { warningSeconds, resetSeconds } = idleSettings();
    warningTimerId = window.setTimeout(showWarning, warningSeconds * 1000);
    resetTimerId = window.setTimeout(returnToStartScreen, resetSeconds * 1000);
  }

  function handleActivity(event) {
    if (!gameIsActive()) return;

    if (isWarningVisible) {
      if (event.key === "Enter") {
        hideWarning();
        scheduleIdleTimers();
      } else if (event.key === "Escape") {
        returnToStartScreen();
      }
      return;
    }

    scheduleIdleTimers();
  }

  ACTIVITY_EVENTS.forEach((eventName) => {
    document.addEventListener(eventName, handleActivity, { capture: true, passive: true });
  });

  document.getElementById("start-game")?.addEventListener("click", () => {
    window.setTimeout(scheduleIdleTimers, 0);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearIdleTimers();
      return;
    }
    scheduleIdleTimers();
  });
})();
