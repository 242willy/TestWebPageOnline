const collections = [
  { brand: "Chanel", products: [["Classic Flap Bag", 380], ["Chanel 19 Bag", 360], ["Chanel 22 Bag", 340], ["Boy Chanel", 330], ["Deauville Tote", 320]] },
  { brand: "Prada", products: [["Prada Galleria", 295], ["Prada Cleo", 240], ["Prada Re-Edition 2005 / 2000", 210], ["Prada Arqué", 230], ["Natural Crochet Tote", 220]] },
  { brand: "Coach", products: [["Tabby Shoulder Bag", 185], ["Brooklyn Shoulder Bag", 195], ["Rogue Tote", 210], ["Teri Shoulder Bag", 155], ["Nolita Wristlet", 120]] },
  { brand: "YSL (Saint Laurent)", products: [["Loulou", 320], ["Kate", 295], ["Sac de Jour", 350], ["Sunset", 280], ["Niki", 310]] },
  { brand: "Gucci", products: [["GG Marmont", 285], ["Jackie 1961", 310], ["Dionysus", 295], ["Horsebit 1955", 305], ["Gucci Diana", 340]] },
  { brand: "Louis Vuitton", products: [["Neverfull", 260], ["Speedy", 250], ["Pochette Accessoires", 165], ["Alma", 270], ["NéoNoé", 255]] },
  { brand: "Hermès", products: [["Birkin Bag", 480], ["Kelly Bag", 460], ["Constance Bag", 390], ["Picotin Lock", 295], ["Evelyne Bag", 270]] },
  { brand: "Celine", products: [["Celine Triomphe", 310], ["Celine Luggage Bag", 340], ["Celine Classic Box Bag", 295], ["Celine Ava Bag", 240], ["Celine Belt Bag", 285]] },
  { brand: "Bvlgari", products: [["Serpenti Forever Crossbody", 320], ["Serpenti Cabochon", 310], ["Serpenti Viper", 340], ["Serpenti Day-to-Night", 295], ["Serpenti Forever Mini Top Handle", 260]] },
  { brand: "Dior", products: [["Lady Dior", 370], ["Dior Book Tote", 340], ["Dior Saddle Bag", 295], ["30 Montaigne Bag", 285], ["Dior Bobby Bag", 260]] },
];

const products = collections.flatMap(({ brand, products: brandProducts }) =>
  brandProducts.map(([name, price], index) => ({
    id: `${brand.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index + 1}`,
    brand,
    name,
    price,
  })),
);

const formatPrice = (price) => `$${price.toLocaleString("en-US")}`;
const bagIllustration = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M22 37h56l-4 49H26l-4-49Z"/><path d="M36 40v-8a14 14 0 0 1 28 0v8"/></svg>`;

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
        <div class="product-illustration" role="img" aria-label="${product.brand} ${product.name} handbag illustration">${bagIllustration}<span>${product.brand}</span></div>
        <button class="product-heart" type="button" data-favorite="${product.id}" aria-label="Save ${product.name} to your wishlist" aria-pressed="false">♡</button>
      </div>
      <div class="product-info">
        <p class="product-brand">${product.brand}</p>
        <div class="product-name-row"><h3 class="product-name">${product.name}</h3><span class="product-price">${formatPrice(product.price)}</span></div>
        <div class="product-meta"><span class="product-note">From the handbag edit</span><button class="add-button" type="button" data-add="${product.id}">ADD TO BAG +</button></div>
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
  const subtotal = items.reduce((total, { product, quantity }) => total + product.price * quantity, 0);
  document.querySelector("#subtotal").textContent = formatPrice(subtotal);
  drawerEmpty.hidden = items.length > 0;
  drawerFooter.hidden = items.length === 0;
  drawerItems.innerHTML = items.map(({ product, quantity }) => {
    return `<article class="drawer-item">
      <div class="drawer-item-swatch">${bagIllustration}</div>
      <div>
        <p class="drawer-item-brand">${product.brand}</p>
        <h3 class="drawer-item-name">${product.name}</h3>
        <div class="drawer-item-controls">
          <button class="quantity-button" type="button" data-quantity="${product.id}" data-change="-1" aria-label="Remove one ${product.name}">−</button>
          <span>${quantity} × ${formatPrice(product.price)}</span>
          <button class="quantity-button" type="button" data-quantity="${product.id}" data-change="1" aria-label="Add one ${product.name}">+</button>
        </div>
      </div>
      <div>
        <strong>${formatPrice(product.price * quantity)}</strong><br>
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
    return product ? `${quantity} × ${product.brand} — ${product.name} — ${formatPrice(product.price * quantity)}` : null;
  }).filter(Boolean);
  const total = [...bag.entries()].reduce((sum, [id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return sum + (product ? product.price * quantity : 0);
  }, 0);
  const summary = `AlluringLuxury order\n${items.join("\n")}\nTotal: ${formatPrice(total)}`;
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
