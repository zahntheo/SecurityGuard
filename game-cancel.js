(() => {
  const {
    $,
    returnToStartScreen,
    showConfirmationDialog
  } = window.PrivacyGuard;

  const cancelButton = $("[data-game-cancel]");

  cancelButton?.addEventListener("click", () => {
    showConfirmationDialog({
      overlayClass: "game-cancel-overlay",
      dialogClass: "game-cancel-dialog",
      kickerClass: "game-cancel-kicker",
      actionsClass: "game-cancel-actions",
      titleId: "game-cancel-title",
      kicker: "Stop game",
      title: "Are you sure you want to stop the game?",
      confirmText: "Yes",
      cancelText: "No",
      confirmClass: "game-cancel-yes",
      cancelClass: "game-cancel-no",
      onConfirm: returnToStartScreen,
      onCancel: () => cancelButton.focus()
    });
  });
})();
