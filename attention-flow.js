(() => {
  const { byId, hide, show } = window.PrivacyGuard;
  const leakScreen = byId("attention-leak-screen");
  const guideScreen = byId("attention-guide-screen");
  const nextButton = byId("attention-next");

  nextButton?.addEventListener("click", () => {
    hide(leakScreen);
    show(guideScreen);
    byId("start-game")?.focus();
  });
})();
