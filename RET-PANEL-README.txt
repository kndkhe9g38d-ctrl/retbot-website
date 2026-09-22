RET Control Panel — Full Build

Website: GitHub Pages static SPA. Backend: WispByte RET HTTP/API server.

Architecture included: Overview, Server, Moderation, Security, Welcome, Roles, Tickets, Logging, Automation, Levels, Economy, Marketplace, Webhooks, Analytics, AI, Branding, Premium, Developer.

The frontend uses config.js API_BASE. Because GitHub Pages is HTTPS, the API endpoint must be reachable over HTTPS for browser fetch/XHR. OAuth top-level navigation can still reach the current HTTP callback, but dashboard API requests require a secure public API origin.

Secrets stay server-side; do not upload bot tokens, OAuth client secrets, or provider API keys to GitHub.
