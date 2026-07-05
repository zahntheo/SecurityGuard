(() => {
  const cancelButton = document.querySelector("[data-game-cancel]");

  function returnToStartScreen() {
    window.location.reload();
  }

  function closeCancelDialog() {
    document.querySelector(".game-cancel-overlay")?.remove();
    cancelButton?.focus();
  }

  function showCancelDialog() {
    document.querySelector(".game-cancel-overlay")?.remove();

    const overlay = document.createElement("div");
    overlay.className = "game-cancel-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "game-cancel-title");
    overlay.innerHTML = `
      <article class="game-cancel-dialog">
        <p class="game-cancel-kicker">Stop game</p>
        <h2 id="game-cancel-title">Are you sure you want to stop the game?</h2>
        <div class="game-cancel-actions">
          <button class="game-cancel-yes" type="button" data-game-cancel-yes>Yes</button>
          <button class="game-cancel-no" type="button" data-game-cancel-no>No</button>
        </div>
      </article>
    `;

    overlay.addEventListener("click", (event) => {
      if (event.target.closest("[data-game-cancel-yes]")) {
        returnToStartScreen();
        return;
      }

      if (event.target.closest("[data-game-cancel-no]") || event.target === overlay) {
        closeCancelDialog();
      }
    });

    document.body.appendChild(overlay);
    overlay.querySelector("[data-game-cancel-no]")?.focus();
  }

  cancelButton?.addEventListener("click", showCancelDialog);

  document.addEventListener("keydown", (event) => {
    if (!document.querySelector(".game-cancel-overlay")) return;

    if (event.key === "Escape") {
      closeCancelDialog();
    }
  });
})();
