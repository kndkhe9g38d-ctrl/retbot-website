# RET Control Panel — Final

This folder is the static GitHub Pages frontend for the RET control panel.

## Before publishing
Edit `config.js` and set:

```js
API_BASE: "https://YOUR-WISPBYTE-HTTPS-URL"
```

GitHub Pages is served over HTTPS, so the backend used by the browser must also be reachable over HTTPS. Do not use the raw `http://78.154.103.42:9975` address from an HTTPS page for browser API calls.

## WispByte
Set these server-side variables:

```text
RET_PANEL_CLIENT_ID=1547729921319772192
RET_PANEL_CLIENT_SECRET=<Discord OAuth client secret>
RET_WEB_ORIGIN=https://kndkhe9g38d-ctrl.github.io
RET_WEB_ORIGINS=https://kndkhe9g38d-ctrl.github.io
RET_OAUTH_REDIRECT_URI=https://YOUR-WISPBYTE-HTTPS-URL/auth/callback
```

Register that exact callback URL in Discord Developer Portal -> OAuth2 -> Redirects.

## Secrets
The GitHub Pages folder contains no Discord bot token and no OAuth client secret.
