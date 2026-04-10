#!/usr/bin/env bash
# Один раз: создайте токен GitHub (Settings → Developer settings → Personal access tokens).
# Права: repo (полный доступ к репозиториям).
# Сохраните токен в файл .github_token в корне проекта (этот файл в .gitignore).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

TOKEN_FILE="$ROOT/.github_token"
REPO_NAME="${GITHUB_REPO_NAME:-stalprofil-demo}"
VISIBILITY="${GITHUB_REPO_VISIBILITY:-public}"

if [[ ! -f "$TOKEN_FILE" ]]; then
  echo "Создайте файл $TOKEN_FILE и вставьте в него один токен GitHub (без пробелов и переводов строк)."
  echo "Или выполните вручную: gh auth login --web"
  exit 1
fi
TOKEN="$(tr -d ' \n\r' < "$TOKEN_FILE")"

GH_VER="2.89.0"
ARCH="$(uname -m)"
if [[ "$ARCH" == "arm64" ]]; then GH_ZIP="gh_${GH_VER}_macOS_arm64.zip"; else GH_ZIP="gh_${GH_VER}_macOS_amd64.zip"; fi
GH_DIR="$ROOT/.tools/${GH_ZIP%.zip}"
GH_BIN="$GH_DIR/bin/gh"
if [[ ! -x "$GH_BIN" ]]; then
  mkdir -p "$ROOT/.tools"
  TMP="$ROOT/.tools/gh_dl.zip"
  echo "Скачиваю GitHub CLI ($ARCH)…"
  curl -sL "https://github.com/cli/cli/releases/download/v${GH_VER}/$GH_ZIP" -o "$TMP"
  unzip -q -o "$TMP" -d "$ROOT/.tools"
  rm -f "$TMP"
fi

echo "$TOKEN" | "$GH_BIN" auth login --with-token -h github.com

USER="$("$GH_BIN" api user -q .login)"
echo "Аккаунт: $USER"

if "$GH_BIN" repo view "$USER/$REPO_NAME" &>/dev/null; then
  echo "Репозиторий $USER/$REPO_NAME уже существует — делаю push."
  git branch -M main
  if git remote get-url origin &>/dev/null; then
    git push -u origin main
  else
    git remote add origin "https://github.com/$USER/$REPO_NAME.git"
    git push -u origin main
  fi
else
  git branch -M main
  "$GH_BIN" repo create "$REPO_NAME" --"$VISIBILITY" --source="$ROOT" --remote=origin --push --description="Демо: СтальПрофиль — металлопрокат"
fi

echo ""
echo "Готово. Включите Pages: https://github.com/$USER/$REPO_NAME/settings/pages"
echo "Источник: branch main, folder / (root)"
echo "Сайт будет: https://$USER.github.io/$REPO_NAME/"
echo ""
echo "Удалите файл .github_token с диска после успешного push."
