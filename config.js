(() => {
  const queryApi = new URLSearchParams(window.location.search).get("api");
  const savedApi = window.localStorage.getItem("http://78.154.103.42:9975") || "";
  const normalize = (value) => String(value || "").trim().replace(/\/+$/, "");
  window.RET_CONFIG = Object.freeze({
    API_BASE: normalize(queryApi || savedApi),
    WEB_ORIGIN: window.location.origin,
    SUPPORT_URL: "https://discord.gg/SHgz77ZUkM",
    DEFAULT_LOCALE: "ar"
  });
})();
