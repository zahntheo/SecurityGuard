(() => {
  const leakScreen = document.getElementById("attention-leak-screen");
  const guideScreen = document.getElementById("attention-guide-screen");
  const nextButton = document.getElementById("attention-next");

  nextButton?.addEventListener("click", () => {
    if (!leakScreen || !guideScreen) return;
    leakScreen.hidden = true;
    guideScreen.hidden = false;
    document.getElementById("start-game")?.focus();
  });
})();
