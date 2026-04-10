#!/usr/bin/env python3
"""Upload static site via FTP. Credentials only via env (see DEPLOY-REG-RU-HOSTING.md)."""
import os
import sys
from ftplib import FTP, error_perm

HOST = os.environ["FTP_HOST"]
USER = os.environ["FTP_USER"]
PASSWORD = os.environ["FTP_PASSWORD"]
LOCAL = os.path.abspath(os.environ.get("FTP_LOCAL", os.path.join(os.path.dirname(__file__), "..")))
REMOTE_ROOT = os.environ.get("FTP_REMOTE", "www/metalltrue.ru")

SKIP_DIRS = {".git", ".tools", "__pycache__"}
SKIP_FILES = {".github_token", ".DS_Store"}


def skip_dir(name: str) -> bool:
    if name in SKIP_DIRS:
        return True
    return name.startswith(".") and name != ".well-known"


def skip_file(name: str) -> bool:
    if name in SKIP_FILES:
        return True
    return False


def ensure_cwd(ftp: FTP, remote_path: str) -> None:
    ftp.cwd("/")
    parts = [p for p in remote_path.split("/") if p]
    for i in range(len(parts)):
        sub = "/".join(parts[: i + 1])
        try:
            ftp.mkd(sub)
        except error_perm:
            pass
    ftp.cwd(remote_path)


def main() -> int:
    ftp = FTP(HOST, timeout=120)
    ftp.login(USER, PASSWORD)
    uploaded = 0
    errors: list[tuple[str, str]] = []

    for root, dirs, files in os.walk(LOCAL):
        dirs[:] = [d for d in dirs if not skip_dir(d)]
        rel = os.path.relpath(root, LOCAL)
        if rel == ".":
            remote_dir = REMOTE_ROOT
        else:
            remote_dir = REMOTE_ROOT + "/" + rel.replace(os.sep, "/")

        try:
            ensure_cwd(ftp, remote_dir)
        except Exception as e:
            errors.append((remote_dir, str(e)))
            continue

        for name in files:
            if skip_file(name):
                continue
            lp = os.path.join(root, name)
            try:
                with open(lp, "rb") as fh:
                    ftp.storbinary(f"STOR {name}", fh, 8192)
                uploaded += 1
            except Exception as e:
                errors.append((lp, str(e)))

    ftp.quit()
    print(f"Uploaded {uploaded} files")
    for path, err in errors[:20]:
        print("ERR", path, err)
    if len(errors) > 20:
        print(f"... {len(errors) - 20} more errors")
    return 0 if not errors else 1


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except KeyError as e:
        print("Missing env:", e, file=sys.stderr)
        raise SystemExit(2)
