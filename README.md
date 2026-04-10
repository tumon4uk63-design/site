# СтальПрофиль — демо-сайт металлопроката

Статический многостраничный сайт: каталог, корзина, личный кабинет (данные в `localStorage`).

## Публикация на GitHub Pages

### 1. Создайте репозиторий на GitHub

1. Зайдите на [github.com/new](https://github.com/new).
2. Имя репозитория, например: `stalprofil-demo`.
3. **Public**, без README (уже есть локально).
4. Нажмите **Create repository**.

### 2. Отправьте код с компьютера

В терминале (замените `ВАШ_ЛОГИН` и `ИМЯ_РЕПО`):

```bash
cd "/Users/k.timofeev/Desktop/Пробник сайта"
git remote add origin https://github.com/ВАШ_ЛОГИН/ИМЯ_РЕПО.git
git branch -M main
git push -u origin main
```

При запросе пароля GitHub используйте **Personal Access Token** (Settings → Developer settings → Tokens), не пароль от аккаунта.

### 3. Включите GitHub Pages

1. Репозиторий → **Settings** → **Pages**.
2. **Source**: Deploy from branch **main**, папка **/** (root).
3. Сохраните. Через 1–3 минуты сайт будет по адресу:

 `https://ВАШ_ЛОГИН.github.io/ИМЯ_РЕПО/`

Если репозиторий назван `ВАШ_ЛОГИН.github.io`, сайт откроется как `https://ВАШ_ЛОГИН.github.io/` без суффикса репозитория.

### 4. Подключение своего домена (бесплатно только DNS; домен обычно платный)

1. Купите домен у регистратора (REG.RU, Timeweb, Cloudflare Registrar и т.д.).
2. В репозитории: **Settings** → **Pages** → **Custom domain** → введите домен, например `www.example.ru`.
3. GitHub покажет нужные DNS-записи. Обычно:
   - **A-записи** для apex `@`: IP из [документации GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain) (185.199.108.153 и др.);
   - или **CNAME** для поддомена `www` → `ВАШ_ЛОГИН.github.io`.
4. В корне репозитория должен появиться файл **`CNAME`** с одной строкой — ваш домен. Создайте его и закоммитьте (или GitHub создаст при сохранении настроек).

5. После делегирования DNS подождите до 24–48 часов, включите **Enforce HTTPS** в настройках Pages, когда сертификат будет готов.

### 5. Обновите SEO под ваш домен

Во всех HTML, в `robots.txt`, `sitemap.xml` и в JSON-LD замените `https://example.com` на ваш реальный URL (GitHub Pages или свой домен).

---

Локальный просмотр: открыть `index.html` в браузере или поднять сервер, например:

```bash
cd "/Users/k.timofeev/Desktop/Пробник сайта"
python3 -m http.server 8080
```

Откройте http://localhost:8080
