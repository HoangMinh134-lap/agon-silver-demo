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

document.querySelector(".newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("#home-email");
  const toast = document.querySelector(".toast");
  toast.textContent = window.AGON_I18N.t("Cảm ơn bạn đã đăng ký, {email}.").replace("{email}", email.value);
  toast.classList.add("visible");
  event.currentTarget.reset();
  window.setTimeout(() => toast.classList.remove("visible"), 3200);
});
