RET CONTROL PANEL - SAME-ORIGIN PANEL BUILD

The panel is now served by the RET WispByte backend at:
http://78.154.103.42:9975/panel/

OAuth callback returns to the same backend panel instead of GitHub Pages.
The panel frontend uses API_BASE="" so API requests are same-origin.

WispByte environment:
RET_PANEL_CLIENT_ID=1547729921319772192
RET_PANEL_CLIENT_SECRET=<your existing secret>
RET_OAUTH_REDIRECT_URI=http://78.154.103.42:9975/auth/callback
RET_PANEL_ORIGIN=http://78.154.103.42:9975

Discord Developer Portal Redirect:
http://78.154.103.42:9975/auth/callback

Keep secrets out of GitHub.
