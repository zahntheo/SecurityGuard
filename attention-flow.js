(() => {
  const { byId } = window.PrivacyGuard;
  const track = byId("attention-track");
  const panels = Array.from(document.querySelectorAll("[data-attention-panel]"));
  const nextButton = byId("attention-next");
  const dots = byId("attention-dots");
  const progress = byId("attention-progress-fill");
  const infoOpenButton = byId("exposure-info-open");
  const infoCloseButton = byId("exposure-info-close");
  const infoBackdrop = byId("exposure-info-backdrop");
  let returnFocus = null;
  let panelIndex = 0;
  let wheelLocked = false;

  panels.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to introduction page ${index + 1}`);
    dot.addEventListener("click", () => goToPanel(index));
    dots?.appendChild(dot);
  });

  function goToPanel(index) {
    panelIndex = Math.max(0, Math.min(panels.length - 1, index));
    track?.style.setProperty("--attention-page", panelIndex);
    panels.forEach((panel, i) => panel.classList.toggle("is-active", i === panelIndex));
    Array.from(dots?.children || []).forEach((dot, i) => {
      dot.classList.toggle("is-active", i === panelIndex);
      if (i === panelIndex) dot.setAttribute("aria-current", "page");
      else dot.removeAttribute("aria-current");
    });
    if (progress) progress.style.width = `${((panelIndex + 1) / panels.length) * 100}%`;
    if (nextButton) {
      nextButton.hidden = panelIndex === panels.length - 1;
      nextButton.setAttribute("aria-label", `Go to introduction page ${panelIndex + 2}`);
    }
  }

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
    goToPanel(panelIndex + 1);
  });

  window.addEventListener("keydown", (event) => {
    if (byId("attention")?.hidden) return;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") goToPanel(panelIndex + 1);
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") goToPanel(panelIndex - 1);
  });

  track?.addEventListener("wheel", (event) => {
    if (wheelLocked || Math.abs(event.deltaY) < 12) return;
    event.preventDefault();
    wheelLocked = true;
    goToPanel(panelIndex + (event.deltaY > 0 ? 1 : -1));
    window.setTimeout(() => { wheelLocked = false; }, 650);
  }, { passive: false });

  window.PSUICloud?.init(byId("attention-cloud"), {
    loopMs: 30000,
    onExpose(value) {
      const count = byId("exposed-count");
      if (count) count.textContent = value.toLocaleString("en-US");
    }
  });

  goToPanel(0);
})();
