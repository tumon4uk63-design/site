(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const S = StalProfil;
    const labels = window.STALPROFIL_CATEGORY_LABELS || {};
    const productsEl = document.getElementById("products");
    const filtersEl = document.getElementById("filters");
    const searchInput = document.getElementById("searchInput");
    if (!productsEl || !filtersEl) return;

    let activeCat = "all";
    let searchQuery = "";

    function buildChips() {
      const order = [
        "all",
        "beam",
        "channel",
        "angle",
        "tube",
        "pipe",
        "rebar",
        "sheet",
        "round",
        "square",
        "strip",
        "mesh",
        "structure",
      ];
      const keys = order.filter((k) => labels[k]);
      filtersEl.innerHTML = keys
        .map(
          (k) =>
            `<button type="button" class="chip${k === "all" ? " chip--active" : ""}" data-cat="${k}">${labels[k]}</button>`
        )
        .join("");
    }

    function filtered() {
      return S.getCatalog().filter((item) => {
        const catOk = activeCat === "all" || item.category === activeCat;
        const q = searchQuery.trim().toLowerCase();
        const searchOk =
          !q ||
          item.title.toLowerCase().includes(q) ||
          item.spec.toLowerCase().includes(q) ||
          item.tag.toLowerCase().includes(q);
        return catOk && searchOk;
      });
    }

    function render() {
      const list = filtered();
      if (!list.length) {
        productsEl.innerHTML = `<p class="cart-empty">Ничего не найдено. Сбросьте фильтры или измените запрос.</p>`;
        return;
      }
      productsEl.innerHTML = list
        .map(
          (item) => `
        <article class="product-card" id="${item.id}">
          <span class="product-card__tag">${item.tag}</span>
          <h3>${item.title}</h3>
          <p class="product-card__spec">${item.spec}</p>
          <p class="product-card__price">${S.displayPrice(item)}</p>
          <button type="button" class="btn btn--primary btn--block add-to-cart" data-id="${item.id}">В корзину</button>
        </article>`
        )
        .join("");

      productsEl.querySelectorAll(".add-to-cart").forEach((btn) => {
        btn.addEventListener("click", () => {
          S.addToCart(btn.dataset.id);
        });
      });
    }

    buildChips();
    render();

    filtersEl.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      filtersEl.querySelectorAll(".chip").forEach((c) => c.classList.remove("chip--active"));
      chip.classList.add("chip--active");
      activeCat = chip.dataset.cat || "all";
      render();
    });

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        searchQuery = searchInput.value;
        render();
      });
    }

    const hash = location.hash.replace(/^#/, "");
    if (hash && S.findProduct(hash)) {
      requestAnimationFrame(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  });
})();
