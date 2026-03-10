function setupFilters() {
  const chips = document.querySelectorAll(".chip");
  const cards = document.querySelectorAll(".product-card");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.getAttribute("data-filter");
      chips.forEach((c) => c.classList.toggle("chip--active", c === chip));

      cards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function setupModal() {
  const modal = document.getElementById("request-modal");
  if (!modal) return;
  const modalInput = modal.querySelector("#modal-product");
  const closeButtons = modal.querySelectorAll("[data-close-modal]");
  const openButtons = document.querySelectorAll("[data-open-modal]");

  function open(productName) {
    modal.classList.add("modal--open");
    modal.setAttribute("aria-hidden", "false");
    if (modalInput && productName) {
      modalInput.value = productName;
    }
  }

  function close() {
    modal.classList.remove("modal--open");
    modal.setAttribute("aria-hidden", "true");
  }

  openButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = btn.getAttribute("data-product") || "";
      open(product);
    });
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", close);
  });

  modal.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-close-modal")) {
      close();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      close();
    }
  });
}

function setupForms() {
  const toast = document.getElementById("toast");

  function showToast() {
    if (!toast) return;
    toast.classList.add("toast--visible");
    toast.setAttribute("aria-hidden", "false");
    setTimeout(() => {
      toast.classList.remove("toast--visible");
      toast.setAttribute("aria-hidden", "true");
    }, 2800);
  }

  ["contact-form", "modal-form"].forEach((id) => {
    const form = document.getElementById(id);
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      form.reset();
      showToast();
    });
  });
}

function setupCart() {
  const cartItemsEl = document.getElementById("cart-items");
  const cartEmptyEl = document.getElementById("cart-empty");
  const cartSummaryEl = document.getElementById("cart-summary");
  if (!cartItemsEl || !cartEmptyEl || !cartSummaryEl) return;

  const cart = new Map();

  function renderCart() {
    const entries = Array.from(cart.entries());
    if (entries.length === 0) {
      cartItemsEl.style.display = "none";
      cartSummaryEl.style.display = "none";
      cartEmptyEl.style.display = "";
      return;
    }

    cartItemsEl.innerHTML = "";
    let totalCount = 0;

    entries.forEach(([name, quantity]) => {
      totalCount += quantity;
      const li = document.createElement("li");
      li.textContent = `${name} — ${quantity} шт.`;
      cartItemsEl.appendChild(li);
    });

    cartEmptyEl.style.display = "none";
    cartItemsEl.style.display = "";
    cartSummaryEl.style.display = "";
    cartSummaryEl.textContent = `Всего позиций: ${entries.length}, общее количество единиц оборудования: ${totalCount}. Для уточнения конфигурации отправьте запрос через форму контактов.`;
  }

  function addToCart(name) {
    if (!name) return;
    const current = cart.get(name) || 0;
    cart.set(name, current + 1);
    renderCart();
  }

  document.querySelectorAll("[data-add-to-cart]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-product") || btn.dataset.productName || "Позиция каталога";
      addToCart(name);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupFilters();
  setupSmoothScroll();
  setupModal();
  setupForms();
  setupCart();
});

