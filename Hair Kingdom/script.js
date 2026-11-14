const bag = [];
const cartPanel = document.querySelector(".cart-panel");
const cartBackdrop = document.querySelector(".cart-backdrop");
const bagCount = document.querySelector(".bag-count");
const cartItems = document.querySelector(".cart-items");
const cartHeadingCount = document.querySelector(".cart-heading-count");
const announcement = document.querySelector("#announcements");

document.querySelector("#current-year").textContent = new Date().getFullYear();

function renderBag() {
  const totalQuantity = bag.reduce((total, item) => total + item.quantity, 0);
  bagCount.textContent = totalQuantity;
  cartHeadingCount.textContent = `(${totalQuantity})`;
  cartPanel.classList.toggle("is-empty", bag.length === 0);
  cartItems.replaceChildren();

  bag.forEach((item, index) => {
    const row = document.createElement("article");
    row.className = "cart-item";
    const details = document.createElement("div");
    const title = document.createElement("h3");
    title.className = "cart-item-title";
    title.textContent = "Body Wave Bundle";
    const description = document.createElement("p");
    description.className = "cart-item-description";
    description.textContent = `${item.length} · Quantity ${item.quantity}`;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "cart-remove";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${item.length} Body Wave Bundle from bag`);
    remove.addEventListener("click", () => {
      bag.splice(index, 1);
      renderBag();
      announcement.textContent = `${item.length} Body Wave Bundle removed from your bag.`;
    });
    details.append(title, description);
    row.append(details, remove);
    cartItems.append(row);
  });
}

function openBag() {
  cartBackdrop.hidden = false;
  cartPanel.classList.add("is-open");
  cartPanel.setAttribute("aria-hidden", "false");
  cartPanel.removeAttribute("inert");
  document.body.classList.add("cart-open");
  document.querySelector(".cart-close").focus();
}

function closeBag() {
  cartPanel.classList.remove("is-open");
  cartPanel.setAttribute("aria-hidden", "true");
  cartPanel.setAttribute("inert", "");
  document.body.classList.remove("cart-open");
  window.setTimeout(() => {
    if (!cartPanel.classList.contains("is-open")) cartBackdrop.hidden = true;
  }, 300);
  document.querySelector(".bag-button").focus();
}

document.querySelector(".bag-button").addEventListener("click", openBag);
document.querySelector(".cart-close").addEventListener("click", closeBag);
document.querySelector(".cart-continue").addEventListener("click", closeBag);
document.querySelector(".continue-shopping").addEventListener("click", closeBag);
cartBackdrop.addEventListener("click", closeBag);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartPanel.classList.contains("is-open")) closeBag();
});

document.querySelector(".add-to-bag-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const length = form.querySelector("#bundle-length").value;
  const quantity = Number(form.elements.quantity.value);

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
    form.elements.quantity.setCustomValidity("Choose a quantity between 1 and 10.");
    form.elements.quantity.reportValidity();
    form.elements.quantity.addEventListener("input", () => form.elements.quantity.setCustomValidity(""), { once: true });
    return;
  }

  const existingItem = bag.find((item) => item.length === length);
  if (existingItem) existingItem.quantity += quantity;
  else bag.push({ length, quantity });

  renderBag();
  announcement.textContent = `${quantity} ${length} Body Wave Bundle${quantity === 1 ? "" : "s"} added to your bag.`;
  openBag();
});

document.querySelector(".menu-toggle").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const navigation = document.querySelector(".navigation");
  const expanded = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!expanded));
  button.setAttribute("aria-label", expanded ? "Open menu" : "Close menu");
  navigation.classList.toggle("is-open", !expanded);
});

document.querySelectorAll(".navigation a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false");
    document.querySelector(".menu-toggle").setAttribute("aria-label", "Open menu");
    document.querySelector(".navigation").classList.remove("is-open");
  });
});
