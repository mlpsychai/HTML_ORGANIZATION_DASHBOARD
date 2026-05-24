#!/usr/bin/env python3
"""
Diagnose why heart.intraday / steps.intraday are empty in the synced JSON.

Does a fresh OAuth handoff (user clicks Allow), then hits Fitbit's intraday
endpoints directly for *yesterday* (a fully-synced day) and *today*, reports
dataset sizes and raw structure. Does NOT install the new refresh token
as a GH secret — your existing FITBIT_REFRESH_TOKEN stays valid because
Fitbit treats each auth-code flow as a separate grant.
"""

from __future__ import annotations
import base64, http.server, json, os, secrets, socket, sys
import urllib.parse, urllib.request, webbrowser
from datetime import date, timedelta
from urllib.error import HTTPError

REDIRECT_HOST = "localhost"
REDIRECT_PORT = 8080
REDIRECT_URI  = f"http://{REDIRECT_HOST}:{REDIRECT_PORT}"

SCOPES = ["activity", "heartrate", "sleep", "profile",
          "respiratory_rate", "oxygen_saturation", "temperature", "cardio_fitness"]


def basic_auth(cid, sec): return base64.b64encode(f"{cid}:{sec}".encode()).decode()


def authorize_url(cid, state):
    return "https://www.fitbit.com/oauth2/authorize?" + urllib.parse.urlencode({
        "response_type": "code", "client_id": cid, "redirect_uri": REDIRECT_URI,
        "scope": " ".join(SCOPES), "expires_in": "31536000", "state": state,
        "prompt": "login consent",
    })


def exchange_code(cid, sec, code):
    body = urllib.parse.urlencode({
        "client_id": cid, "grant_type": "authorization_code",
        "redirect_uri": REDIRECT_URI, "code": code,
    }).encode()
    req = urllib.request.Request(
        "https://api.fitbit.com/oauth2/token", data=body, method="POST",
        headers={"Authorization": f"Basic {basic_auth(cid, sec)}",
                 "Content-Type": "application/x-www-form-urlencoded"},
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r: return json.loads(r.read())
    except HTTPError as e: return json.loads(e.read())


class _Catcher(http.server.BaseHTTPRequestHandler):
    captured = None
    def log_message(self, *a, **k): pass
    def do_GET(self):
        _Catcher.captured = dict(urllib.parse.parse_qsl(urllib.parse.urlparse(self.path).query))
        self.send_response(200); self.send_header("Content-Type", "text/html"); self.end_headers()
        self.wfile.write(b"<h2>Captured. Return to terminal.</h2>")


def await_redirect():
    with http.server.HTTPServer((REDIRECT_HOST, REDIRECT_PORT), _Catcher) as s:
        s.timeout = 300
        while _Catcher.captured is None: s.handle_request()
    return _Catcher.captured


def port_free():
    sk = socket.socket()
    try: sk.bind((REDIRECT_HOST, REDIRECT_PORT)); return True
    except OSError: return False
    finally: sk.close()


def get_json(url, token):
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.status, json.loads(r.read())
    except HTTPError as e:
        try: return e.code, json.loads(e.read())
        except Exception: return e.code, {"_raw": "<non-json>"}


def probe(token, label, url):
    status, body = get_json(url, token)
    print(f"\n── {label} ──")
    print(f"  URL:    {url}")
    print(f"  HTTP:   {status}")
    print(f"  keys:   {list(body.keys())}")

    # Try common intraday paths
    intraday = (body.get("activities-heart-intraday") or
                body.get("activities-steps-intraday") or {})
    dataset  = intraday.get("dataset", []) if isinstance(intraday, dict) else []
    interval = intraday.get("datasetInterval") if isinstance(intraday, dict) else None

    print(f"  intraday.datasetInterval: {interval}")
    print(f"  intraday.dataset rows:    {len(dataset)}")
    if dataset:
        print(f"  first 2: {dataset[:2]}")
        print(f"  last 1:  {dataset[-1:]}")
    else:
        # Dump full body so we can see what Fitbit actually returned
        print(f"  full body:\n{json.dumps(body, indent=2)[:1500]}")


def main():
    if not port_free():
        print(f"port {REDIRECT_PORT} busy"); return 1

    cid = os.environ.get("FITBIT_CLIENT_ID")
    sec = os.environ.get("FITBIT_CLIENT_SECRET")
    if not (cid and sec):
        print("FITBIT_CLIENT_ID and FITBIT_CLIENT_SECRET must be set"); return 1

    state = secrets.token_urlsafe(16)
    url = authorize_url(cid, state)
    print("Opening browser to authorize…")
    print(f"If it doesn't open, paste:\n  {url}")
    webbrowser.open(url)

    params = await_redirect()
    if "error" in params or params.get("state") != state:
        print(f"auth failure: {params}"); return 1

    tokens = exchange_code(cid, sec, params["code"])
    if "access_token" not in tokens:
        print(f"token exchange failed: {tokens}"); return 1
    token = tokens["access_token"]
    print(f"✓ access_token acquired (expires in {tokens.get('expires_in')}s)")

    today = date.fromisoformat("2026-05-23")     # per workspace CLAUDE.md
    yest  = today - timedelta(days=1)
    twoago = today - timedelta(days=2)

    for d in (twoago, yest, today):
        probe(token, f"HR /1min  date={d}",
              f"https://api.fitbit.com/1/user/-/activities/heart/date/{d}/1d/1min.json")
        probe(token, f"HR /5min  date={d}",
              f"https://api.fitbit.com/1/user/-/activities/heart/date/{d}/1d/5min.json")
        probe(token, f"Steps /1min date={d}",
              f"https://api.fitbit.com/1/user/-/activities/steps/date/{d}/1d/1min.json")

    print("\n──────")
    print("Probe complete. Existing GH secret untouched.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
