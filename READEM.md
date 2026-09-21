# RET Control Panel

This panel is bundled into the RET WispByte server and uses the same origin as the bot API.

## Use
1. Upload the complete RET package to WispByte.
2. Start with `node index.js`.
3. Open the public HTTPS URL of the WispByte server.
4. Click **تسجيل الدخول عبر Discord**.

The website contains no bot token and no Discord OAuth client secret. Those stay on the server.

## One-time Discord OAuth setup
Set `RET_PANEL_CLIENT_SECRET` in WispByte environment variables. If `RET_OAUTH_REDIRECT_URI` is empty, RET automatically uses:

`https://YOUR-WISPBYTE-PUBLIC-URL/auth/callback`

Add that exact callback URL to your Discord application's OAuth2 Redirects.
