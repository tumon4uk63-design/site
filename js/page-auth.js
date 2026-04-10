(function () {
  const page = document.body.dataset.page;

  function socialDemo(provider) {
    StalProfil.showToast(`Демо: вход через ${provider} не подключён к серверу OAuth. Используйте форму ниже.`);
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-social]").forEach((btn) => {
      btn.addEventListener("click", () => socialDemo(btn.getAttribute("data-social")));
    });

    if (page === "login") {
      const form = document.getElementById("loginForm");
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const fd = new FormData(form);
          const email = String(fd.get("email") || "").trim();
          const password = String(fd.get("password") || "");
          if (!email || !password) {
            StalProfil.showToast("Укажите e-mail и пароль");
            return;
          }
          const existing = StalProfil.getUser();
          if (existing && existing.email === email) {
            StalProfil.setUser({ ...existing, lastLogin: new Date().toISOString() });
          } else {
            StalProfil.setUser({
              email,
              name: email.split("@")[0],
              company: "",
              phone: "",
              registeredAt: new Date().toISOString(),
            });
          }
          StalProfil.showToast("Вы вошли (демо, данные только в браузере)");
          location.href = "account.html";
        });
      }
    }

    if (page === "register") {
      const form = document.getElementById("registerForm");
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const fd = new FormData(form);
          const name = String(fd.get("name") || "").trim();
          const email = String(fd.get("email") || "").trim();
          const phone = String(fd.get("phone") || "").trim();
          const company = String(fd.get("company") || "").trim();
          const pass = String(fd.get("password") || "");
          const pass2 = String(fd.get("password2") || "");
          if (!name || !email || !phone || !pass) {
            StalProfil.showToast("Заполните обязательные поля");
            return;
          }
          if (pass.length < 6) {
            StalProfil.showToast("Пароль не короче 6 символов");
            return;
          }
          if (pass !== pass2) {
            StalProfil.showToast("Пароли не совпадают");
            return;
          }
          StalProfil.setUser({
            email,
            name,
            company,
            phone,
            registeredAt: new Date().toISOString(),
          });
          StalProfil.showToast("Регистрация завершена (демо)");
          location.href = "account.html";
        });
      }
    }

    if (page === "account") {
      if (!StalProfil.getUser()) {
        location.href = "login.html";
        return;
      }
      const u = StalProfil.getUser();
      const nameEl = document.getElementById("accName");
      const emailEl = document.getElementById("accEmail");
      const companyEl = document.getElementById("accCompany");
      const phoneEl = document.getElementById("accPhone");
      if (nameEl) nameEl.textContent = u.name || "—";
      if (emailEl) emailEl.textContent = u.email || "—";
      if (companyEl) companyEl.textContent = u.company || "—";
      if (phoneEl) phoneEl.textContent = u.phone || "—";

      const profileForm = document.getElementById("profileForm");
      if (profileForm) {
        profileForm.querySelector('[name="name"]').value = u.name || "";
        profileForm.querySelector('[name="company"]').value = u.company || "";
        profileForm.querySelector('[name="phone"]').value = u.phone || "";
        profileForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const fd = new FormData(profileForm);
          StalProfil.setUser({
            ...u,
            name: String(fd.get("name") || "").trim(),
            company: String(fd.get("company") || "").trim(),
            phone: String(fd.get("phone") || "").trim(),
          });
          StalProfil.showToast("Профиль сохранён");
          location.reload();
        });
      }

      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          StalProfil.setUser(null);
          StalProfil.showToast("Вы вышли");
          location.href = "index.html";
        });
      }

      const ordersBody = document.getElementById("ordersBody");
      if (ordersBody) {
        const orders = StalProfil.getOrders();
        if (!orders.length) {
          ordersBody.innerHTML = `<tr><td colspan="4" class="muted-cell">Заказов пока нет — оформите заявку из корзины.</td></tr>`;
        } else {
          ordersBody.innerHTML = orders
            .map(
              (o) => `
            <tr>
              <td><strong>${o.id}</strong></td>
              <td>${new Date(o.date).toLocaleString("ru-RU")}</td>
              <td>${o.items.length} поз.</td>
              <td>${StalProfil.formatMoney(o.total)}</td>
            </tr>`
 )
            .join("");
        }
      }

      document.querySelectorAll("[data-account-tab]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const tab = btn.getAttribute("data-account-tab");
          document.querySelectorAll("[data-account-tab]").forEach((b) => b.classList.remove("is-active"));
          btn.classList.add("is-active");
          document.querySelectorAll("[data-account-panel]").forEach((p) => {
            p.hidden = p.getAttribute("data-account-panel") !== tab;
          });
        });
      });
    }
  });
})();
