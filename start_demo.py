#!/usr/bin/env python3
"""Start the static GreenBuddy demo. Python 3, standard library only."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Timer
import webbrowser


def main():
    parser = argparse.ArgumentParser(description="GreenBuddy local demo server")
    parser.add_argument("--host", default="127.0.0.1", help="Default: localhost only")
    parser.add_argument("--port", default=9002, type=int)
    parser.add_argument("--no-browser", action="store_true")
    parser.add_argument("--local-assets", action="store_true", help="Skip CDN; use bundled libraries")
    args = parser.parse_args()
    root = Path(__file__).resolve().parent
    handler = partial(SimpleHTTPRequestHandler, directory=str(root))
    try:
        server = ThreadingHTTPServer((args.host, args.port), handler)
    except OSError as exc:
        print(f"Cannot start server: {exc}\nTry another port: python start_demo.py --port 9003")
        raise SystemExit(1) from exc
    address = "127.0.0.1" if args.host == "0.0.0.0" else args.host
    url = f"http://{address}:{args.port}/index.html?demo=1"
    if args.local_assets:
        url += "&assets=local"
    print(f"GreenBuddy is ready: {url}\nPress Ctrl+C to stop.")
    if not args.no_browser:
        timer = Timer(0.5, webbrowser.open, args=(url,))
        timer.daemon = True
        timer.start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nGreenBuddy stopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
