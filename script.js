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

const categoryLabels = ["Jewelry", "Bag", "Shades", "Clothing"];

const bagProducts = collections.flatMap(({ brand, products: brandProducts }) =>
  brandProducts.map(([name, price], index) => ({
    id: `${brand.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index + 1}`,
    brand,
    name,
    price,
    category: "Bag",
    image: null,
    estimatedPrice: false,
  })),
);

const shadeBrandFiles = [
  { brand: "Bvlgari", prefix: "bvlgari", files: Array.from({ length: 21 }, (_, index) => index + 1).filter((number) => number !== 15) },
  { brand: "Cartier", prefix: "cartier", files: Array.from({ length: 7 }, (_, index) => index + 1) },
  { brand: "Chanel", prefix: "chanel", files: Array.from({ length: 30 }, (_, index) => index + 1) },
  { brand: "Dior", prefix: "dior", files: Array.from({ length: 11 }, (_, index) => index + 1) },
  { brand: "Gucci", prefix: "gucci", files: Array.from({ length: 7 }, (_, index) => index + 1) },
  { brand: "Prada", prefix: "prada", files: Array.from({ length: 10 }, (_, index) => index + 1) },
];

const jewelryBrandFiles = [
  { brand: "David Yurman", prefix: "yurman", files: Array.from({ length: 66 }, (_, index) => index + 1) },
];

const unknownJewelryFiles = [
  "01f7ba33-2187-4903-a556-3a7686a57b74.JPG",
  "2aa7d5ce-ae00-42c5-b419-9e4e6016d70b.JPG",
  "02e70264-8683-43c7-99d3-49d0daa5e92c.JPG",
  "4aa7fdc9-5973-4bd4-b682-300ebcb40b13.JPG",
  "5df40f3e-0d5d-4e15-964a-0aa309363c50.JPG",
  "8feafe41-a4a2-417c-a105-8027808e34df.JPG",
  "9e8b9f6a-2407-4d90-a158-fc2a012e326a.JPG",
  "9e227dc5-dfad-4cd2-910d-9d8ed23b328b.JPG",
  "11bd4e52-236d-4f10-980a-a85db168a7ef.JPG",
  "272bf0a9-78fb-4840-a7ab-cd25339d52b9.JPG",
  "277f6b03-c1d2-4e0b-a728-46f8dc40e58b.JPG",
  "619ac635-c124-4f9c-8352-d26e3b4e50d8.JPG",
  "647dfff6-2374-481f-aea6-abd38599d182.JPG",
  "744a8c5b-fc78-4b6f-a49c-c5c859e630ad.JPG",
  "14601b39-4659-400f-a868-f8a64ba900fc.JPG",
  "6282329e-9cff-445a-8349-4ad2ac8201d5.JPG",
  "56991060-6255-445f-a24f-c2615c223267.JPG",
  "78660506-700e-4320-800d-790b7b52ae40.JPG",
  "a79c10ad-49a7-4580-b725-650ad241c442.JPG",
  "ac35bf59-ec70-49e6-b708-bae124aa7f7c.JPG",
  "b4ecd05f-e6cc-45ad-827d-4c6b1d93e80d.JPG",
  "b53b06b9-b6c9-4c62-9403-2e7f72aa08dd.JPG",
  "bfe94e44-b879-4df8-8984-81f79924ede8.JPG",
  "c2cc003e-61ea-4443-aec3-f95a972517c5.JPG",
  "cbef6153-aee3-457a-805c-0405f9b4f4ec.JPG",
  "cc49e3d0-1913-474d-a709-9808edc0af28.JPG",
  "cc9218a5-dfb7-4b5b-a6b4-027393261d97.JPG",
  "cf4812e9-649d-4e2a-9611-f3787f96f41f.JPG",
  "d48f6637-40f4-4ad4-b0b3-c43d7f3b47f1.JPG",
  "dcedc07c-cad1-4832-b607-6fcc35c53dad.JPG",
  "efbd6603-0fbf-4351-98eb-65e5c32e2da3.JPG",
  "f5c98b47-f763-465c-8f4b-10e8b9fa701e.JPG",
  "fde2755b-d826-42f3-9492-34110cbb76fb.JPG",
  "fdffc01c-3541-4aae-b759-f3a876c67f7d.JPG",
];

const unknownShadeFiles = [
  "1e202ffa-9620-4ae0-bc89-6bc621342a2d.JPG",
  "2dfb8094-5bee-4279-8ae7-e31598e6d1f6.JPG",
  "2ff1d142-7cd2-4e03-a3e5-898b78b4f0e8.JPG",
  "4cb8b53b-61ac-4b08-b912-234a4ac6af3d.JPG",
  "9ab4dd1a-45f9-4e39-95b9-4054bfdc46f2.JPG",
  "116bfa47-a08e-454d-acf1-bb197098ca84.JPG",
  "373c36df-8dfb-478e-89b0-1b6966c2e062.JPG",
  "715c9a7b-1696-45a1-b067-7d70fb939c5e.JPG",
  "68489a94-973e-438f-8dd4-f9c149ad4364.JPG",
  "35044874-783b-4478-b209-839003a4a6be.JPG",
  "a8255f32-d7ed-47ff-a6db-790117998b1a.JPG",
  "b0c3d16e-431f-4e82-9bcb-dfaa1713bfc0.JPG",
  "b6f723f6-8c78-45c7-a59c-1f7dc2bf1b0a.JPG",
  "b07c692f-6670-4885-bf7e-bd1222ff7861.JPG",
  "ba3ed23d-b429-4cd8-a9d1-bd185029a84a.JPG",
  "bb65b95d-d46d-434f-b490-9276e2f2ca8c.JPG",
  "f5c05da6-38a6-465e-a299-76e411fbf44d.JPG",
  "fbbb4fe2-8a6b-4e9f-982e-daff9bae9f0f.JPG",
  "fc2a1a1f-a55a-4b4f-9342-51284409720e.JPG",
  "fdabc388-3d4c-4a94-8d03-81180a837dba.JPG",
];

function estimateAccessoryPrice(brand) {
  const sourceCollection = collections.find((collection) => collection.brand === brand);
  const sourcePrice = sourceCollection
    ? sourceCollection.products.reduce((sum, [, price]) => sum + price, 0) / sourceCollection.products.length
    : brand === "Cartier" ? 320 : 180;
  return Math.round(sourcePrice * 0.65 / 10) * 10;
}

const jewelryProducts = jewelryBrandFiles.flatMap(({ brand, prefix, files }) =>
  files.map((number) => ({
    id: `jewelry-${prefix}-${number}`,
    brand,
    name: `${brand} Jewelry ${String(number).padStart(2, "0")}`,
    price: estimateAccessoryPrice(brand),
    category: "Jewelry",
    image: `image/Jewelry/${prefix === "yurman" ? "david yurman" : prefix}/${prefix}${number}.JPG`,
    estimatedPrice: true,
  })),
).concat(unknownJewelryFiles.map((filename, index) => ({
  id: `jewelry-unidentified-${index + 1}`,
  brand: "Unidentified",
  name: `Designer Jewelry ${String(index + 1).padStart(2, "0")}`,
  price: estimateAccessoryPrice("Unidentified"),
  category: "Jewelry",
  image: `image/Jewelry/unknown/${filename}`,
  estimatedPrice: true,
})));

const shadeProducts = shadeBrandFiles.flatMap(({ brand, prefix, files }) =>
  files.map((number) => ({
    id: `shades-${prefix}-${number}`,
    brand,
    name: `${brand} Sunglasses ${String(number).padStart(2, "0")}`,
    price: estimateAccessoryPrice(brand),
    category: "Shades",
    image: `image/Shades/${prefix}/${prefix}${number}.JPG`,
    estimatedPrice: true,
  })),
).concat(unknownShadeFiles.map((filename, index) => ({
  id: `shades-unidentified-${index + 1}`,
  brand: "Unidentified",
  name: `Designer Sunglasses ${String(index + 1).padStart(2, "0")}`,
  price: estimateAccessoryPrice("Unidentified"),
  category: "Shades",
  image: `image/Shades/unknown/${filename}`,
  estimatedPrice: true,
})));

const products = [...bagProducts, ...jewelryProducts, ...shadeProducts];

const formatPrice = (price) => `$${price.toLocaleString("en-US")}`;
const formatProductPrice = (product, amount = product.price) =>
  `${formatPrice(amount)}${product.estimatedPrice ? " est." : ""}`;
const bagIllustration = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M22 37h56l-4 49H26l-4-49Z"/><path d="M36 40v-8a14 14 0 0 1 28 0v8"/></svg>`;

const productGrid = document.querySelector("#product-grid");
const typeFilterContainer = document.querySelector("#type-filters");
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
let activeCategory = "All";
let bag = new Map();
let toastTimer;
let lastFocusedElement;

function renderFilters() {
  const brands = ["All", ...new Set(products.map(({ brand }) => brand))];
  const types = ["All", ...categoryLabels];

  filterContainer.innerHTML = brands.map((brand) => {
    const active = activeBrand === brand;
    return `<button class="filter-chip${active ? " active" : ""}" type="button" data-brand="${brand}" aria-pressed="${active}">${brand}</button>`;
  }).join("");

  typeFilterContainer.innerHTML = types.map((type) => {
    const active = activeCategory === type;
    return `<button class="filter-chip${active ? " active" : ""}" type="button" data-category="${type}" aria-pressed="${active}">${type}</button>`;
  }).join("");
}

function getVisibleProducts() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const visible = products.filter((product) => {
    const matchesBrand = activeBrand === "All" || product.brand === activeBrand;
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = `${product.name} ${product.brand}`.toLocaleLowerCase().includes(query);
    return matchesBrand && matchesCategory && matchesSearch;
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
    const artwork = product.image
      ? `<img class="product-image" src="${product.image}" alt="${product.brand} ${product.name}" loading="lazy">`
      : `<div class="product-image-placeholder" aria-hidden="true">${bagIllustration}</div>`;
    const productNote = product.estimatedPrice ? `Estimated price · ${product.category.toLowerCase()}` : "From the handbag edit";
    return `<article class="product-card">
      <div class="product-art">
        ${artwork}
        <button class="product-heart" type="button" data-favorite="${product.id}" aria-label="Save ${product.name} to your wishlist" aria-pressed="false">♡</button>
      </div>
      <div class="product-info">
        <p class="product-brand">${product.brand}</p>
        <div class="product-name-row"><h3 class="product-name">${product.name}</h3><span class="product-price">${formatProductPrice(product)}</span></div>
        <div class="product-meta"><span class="product-note">${productNote}</span><button class="add-button" type="button" data-add="${product.id}">ADD TO BAG +</button></div>
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
  const includesEstimate = items.some(({ product }) => product.estimatedPrice);
  document.querySelector("#subtotal").textContent = `${formatPrice(subtotal)}${includesEstimate ? " est." : ""}`;
  drawerEmpty.hidden = items.length > 0;
  drawerFooter.hidden = items.length === 0;
  drawerItems.innerHTML = items.map(({ product, quantity }) => {
    const artwork = product.image
      ? `<img src="${product.image}" alt="${product.name}" loading="lazy">`
      : `<span aria-hidden="true">${bagIllustration}</span>`;
    return `<article class="drawer-item">
      <div class="drawer-item-swatch">${artwork}</div>
      <div>
        <p class="drawer-item-brand">${product.brand}</p>
        <h3 class="drawer-item-name">${product.name}</h3>
        <div class="drawer-item-controls">
          <button class="quantity-button" type="button" data-quantity="${product.id}" data-change="-1" aria-label="Remove one ${product.name}">−</button>
          <span>${quantity} × ${formatProductPrice(product)}</span>
          <button class="quantity-button" type="button" data-quantity="${product.id}" data-change="1" aria-label="Add one ${product.name}">+</button>
        </div>
      </div>
      <div>
        <strong>${formatProductPrice(product, product.price * quantity)}</strong><br>
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

typeFilterContainer.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  renderFilters();
  renderProducts();
});

searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);

document.querySelector("#reset-filters").addEventListener("click", () => {
  activeBrand = "All";
  activeCategory = "All";
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
    return product ? `${quantity} × ${product.brand} — ${product.name} — ${formatProductPrice(product, product.price * quantity)}` : null;
  }).filter(Boolean);
  const total = [...bag.entries()].reduce((sum, [id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return sum + (product ? product.price * quantity : 0);
  }, 0);
  const hasEstimates = [...bag.keys()].some((id) => products.find((product) => product.id === id)?.estimatedPrice);
  const summary = `AlluringLuxury order\n${items.join("\n")}\nTotal: ${formatPrice(total)}${hasEstimates ? " est." : ""}`;
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
