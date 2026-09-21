const CONFIG = window.RET_CONFIG || {};
const API_BASE = (localStorage.getItem("ret_api_base") || CONFIG.API_BASE || "").replace(/\/$/,"");
const state = {
  me:null, guilds:[], guild:null, config:null, commands:[], channels:[], roles:[], status:null,
  locale:localStorage.getItem("ret_locale") || CONFIG.DEFAULT_LOCALE || "ar",
  commandFilter:"all", commandSearch:"",
};
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const esc=(v)=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const fmtDate=(v)=>v?new Date(v).toLocaleString(state.locale==="ar"?"ar":"en",{dateStyle:"medium",timeStyle:"short"}):"—";
const apiUrl=(path)=>API_BASE+path;

const LANGS=[
 ["ar","العربية","العربية"],["en","English","English"],["tr","Türkçe","Türkçe"],["de","Deutsch","Deutsch"],["fr","Français","Français"],
 ["es","Español","Español"],["pt","Português","Português"],["ru","Русский","Русский"],["uk","Українська","Українська"],["it","Italiano","Italiano"],
 ["nl","Nederlands","Nederlands"],["pl","Polski","Polski"],["zh","中文","中文"],["ja","日本語","日本語"],["ko","한국어","한국어"],
 ["hi","हिन्दी","हिन्दी"],["id","Bahasa Indonesia","Bahasa Indonesia"],["vi","Tiếng Việt","Tiếng Việt"],["th","ไทย","ไทย"],["fa","فارسی","فارسی"],
 ["ur","اردو","اردو"]
];
const T={
 ar:{dashboard:"لوحة التحكم",servers:"السيرفرات",commands:"الأوامر",moderation:"الإدارة",security:"الحماية",tickets:"التذاكر",automation:"الأتمتة",economy:"الاقتصاد",premium:"Premium",branding:"الهوية",logs:"السجلات",settings:"الإعدادات",developer:"المطور",selectServer:"اختر سيرفر",serverSelect:"اختيار السيرفر",chooseLanguage:"اختر اللغة",botStatus:"حالة البوت",online:"متصل",offline:"غير متصل",guilds:"السيرفرات",ping:"البنق",uptime:"مدة التشغيل",availableCommands:"الأوامر المتاحة",quickTools:"أدوات سريعة",welcome:"أهلًا بك في لوحة RET",manageText:"إدارة البوت والسيرفرات من مكان واحد.",securityCenter:"مركز الحماية",ticketCenter:"مركز التذاكر",automationCenter:"مركز الأتمتة",premiumSystems:"أنظمة Premium",save:"حفظ",saved:"تم الحفظ",search:"بحث",searchServers:"ابحث عن سيرفر…",noServers:"ما عندك سيرفرات قابلة للإدارة هنا.",noCommands:"لا توجد أوامر مطابقة.",apiMissing:"رابط API غير مضبوط",apiMissingText:"افتح config.js وضع رابط Wispbyte العام (HTTPS) للبوت.",signIn:"تسجيل الدخول عبر Discord",logout:"تسجيل الخروج",checking:"جارٍ الفحص",free:"Free",premiumPlan:"Premium",active:"مفعّل",disabled:"معطّل",prefix:"البادئة",language:"لغة البوت",brandName:"اسم الهوية",iconUrl:"رابط الأيقونة",bannerUrl:"رابط البنر",automod:"AutoMod",antiraid:"Anti-Raid",antispam:"Anti-Spam",level:"نظام المستويات",ticketsEnabled:"نظام التذاكر",none:"لا يوجد",owner:"مالك",manageGuild:"إدارة",commandCategory:"التصنيف",description:"الوصف",status:"الحالة",lastSave:"آخر حفظ",logsTitle:"آخر الأحداث",plan:"الباقة",expires:"الانتهاء",connected:"متصل",notConnected:"البوت غير موجود في السيرفر",openDiscord:"فتح Discord",serverCount:"عدد السيرفرات",memory:"الذاكرة",errors:"الأخطاء",health:"الصحة",languageSite:"لغة الموقع",botLanguageNote:"الردود داخل البوت حاليًا مدعومة بالعربية والإنجليزية؛ واجهة الموقع تدعم لغات متعددة.",developerPanel:"Developer Console"},
 en:{dashboard:"Dashboard",servers:"Servers",commands:"Commands",moderation:"Moderation",security:"Security",tickets:"Tickets",automation:"Automation",economy:"Economy",premium:"Premium",branding:"Branding",logs:"Logs",settings:"Settings",developer:"Developer",selectServer:"Select server",serverSelect:"SERVER SELECT",chooseLanguage:"Choose language",botStatus:"Bot status",online:"Online",offline:"Offline",guilds:"Guilds",ping:"Ping",uptime:"Uptime",availableCommands:"Available commands",quickTools:"Quick tools",welcome:"Welcome to RET Control",manageText:"Manage your bot and servers from one place.",securityCenter:"Security center",ticketCenter:"Ticket center",automationCenter:"Automation center",premiumSystems:"Premium systems",save:"Save",saved:"Saved",search:"Search",searchServers:"Search servers…",noServers:"No manageable servers found.",noCommands:"No commands matched.",apiMissing:"API URL not configured",apiMissingText:"Open config.js and set your public HTTPS Wispbyte bot URL.",signIn:"Continue with Discord",logout:"Logout",checking:"Checking",free:"Free",premiumPlan:"Premium",active:"Enabled",disabled:"Disabled",prefix:"Prefix",language:"Bot language",brandName:"Brand name",iconUrl:"Icon URL",bannerUrl:"Banner URL",automod:"AutoMod",antiraid:"Anti-Raid",antispam:"Anti-Spam",level:"Level system",ticketsEnabled:"Ticket system",none:"None",owner:"Owner",manageGuild:"Manage",commandCategory:"Category",description:"Description",status:"Status",lastSave:"Last saved",logsTitle:"Recent events",plan:"Plan",expires:"Expires",connected:"Connected",notConnected:"Bot is not in this server",openDiscord:"Open Discord",serverCount:"Server count",memory:"Memory",errors:"Errors",health:"Health",languageSite:"Site language",botLanguageNote:"Bot replies are currently supported in Arabic and English; the website UI supports many languages.",developerPanel:"Developer Console"},
 tr:{dashboard:"Kontrol Paneli",servers:"Sunucular",commands:"Komutlar",moderation:"Moderasyon",security:"Güvenlik",tickets:"Ticketlar",automation:"Otomasyon",economy:"Ekonomi",premium:"Premium",branding:"Marka",logs:"Loglar",settings:"Ayarlar",developer:"Geliştirici",selectServer:"Sunucu seç",serverSelect:"SUNUCU SEÇ",chooseLanguage:"Dil seç",save:"Kaydet",saved:"Kaydedildi",search:"Ara",logout:"Çıkış",online:"Çevrimiçi",offline:"Çevrimdışı",checking:"Kontrol ediliyor"},
 de:{dashboard:"Übersicht",servers:"Server",commands:"Befehle",moderation:"Moderation",security:"Sicherheit",tickets:"Tickets",automation:"Automatisierung",economy:"Ökonomie",premium:"Premium",branding:"Branding",logs:"Protokolle",settings:"Einstellungen",developer:"Entwickler",selectServer:"Server wählen",serverSelect:"SERVER AUSWÄHLEN",chooseLanguage:"Sprache wählen",save:"Speichern",saved:"Gespeichert",search:"Suchen",logout:"Abmelden",online:"Online",offline:"Offline",checking:"Prüfen"},
 fr:{dashboard:"Tableau de bord",servers:"Serveurs",commands:"Commandes",moderation:"Modération",security:"Sécurité",tickets:"Tickets",automation:"Automatisation",economy:"Économie",premium:"Premium",branding:"Identité",logs:"Journaux",settings:"Paramètres",developer:"Développeur",selectServer:"Choisir un serveur",serverSelect:"CHOISIR LE SERVEUR",chooseLanguage:"Choisir la langue",save:"Enregistrer",saved:"Enregistré",search:"Rechercher",logout:"Déconnexion",online:"En ligne",offline:"Hors ligne",checking:"Vérification"},
 es:{dashboard:"Panel",servers:"Servidores",commands:"Comandos",moderation:"Moderación",security:"Seguridad",tickets:"Tickets",automation:"Automatización",economy:"Economía",premium:"Premium",branding:"Marca",logs:"Registros",settings:"Ajustes",developer:"Desarrollador",selectServer:"Elegir servidor",serverSelect:"ELEGIR SERVIDOR",chooseLanguage:"Elegir idioma",save:"Guardar",saved:"Guardado",search:"Buscar",logout:"Cerrar sesión",online:"En línea",offline:"Fuera de línea",checking:"Comprobando"},
 pt:{dashboard:"Painel",servers:"Servidores",commands:"Comandos",moderation:"Moderação",security:"Segurança",tickets:"Tickets",automation:"Automação",economy:"Economia",premium:"Premium",branding:"Marca",logs:"Logs",settings:"Configurações",developer:"Desenvolvedor",selectServer:"Selecionar servidor",serverSelect:"SELECIONAR SERVIDOR",chooseLanguage:"Escolher idioma",save:"Salvar",saved:"Salvo",search:"Pesquisar",logout:"Sair",online:"Online",offline:"Offline",checking:"Verificando"},
 ru:{dashboard:"Панель",servers:"Серверы",commands:"Команды",moderation:"Модерация",security:"Безопасность",tickets:"Тикеты",automation:"Автоматизация",economy:"Экономика",premium:"Premium",branding:"Брендинг",logs:"Журналы",settings:"Настройки",developer:"Разработчик",selectServer:"Выберите сервер",serverSelect:"ВЫБОР СЕРВЕРА",chooseLanguage:"Выберите язык",save:"Сохранить",saved:"Сохранено",search:"Поиск",logout:"Выйти",online:"Онлайн",offline:"Офлайн",checking:"Проверка"},
 uk:{dashboard:"Панель",servers:"Сервери",commands:"Команди",moderation:"Модерація",security:"Безпека",tickets:"Тікети",automation:"Автоматизація",economy:"Економіка",premium:"Premium",branding:"Брендинг",logs:"Журнали",settings:"Налаштування",developer:"Розробник",selectServer:"Виберіть сервер",serverSelect:"ВИБІР СЕРВЕРА",chooseLanguage:"Виберіть мову",save:"Зберегти",saved:"Збережено",search:"Пошук",logout:"Вийти",online:"Онлайн",offline:"Офлайн",checking:"Перевірка"},
 it:{dashboard:"Dashboard",servers:"Server",commands:"Comandi",moderation:"Moderazione",security:"Sicurezza",tickets:"Ticket",automation:"Automazione",economy:"Economia",premium:"Premium",branding:"Brand",logs:"Log",settings:"Impostazioni",developer:"Sviluppatore",selectServer:"Scegli server",serverSelect:"SCEGLI SERVER",chooseLanguage:"Scegli lingua",save:"Salva",saved:"Salvato",search:"Cerca",logout:"Esci",online:"Online",offline:"Offline",checking:"Controllo"},
 nl:{dashboard:"Dashboard",servers:"Servers",commands:"Commando's",moderation:"Moderatie",security:"Beveiliging",tickets:"Tickets",automation:"Automatisering",economy:"Economie",premium:"Premium",branding:"Branding",logs:"Logboeken",settings:"Instellingen",developer:"Ontwikkelaar",selectServer:"Server kiezen",serverSelect:"SERVER KIEZEN",chooseLanguage:"Taal kiezen",save:"Opslaan",saved:"Opgeslagen",search:"Zoeken",logout:"Uitloggen",online:"Online",offline:"Offline",checking:"Controleren"},
 pl:{dashboard:"Panel",servers:"Serwery",commands:"Komendy",moderation:"Moderacja",security:"Bezpieczeństwo",tickets:"Tickety",automation:"Automatyzacja",economy:"Ekonomia",premium:"Premium",branding:"Branding",logs:"Logi",settings:"Ustawienia",developer:"Deweloper",selectServer:"Wybierz serwer",serverSelect:"WYBÓR SERWERA",chooseLanguage:"Wybierz język",save:"Zapisz",saved:"Zapisano",search:"Szukaj",logout:"Wyloguj",online:"Online",offline:"Offline",checking:"Sprawdzanie"},
 zh:{dashboard:"控制面板",servers:"服务器",commands:"命令",moderation:"管理",security:"安全",tickets:"工单",automation:"自动化",economy:"经济",premium:"高级",branding:"品牌",logs:"日志",settings:"设置",developer:"开发者",selectServer:"选择服务器",serverSelect:"选择服务器",chooseLanguage:"选择语言",save:"保存",saved:"已保存",search:"搜索",logout:"退出",online:"在线",offline:"离线",checking:"检查中"},
 ja:{dashboard:"ダッシュボード",servers:"サーバー",commands:"コマンド",moderation:"モデレーション",security:"セキュリティ",tickets:"チケット",automation:"自動化",economy:"経済",premium:"プレミアム",branding:"ブランディング",logs:"ログ",settings:"設定",developer:"開発者",selectServer:"サーバーを選択",serverSelect:"サーバー選択",chooseLanguage:"言語を選択",save:"保存",saved:"保存しました",search:"検索",logout:"ログアウト",online:"オンライン",offline:"オフライン",checking:"確認中"},
 ko:{dashboard:"대시보드",servers:"서버",commands:"명령어",moderation:"관리",security:"보안",tickets:"티켓",automation:"자동화",economy:"경제",premium:"프리미엄",branding:"브랜딩",logs:"로그",settings:"설정",developer:"개발자",selectServer:"서버 선택",serverSelect:"서버 선택",chooseLanguage:"언어 선택",save:"저장",saved:"저장됨",search:"검색",logout:"로그아웃",online:"온라인",offline:"오프라인",checking:"확인 중"},
 hi:{dashboard:"डैशबोर्ड",servers:"सर्वर",commands:"कमांड",moderation:"मॉडरेशन",security:"सुरक्षा",tickets:"टिकट",automation:"ऑटोमेशन",economy:"अर्थव्यवस्था",premium:"प्रीमियम",branding:"ब्रांडिंग",logs:"लॉग",settings:"सेटिंग्स",developer:"डेवलपर",selectServer:"सर्वर चुनें",serverSelect:"सर्वर चुनें",chooseLanguage:"भाषा चुनें",save:"सहेजें",saved:"सहेजा गया",search:"खोजें",logout:"लॉगआउट",online:"ऑनलाइन",offline:"ऑफ़लाइन",checking:"जाँच"},
 id:{dashboard:"Dasbor",servers:"Server",commands:"Perintah",moderation:"Moderasi",security:"Keamanan",tickets:"Tiket",automation:"Otomasi",economy:"Ekonomi",premium:"Premium",branding:"Branding",logs:"Log",settings:"Pengaturan",developer:"Pengembang",selectServer:"Pilih server",serverSelect:"PILIH SERVER",chooseLanguage:"Pilih bahasa",save:"Simpan",saved:"Tersimpan",search:"Cari",logout:"Keluar",online:"Online",offline:"Offline",checking:"Memeriksa"},
 vi:{dashboard:"Bảng điều khiển",servers:"Máy chủ",commands:"Lệnh",moderation:"Kiểm duyệt",security:"Bảo mật",tickets:"Ticket",automation:"Tự động hóa",economy:"Kinh tế",premium:"Premium",branding:"Thương hiệu",logs:"Nhật ký",settings:"Cài đặt",developer:"Nhà phát triển",selectServer:"Chọn máy chủ",serverSelect:"CHỌN MÁY CHỦ",chooseLanguage:"Chọn ngôn ngữ",save:"Lưu",saved:"Đã lưu",search:"Tìm kiếm",logout:"Đăng xuất",online:"Trực tuyến",offline:"Ngoại tuyến",checking:"Đang kiểm tra"},
 th:{dashboard:"แดชบอร์ด",servers:"เซิร์ฟเวอร์",commands:"คำสั่ง",moderation:"การดูแล",security:"ความปลอดภัย",tickets:"ทิกเก็ต",automation:"อัตโนมัติ",economy:"เศรษฐกิจ",premium:"พรีเมียม",branding:"แบรนด์",logs:"บันทึก",settings:"ตั้งค่า",developer:"นักพัฒนา",selectServer:"เลือกเซิร์ฟเวอร์",serverSelect:"เลือกเซิร์ฟเวอร์",chooseLanguage:"เลือกภาษา",save:"บันทึก",saved:"บันทึกแล้ว",search:"ค้นหา",logout:"ออกจากระบบ",online:"ออนไลน์",offline:"ออฟไลน์",checking:"กำลังตรวจสอบ"},
 fa:{dashboard:"داشبورد",servers:"سرورها",commands:"دستورات",moderation:"مدیریت",security:"امنیت",tickets:"تیکت‌ها",automation:"اتوماسیون",economy:"اقتصاد",premium:"پرمیوم",branding:"برندینگ",logs:"لاگ‌ها",settings:"تنظیمات",developer:"توسعه‌دهنده",selectServer:"انتخاب سرور",serverSelect:"انتخاب سرور",chooseLanguage:"انتخاب زبان",save:"ذخیره",saved:"ذخیره شد",search:"جستجو",logout:"خروج",online:"آنلاین",offline:"آفلاین",checking:"در حال بررسی"},
 ur:{dashboard:"ڈیش بورڈ",servers:"سرورز",commands:"کمانڈز",moderation:"انتظام",security:"سیکیورٹی",tickets:"ٹکٹس",automation:"آٹومیشن",economy:"اکانومی",premium:"پریمیم",branding:"برانڈنگ",logs:"لاگز",settings:"سیٹنگز",developer:"ڈیولپر",selectServer:"سرور منتخب کریں",serverSelect:"سرور منتخب کریں",chooseLanguage:"زبان منتخب کریں",save:"محفوظ کریں",saved:"محفوظ",search:"تلاش",logout:"لاگ آؤٹ",online:"آن لائن",offline:"آف لائن",checking:"چیک ہو رہا ہے"}
};
function t(k){return (T[state.locale]&&T[state.locale][k])||T.en[k]||k}
function applyLocale(){
  const rtl=["ar","fa","ur"].includes(state.locale);
  document.documentElement.lang=state.locale; document.documentElement.dir=rtl?"rtl":"ltr";
  $$("[data-i18n]").forEach(el=>el.textContent=t(el.dataset.i18n));
  $$("[data-placeholder]").forEach(el=>el.placeholder=t(el.dataset.placeholder));
  $("#langButton").textContent=state.locale.toUpperCase();
  $("#pageTitle").textContent=t(currentPageKey());
  renderLanguageGrid();
  renderCurrentPage();
}
function currentPageKey(){const p=$(".nav-item.active")?.dataset.page||"dashboard"; return p}
function toast(msg,type="ok"){const x=document.createElement("div");x.className=`toast ${type==="error"?"err":"ok"}`;x.textContent=msg;$("#toastStack").appendChild(x);setTimeout(()=>x.remove(),3200)}

async function api(path,options={}){
  if(!API_BASE||API_BASE.includes("YOUR-WISPBYTE")) throw new Error("API_NOT_CONFIGURED");
  const res=await fetch(apiUrl(path),{credentials:"include",headers:{"Content-Type":"application/json",...(options.headers||{})},...options});
  if(res.status===401){showLogin();throw new Error("UNAUTHORIZED")}
  let data=null; try{data=await res.json()}catch{}
  if(!res.ok) throw new Error(data?.error||`HTTP ${res.status}`);
  return data;
}

function showLogin(){
  $("#appView").classList.add("hidden");$("#loginView").classList.remove("hidden");
}
async function boot(){
  await sleep(350);
  $("#boot").classList.add("hidden");
  try{
    state.me=await api("/api/me");
    state.guilds=state.me.guilds||[];
    $("#loginView").classList.add("hidden");$("#appView").classList.remove("hidden");
    bindApp();
    applyLocale();
    await updateUserUI();
    if(state.guilds[0]) await selectGuild(state.guilds[0].id,false);
    await refreshStatus();
  }catch(e){
    if(e.message!=="UNAUTHORIZED"&&e.message!=="API_NOT_CONFIGURED") console.warn(e);
    $("#loginView").classList.remove("hidden");$("#appView").classList.add("hidden");
    if(e.message==="API_NOT_CONFIGURED") $("#loginText").textContent=t("apiMissingText");
    bindLogin();
    applyLoginLocale();
  }
}
function applyLoginLocale(){
  const local=T[state.locale]||T.en;
  $("#loginTitle").textContent=state.locale==="ar"?"تحكم بكل شيء من مكان واحد.":"Control everything from one place.";
  $("#loginText").textContent=local.signIn||T.en.signIn;
  $("#loginBtnText").textContent=local.signIn||T.en.signIn;
}
function bindLogin(){
  $("#loginBtn").onclick=()=>{
    if(!API_BASE||API_BASE.includes("YOUR-WISPBYTE")) return toast(t("apiMissingText"),"error");
    location.href=apiUrl("/auth/discord");
  };
}
function bindApp(){
  $$(".nav-item").forEach(item=>item.onclick=async()=>{await goPage(item.dataset.page);if(innerWidth<=900)closeMobile()});
  $("#serverPicker").onclick=openServers;$("#closeServerModal").onclick=closeServers;
  $("#serverModal .modal-backdrop").onclick=closeServers;
  $("#langButton").onclick=openLang;$("#closeLangModal").onclick=closeLang;$("#langModal .modal-backdrop").onclick=closeLang;
  $("#mobileMenu").onclick=()=>{$("#sidebar").classList.add("open");$("#mobileShade").classList.add("show")};
  $("#mobileClose").onclick=closeMobile;$("#mobileShade").onclick=closeMobile;
  $("#logoutBtn").onclick=async()=>{try{await api("/auth/logout",{method:"POST"})}catch{} location.reload()};
  $("#serverSearch").oninput=renderServerModal;
}
function closeMobile(){$("#sidebar").classList.remove("open");$("#mobileShade").classList.remove("show")}
async function goPage(page){
  $$(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.page===page));
  $$(".page").forEach(x=>x.classList.toggle("active",x.id===`page-${page}`));
  $("#pageTitle").textContent=t(page);
  if(page==="commands") await loadCommands();
  if(page==="logs") await loadLogs();
  renderCurrentPage();
}
function renderCurrentPage(){const p=currentPageKey(); if(p==="dashboard")renderDashboard();if(p==="servers")renderServersPage();if(p==="commands")renderCommands();if(p==="moderation")renderModeration();if(p==="security")renderSecurity();if(p==="tickets")renderTickets();if(p==="automation")renderAutomation();if(p==="economy")renderEconomy();if(p==="premium")renderPremium();if(p==="branding")renderBranding();if(p==="logs")renderLogs();if(p==="settings")renderSettings();if(p==="developer")renderDeveloper();}
async function selectGuild(id,close=true){
  try{
    const d=await api(`/api/guilds/${encodeURIComponent(id)}`);
    state.guild=d.guild;state.config=d.config;state.channels=d.channels||[];state.roles=d.roles||[];state.commands=d.commands||[];
    $("#serverName").textContent=state.guild?.name||"—";$("#serverAvatar").innerHTML=state.guild?.icon?`<img src="${esc(state.guild.icon)}" style="width:34px;height:34px;border-radius:11px;object-fit:cover">`:esc((state.guild?.name||"R")[0]);
    if(close)closeServers();
    await goPage(currentPageKey());
    if(d.isDeveloper) $(".developer-link")?.classList.remove("hidden");
  }catch(e){toast(e.message||"Failed","error")}
}
async function updateUserUI(){
  const u=state.me?.user||{};$("#userName").textContent=u.global_name||u.username||"User";$("#userTag").textContent=u.discriminator&&u.discriminator!=="0"?`@${u.username}#${u.discriminator}`:`@${u.username||""}`;
  if(u.avatar) $("#userAvatar").src=`https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png?size=128`; else $("#userAvatar").src="assets/ret-logo.png";
}
async function refreshStatus(){
  try{
    state.status=await api("/api/status");
    const ok=["healthy","degraded"].includes(state.status.status);$("#statusChip").classList.toggle("ok",ok);$("#statusChip").classList.toggle("bad",!ok);
    $("#statusLabel").textContent=ok? t("online"):t("offline");
    renderCurrentPage();
  }catch{}
}
function openServers(){$("#serverModal").classList.remove("hidden");renderServerModal()}
function closeServers(){$("#serverModal").classList.add("hidden")}
function renderServerModal(){
  const q=($("#serverSearch").value||"").toLowerCase();const arr=state.guilds.filter(g=>g.name.toLowerCase().includes(q));
  $("#serverList").innerHTML=arr.length?arr.map(g=>`<div class="server-option" data-id="${g.id}">${guildIcon(g,38)}<div><b>${esc(g.name)}</b><span>${g.owner?t("owner"):t("manageGuild")} · ${g.botInstalled?t("connected"):t("notConnected")}</span></div><span class="badge ${g.botInstalled?"green":""}">${g.botInstalled?t("connected"):t("notConnected")}</span></div>`).join(""):`<div class="empty">${t("noServers")}</div>`;
  $$(".server-option").forEach(x=>x.onclick=()=>selectGuild(x.dataset.id));
}
function guildIcon(g,size=42){if(g.icon)return `<img src="${esc(g.icon)}" style="width:${size}px;height:${size}px;border-radius:12px;object-fit:cover">`;return `<div class="server-avatar" style="width:${size}px;height:${size}px">${esc((g.name||"R")[0])}</div>`}
function openLang(){$("#langModal").classList.remove("hidden");renderLanguageGrid()}
function closeLang(){$("#langModal").classList.add("hidden")}
function renderLanguageGrid(){
  $("#languageGrid").innerHTML=LANGS.map(([code,native,en])=>`<button class="lang-option ${code===state.locale?"active":""}" data-locale="${code}"><b>${esc(native)}</b><span>${esc(en)}</span></button>`).join("");
  $$(".lang-option").forEach(x=>x.onclick=()=>{state.locale=x.dataset.locale;localStorage.setItem("ret_locale",state.locale);closeLang();applyLocale();renderCurrentPage();});
}

function dashboardHtml(){
  const s=state.status||{}; const c=state.config||{}; const g=state.guild;
  const modules=[["◉",t("security"),"security"],["▤",t("tickets"),"tickets"],["⚡",t("automation"),"automation"],["◌",t("economy"),"economy"],["✦",t("premium"),"premium"],["◇",t("branding"),"branding"]];
  return `<div class="hero-line"><div><div class="eyebrow">RET • EMPEROR ENGINE</div><h1>${esc(t("welcome"))}</h1><p>${esc(t("manageText"))}</p></div><div class="quick-actions"><button class="btn" data-go="servers">${t("servers")}</button><button class="btn primary" data-go="settings">${t("settings")}</button></div></div>
  ${!g?`<div class="notice">${esc(t("selectServer"))}</div>`:`<div class="grid stats-grid">
    <div class="card stat"><small>${t("botStatus")}</small><b>${s.status==="healthy"?t("online"):t("offline")}</b><div class="sub"><span class="pulse"></span> RET</div></div>
    <div class="card stat"><small>${t("ping")}</small><b>${s.websocketPing??"—"}ms</b><div class="sub">${t("health")} · ${esc(s.status||"—")}</div></div>
    <div class="card stat"><small>${t("availableCommands")}</small><b>${state.commands?.length||615}</b><div class="sub">${t("commands")}</div></div>
    <div class="card stat"><small>${t("plan")}</small><b>${esc(c.planLabel||"Free")}</b><div class="sub">${c.planExpiresAt?`${t("expires")} ${fmtDate(c.planExpiresAt)}`:t("active")}</div></div>
  </div>
  <div class="grid two-grid section-space">
    <div class="card"><div class="card-head"><h3>${t("quickTools")}</h3><span>${esc(g.name)}</span></div><div class="card-body"><div class="module-grid">${modules.map(m=>`<div class="module" data-go="${m[2]}"><div class="icon">${m[0]}</div><b>${esc(m[1])}</b><p>${moduleDesc(m[2])}</p></div>`).join("")}</div></div></div>
    <div class="card"><div class="card-head"><h3>${t("botStatus")}</h3><span>RET API</span></div><div class="card-body"><div class="list">
      <div class="row"><div class="row-icon">◎</div><div class="row-main"><b>${t("serverCount")}</b><span>${s.guildCount??"—"}</span></div></div>
      <div class="row"><div class="row-icon">⌁</div><div class="row-main"><b>${t("uptime")}</b><span>${formatUptime(s.uptimeMs)}</span></div></div>
      <div class="row"><div class="row-icon">◒</div><div class="row-main"><b>${t("memory")}</b><span>${s.memoryRssMb??"—"} MB</span></div></div>
      <div class="row"><div class="row-icon">!</div><div class="row-main"><b>${t("errors")}</b><span>${s.errors??0}</span></div></div>
    </div></div></div>
  </div>`}`;
}
function moduleDesc(k){const m={security:"Anti-Raid, Anti-Spam and AutoMod controls.",tickets:"Ticket workflow, support roles and channels.",automation:"Scheduled messages and automatic responses.",economy:"XP, levels, balances and community systems.",premium:"Plan status and premium command access.",branding:"Name, icon and banner customization."};return m[k]||""}
function formatUptime(ms){if(!ms)return"—";const s=Math.floor(ms/1000),d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60);return d?`${d}d ${h}h`:h?`${h}h ${m}m`:`${m}m`}
function renderDashboard(){$("#page-dashboard").innerHTML=dashboardHtml();$$("[data-go]","#page-dashboard").forEach(x=>x.onclick=()=>goPage(x.dataset.go))}
function renderServersPage(){
  $("#page-servers").innerHTML=`<div class="hero-line"><div><div class="eyebrow">RET • ${t("servers").toUpperCase()}</div><h1>${t("servers")}</h1><p>${esc(t("selectServer"))}</p></div><button class="btn primary" id="pageServerSelect">${t("selectServer")}</button></div><div class="server-grid">${state.guilds.map(g=>`<div class="server-card" data-id="${g.id}">${guildIcon(g)}<div><b>${esc(g.name)}</b><span>${g.botInstalled?t("connected"):t("notConnected")}</span></div><span class="arrow">›</span></div>`).join("")||`<div class="card empty">${t("noServers")}</div>`}</div>`;
  $("#pageServerSelect").onclick=openServers;$$(".server-card","#page-servers").forEach(x=>x.onclick=()=>selectGuild(x.dataset.id));
}
async function loadCommands(){if(!state.guild){return}try{const d=await api(`/api/guilds/${encodeURIComponent(state.guild.id)}/commands`);state.commands=d.commands||[]}catch{}}
function renderCommands(){
  const q=state.commandSearch.toLowerCase();const arr=state.commands.filter(c=>(state.commandFilter==="all"||String(c.category).toLowerCase()===state.commandFilter)&&(!q||`${c.name} ${c.description} ${c.category}`.toLowerCase().includes(q)));
  const cats=["all",...new Set(state.commands.map(x=>String(x.category).toLowerCase()))];
  $("#page-commands").innerHTML=`<div class="hero-line"><div><div class="eyebrow">RET • ${t("commands").toUpperCase()}</div><h1>${t("commands")}</h1><p>${state.commands.length} ${t("availableCommands")}</p></div></div><div class="command-toolbar"><div class="search"><span>⌕</span><input id="commandInput" value="${esc(state.commandSearch)}" placeholder="${esc(t("search"))}"></div><div class="chips">${cats.map(c=>`<button class="chip ${c===state.commandFilter?"active":""}" data-cat="${esc(c)}">${c==="all"?"All":esc(c[0].toUpperCase()+c.slice(1))}</button>`).join("")}</div></div><div class="commands-grid">${arr.length?arr.map(c=>`<article class="command-card"><b>!${esc(c.name)}</b><p>${esc(c.description||"")}</p><div class="meta"><span>${esc(c.category||"")}</span><span>${c.requiredPlan==="premium"?t("premium"):""}</span></div></article>`).join(""):`<div class="card empty">${t("noCommands")}</div>`}</div>`;
  $("#commandInput").oninput=e=>{state.commandSearch=e.target.value;renderCommands()};$$("[data-cat]","#page-commands").forEach(x=>x.onclick=()=>{state.commandFilter=x.dataset.cat;renderCommands()});
}
function toggleHtml(key,value,label,desc){return `<div class="toggle"><div class="toggle-main"><b>${esc(label)}</b><p>${esc(desc)}</p></div><button class="switch ${value?"on":""}" data-toggle="${key}" aria-label="${esc(label)}"></button></div>`}
function renderModeration(){const c=state.config||{};$("#page-moderation").innerHTML=`<div class="hero-line"><div><div class="eyebrow">RET • ${t("moderation").toUpperCase()}</div><h1>${t("moderation")}</h1><p>Core moderation switches controlled from the panel.</p></div><button class="btn primary" id="saveModeration">${t("save")}</button></div><div class="card"><div class="card-body"><div class="toggle-list">${toggleHtml("automodEnabled",!!c.automodEnabled,t("automod"),"Regex link/spam and moderation engine.")}${toggleHtml("antispamEnabled",!!c.antispamEnabled,t("antispam"),"Message burst protection.")}${toggleHtml("antiraidEnabled",!!c.antiraidEnabled,t("antiraid"),"Join-burst and lockdown protection.")}</div></div></div>`;bindToggles();$("#saveModeration").onclick=saveConfigFromToggles}
function renderSecurity(){const p=state.config?.protection||{},r=state.config?.raidProtection||{};$("#page-security").innerHTML=`<div class="hero-line"><div><div class="eyebrow">RET • ${t("security").toUpperCase()}</div><h1>${t("security")}</h1><p>Protection controls already used by RET.</p></div><button class="btn primary" id="saveSecurity">${t("save")}</button></div><div class="grid two-grid"><div class="card"><div class="card-head"><h3>${t("securityCenter")}</h3></div><div class="card-body"><div class="toggle-list">${toggleHtml("raidEnabled",!!r.enabled,"Raid protection","Burst detection and temporary lockdown.")}${toggleHtml("lockdownOnBurst",!!r.lockdownOnBurst,"Lockdown on burst","Lock the configured channels when a raid burst is detected.")}</div></div></div><div class="card"><div class="card-head"><h3>Raid thresholds</h3></div><div class="card-body"><div class="field-grid"><div class="field"><label>Join threshold</label><input id="raidJoinThreshold" type="number" min="3" max="100" value="${Number(r.joinThreshold??8)}"></div><div class="field"><label>Window (seconds)</label><input id="raidJoinWindow" type="number" min="5" max="120" value="${Number(r.joinWindowSeconds??30)}"></div><div class="field"><label>Lockdown (seconds)</label><input id="raidDuration" type="number" min="10" max="3600" value="${Number(r.lockdownDurationSeconds??120)}"></div><div class="field"><label>Young account days</label><input id="raidYoungDays" type="number" min="0" max="365" value="${Number(r.youngAccountDays??7)}"></div></div></div></div></div>`;bindToggles();$("#saveSecurity").onclick=async()=>{const patch={raidProtection:{...r,enabled:$("[data-toggle=raidEnabled]").classList.contains("on"),lockdownOnBurst:$("[data-toggle=lockdownOnBurst]").classList.contains("on"),joinThreshold:Number($("#raidJoinThreshold").value),joinWindowSeconds:Number($("#raidJoinWindow").value),lockdownDurationSeconds:Number($("#raidDuration").value),youngAccountDays:Number($("#raidYoungDays").value)}};await saveConfig(patch)}}
function renderTickets(){const c=state.config||{};$("#page-tickets").innerHTML=`<div class="hero-line"><div><div class="eyebrow">RET • ${t("tickets").toUpperCase()}</div><h1>${t("tickets")}</h1><p>${t("ticketCenter")}</p></div><button class="btn primary" id="saveTickets">${t("save")}</button></div><div class="card"><div class="card-body"><div class="field-grid"><div class="field"><label>Ticket category</label><select id="ticketCategory">${channelOptions(c.ticketCategoryId)}</select></div><div class="field"><label>Ticket log channel</label><select id="ticketLogChannel">${channelOptions(c.ticketLogChannelId)}</select></div><div class="field"><label>Support role</label><select id="ticketSupportRole">${roleOptions(c.ticketSupportRoleId)}</select></div><div class="field"><label>Control roles</label><input id="ticketControlRoles" value="${esc((c.ticketControlRoleIds||[]).join(","))}" placeholder="Role IDs, comma separated"></div></div></div></div>`;$("#saveTickets").onclick=()=>saveConfig({ticketCategoryId:valOrUndefined($("#ticketCategory").value),ticketLogChannelId:valOrUndefined($("#ticketLogChannel").value),ticketSupportRoleId:valOrUndefined($("#ticketSupportRole").value),ticketControlRoleIds:($("#ticketControlRoles").value||"").split(",").map(x=>x.trim()).filter(Boolean)})}
function channelOptions(selected){return `<option value="">${t("none")}</option>`+state.channels.map(ch=>`<option value="${ch.id}" ${ch.id===selected?"selected":""}>${esc(ch.name)} · ${esc(ch.type)}</option>`).join("")}
function roleOptions(selected){return `<option value="">${t("none")}</option>`+state.roles.map(r=>`<option value="${r.id}" ${r.id===selected?"selected":""}>${esc(r.name)}</option>`).join("")}
function valOrUndefined(v){return v||undefined}
function renderAutomation(){const c=state.config||{};$("#page-automation").innerHTML=`<div class="hero-line"><div><div class="eyebrow">RET • ${t("automation").toUpperCase()}</div><h1>${t("automation")}</h1><p>${t("automationCenter")}</p></div></div><div class="grid two-grid"><div class="card"><div class="card-head"><h3>Scheduled messages</h3></div><div class="card-body"><div class="kpi"><div><div class="muted">Configured</div><b>${(c.scheduledMessages||[]).length}</b></div><span class="badge">${(c.scheduledMessages||[]).length?t("active"):t("none")}</span></div><div class="notice section-space">Schedule definitions already live in RET state. This panel exposes their stored count without inventing new data.</div></div></div><div class="card"><div class="card-head"><h3>Auto responses</h3></div><div class="card-body"><div class="kpi"><div><div class="muted">Rules</div><b>${(c.autoResponses||[]).length}</b></div><span class="badge">${(c.autoResponses||[]).length?t("active"):t("none")}</span></div><div class="notice section-space">Use the Discord commands for detailed rule creation; the panel keeps your state visible here.</div></div></div></div>`}
function renderEconomy(){const c=state.config||{};$("#page-economy").innerHTML=`<div class="hero-line"><div><div class="eyebrow">RET • ${t("economy").toUpperCase()}</div><h1>${t("economy")}</h1><p>Community progression and economy systems.</p></div></div><div class="grid three-grid"><div class="card stat"><small>Members with balances</small><b>${Object.keys(c.balances||{}).length}</b><div class="sub">${t("economy")}</div></div><div class="card stat"><small>Inventory owners</small><b>${Object.keys(c.inventory||{}).length}</b><div class="sub">Inventory</div></div><div class="card stat"><small>XP profiles</small><b>${Object.keys(c.xp||{}).length}</b><div class="sub">${t("level")}</div></div></div><div class="card section-space"><div class="card-head"><h3>${t("level")}</h3><span>${c.levelSettings?.enabled?t("active"):t("disabled")}</span></div><div class="card-body"><div class="progress"><span style="width:${c.levelSettings?.enabled?100:0}%"></span></div><div class="notice section-space">${esc(t("botLanguageNote"))}</div></div></div>`}
function renderPremium(){const c=state.config||{};$("#page-premium").innerHTML=`<div class="hero-line"><div><div class="eyebrow">RET • PREMIUM</div><h1>${t("premium")}</h1><p>${t("premiumSystems")}</p></div></div><div class="big-plan"><div class="eyebrow">${t("plan").toUpperCase()}</div><h2>${esc(c.planLabel||"Free")}</h2><p>${c.planExpiresAt?`${t("expires")}: ${fmtDate(c.planExpiresAt)}`:"No expiry is stored for the current plan."}</p></div><div class="card section-space"><div class="card-head"><h3>Premium command access</h3><span>${state.commands.filter(x=>x.requiredPlan==="premium").length}</span></div><div class="card-body"><div class="pill-row">${state.commands.filter(x=>x.requiredPlan==="premium").slice(0,20).map(x=>`<span class="badge yellow">!${esc(x.name)}</span>`).join("")||`<span class="muted">${t("none")}</span>`}</div></div></div>`}
function renderBranding(){const c=state.config||{};$("#page-branding").innerHTML=`<div class="hero-line"><div><div class="eyebrow">RET • ${t("branding").toUpperCase()}</div><h1>${t("branding")}</h1><p>Customize how RET identifies your server.</p></div><button class="btn primary" id="saveBranding">${t("save")}</button></div><div class="card"><div class="card-body"><div class="field-grid"><div class="field"><label>${t("brandName")}</label><input id="brandName" value="${esc(c.brandingName||"RET Support")}"></div><div class="field"><label>${t("iconUrl")}</label><input id="brandIcon" value="${esc(c.brandingIconUrl||"")}"></div><div class="field"><label>${t("bannerUrl")}</label><input id="bannerUrl" value="${esc(c.bannerUrl||"")}"></div></div></div></div>`;$("#saveBranding").onclick=()=>saveConfig({brandingName:valOrUndefined($("#brandName").value.trim()),brandingIconUrl:valOrUndefined($("#brandIcon").value.trim()),bannerUrl:valOrUndefined($("#bannerUrl").value.trim())})}
async function loadLogs(){if(!state.guild)return;try{const d=await api(`/api/guilds/${encodeURIComponent(state.guild.id)}/logs`);state.logs=d.logs||[]}catch{state.logs=[]}}
function renderLogs(){const logs=state.logs||[];$("#page-logs").innerHTML=`<div class="hero-line"><div><div class="eyebrow">RET • ${t("logs").toUpperCase()}</div><h1>${t("logsTitle")}</h1><p>Recent persisted RET events for this server.</p></div></div><div class="card"><div class="card-body">${logs.length?`<table class="log-table"><thead><tr><th>Type</th><th>Details</th><th>Time</th></tr></thead><tbody>${logs.map(x=>`<tr><td>${esc(x.type||"event")}</td><td>${esc(x.details||"")}</td><td>${fmtDate(x.createdAt)}</td></tr>`).join("")}</tbody></table>`:`<div class="empty">${t("none")}</div>`}</div></div>`}
function renderSettings(){const c=state.config||{};$("#page-settings").innerHTML=`<div class="hero-line"><div><div class="eyebrow">RET • ${t("settings").toUpperCase()}</div><h1>${t("settings")}</h1><p>Server-level settings backed by RET persistent storage.</p></div><button class="btn primary" id="saveSettings">${t("save")}</button></div><div class="grid two-grid"><div class="card"><div class="card-head"><h3>${t("settings")}</h3></div><div class="card-body"><div class="field-grid"><div class="field"><label>${t("prefix")}</label><input id="prefix" value="${esc(c.prefix||"!")}" maxlength="6"></div><div class="field"><label>${t("language")}</label><select id="botLanguage"><option value="ar" ${c.language==="ar"?"selected":""}>العربية</option><option value="en" ${c.language==="en"?"selected":""}>English</option></select></div></div></div></div><div class="card"><div class="card-head"><h3>${t("languageSite")}</h3></div><div class="card-body"><div class="notice">${esc(t("botLanguageNote"))}</div><div class="save-bar"><button class="btn" id="siteLangOpen">${$("#langButton").textContent}</button></div></div></div></div>`;$("#saveSettings").onclick=()=>saveConfig({prefix:$("#prefix").value.trim()||"!",language:$("#botLanguage").value});$("#siteLangOpen").onclick=openLang}
function renderDeveloper(){const s=state.status||{};$("#page-developer").innerHTML=`<div class="hero-line"><div><div class="eyebrow">RET • DEVELOPER</div><h1>${t("developerPanel")}</h1><p>Developer-only visibility from the same RET backend.</p></div></div><div class="grid three-grid"><div class="card stat"><small>${t("serverCount")}</small><b>${s.guildCount??0}</b></div><div class="card stat"><small>${t("memory")}</small><b>${s.memoryRssMb??0} MB</b></div><div class="card stat"><small>${t("errors")}</small><b>${s.errors??0}</b></div></div><div class="card section-space"><div class="card-head"><h3>Backend</h3></div><div class="card-body"><div class="code-box">${esc(JSON.stringify({apiBase:API_BASE,shardId:s.shardId,shardCount:s.shardCount,servicesVerified:s.servicesVerified},null,2))}</div></div></div>`}
function bindToggles(){$$("[data-toggle]").forEach(x=>x.onclick=()=>x.classList.toggle("on"))}
async function saveConfigFromToggles(){const patch={automodEnabled:$("[data-toggle=automodEnabled]").classList.contains("on"),antispamEnabled:$("[data-toggle=antispamEnabled]").classList.contains("on"),antiraidEnabled:$("[data-toggle=antiraidEnabled]").classList.contains("on")};await saveConfig(patch)}
async function saveConfig(patch){if(!state.guild)return;try{const d=await api(`/api/guilds/${encodeURIComponent(state.guild.id)}/config`,{method:"PATCH",body:JSON.stringify(patch)});state.config=d.config;toast(t("saved"));renderCurrentPage()}catch(e){toast(e.message||"Save failed","error")}}

boot();
