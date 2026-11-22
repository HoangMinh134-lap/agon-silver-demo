const checkoutForm = document.querySelector("#checkout-form");
const checkoutItems = document.querySelector("#checkout-items");
const checkoutMessage = document.querySelector(".checkout-message");
const checkoutGrid = document.querySelector("#checkout-grid");
const checkoutEmpty = document.querySelector("#checkout-empty");
const money = (amount) => window.AGON_I18N.language === "en"
  ? `VND ${amount.toLocaleString("en-US")}`
  : `${amount.toLocaleString("vi-VN")}₫`;

function renderCart() {
  const items = window.AGON_CART.getItems();
  const isEmpty = items.length === 0;
  checkoutGrid.hidden = isEmpty;
  checkoutEmpty.hidden = !isEmpty;
  checkoutItems.replaceChildren();

  items.forEach((item) => {
    const row = document.createElement("article");
    row.className = "checkout-line";
    row.dataset.lineKey = item.lineKey;

    const image = document.createElement("img");
    image.src = `https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=240&q=75`;
    image.alt = item.name;
    image.loading = "lazy";

    const details = document.createElement("div");
    details.className = "checkout-line-info";
    const name = document.createElement("strong");
    name.textContent = item.name;
    const variants = [item.size, item.finish && window.AGON_I18N.t(item.finish)].filter(Boolean).join(" · ");
    const options = document.createElement("small");
    options.textContent = variants;
    const controls = document.createElement("div");
    controls.className = "checkout-line-controls";

    const quantity = document.createElement("div");
    quantity.className = "quantity-control";
    const decrease = document.createElement("button");
    decrease.type = "button";
    decrease.dataset.quantity = "-1";
    decrease.setAttribute("aria-label", window.AGON_I18N.t("Giảm số lượng"));
    decrease.textContent = "−";
    const count = document.createElement("span");
    count.textContent = String(item.quantity);
    const increase = document.createElement("button");
    increase.type = "button";
    increase.dataset.quantity = "1";
    increase.setAttribute("aria-label", window.AGON_I18N.t("Tăng số lượng"));
    increase.textContent = "+";
    quantity.append(decrease, count, increase);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-cart-item";
    remove.dataset.remove = "true";
    remove.textContent = window.AGON_I18N.t("XÓA");
    controls.append(quantity, remove);
    details.append(name, options, controls);

    const lineTotal = document.createElement("strong");
    lineTotal.className = "checkout-line-total";
    lineTotal.textContent = money(item.price * item.quantity);
    row.append(image, details, lineTotal);
    checkoutItems.append(row);
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= 2000000 ? 0 : 30000;
  document.querySelector("#checkout-subtotal").textContent = money(subtotal);
  document.querySelector("#checkout-shipping").textContent = shipping === 0 && subtotal > 0
    ? window.AGON_I18N.t("Miễn phí")
    : money(shipping);
  document.querySelector("#checkout-total").textContent = money(subtotal + shipping);
}

checkoutItems.addEventListener("click", (event) => {
  const row = event.target.closest(".checkout-line");
  if (!row) return;
  const { lineKey } = row.dataset;
  if (event.target.closest("[data-remove]")) {
    window.AGON_CART.remove(lineKey);
    return;
  }
  const step = event.target.closest("[data-quantity]");
  if (!step) return;
  const item = window.AGON_CART.getItems().find((entry) => entry.lineKey === lineKey);
  if (item) window.AGON_CART.setQuantity(lineKey, item.quantity + Number(step.dataset.quantity));
});

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!checkoutForm.reportValidity()) return;
  checkoutMessage.textContent = window.AGON_I18N.t("Bản xem thử: thông tin hợp lệ, nhưng đơn hàng chưa được gửi và chưa có thanh toán thực tế.");
});

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  mainNav.classList.toggle("open", isOpen);
});
mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    mainNav.classList.remove("open");
  });
});

window.addEventListener("agon-cart-change", renderCart);
window.addEventListener("agon-language-change", renderCart);
renderCart();
