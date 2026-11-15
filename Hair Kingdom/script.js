const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = new Date().getFullYear();

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    menuButton.setAttribute("aria-label", expanded ? "Open menu" : "Close menu");
    navigation.classList.toggle("is-open", !expanded);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open menu");
      navigation.classList.remove("is-open");
    });
  });
}

const cartPanel = document.querySelector(".cart-panel");
const cartBackdrop = document.querySelector(".cart-backdrop");
const bagCount = document.querySelector(".bag-count");
const cartItems = document.querySelector(".cart-items");
const cartHeadingCount = document.querySelector(".cart-heading-count");
const announcement = document.querySelector("#announcements");
const addToBagForm = document.querySelector(".add-to-bag-form");

if (cartPanel && cartBackdrop && bagCount && cartItems && cartHeadingCount && announcement) {
  const bag = [];
  const bundleProducts = {
    "straight-body-wave": {
      name: "Straight/Body Wave Bundles",
      description: "Choose straight or body wave for a soft, versatile look with natural movement. Wear it wavy, straighten it sleek, or style it your way.",
      prices: { 16: 90, 18: 110, 20: 130, 22: 150, 24: 160, 26: 180, 28: 200, 30: 240 }
    },
    "loose-wave-burmese-curly": {
      name: "Loose Wave/Burmese Curly",
      description: "Choose loose wave or Burmese curly for a beautiful, textured look with natural movement.",
      prices: { 16: 100, 18: 115, 20: 135, 22: 155, 24: 165, 26: 185, 28: 205, 30: 260 }
    }
  };
  const textureSelect = document.querySelector("#bundle-texture");
  const lengthSelect = document.querySelector("#bundle-length");
  const productTitle = document.querySelector("#bundle-title");
  const productDescription = document.querySelector("#bundle-description");
  const productPrice = document.querySelector("#bundle-price");

  function updateBundleSelection() {
    const product = bundleProducts[textureSelect.value];
    const price = product.prices[lengthSelect.value];
    productTitle.textContent = product.name;
    productDescription.textContent = product.description;
    productPrice.textContent = `$${price}`;
  }

  if (textureSelect && lengthSelect && productTitle && productDescription && productPrice) {
    textureSelect.addEventListener("change", updateBundleSelection);
    lengthSelect.addEventListener("change", updateBundleSelection);
    updateBundleSelection();
  }

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
      title.textContent = item.product;
      const description = document.createElement("p");
      description.className = "cart-item-description";
      description.textContent = `${item.length}" · $${item.price} each · Quantity ${item.quantity}`;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "cart-remove";
      remove.textContent = "Remove";
      remove.setAttribute("aria-label", `Remove ${item.length}-inch ${item.product} from bag`);
      remove.addEventListener("click", () => {
        bag.splice(index, 1);
        renderBag();
        announcement.textContent = `${item.length}-inch ${item.product} removed from your bag.`;
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

  if (addToBagForm) {
    addToBagForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const length = Number(lengthSelect.value);
      const product = bundleProducts[textureSelect.value];
      const price = product.prices[length];
      const quantity = Number(form.elements.quantity.value);

      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
        form.elements.quantity.setCustomValidity("Choose a quantity between 1 and 10.");
        form.elements.quantity.reportValidity();
        form.elements.quantity.addEventListener("input", () => form.elements.quantity.setCustomValidity(""), { once: true });
        return;
      }

      const existingItem = bag.find((item) => item.length === length && item.product === product.name);
      if (existingItem) existingItem.quantity += quantity;
      else bag.push({ product: product.name, length, price, quantity });

      renderBag();
      announcement.textContent = `${quantity} ${length}-inch ${product.name} added to your bag.`;
      openBag();
    });
  }
}
