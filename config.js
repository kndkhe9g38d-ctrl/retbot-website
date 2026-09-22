(() => {
  const normalize = (value) => String(value || "").trim().replace(/\/+$/, "");

  window.RET_CONFIG = Object.freeze({
    API_BASE: normalize("https://retbot.wispbyte.app"),
    WEB_ORIGIN: window.location.origin,
    SUPPORT_URL: "https://discord.gg/SHgz77ZUkM",
    DEFAULT_LOCALE: "ar"
  });
})();
