window.PrivacyGuard = (() => {
  function byId(id) {
    return document.getElementById(id);
  }

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function remove(selector, root = document) {
    root.querySelector(selector)?.remove();
  }

  function show(element) {
    if (element) element.hidden = false;
  }

  function hide(element) {
    if (element) element.hidden = true;
  }

  function positiveNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : fallback;
  }

  function gameIsActive() {
    const stage = byId("game-stage");
    return Boolean(stage && !stage.hidden);
  }

  function returnToStartScreen() {
    window.location.reload();
  }

  function createElement(tagName, { className, text, attributes = {} } = {}, children = []) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    Object.entries(attributes).forEach(([name, value]) => {
      if (value !== undefined && value !== null) element.setAttribute(name, value);
    });
    children.forEach((child) => element.appendChild(child));
    return element;
  }

  function showConfirmationDialog({
    overlayClass,
    dialogClass,
    kickerClass,
    actionsClass,
    titleId,
    kicker,
    title,
    confirmText,
    cancelText,
    confirmClass,
    cancelClass,
    initialFocus = "cancel",
    onConfirm,
    onCancel
  }) {
    remove(`.${overlayClass}`);

    let removeKeyListener = () => {};
    const close = () => {
      overlay.remove();
      removeKeyListener();
      onCancel?.();
    };

    const confirmButton = createElement("button", {
      className: confirmClass,
      text: confirmText,
      attributes: { type: "button", "data-confirm": "" }
    });
    const cancelButton = createElement("button", {
      className: cancelClass,
      text: cancelText,
      attributes: { type: "button", "data-cancel": "" }
    });
    const actions = createElement("div", { className: actionsClass }, [confirmButton, cancelButton]);
    const dialog = createElement("article", { className: dialogClass }, [
      createElement("p", { className: kickerClass, text: kicker }),
      createElement("h2", { text: title, attributes: { id: titleId } }),
      actions
    ]);
    const overlay = createElement("div", {
      className: overlayClass,
      attributes: {
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": titleId
      }
    }, [dialog]);

    overlay.addEventListener("click", (event) => {
      if (event.target.closest("[data-confirm]")) {
        overlay.remove();
        removeKeyListener();
        onConfirm?.();
        return;
      }

      if (event.target.closest("[data-cancel]") || event.target === overlay) {
        close();
      }
    });

    const handleKeydown = (event) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKeydown);
    removeKeyListener = () => document.removeEventListener("keydown", handleKeydown);

    document.body.appendChild(overlay);
    const focusTarget = initialFocus === "confirm" ? confirmButton : cancelButton;
    focusTarget.focus();

    return { close, overlay };
  }

  return {
    $,
    byId,
    createElement,
    gameIsActive,
    hide,
    positiveNumber,
    remove,
    returnToStartScreen,
    show,
    showConfirmationDialog
  };
})();
