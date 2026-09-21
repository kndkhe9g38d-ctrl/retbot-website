# RET Control Panel

This version turns the old public landing page into a responsive Discord-style control panel for RET.

## Included
- Discord OAuth login
- Server picker using Discord Manage Server / Administrator permissions
- Live RET status
- Dashboard
- Server list
- Live command list from RET (including the existing 615-command surface when available)
- Moderation controls
- Security / Anti-Raid controls
- Ticket channel/role configuration
- Automation visibility
- Economy / level statistics
- Premium plan visibility
- Branding editor
- Persisted event logs
- Bot language setting (RET currently stores `ar`/`en`)
- 21 website interface languages with RTL support for Arabic, Persian and Urdu
- Mobile responsive layout
- Secrets stay on Wispbyte; the GitHub website contains no bot token or OAuth client secret

## GitHub Pages
Upload the contents of `RET-V100` to the repository root.

Before publishing, edit `config.js` and set the public HTTPS URL of the Wispbyte server:

```js
API_BASE: "https://YOUR-WISPBYTE-PUBLIC-URL"
```

The URL must point to the same Wispbyte server running `node index.js`.

## Wispbyte
Use the matching bot build. Set:

```text
RET_PANEL_CLIENT_ID=1547729921319772192
RET_PANEL_CLIENT_SECRET=YOUR_DISCORD_APPLICATION_CLIENT_SECRET
RET_WEB_ORIGIN=https://kndkhe9g38d-ctrl.github.io
RET_WEB_ORIGINS=https://kndkhe9g38d-ctrl.github.io
RET_OAUTH_REDIRECT_URI=https://YOUR-WISPBYTE-PUBLIC-URL/auth/callback
```

Then add the exact callback URL to your Discord application's OAuth2 Redirects.

Do not put Discord bot tokens or OAuth client secrets in this GitHub Pages project.
