#!/usr/bin/env python3
"""
Refresh the FITBIT_REFRESH_TOKEN GitHub secret by running the OAuth
authorization-code flow locally.

Usage:
    python3 scripts/refresh_fitbit_token.py

Prereqs:
    1. Your Fitbit app at https://dev.fitbit.com/apps must have
       http://127.0.0.1:8080/ listed under "Callback URL"
       (one URL per line; existing entries can stay).
    2. `gh` CLI authenticated against the mlpsychai org if you want
       the script to install the secret for you.
"""

from __future__ import annotations

import base64
import http.server
import json
import os
import secrets
import socket
import subprocess
import sys
import urllib.parse
import urllib.request
import webbrowser
from getpass import getpass
from urllib.error import HTTPError

REDIRECT_HOST = "localhost"
REDIRECT_PORT = 8080
REDIRECT_URI  = f"http://{REDIRECT_HOST}:{REDIRECT_PORT}"   # must match Fitbit app exactly (no trailing slash)

SCOPES = [
    "activity",
    "heartrate",
    "sleep",
    "profile",
    "respiratory_rate",
    "oxygen_saturation",
    "temperature",
    "cardio_fitness",
]

REPO = "mlpsychai/HTML_ORGANIZATION_DASHBOARD"
SECRET_NAME = "FITBIT_REFRESH_TOKEN"


# ---------------------------------------------------------------- helpers ---

def basic_auth(client_id: str, client_secret: str) -> str:
    raw = f"{client_id}:{client_secret}".encode()
    return base64.b64encode(raw).decode()


def authorize_url(client_id: str, state: str) -> str:
    params = {
        "response_type": "code",
        "client_id":     client_id,
        "redirect_uri":  REDIRECT_URI,
        "scope":         " ".join(SCOPES),
        "expires_in":    "31536000",     # 1 year access token
        "state":         state,
        "prompt":        "login consent",
    }
    return "https://www.fitbit.com/oauth2/authorize?" + urllib.parse.urlencode(params)


def exchange_code(client_id: str, client_secret: str, code: str) -> dict:
    body = urllib.parse.urlencode({
        "client_id":    client_id,
        "grant_type":   "authorization_code",
        "redirect_uri": REDIRECT_URI,
        "code":         code,
    }).encode()
    req = urllib.request.Request(
        "https://api.fitbit.com/oauth2/token",
        data=body,
        method="POST",
        headers={
            "Authorization": f"Basic {basic_auth(client_id, client_secret)}",
            "Content-Type":  "application/x-www-form-urlencoded",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return json.loads(resp.read())
    except HTTPError as e:
        return json.loads(e.read())


def smoke_test(access_token: str) -> None:
    req = urllib.request.Request(
        "https://api.fitbit.com/1/user/-/profile.json",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read())
    name = data.get("user", {}).get("displayName", "?")
    mid  = data.get("user", {}).get("encodedId", "?")
    print(f"  ✓ Fitbit accepts the new token  (user: {name}, id: {mid})")


# ----------------------------------------------------------- local server ---

class _CodeCatcher(http.server.BaseHTTPRequestHandler):
    captured: dict[str, str] | None = None

    def log_message(self, *_a, **_kw):
        pass

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        params = dict(urllib.parse.parse_qsl(parsed.query))
        _CodeCatcher.captured = params

        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        body = (
            "<!doctype html><meta charset=utf-8>"
            "<title>Fitbit auth captured</title>"
            "<body style='font-family:system-ui;padding:40px;'>"
            "<h2 style='margin:0 0 8px;'>Authorization captured.</h2>"
            "<p>You can close this tab and return to your terminal.</p>"
            "</body>"
        )
        self.wfile.write(body.encode())


def await_redirect() -> dict[str, str]:
    with http.server.HTTPServer((REDIRECT_HOST, REDIRECT_PORT), _CodeCatcher) as srv:
        srv.timeout = 300
        while _CodeCatcher.captured is None:
            srv.handle_request()
    return _CodeCatcher.captured


# ------------------------------------------------------------------- main ---

def port_free() -> bool:
    s = socket.socket()
    try:
        s.bind((REDIRECT_HOST, REDIRECT_PORT))
        return True
    except OSError:
        return False
    finally:
        s.close()


def maybe_install_secret(refresh_token: str) -> None:
    if not subprocess.run(["which", "gh"], capture_output=True).stdout.strip():
        print(f"  gh CLI not found — set the secret manually at:")
        print(f"  https://github.com/{REPO}/settings/secrets/actions/{SECRET_NAME}")
        return

    answer = input(f"\nInstall as {SECRET_NAME} in {REPO} via gh? [y/N] ").strip().lower()
    if answer != "y":
        print(f"  Skipping. To install later:")
        print(f"  echo -n '<token>' | gh secret set {SECRET_NAME} -R {REPO}")
        return

    proc = subprocess.run(
        ["gh", "secret", "set", SECRET_NAME, "-R", REPO],
        input=refresh_token,
        text=True,
        capture_output=True,
    )
    if proc.returncode == 0:
        print(f"  ✓ Secret {SECRET_NAME} updated in {REPO}")
    else:
        print(f"  ✗ gh secret set failed:\n{proc.stderr.strip()}")


def main() -> int:
    print("Fitbit refresh-token recovery\n" + "─" * 32)

    if not port_free():
        print(f"  port {REDIRECT_PORT} on {REDIRECT_HOST} is busy — free it and retry.")
        return 1

    client_id     = os.environ.get("FITBIT_CLIENT_ID")     or input("FITBIT_CLIENT_ID:     ").strip()
    client_secret = os.environ.get("FITBIT_CLIENT_SECRET") or getpass("FITBIT_CLIENT_SECRET: ").strip()
    if not (client_id and client_secret):
        print("  missing CLIENT_ID or CLIENT_SECRET")
        return 1

    print(
        "\n  Make sure your Fitbit app's Callback URL list includes:\n"
        f"    {REDIRECT_URI}\n"
        "  (edit at https://dev.fitbit.com/apps → your app → Edit Application Settings)\n"
    )

    state = secrets.token_urlsafe(16)
    url   = authorize_url(client_id, state)
    print("  Opening browser to authorize…")
    print(f"  If it doesn't open, paste this URL:\n    {url}\n")
    webbrowser.open(url)

    params = await_redirect()
    if "error" in params:
        print(f"  ✗ authorization denied: {params.get('error_description') or params['error']}")
        return 1
    if params.get("state") != state:
        print("  ✗ state mismatch — possible CSRF, aborting.")
        return 1
    code = params.get("code")
    if not code:
        print(f"  ✗ no code in redirect: {params}")
        return 1

    print("  ✓ code captured, exchanging for tokens…")
    tokens = exchange_code(client_id, client_secret, code)
    if "errors" in tokens or "refresh_token" not in tokens:
        print(f"  ✗ token exchange failed: {json.dumps(tokens, indent=2)}")
        return 1

    refresh_token = tokens["refresh_token"]
    access_token  = tokens["access_token"]
    print(f"  ✓ new refresh_token issued ({len(refresh_token)} chars)")

    try:
        smoke_test(access_token)
    except Exception as e:
        print(f"  ! smoke test failed: {e}  (proceeding anyway)")

    print(f"\n  refresh_token (copy if needed):\n  {refresh_token}")
    maybe_install_secret(refresh_token)

    print(
        "\nNext:\n"
        f"  gh workflow run fitbit-sync.yml -R {REPO}\n"
        "  …then watch the run and confirm data/fitbit-latest.json updates."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
