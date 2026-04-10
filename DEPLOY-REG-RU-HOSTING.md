# Выгрузка сайта на хостинг REG.RU (ISPmanager / FTP)

## Где что делать

| Действие | Где |
|----------|-----|
| Панель ISPmanager | Браузер — адрес из письма REG.RU (часто порт **1500**) |
| Загрузка по FTP | FileZilla или скрипт `scripts/ftp_upload.py` на вашем Mac |
| Команды `zip` | Терминал на **вашем компьютере** |

Корень сайта на хостинге REG.RU для домена **metalltrue.ru** (типично): **`www/metalltrue.ru`** на FTP.

## Повторная выгрузка с Mac (скрипт)

Пароль не храните в файлах — передайте через переменные окружения:

```bash
cd "/Users/k.timofeev/Desktop/Пробник сайта"
export FTP_HOST="IP_из_письма_REG.RU"
export FTP_USER="FTP_логин"
export FTP_PASSWORD="FTP_пароль"
export FTP_REMOTE="www/metalltrue.ru"
python3 scripts/ftp_upload.py
```

Скрипт заливает проект рекурсивно, пропуская `.git`, `.github_token`, `.DS_Store`.

## Менеджер файлов ISPmanager

1. Войти в панель → **Менеджер файлов**.
2. Открыть каталог сайта (корень = тот же, что в **WWW-домены**).
3. Загрузить файлы или zip и распаковать.

## FTP вручную (FileZilla)

Хост — IP из письма, логин/пароль — FTP из письма, порт **21** (FTP) или **22** (SFTP) — смотрите инструкцию REG.RU. Удалённая папка — **`www/metalltrue.ru`** (или как у вас в панели).

## SSL

В ISPmanager включите **Let's Encrypt** для домена, чтобы открывалось по `https://`.

## Архив вручную

```bash
cd "/Users/k.timofeev/Desktop/Пробник сайта"
zip -r ~/Desktop/stalprofil-site.zip . -x "*.git*" -x ".github_token" -x "*.DS_Store"
```

Загрузите zip в менеджер файлов и распакуйте в корень сайта.
