(() => {
  const {
    $,
    byId,
    createElement,
    gameIsActive,
    hide,
    positiveNumber,
    returnToStartScreen,
    show
  } = window.PrivacyGuard;

  const DEFAULT_IDLE_SETTINGS = {
    idleWarningSeconds: 30,
    idleResetSeconds: 120
  };
  const ACTIVITY_EVENTS = ["pointerdown", "keydown", "touchstart", "wheel"];

  let warningTimerId = null;
  let resetTimerId = null;
  let isWarningVisible = false;

  function configuredSeconds(key) {
    return positiveNumber(window.PRIVACYGUARD_GAME_CONFIG?.[key], DEFAULT_IDLE_SETTINGS[key]);
  }

  function idleSettings() {
    const warningSeconds = configuredSeconds("idleWarningSeconds");
    const resetSeconds = Math.max(warningSeconds, configuredSeconds("idleResetSeconds"));
    return { warningSeconds, resetSeconds };
  }

  function clearIdleTimers() {
    window.clearTimeout(warningTimerId);
    window.clearTimeout(resetTimerId);
    warningTimerId = null;
    resetTimerId = null;
  }

  function createWarningOverlay() {
    const continueButton = createElement("button", {
      className: "idle-continue",
      text: "Continue",
      attributes: { type: "button", "data-idle-continue": "" }
    });
    const cancelButton = createElement("button", {
      className: "idle-cancel",
      text: "Cancel",
      attributes: { type: "button", "data-idle-cancel": "" }
    });
    const overlay = createElement("div", {
      className: "idle-overlay",
      attributes: {
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "idle-warning-title"
      }
    }, [
      createElement("article", { className: "idle-warning" }, [
        createElement("p", { className: "idle-kicker", text: "Session paused" }),
        createElement("h2", { text: "Are you there?", attributes: { id: "idle-warning-title" } }),
        createElement("p", { text: "Your game will return to the start screen if there is no activity." }),
        createElement("div", { className: "idle-actions" }, [continueButton, cancelButton])
      ])
    ]);

    overlay.hidden = true;
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

  function getWarningOverlay() {
    return $(".idle-overlay") || createWarningOverlay();
  }

  function showWarning() {
    if (!gameIsActive()) {
      clearIdleTimers();
      return;
    }

    const overlay = getWarningOverlay();
    show(overlay);
    isWarningVisible = true;
    $("[data-idle-continue]", overlay)?.focus();
  }

  function hideWarning() {
    hide($(".idle-overlay"));
    isWarningVisible = false;
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

  byId("start-game")?.addEventListener("click", () => {
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
