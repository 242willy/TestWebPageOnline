const numberedFiles = (prefix, count) =>
  Array.from({ length: count }, (_, index) => `${prefix}${index + 1}.JPG`);

const collections = [
  {
    brand: "Bvlgari",
    category: "Sunglasses",
    folder: "bvlgari",
    files: [...numberedFiles("bvlgari", 14), ...Array.from({ length: 6 }, (_, index) => `bvlgari${index + 16}.JPG`)],
  },
  { brand: "Cartier", category: "Sunglasses", folder: "cartier", files: numberedFiles("cartier", 7) },
  { brand: "Chanel", category: "Sunglasses", folder: "chanel", files: numberedFiles("chanel", 30) },
  { brand: "David Yurman", category: "Bracelet", folder: "david yurman", files: numberedFiles("yurman", 65) },
  { brand: "Dior", category: "Sunglasses", folder: "dior", files: numberedFiles("dior", 10) },
  { brand: "Gucci", category: "Sunglasses", folder: "gucci", files: numberedFiles("gucci", 7) },
  { brand: "Prada", category: "Sunglasses", folder: "prada", files: numberedFiles("prada", 10) },
];

const products = collections.flatMap(({ brand, category, folder, files }) =>
  files.map((file, index) => ({
    id: `${brand.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index + 1}`,
    brand,
    name: `${category} ${String(index + 1).padStart(2, "0")}`,
    image: `image/${encodeURIComponent(folder)}/${file}`,
  })),
);

const productGrid = document.querySelector("#product-grid");
const filterContainer = document.querySelector("#brand-filters");
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const drawer = document.querySelector("#bag-drawer");
const backdrop = document.querySelector("#drawer-backdrop");
const drawerItems = document.querySelector("#drawer-items");
const drawerEmpty = document.querySelector("#drawer-empty");
const drawerFooter = document.querySelector("#drawer-footer");
const openBagButton = document.querySelector("#open-bag");
const closeBagButton = document.querySelector("#close-bag");
const toast = document.querySelector("#toast");
const orderSummary = document.querySelector("#order-summary");

let activeBrand = "All";
let bag = new Map();
let toastTimer;
let lastFocusedElement;

function renderFilters() {
  const brands = ["All", ...collections.map(({ brand }) => brand)];
  filterContainer.innerHTML = brands.map((brand) => {
    const active = activeBrand === brand;
    return `<button class="filter-chip${active ? " active" : ""}" type="button" data-brand="${brand}" aria-pressed="${active}">${brand}</button>`;
  }).join("");
}

function getVisibleProducts() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const visible = products.filter((product) => {
    const matchesBrand = activeBrand === "All" || product.brand === activeBrand;
    const matchesSearch = `${product.name} ${product.brand}`.toLocaleLowerCase().includes(query);
    return matchesBrand && matchesSearch;
  });

  switch (sortSelect.value) {
    case "az":
      visible.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return visible;
}

function renderProducts() {
  const visible = getVisibleProducts();
  resultCount.textContent = `Showing ${visible.length} ${visible.length === 1 ? "style" : "styles"}`;
  emptyState.hidden = visible.length > 0;
  productGrid.hidden = visible.length === 0;
  productGrid.innerHTML = visible.map((product) => {
    return `<article class="product-card">
      <div class="product-art">
        <img class="product-photo" src="${product.image}" alt="${product.brand} ${product.name}" loading="lazy">
        <button class="product-heart" type="button" data-favorite="${product.id}" aria-label="Save ${product.name} to your wishlist" aria-pressed="false">♡</button>
      </div>
      <div class="product-info">
        <p class="product-brand">${product.brand}</p>
        <div class="product-name-row"><h3 class="product-name">${product.name}</h3><span class="product-price">Price on request</span></div>
        <div class="product-meta"><span class="product-note">From the in-store edit</span><button class="add-button" type="button" data-add="${product.id}">ADD TO BAG +</button></div>
      </div>
    </article>`;
  }).join("");
}

function updateBag() {
  const items = [...bag.entries()]
    .map(([id, quantity]) => ({ product: products.find((item) => item.id === id), quantity }))
    .filter(({ product }) => product);
  const count = items.reduce((total, item) => total + item.quantity, 0);

  document.querySelector("#bag-count").textContent = count;
  document.querySelector("#drawer-count").textContent = `(${count})`;
  document.querySelector("#subtotal").textContent = "Price on request";
  drawerEmpty.hidden = items.length > 0;
  drawerFooter.hidden = items.length === 0;
  drawerItems.innerHTML = items.map(({ product, quantity }) => {
    return `<article class="drawer-item">
      <div class="drawer-item-swatch"><img src="${product.image}" alt="" loading="lazy"></div>
      <div>
        <p class="drawer-item-brand">${product.brand}</p>
        <h3 class="drawer-item-name">${product.name}</h3>
        <div class="drawer-item-controls">
          <button class="quantity-button" type="button" data-quantity="${product.id}" data-change="-1" aria-label="Remove one ${product.name}">−</button>
          <span>${quantity}</span>
          <button class="quantity-button" type="button" data-quantity="${product.id}" data-change="1" aria-label="Add one ${product.name}">+</button>
        </div>
      </div>
      <div>
        <strong>Inquire</strong><br>
        <button class="remove-item" type="button" data-remove="${product.id}">Remove</button>
      </div>
    </article>`;
  }).join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function openBag() {
  lastFocusedElement = document.activeElement;
  backdrop.hidden = false;
  drawer.inert = false;
  drawer.setAttribute("aria-hidden", "false");
  openBagButton.setAttribute("aria-expanded", "true");
  document.body.classList.add("drawer-visible");
  requestAnimationFrame(() => drawer.classList.add("is-open"));
  closeBagButton.focus();
}

function closeBag() {
  drawer.classList.remove("is-open");
  drawer.inert = true;
  drawer.setAttribute("aria-hidden", "true");
  openBagButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("drawer-visible");
  window.setTimeout(() => {
    backdrop.hidden = true;
  }, 300);
  if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

filterContainer.addEventListener("click", (event) => {
  const button = event.target.closest("[data-brand]");
  if (!button) return;
  activeBrand = button.dataset.brand;
  renderFilters();
  renderProducts();
});

searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);

document.querySelector("#reset-filters").addEventListener("click", () => {
  activeBrand = "All";
  searchInput.value = "";
  sortSelect.value = "featured";
  renderFilters();
  renderProducts();
});

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    const product = products.find((item) => item.id === addButton.dataset.add);
    if (!product) return;
    bag.set(product.id, (bag.get(product.id) ?? 0) + 1);
    updateBag();
    showToast(`${product.name} added to your bag.`);
    return;
  }

  const favoriteButton = event.target.closest("[data-favorite]");
  if (favoriteButton) {
    const isSaved = favoriteButton.getAttribute("aria-pressed") !== "true";
    favoriteButton.setAttribute("aria-pressed", String(isSaved));
    favoriteButton.textContent = isSaved ? "♥" : "♡";
    favoriteButton.setAttribute("aria-label", `${isSaved ? "Remove" : "Save"} ${products.find((item) => item.id === favoriteButton.dataset.favorite)?.name ?? "style"} ${isSaved ? "from" : "to"} your wishlist`);
    showToast(isSaved ? "Saved to your wishlist." : "Removed from your wishlist.");
  }
});

drawerItems.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");

  if (removeButton) {
    bag.delete(removeButton.dataset.remove);
    updateBag();
    return;
  }

  if (quantityButton) {
    const id = quantityButton.dataset.quantity;
    const nextQuantity = (bag.get(id) ?? 0) + Number(quantityButton.dataset.change);
    if (nextQuantity <= 0) bag.delete(id);
    else bag.set(id, nextQuantity);
    updateBag();
  }
});

openBagButton.addEventListener("click", openBag);
closeBagButton.addEventListener("click", closeBag);
backdrop.addEventListener("click", closeBag);
document.querySelector("#continue-shopping").addEventListener("click", () => {
  closeBag();
  document.querySelector("#collection").scrollIntoView({ behavior: "smooth" });
});
document.querySelector("#clear-bag").addEventListener("click", () => {
  bag.clear();
  updateBag();
  showToast("Your bag is clear.");
});
document.querySelector("#copy-order").addEventListener("click", async () => {
  const items = [...bag.entries()].map(([id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return product ? `${quantity} × ${product.brand} — ${product.name}` : null;
  }).filter(Boolean);
  const summary = `AlluringLuxury order inquiry\n${items.join("\n")}\nPricing: please confirm availability and price.`;
  orderSummary.value = summary;

  try {
    await navigator.clipboard.writeText(summary);
    orderSummary.hidden = true;
    showToast("Order details copied. Paste them into a message to complete your inquiry.");
  } catch (error) {
    console.error("Could not copy order details to clipboard.", error);
    orderSummary.hidden = false;
    orderSummary.focus();
    orderSummary.select();
    showToast("Clipboard access is unavailable. Order details are selected below for manual copying.");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && drawer.classList.contains("is-open")) closeBag();
});

renderFilters();
renderProducts();
updateBag();
