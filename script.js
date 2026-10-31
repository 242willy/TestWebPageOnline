const collections = [
  { brand: "Chanel", names: [["Classic Flap Bag", 380], ["Chanel 19 Bag", 360], ["Chanel 22 Bag", 340], ["Boy Chanel", 330], ["Deauville Tote", 320]] },
  { brand: "Prada", names: [["Prada Galleria", 295], ["Prada Cleo", 240], ["Prada Re-Edition 2005 / 2000", 210], ["Prada Arqué", 230], ["Natural Crochet Tote", 220]] },
  { brand: "Coach", names: [["Tabby Shoulder Bag", 185], ["Brooklyn Shoulder Bag", 195], ["Rogue Tote", 210], ["Teri Shoulder Bag", 155], ["Nolita Wristlet", 120]] },
  { brand: "YSL (Saint Laurent)", names: [["Loulou", 320], ["Kate", 295], ["Sac de Jour", 350], ["Sunset", 280], ["Niki", 310]] },
  { brand: "Gucci", names: [["GG Marmont", 285], ["Jackie 1961", 310], ["Dionysus", 295], ["Horsebit 1955", 305], ["Gucci Diana", 340]] },
  { brand: "Louis Vuitton", names: [["Neverfull", 260], ["Speedy", 250], ["Pochette Accessoires", 165], ["Alma", 270], ["NéoNoé", 255]] },
  { brand: "Hermès", names: [["Birkin Bag", 480], ["Kelly Bag", 460], ["Constance Bag", 390], ["Picotin Lock", 295], ["Evelyne Bag", 270]] },
  { brand: "Celine", names: [["Celine Triomphe", 310], ["Celine Luggage Bag", 340], ["Celine Classic Box Bag", 295], ["Celine Ava Bag", 240], ["Celine Belt Bag", 285]] },
  { brand: "Bvlgari", names: [["Serpenti Forever Crossbody", 320], ["Serpenti Cabochon", 310], ["Serpenti Viper", 340], ["Serpenti Day-to-Night", 295], ["Serpenti Forever Mini Top Handle", 260]] },
  { brand: "Dior", names: [["Lady Dior", 370], ["Dior Book Tote", 340], ["Dior Saddle Bag", 295], ["30 Montaigne Bag", 285], ["Dior Bobby Bag", 260]] },
];

const products = collections.flatMap(({ brand, names }) =>
  names.map(([name, price], index) => ({
    id: `${brand.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
    brand,
    name,
    price,
  })),
);

const palettes = [
  { bg: "#eee7db", leather: "#9b7958", trim: "#684c36", hardware: "#b49969" },
  { bg: "#e9e4dc", leather: "#393837", trim: "#232221", hardware: "#c5a669" },
  { bg: "#efe9e2", leather: "#ab7f6d", trim: "#79564d", hardware: "#b6a07c" },
  { bg: "#e9e6df", leather: "#77766c", trim: "#55544b", hardware: "#b9a170" },
  { bg: "#f0e6dd", leather: "#d1b99a", trim: "#a58b69", hardware: "#bba36f" },
  { bg: "#e8e4da", leather: "#68756b", trim: "#424e46", hardware: "#bfaa7a" },
];

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

const money = (amount) => `$${amount.toLocaleString("en-US")}`;

function bagIllustration(index, compact = false) {
  const palette = palettes[index % palettes.length];
  const bagId = `illustration-${index}-${compact ? "small" : "large"}`;
  const viewBox = compact ? "0 0 120 120" : "0 0 280 300";
  const scale = compact ? ' transform="translate(16 15) scale(.31)"' : "";

  return {
    palette,
    svg: `<svg viewBox="${viewBox}" role="img" aria-label="Illustrative handbag">
      <title>Illustrative handbag</title>
      <g${scale}>
        <ellipse cx="140" cy="263" rx="91" ry="13" fill="rgba(57,47,34,.12)"/>
        <path class="product-bag-handle" d="M92 109V83c0-31 18-51 48-51s48 20 48 51v26"/>
        <path class="product-bag-body" d="M65 103h150l16 146H49l16-146Z"/>
        <path class="product-bag-seam" d="M76 115h128l12 120H64l12-120Z"/>
        <path class="product-bag-stripe" d="M73 105h18l-15 141H58l15-141Zm116 0h18l15 141h-18l-15-141Z"/>
        <path class="product-bag-hardware" d="M130 139h20v28h-20z"/>
        <circle class="product-bag-hardware" cx="140" cy="149" r="3"/>
        <path class="product-bag-seam" d="M52 242h176"/>
        <path class="product-bag-seam" d="M86 104c0 12 9 18 18 18s18-6 18-18m36 0c0 12 9 18 18 18s18-6 18-18"/>
      </g>
    </svg>`,
  };
}

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
    case "low":
      visible.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name));
      break;
    case "high":
      visible.sort((a, b) => b.price - a.price || a.name.localeCompare(b.name));
      break;
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
    const index = products.indexOf(product);
    const art = bagIllustration(index);
    return `<article class="product-card">
      <div class="product-art" style="--product-bg:${art.palette.bg};--product-leather:${art.palette.leather};--product-trim:${art.palette.trim};--product-hardware:${art.palette.hardware}">
        <span class="product-art-label">ILLUSTRATIVE IMAGE</span>
        <button class="product-heart" type="button" data-favorite="${product.id}" aria-label="Save ${product.name} to your wishlist" aria-pressed="false">♡</button>
        ${art.svg}
      </div>
      <div class="product-info">
        <p class="product-brand">${product.brand}</p>
        <div class="product-name-row"><h3 class="product-name">${product.name}</h3><span class="product-price">${money(product.price)}</span></div>
        <div class="product-meta"><span class="product-note">A considered classic</span><button class="add-button" type="button" data-add="${product.id}">ADD TO BAG +</button></div>
      </div>
    </article>`;
  }).join("");
}

function updateBag() {
  const items = [...bag.entries()]
    .map(([id, quantity]) => ({ product: products.find((item) => item.id === id), quantity }))
    .filter(({ product }) => product);
  const count = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  document.querySelector("#bag-count").textContent = count;
  document.querySelector("#drawer-count").textContent = `(${count})`;
  document.querySelector("#subtotal").textContent = money(subtotal);
  drawerEmpty.hidden = items.length > 0;
  drawerFooter.hidden = items.length === 0;
  drawerItems.innerHTML = items.map(({ product, quantity }) => {
    const index = products.indexOf(product);
    const art = bagIllustration(index, true);
    return `<article class="drawer-item" style="--product-bg:${art.palette.bg};--product-leather:${art.palette.leather};--product-trim:${art.palette.trim};--product-hardware:${art.palette.hardware}">
      <div class="drawer-item-swatch">${art.svg}</div>
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
        <strong>${money(product.price * quantity)}</strong><br>
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
    return product ? `${quantity} × ${product.brand} — ${product.name} (${money(product.price * quantity)})` : null;
  }).filter(Boolean);
  const total = [...bag.entries()].reduce((sum, [id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return sum + (product ? product.price * quantity : 0);
  }, 0);
  const summary = `AlluringLuxury order inquiry\n${items.join("\n")}\nSubtotal: ${money(total)}`;
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
