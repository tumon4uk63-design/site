(function () {
  document.addEventListener("DOMContentLoaded", () => {
    StalProfil.initAmbientVideoCrossfade();

    const leadForm = document.getElementById("leadForm");
    if (leadForm) {
      leadForm.addEventListener("submit", (e) => {
        e.preventDefault();
        StalProfil.showToast("Спасибо! Заявка записана (демо, данные не отправлялись).");
        leadForm.reset();
      });
    }

    const featured = document.getElementById("featuredProducts");
    if (featured) {
      const ids = ["b-20b1", "sh-16p", "t-100x100", "r-a500-12", "s-4x1500", "mk-frame"];
      const S = StalProfil;
      featured.innerHTML = ids
        .map((id) => S.findProduct(id))
        .filter(Boolean)
        .map(
          (item) => `
 <article class="product-card">
          <span class="product-card__tag">${item.tag}</span>
          <h3>${item.title}</h3>
          <p class="product-card__spec">${item.spec}</p>
          <p class="product-card__price">${S.displayPrice(item)}</p>
          <div class="product-card__actions">
            <button type="button" class="btn btn--primary btn--block featured-add-cart" data-id="${item.id}">Добавить в корзину</button>
            <a class="btn btn--outline btn--block" href="catalog.html#${item.id}">Перейти в каталог</a>
          </div>
        </article>`
        )
        .join("");

      featured.addEventListener("click", (e) => {
        const btn = e.target.closest(".featured-add-cart");
        if (!btn) return;
        S.addToCart(btn.getAttribute("data-id"));
      });
    }
  });
})();
