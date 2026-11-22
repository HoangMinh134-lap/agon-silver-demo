(() => {
  const storageKey = "agon-cart";

  function getItems() {
    return JSON.parse(localStorage.getItem(storageKey) || "[]");
  }

  function updateCount(items = getItems()) {
    const count = items.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll(".bag-count").forEach((badge) => {
      badge.textContent = String(count);
    });
  }

  function save(items) {
    localStorage.setItem(storageKey, JSON.stringify(items));
    updateCount(items);
    window.dispatchEvent(new CustomEvent("agon-cart-change", { detail: { items } }));
  }

  window.AGON_CART = {
    getItems,
    add(lines) {
      const items = getItems();
      lines.forEach((line) => {
        const lineKey = JSON.stringify([line.productId, line.size, line.finish, line.price]);
        const existing = items.find((item) => item.lineKey === lineKey);
        if (existing) {
          existing.quantity += 1;
        } else {
          items.push({ ...line, lineKey, quantity: 1 });
        }
      });
      save(items);
    },
    setQuantity(lineKey, quantity) {
      const items = getItems();
      const item = items.find((entry) => entry.lineKey === lineKey);
      if (!item) return;
      item.quantity = Math.max(1, Math.floor(quantity));
      save(items);
    },
    remove(lineKey) {
      save(getItems().filter((item) => item.lineKey !== lineKey));
    },
  };

  updateCount();
  window.addEventListener("storage", (event) => {
    if (event.key === storageKey) updateCount();
  });
})();
