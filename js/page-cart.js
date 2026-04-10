(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const S = StalProfil;
    const root = document.getElementById("cartPage");
    const totalEl = document.getElementById("cartPageTotal");
    const checkoutBtn = document.getElementById("cartCheckoutBtn");
    const summaryBlock = document.getElementById("cartSummaryBlock");

    function render() {
      const cart = S.loadCart();
      const lines = Object.values(cart);
      if (!lines.length) {
        root.innerHTML = `
          <div class="cart-empty-state">
            <p>В корзине пока пусто.</p>
            <a class="btn btn--primary" href="catalog.html">Перейти в каталог</a>
          </div>`;
        if (totalEl) totalEl.textContent = S.formatMoney(0);
        if (summaryBlock) summaryBlock.style.display = "none";
        return;
      }
      if (summaryBlock) summaryBlock.style.display = "";
      let sum = 0;
      const rows = lines
        .map(({ item, qty }) => {
          const lt = S.lineTotal(item, qty);
          sum += lt;
          const unit = item.unitLabel === "м" ? "м" : "т";
          return `
            <tr data-id="${item.id}">
              <td>
                <strong>${item.title}</strong>
                <div class="product-card__spec">${item.tag} · ${item.spec}</div>
              </td>
              <td>${S.formatMoney(S.getUnitPrice(item))} / ${unit}</td>
              <td>
                <div class="qty-control">
                  <button type="button" data-act="minus" data-id="${item.id}" aria-label="Меньше">−</button>
                  <span>${qty} ${unit}</span>
                  <button type="button" data-act="plus" data-id="${item.id}" aria-label="Больше">+</button>
                </div>
              </td>
              <td class="cart-row-sum">${S.formatMoney(lt)}</td>
              <td><button type="button" class="link-btn" data-remove="${item.id}">Удалить</button></td>
            </tr>`;
        })
        .join("");

      root.innerHTML = `
        <div class="table-wrap">
          <table class="cart-table">
            <thead>
              <tr>
                <th>Товар</th>
                <th>Цена</th>
                <th>Количество</th>
                <th>Сумма</th>
                <th></th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>`;

      if (totalEl) totalEl.textContent = S.formatMoney(sum);

      root.querySelectorAll("[data-remove]").forEach((btn) => {
        btn.addEventListener("click", () => {
          S.removeLine(btn.getAttribute("data-remove"));
          render();
        });
      });
      root.querySelectorAll("[data-act]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-id");
          S.changeQty(id, btn.getAttribute("data-act") === "plus" ? 1 : -1);
          render();
        });
      });
    }

    render();

    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        const cart = S.loadCart();
        if (!Object.keys(cart).length) {
          S.showToast("Корзина пуста");
          return;
        }
        let sum = 0;
        const items = Object.values(cart).map(({ item, qty }) => {
          const lt = S.lineTotal(item, qty);
          sum += lt;
          return { title: item.title, qty, unit: item.unitLabel, sum: lt };
        });
        S.saveOrder({ total: sum, items });
        S.clearCart();
        render();
        S.showToast("Заявка оформлена (демо). Счёт и договор — в личном кабинете.");
        setTimeout(() => {
          location.href = S.getUser() ? "account.html" : "login.html";
        }, 800);
      });
    }
  });
})();
