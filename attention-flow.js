(() => {
  const { byId, hide, show } = window.PrivacyGuard;
  const leakScreen = byId("attention-leak-screen");
  const guideScreen = byId("attention-guide-screen");
  const nextButton = byId("attention-next");
  const infoOpenButton = byId("exposure-info-open");
  const infoCloseButton = byId("exposure-info-close");
  const infoBackdrop = byId("exposure-info-backdrop");
  let returnFocus = null;

  function openExposureInfo() {
    if (!infoBackdrop) return;
    returnFocus = document.activeElement;
    infoBackdrop.hidden = false;
    infoCloseButton?.focus();
  }

  function closeExposureInfo() {
    if (!infoBackdrop || infoBackdrop.hidden) return;
    infoBackdrop.hidden = true;
    returnFocus?.focus?.();
  }

  infoOpenButton?.addEventListener("click", openExposureInfo);
  infoCloseButton?.addEventListener("click", closeExposureInfo);
  infoBackdrop?.addEventListener("click", (event) => {
    if (event.target === infoBackdrop) closeExposureInfo();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !infoBackdrop?.hidden) {
      closeExposureInfo();
    }
  });

  nextButton?.addEventListener("click", () => {
    closeExposureInfo();
    hide(leakScreen);
    show(guideScreen);
    byId("start-game")?.focus();
  });
})();
