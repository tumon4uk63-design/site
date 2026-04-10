/**
 * Общая логика: корзина, пользователь, тост, шапка.
 * Требует предварительно подключённый catalog-data.js
 */
(function () {
  const CART_KEY = "stalprofil-cart";
  const USER_KEY = "stalprofil-user";
  const ORDERS_KEY = "stalprofil-orders";

  function getCatalog() {
    return window.STALPROFIL_CATALOG || [];
  }

  function formatMoney(n) {
    return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);
  }

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      const catalog = getCatalog();
      const rebuilt = {};
      for (const [id, line] of Object.entries(parsed)) {
        const item = catalog.find((p) => p.id === id) || line.item;
        if (item) rebuilt[id] = { item, qty: line.qty };
      }
      return rebuilt;
    } catch {
      return {};
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function getUnitPrice(item) {
    if (item.pricePerTon != null) return item.pricePerTon;
    if (item.pricePerMeter != null) return item.pricePerMeter;
    return 0;
  }

  function displayPrice(item) {
    if (item.pricePerTon != null) return `${formatMoney(item.pricePerTon)} <small>/ т</small>`;
    if (item.pricePerMeter != null) return `${formatMoney(item.pricePerMeter)} <small>/ м</small>`;
    return "—";
  }

  function lineTotal(item, qty) {
    return getUnitPrice(item) * qty;
  }

  function findProduct(id) {
    return getCatalog().find((p) => p.id === id);
  }

  function updateAllCartBadges() {
    const cart = loadCart();
    const count = Object.values(cart).reduce((s, l) => s + l.qty, 0);
    document.querySelectorAll("[data-cart-badge]").forEach((el) => {
      if (count > 0) {
        el.hidden = false;
        el.textContent = String(count);
      } else {
        el.hidden = true;
      }
    });
  }

  function showToast(msg) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }

  function addToCart(id) {
    const item = findProduct(id);
    if (!item) return;
    const cart = loadCart();
    if (!cart[id]) cart[id] = { item, qty: 0 };
    cart[id].qty += item.category === "structure" ? 1 : item.unitLabel === "м" ? 6 : 1;
    saveCart(cart);
    updateAllCartBadges();
    showToast(`${item.title} добавлен в корзину`);
    return cart;
  }

  function changeQty(id, delta) {
    const cart = loadCart();
    if (!cart[id]) return;
    cart[id].qty += delta;
    if (cart[id].qty < 1) delete cart[id];
    saveCart(cart);
    updateAllCartBadges();
    return cart;
  }

  function removeLine(id) {
    const cart = loadCart();
    delete cart[id];
    saveCart(cart);
    updateAllCartBadges();
    return cart;
  }

  function clearCart() {
    saveCart({});
    updateAllCartBadges();
  }

  function getUser() {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function setUser(user) {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
    updateHeaderAccount();
  }

  function saveOrder(summary) {
    try {
      const list = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
      list.unshift({
        id: "SP-" + Date.now(),
        date: new Date().toISOString(),
        total: summary.total,
        items: summary.items,
      });
      localStorage.setItem(ORDERS_KEY, JSON.stringify(list.slice(0, 20)));
    } catch (_) {}
  }

  function getOrders() {
    try {
      return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function updateHeaderAccount() {
    const el = document.getElementById("navAccount");
    if (!el) return;
    const u = getUser();
    if (u) {
      el.textContent = "Кабинет";
      el.href = "account.html";
      el.classList.remove("btn--accent-outline");
    } else {
      el.textContent = "Войти";
      el.href = "login.html";
    }
  }

  function initBurger() {
    const burger = document.getElementById("burger");
    const nav = document.querySelector(".nav");
    if (!burger || !nav) return;
    burger.addEventListener("click", () => {
      const open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      if (!open) {
        nav.style.display = "flex";
        nav.style.flexDirection = "column";
        nav.style.position = "absolute";
        nav.style.top = "100%";
        nav.style.left = "0";
        nav.style.right = "0";
        nav.style.background = "var(--bg-elevated)";
        nav.style.padding = "1rem";
        nav.style.borderBottom = "1px solid var(--border)";
        nav.style.zIndex = "99";
      } else {
        nav.style.display = "none";
      }
    });
  }

  function initAmbientVideoCrossfade() {
    const a = document.getElementById("ambientVideoA");
    const b = document.getElementById("ambientVideoB");
    if (!a || !b) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      a.pause();
      b.pause();
      return;
    }
    let active = a;
    const SWAP_MS = 22000;
    function activate(next) {
      if (next === active) return;
      const prev = active;
      active = next;
      a.classList.toggle("is-active", active === a);
      b.classList.toggle("is-active", active === b);
      active.currentTime = 0;
      const p = active.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
      prev.pause();
    }
    setInterval(() => activate(active === a ? b : a), SWAP_MS);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        a.pause();
        b.pause();
      } else {
        const p = active.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      }
    });
  }

  window.StalProfil = {
    getCatalog,
    formatMoney,
    loadCart,
    saveCart,
    getUnitPrice,
    displayPrice,
    lineTotal,
    findProduct,
    addToCart,
    changeQty,
    removeLine,
    clearCart,
    updateAllCartBadges,
    showToast,
    getUser,
    setUser,
    saveOrder,
    getOrders,
    updateHeaderAccount,
    initBurger,
    initAmbientVideoCrossfade,
  };

  document.addEventListener("DOMContentLoaded", () => {
    StalProfil.updateHeaderAccount();
    StalProfil.updateAllCartBadges();
    StalProfil.initBurger();
  });
})();
