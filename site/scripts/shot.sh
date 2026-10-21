#!/bin/sh
# usage: scripts/shot.sh ComponentName out.png [height]   (dev server must run on :3000)
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --window-size=1100,${3:-1400} --virtual-time-budget=10000 --screenshot="$2" "http://localhost:3000/docs/components/$1${OPEN:+?open=1}" >/dev/null 2>&1 && echo "$2"
