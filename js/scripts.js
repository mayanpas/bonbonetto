const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.querySelector(".close-sidebar");
const sidebarLinks = document.querySelectorAll(".sidebar-nav a");
const addToCartButtons = document.querySelectorAll(
  ".produto button.adicionarSacola",
);
const cartItemsContainer = document.getElementById("cartItems");
const clearCartButton = document.getElementById("clearCart");
const paymentButton = document.getElementById("buy");
const CART_STORAGE_KEY = "bonbonettoCart";

// Abrir/fechar sidebar ao clicar no botão de menu
if (menuToggle && sidebar) {
  menuToggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");
    document.body.classList.toggle("sidebar-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Fechar sidebar ao clicar no botão X
if (closeSidebar && sidebar) {
  closeSidebar.addEventListener("click", () => {
    sidebar.classList.remove("open");
    document.body.classList.remove("sidebar-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
}

// Fechar sidebar ao clicar em um link
sidebarLinks.forEach((link) => {
  link.addEventListener("click", () => {
    sidebar.classList.remove("open");
    document.body.classList.remove("sidebar-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Fechar sidebar ao clicar no backdrop
document.body.addEventListener("click", (e) => {
  if (e.target === document.body && sidebar.classList.contains("open")) {
    sidebar.classList.remove("open");
    document.body.classList.remove("sidebar-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

function getCartItems() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveCartItems(items) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function formatPrice(value) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function parsePrice(priceText) {
  const match = String(priceText).match(/R\$\s*([\d.,]+)/);
  if (!match) return 0;
  const normalized = match[1].replace(/\./g, "").replace(/,/, ".");
  return Number(normalized) || 0;
}

function updateCartCount() {
  const cart = getCartItems();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.querySelector(".cart-count");
  if (!badge) return;
  badge.textContent = String(count);
  badge.style.display = count > 0 ? "inline-flex" : "none";
}

function addProductToCart(product) {
  const cart = getCartItems();
  const existingItem = cart.find((item) => item.title === product.title);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(product);
  }
  saveCartItems(cart);
  updateCartCount();
}

function handleAddToCart(event) {
  const button = event.currentTarget;
  const card = button.closest(".produto");
  if (!card) return;

  const title = card.querySelector("h3")?.textContent.trim() || "Produto";
  const price = card.querySelector("p")?.textContent.trim() || "R$ 0,00";
  const img = card.querySelector("img")?.src || "";

  addProductToCart({ title, price, img, quantity: 1 });
  // alert(`${title} adicionado ao carrinho!`);
}

function renderCartPage() {
  if (!cartItemsContainer) return;

  const cart = getCartItems();
  const emptyMessage = document.getElementById("emptyCartMessage");
  const summary = document.getElementById("cartSummary");
  const totalEl = document.getElementById("cartTotal");

  if (cart.length === 0) {
    if (emptyMessage) emptyMessage.classList.remove("hidden");
    cartItemsContainer.innerHTML = "";
    if (summary) {
      summary.classList.add("hidden");
      summary.style.display = "none";
    }
    if (clearCartButton) {
      clearCartButton.style.display = "none";
      paymentButton.style.display = "none";
    }
    if (totalEl) totalEl.textContent = formatPrice(0);
    return;
  }

  if (emptyMessage) emptyMessage.classList.add("hidden");
  if (summary) {
    summary.classList.remove("hidden");
    summary.style.display = "flex";
  }
  if (clearCartButton) clearCartButton.style.display = "inline-flex";

  cartItemsContainer.innerHTML = cart
    .map(
      (item, index) => `
      <div class="cart-item" data-index="${index}">
        <div class="product-content">
          <img src="${item.img}" alt="${item.title}" />
          <div class="cart-item-details">
            <h3>${item.title}</h3>
            <p>${item.price} x ${item.quantity}</p>
          </div>
        </div>
        <button type="button" class="remove-item" data-index="${index}">Remover</button>
      </div>
    `,
    )
    .join("");

  const total = cart.reduce(
    (sum, item) => sum + parsePrice(item.price) * item.quantity,
    0,
  );
  if (totalEl) totalEl.textContent = formatPrice(total);
}

function removeCartItem(index) {
  const cart = getCartItems();
  if (index < 0 || index >= cart.length) return;
  cart.splice(index, 1);
  saveCartItems(cart);
  updateCartCount();
  renderCartPage();
}

function clearCart() {
  saveCartItems([]);
  updateCartCount();
  renderCartPage();
}

if (addToCartButtons) {
  addToCartButtons.forEach((button) =>
    button.addEventListener("click", handleAddToCart),
  );
}

if (cartItemsContainer) {
  cartItemsContainer.addEventListener("click", (event) => {
    const removeButton = event.target.closest(".remove-item");
    if (!removeButton) return;
    const index = Number(removeButton.dataset.index);
    removeCartItem(index);
  });
}

if (clearCartButton) {
  clearCartButton.addEventListener("click", clearCart);
}

updateCartCount();
renderCartPage();

// aniamç~cao
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Quando entra na tela
        entry.target.classList.add("show");
      } else {
        // Quando sai da tela (permite repetir a animação ao subir/descer)
        entry.target.classList.remove("show");
      }
    });
  },
  {
    // Ajuste o threshold para 0.2 para a animação começar
    // apenas quando 20% do card estiver visível
    // threshold: 0.1
  },
);

const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((el) => observer.observe(el));
