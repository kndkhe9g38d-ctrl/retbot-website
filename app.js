'use strict';

(() => {
  const meta = document.querySelector('meta[name="ret-api-origin"]');
  const API_BASE = (meta?.content || 'https://retbot.wispbyte.app').replace(/\/$/, '');
  const page = document.body.dataset.page || 'home';

  const coreSections = [
    ['overview','◈','Overview / General','نظرة عامة وإعدادات السيرفر'],
    ['moderation','⛨','Moderation & Auto-Mod','الحماية والفلترة ومقاومة الرايد'],
    ['tickets','▣','Ticket Center','التذاكر والترانسكريبت'],
    ['welcome','✦','Welcome & Leave','بطاقات ورسائل الدخول والخروج'],
    ['roles','◎','Auto-Roles & Reaction Roles','الرتب التلقائية والتفاعلية'],
    ['economy','◉','Economy & Shop','الاقتصاد والمتجر الافتراضي'],
    ['leveling','↗','Leveling & XP','المستويات والخبرة'],
    ['logging','≡','Logging & Audit','السجلات والتدقيق'],
    ['music','♫','Music & Audio','التحكم الصوتي وقوائم التشغيل'],
    ['giveaways','✹','Giveaways & Contests','السحوبات والمسابقات'],
    ['visuals','⬡','Banners & Counters','البنرات والعدادات'],
    ['socials','◌','Social Feeds','تنبيهات Twitch / YouTube / Kick / RSS'],
    ['customCommands','⌘','Custom Commands','الأوامر والردود المخصصة'],
    ['verification','✓','Verification','التحقق والحماية من البوتات'],
    ['embeds','▤','Embed Builder','مصمم الإيمبد والمعاينة الحية'],
    ['invites','↗','Invite Tracking','تتبع الدعوات والمكافآت'],
    ['polls','☷','Polls & Suggestions','الاستطلاعات والاقتراحات'],
    ['games','⌁','Games & Fun','الألعاب والفعاليات الخفيفة'],
    ['monitor','◉','System Monitor','الحالة والموارد وUptime'],
    ['broadcast','⚡','Owner Broadcast','بث المطور والمالك']
  ];
  const nextGenSections = [
    ['analytics','🧠','AI Analytics','تحليلات سلوكية واقتراحات Auto-Tuning'],
    ['escrow','🤝','Virtual Market / Escrow','إدارة صفقات RET الافتراضية'],
    ['dynamicVoice','🔊','Dynamic Voice Rooms','الرومات الصوتية المؤقتة'],
    ['boosterRewards','💜','Booster Rewards','مكافآت داعمي السيرفر'],
    ['alliances','🔗','Alliance Hub','ربط ومزامنة السيرفرات'],
    ['tournaments','🏆','Tournament Hub','البطولات والـBrackets'],
    ['backups','☁','Cloud Backups','نسخ السيرفر واستعادتها'],
    ['streamers','📺','Streamer Showcase','منصة البث المباشر'],
    ['storefront','🛍','Digital Storefront','السلع الرقمية والاشتراكات'],
    ['activityHeatmap','🔥','Activity Heatmap','خريطة التفاعل الأسبوعية']
  ];

  const featureDescriptions = [
    ['⛨','Security Core','Auto-Mod، Anti-Raid، وطبقات حماية قابلة للتفعيل.'],
    ['▣','Ticket Center','تذاكر بأزرار، دعم، وسجلات قابلة للحفظ.'],
    ['◉','Economy','عملة افتراضية، Daily، Shop، ورواتب.'],
    ['↗','Leveling','XP للرسائل والصوت مع Rewards.'],
    ['≡','Audit','تجميع الأحداث والعمليات في سجل منظم.'],
    ['♫','Audio','تهيئة مشغل الصوت وقوائم التشغيل.'],
    ['✹','Giveaways','إدارة السحوبات والشروط.'],
    ['◌','Social','تكاملات إشعارات المحتوى والبث.'],
    ['✓','Verification','Captcha + Button protection flow.'],
    ['▤','Embeds','معاينة حية قبل إرسال الرسالة.'],
    ['🧠','AI Analytics','اقتراحات Explainable بدون إرسال محتوى الأعضاء للخارج.'],
    ['🤝','Escrow','إدارة صفقة RET افتراضية بحالات واضحة.'],
    ['🏆','Tournaments','Teams + Bracket + Results.'],
    ['☁','Backups','Snapshot للهيكل واستعادة Merge.'],
    ['📺','Streamer Showcase','تجميع حالات البث في مكان واحد.'],
    ['💜','Booster Rewards','مكافآت للـServer Boosters.'],
    ['🔗','Alliance','ربط عدة سيرفرات بنفس النظام.'],
    ['🔥','Heatmap','تحليل أوقات النشاط والقنوات.']
  ];

  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>'"]/g, ch => ({ '&':'&amp;','<':'&lt;','>':'&gt;','\'':'&#39;','"':'&quot;' }[ch]));
  }
  function toast(message, type = 'success') {
    const node = $('#toast'); if (!node) return;
    node.textContent = message; node.className = `toast show ${type}`;
    clearTimeout(window.__retToast); window.__retToast = setTimeout(() => { node.className = 'toast'; }, 3200);
  }
  function apiPath(path) { return `${API_BASE}${path}`; }
  async function api(path, options = {}) {
    const response = await fetch(apiPath(path), { credentials: 'include', ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } });
    const type = response.headers.get('content-type') || '';
    const payload = type.includes('application/json') ? await response.json() : await response.text();
    if (!response.ok) {
      const msg = payload?.error || payload || `HTTP ${response.status}`;
      throw new Error(msg);
    }
    return payload;
  }
  const post = (path, body) => api(path, { method: 'POST', body: JSON.stringify(body) });
  const patch = (path, body) => api(path, { method: 'PATCH', body: JSON.stringify(body) });

  async function loadBotIdentity() {
    try {
      const data = await api('/api/public/config');
      const avatar = `${data.avatarURL}${data.avatarURL.includes('?') ? '&' : '?'}v=${encodeURIComponent(data.avatarVersion || Date.now())}`;
      $$('[data-bot-avatar]').forEach(el => { el.src = avatar; });
      const favicon = $('#ret-favicon'); if (favicon) favicon.href = `${API_BASE}/bot-avatar.png?v=${encodeURIComponent(data.avatarVersion || Date.now())}`;
      const online = data.online ? 'ONLINE' : 'OFFLINE';
      const status = $('#identityStatus'); if (status) status.textContent = online;
      const sGuilds = $('#statGuilds'); if (sGuilds) sGuilds.textContent = Number(data.guildCount || 0).toLocaleString();
      const sUptime = $('#statUptime'); if (sUptime) sUptime.textContent = formatDuration(data.uptime || 0);
      if ($('#botOnline')) $('#botOnline').textContent = online;
    } catch (error) {
      if ($('#identityStatus')) $('#identityStatus').textContent = 'API unreachable';
      if ($('#botOnline')) $('#botOnline').textContent = 'API unreachable';
    }
  }
  function formatDuration(seconds) {
    const s = Math.max(0, Math.floor(Number(seconds) || 0));
    const d = Math.floor(s / 86400); const h = Math.floor(s % 86400 / 3600); const m = Math.floor(s % 3600 / 60);
    return d ? `${d}d ${h}h` : `${h}h ${m}m`;
  }

  function renderFeatureGrid() {
    const grid = $('#featureGrid'); if (!grid) return;
    grid.innerHTML = featureDescriptions.map(([icon, title, desc]) => `<article class="feature-card"><div class="icon">${icon}</div><h3>${title}</h3><p>${desc}</p></article>`).join('');
  }

  let currentGuildId = null;
  let currentGuildData = null;
  let activeSection = 'overview';

  async function loadMe() {
    const me = await api('/api/me');
    if ($('#userAvatar') && me.user?.avatarURL) $('#userAvatar').src = me.user.avatarURL;
    if ($('#userName')) $('#userName').textContent = me.user?.globalName || me.user?.username || 'User';
    if ($('#userRole')) $('#userRole').textContent = me.developer ? 'Developer' : (me.user?.role || 'User');
    return me;
  }

  async function loadGuilds() {
    const result = await api('/api/guilds');
    const select = $('#guildSelect');
    if (!select) return;
    select.innerHTML = result.guilds.map(g => `<option value="${escapeHTML(g.id)}">${escapeHTML(g.name)} ${g.installed ? '• RET' : '• غير مثبت'}</option>`).join('');
    if (!result.guilds.length) throw new Error('لا توجد سيرفرات تملك Administrator فيها.');
    currentGuildId = select.value;
    await selectGuild();
  }

  async function selectGuild() {
    const select = $('#guildSelect'); if (select) currentGuildId = select.value;
    if (!currentGuildId) return;
    try {
      currentGuildData = await api(`/api/guild/${encodeURIComponent(currentGuildId)}`);
      renderDashboard();
    } catch (error) { toast(error.message, 'error'); }
  }

  function renderNav() {
    const nav = $('#sectionNav'); if (!nav) return;
    nav.innerHTML = `<div class="kicker" style="padding:8px 10px">CORE SYSTEMS</div>` + coreSections.map(([id, icon, title]) => `<button data-section="${id}" class="${id === activeSection ? 'active' : ''}"><span>${icon}</span><span>${title}</span></button>`).join('') + `<div class="kicker" style="padding:14px 10px 8px">NEXT-GEN</div>` + nextGenSections.map(([id, icon, title]) => `<button data-section="${id}" class="${id === activeSection ? 'active' : ''}"><span>${icon}</span><span>${title}</span></button>`).join('');
    $$('#sectionNav button').forEach(btn => btn.addEventListener('click', () => { activeSection = btn.dataset.section; renderNav(); renderDashboard(); }));
  }

  function saveSection(section, config, enabled = true) {
    return patch(`/api/guild/${currentGuildId}/settings`, { sections: { [section]: { enabled, config } } });
  }
  function sectionDoc(section) { return currentGuildData?.settings?.[section] || { enabled: false, config: {} }; }

  function field(label, id, value = '', type = 'text', cls = '') {
    if (type === 'checkbox') return `<label class="toggle ${cls}"><input id="${id}" type="checkbox" ${value ? 'checked' : ''}> <span>${label}</span></label>`;
    return `<div class="field ${cls}"><label for="${id}">${label}</label><input id="${id}" type="${type}" value="${escapeHTML(value)}"></div>`;
  }
  function textarea(label, id, value = '', cls = '') { return `<div class="field ${cls}"><label for="${id}">${label}</label><textarea id="${id}" class="codebox">${escapeHTML(value)}</textarea></div>`; }
  function button(id, label, kind = 'primary') { return `<button id="${id}" class="btn btn-${kind}">${label}</button>`; }

  function renderOverview() {
    const g = currentGuildData.guild; const settings = currentGuildData.settings;
    return `<div class="section-banner"><div><span class="kicker">GENERAL & SERVER OVERVIEW</span><h2>${escapeHTML(g.name)}</h2><p>${escapeHTML(g.id)}</p></div><div class="pill">${settings.premiumTier?.toUpperCase() || 'FREE'}</div></div>
    <div class="page-grid">
      <div class="card span-3"><span class="muted">Members</span><div class="metric">${Number(g.members||0).toLocaleString()}</div></div>
      <div class="card span-3"><span class="muted">Channels</span><div class="metric">${Number(g.channels||0).toLocaleString()}</div></div>
      <div class="card span-3"><span class="muted">Roles</span><div class="metric">${Number(g.roles||0).toLocaleString()}</div></div>
      <div class="card span-3"><span class="muted">Bot</span><div class="metric">${g.botInstalled ? 'LIVE' : 'OFF'}</div></div>
      <div class="card span-8"><h3>الهوية والإعدادات الأساسية</h3><div class="form-grid">${field('Prefix','prefixInput',settings.prefix||'+')}${field('Language','langInput',settings.language||'ar')} </div><div class="actions">${button('saveGeneral','حفظ الإعدادات')}</div></div>
      <div class="card span-4"><h3>Dynamic Avatar</h3><img data-bot-avatar style="width:76px;height:76px;border-radius:22px;object-fit:cover;box-shadow:0 0 36px rgba(139,92,246,.35)"><p>الصورة تأتي من Discord API مباشرة ولا توجد صورة بوت ثابتة داخل GitHub.</p></div>
    </div>`;
  }

  function renderModeration() {
    const d = sectionDoc('moderation'); const c = d.config || {}; const raid = c.antiRaid || {};
    return basicHeader('moderation','⛨','Moderation & Auto-Mod','الحماية، الفلترة، Anti-Raid والحذف التلقائي.') + `<div class="page-grid"><div class="card span-8"><div class="form-grid">${field('تفعيل Auto-Mod','modEnabled',d.enabled,'checkbox')}${field('Block Links','blockLinks',Boolean(c.blockLinks),'checkbox')}${field('Blocked Words','blockedWords',(c.blockedWords||[]).join(', '),'text','full')}${field('Anti-Raid','raidEnabled',Boolean(raid.enabled),'checkbox')}${field('Raid Threshold','raidThreshold',raid.threshold||8,'number')}</div><div class="actions">${button('saveModeration','حفظ')}</div></div><div class="card span-4"><h3>Policy</h3><p>يحذف الروابط/الكلمات المحددة ويحتوي على تنبيه Anti-Raid قابل للتعديل.</p></div></div>`;
  }
  function renderTickets() { const d=sectionDoc('tickets'), c=d.config||{}; return basicHeader('tickets','▣','Ticket Center','أزرار التذاكر، رتب الدعم، والسجلات.')+`<div class="page-grid"><div class="card span-8"><div class="form-grid">${field('Enable','ticketEnabled',d.enabled,'checkbox')}${field('Category ID','ticketCategory',c.categoryId||'')}${field('Support Role ID','ticketSupportRole',c.supportRoleId||'')}${field('Panel Channel ID','ticketChannel',c.channelId||'')}${field('Button Label','ticketLabel',c.buttonLabel||'فتح تذكرة')}</div><div class="actions">${button('saveTickets','حفظ')} ${button('sendTicketPanel','إرسال Ticket Panel','soft')}</div></div><div class="card span-4"><h3>Transcript</h3><p>عند إغلاق التذكرة يتم حفظ سجل نصي على RET persistent storage.</p></div></div>`; }
  function renderWelcome() { const d=sectionDoc('welcome'), c=d.config||{}; return basicHeader('welcome','✦','Welcome & Leave','رسائل الدخول والخروج مع متغيرات.')+`<div class="page-grid"><div class="card span-8"><div class="form-grid">${field('Enable','welcomeEnabled',d.enabled,'checkbox')}${field('Welcome Channel','welcomeChannel',c.channelId||'')}${field('Welcome Message','welcomeMessage',c.message||'مرحباً {user} في {server}!','text','full')}${field('Leave Channel','leaveChannel',c.leaveChannelId||'')}${field('Leave Message','leaveMessage',c.leaveMessage||'غادر {user} السيرفر.','text','full')}</div><div class="actions">${button('saveWelcome','حفظ')}</div></div></div>`; }
  function renderRoles() { const d=sectionDoc('roles'), c=d.config||{}; return basicHeader('roles','◎','Auto-Roles & Reaction Roles','توزيع الرتب تلقائياً وخيارات الرتب.')+`<div class="card"><div class="form-grid">${field('Enable','rolesEnabled',d.enabled,'checkbox')}${field('Auto Role IDs','autoRoleIds',(c.autoRoleIds||[]).join(', '),'text','full')}${textarea('Button / Reaction Role Map (JSON)','roleMap',JSON.stringify(c.roleMap||{},null,2),'full')}</div><div class="actions">${button('saveRoles','حفظ')}</div></div>`; }
  function renderEconomy() { const d=sectionDoc('economy'), c=d.config||{}; return basicHeader('economy','◉','Economy & Shop','إعدادات العملة اليومية والمتجر الافتراضي.')+`<div class="card"><div class="form-grid">${field('Enable','ecoEnabled',d.enabled,'checkbox')}${field('Currency','currency',c.currency||'RET')}${field('Starting Balance','startingBalance',c.startingBalance||0,'number')}${field('Daily Reward','dailyReward',c.dailyReward||100,'number')}${field('Work Min','workMin',c.workMin||50,'number')}${field('Work Max','workMax',c.workMax||250,'number')}</div><div class="actions">${button('saveEconomy','حفظ')}</div></div>`; }
  function renderLeveling() { const d=sectionDoc('leveling'), c=d.config||{}; return basicHeader('leveling','↗','Leveling & XP','XP للرسائل ويمكن توسيعه للصوت.')+`<div class="card"><div class="form-grid">${field('Enable','levelEnabled',d.enabled,'checkbox')}${field('XP / Message','xpPerMessage',c.xpPerMessage||15,'number')}${field('XP / Level','xpPerLevel',c.xpPerLevel||100,'number')}${field('Announce Channel','xpChannel',c.announceChannelId||'')}${field('Voice XP','voiceXP',Boolean(c.voiceXP),'checkbox')}</div><div class="actions">${button('saveLeveling','حفظ')}</div></div>`; }
  function renderLogging() { const d=sectionDoc('logging'), c=d.config||{}; return basicHeader('logging','≡','Logging & Audit','قنوات logs وأحداث Discord الأساسية.')+`<div class="card"><div class="form-grid">${field('Enable','loggingEnabled',d.enabled,'checkbox')}${field('Log Channel ID','logChannel',c.channelId||'')}${textarea('Enabled Events JSON','logEvents',JSON.stringify(c.events||{messages:true,roles:true,channels:true,voice:true,moderation:true},null,2),'full')}</div><div class="actions">${button('saveLogging','حفظ')}</div></div>`; }
  function renderMusic() { const d=sectionDoc('music'), c=d.config||{}; return basicHeader('music','♫','Music & Audio','إعدادات المشغل والقنوات الصوتية.')+`<div class="card"><div class="form-grid">${field('Enable','musicEnabled',d.enabled,'checkbox')}${field('Default Voice Channel','musicVoice',c.voiceChannelId||'')}${field('Volume','musicVolume',c.volume||100,'number')}${field('Queue Limit','queueLimit',c.queueLimit||50,'number')}${field('Filters JSON','musicFilters',JSON.stringify(c.filters||{},null,2),'text','full')}</div><div class="actions">${button('saveMusic','حفظ')}</div><p class="muted">المحرك الصوتي قابل للإضافة عبر @discordjs/voice عند إعداد FFmpeg ومصدر صوت متوافق.</p></div>`; }
  function renderGiveaways() { const d=sectionDoc('giveaways'), c=d.config||{}; return basicHeader('giveaways','✹','Giveaways & Contests','شروط ومساحات السحوبات.')+`<div class="card"><div class="form-grid">${field('Enable','gwEnabled',d.enabled,'checkbox')}${field('Default Duration (s)','gwDuration',c.duration||3600,'number')}${field('Required Role','gwRole',c.requiredRoleId||'')}${field('Required Level','gwLevel',c.requiredLevel||0,'number')}</div><div class="actions">${button('saveGiveaways','حفظ')}</div></div>`; }
  function renderVisuals() { const d=sectionDoc('visuals'), c=d.config||{}; return basicHeader('visuals','⬡','Banners & Counters','بنرات السيرفر وعدادات الأعضاء الصوتية.')+`<div class="card"><div class="form-grid">${field('Enable','visualsEnabled',d.enabled,'checkbox')}${field('Banner URL','bannerURL',c.bannerURL||'')}${field('Voice Counter Category','voiceCounterCategory',c.counterCategoryId||'')}${field('Member Count Channel','memberCounterChannel',c.memberCountChannelId||'')}${field('Voice Count Channel','voiceCounterChannel',c.voiceCountChannelId||'')}</div><div class="actions">${button('saveVisuals','حفظ')}</div></div>`; }
  function renderSocials() { const d=sectionDoc('socials'), c=d.config||{}; return basicHeader('socials','◌','Social Alerts & Feeds','قائمة مصادر Twitch / YouTube / Kick / RSS.')+`<div class="card"><div class="form-grid">${field('Enable','socialEnabled',d.enabled,'checkbox')}${field('Alert Channel ID','socialChannel',c.channelId||'')}${textarea('Sources JSON','socialSources',JSON.stringify(c.entries||[],null,2),'full')}</div><div class="actions">${button('saveSocials','حفظ')}</div></div>`; }
  function renderCustomCommands() { const d=sectionDoc('customCommands'), c=d.config||{}; return basicHeader('customCommands','⌘','Custom Commands & Auto-Responders','متغيرات {user} و{server} مدعومة.')+`<div class="card">${textarea('Commands JSON','customCommandsJSON',JSON.stringify(c.commands||{'hello':'مرحباً {user} في {server}!'},null,2))}<div class="actions">${button('saveCustomCommands','حفظ')}</div></div>`; }
  function renderVerification() { const d=sectionDoc('verification'), c=d.config||{}; return basicHeader('verification','✓','Verification System','Button + Captcha-ready flow.')+`<div class="card"><div class="form-grid">${field('Enable','verifyEnabled',d.enabled,'checkbox')}${field('Verification Channel','verifyChannel',c.channelId||'')}${field('Verified Role','verifiedRole',c.roleId||'')}${field('Button Label','verifyLabel',c.label||'تحقق الآن')}${field('Captcha Provider','captchaProvider',c.captchaProvider||'local')}</div><div class="actions">${button('saveVerification','حفظ')}</div></div>`; }
  function renderEmbeds() { return basicHeader('embeds','▤','Embed Builder','صمم الرسالة وشاهد المعاينة مباشرة قبل الإرسال.')+`<div class="page-grid"><div class="card span-6"><div class="form-grid">${field('Title','embedTitle','RET Announcement','text','full')}${field('Color','embedColor','#8b5cf6')}${field('Channel ID','embedChannel','')}${field('Footer','embedFooter','RET Control Panel','text','full')}</div>${textarea('Description','embedDescription','اكتب وصف الإيمبد هنا...')}<div class="actions">${button('sendEmbed','إرسال الإيمبد')}</div></div><div class="card span-6"><h3>Live Preview</h3><div id="embedPreview" class="embed-preview"><div class="embed-bar"></div><h4 id="previewTitle">RET Announcement</h4><div id="previewDescription" class="embed-desc">اكتب وصف الإيمبد هنا...</div></div></div></div>`; }
  function renderInvites() { const d=sectionDoc('invites'), c=d.config||{}; return basicHeader('invites','↗','Invite Tracking','تتبع الدعوات ومكافآت عدد الدعوات.')+`<div class="card"><div class="form-grid">${field('Enable','inviteEnabled',d.enabled,'checkbox')}${field('Reward per Invite','inviteReward',c.reward||100,'number')}${field('Log Channel','inviteLogChannel',c.logChannelId||'')}${field('Required Invites for Role','inviteThreshold',c.roleThreshold||0,'number')}${field('Reward Role','inviteRole',c.rewardRoleId||'')}</div><div class="actions">${button('saveInvites','حفظ')}</div></div>`; }
  function renderPolls() { const d=sectionDoc('polls'), c=d.config||{}; return basicHeader('polls','☷','Polls & Suggestions','استطلاعات واقتراحات مع تفاعل.')+`<div class="card"><div class="form-grid">${field('Enable','pollsEnabled',d.enabled,'checkbox')}${field('Poll Channel','pollChannel',c.channelId||'')}${field('Suggestion Channel','suggestionsChannel',c.suggestionsChannelId||'')}${field('Allow Anonymous','pollAnon',Boolean(c.allowAnonymous),'checkbox')}</div><div class="actions">${button('savePolls','حفظ')}</div></div>`; }
  function renderGames() { const d=sectionDoc('games'), c=d.config||{}; return basicHeader('games','⌁','Games & Fun','تفعيل الألعاب الخفيفة والأوامر الممتعة.')+`<div class="card"><div class="form-grid">${field('Enable','gamesEnabled',d.enabled,'checkbox')}${field('Commands Channel','gamesChannel',c.channelId||'')}${field('Cooldown (s)','gamesCooldown',c.cooldown||5,'number')}${field('Enabled Games','gamesJSON',JSON.stringify(c.enabledGames||['coinflip','8ball','roll']))}</div><div class="actions">${button('saveGames','حفظ')}</div></div>`; }
  function renderMonitor() { return basicHeader('monitor','◉','System & Server Status','مراقبة الموارد وحالة البوت.')+`<div class="page-grid"><div class="card span-4"><span class="muted">Bot</span><div class="metric" id="monitorOnline">—</div></div><div class="card span-4"><span class="muted">Uptime</span><div class="metric" id="monitorUptime">—</div></div><div class="card span-4"><span class="muted">Guilds</span><div class="metric" id="monitorGuilds">—</div></div><div class="card span-12"><h3>Resource Health</h3><pre id="monitorMemory" class="codebox" style="min-height:160px">Loading…</pre></div></div>`; }
  function renderBroadcast() { return basicHeader('broadcast','⚡','Owner Broadcast','إرسال إعلان رسمي لجميع السيرفرات المتصلة.','danger')+`<div class="card"><div class="form-grid">${textarea('Broadcast Message','broadcastMessage','','full')}${field('Optional Channel ID','broadcastChannel','')}</div><div class="actions">${button('sendBroadcast','إرسال للجميع','danger')}</div><p class="muted">الميزة محمية على مستوى API ولا تعمل إلا للمطور/المالك.</p></div>`; }
  function renderAnalytics() { return basicHeader('analytics','🧠','AI Analytics & Auto-Tuning','تحليلات Explainable وتقترحات فورية.')+`<div class="card"><div id="analyticsResults" class="empty">Loading recommendations…</div></div>`; }
  function renderEscrow() { const d=sectionDoc('escrow'), c=d.config||{}; return basicHeader('escrow','🤝','Virtual Market & Escrow','دفتر صفقات RET افتراضي مع حالات واضحة.')+`<div class="card"><div class="form-grid">${field('Enable','escrowEnabled',d.enabled,'checkbox')}${field('Market Channel','escrowChannel',c.channelId||'')}${field('Mediator Role','escrowRole',c.mediatorRoleId||'')}${field('Fee %','escrowFee',c.feePercent||0,'number')}</div><div class="actions">${button('saveEscrow','حفظ')}</div><p class="muted">هذه الوحدة لا تحوز أموالاً أو أصول ألعاب حقيقية؛ هي طبقة إدارة لصفقات داخلية قابلة للتوسع.</p></div>`; }
  function renderDynamicVoice() { const d=sectionDoc('dynamicVoice'), c=d.config||{}; return basicHeader('dynamicVoice','🔊','Dynamic Voice Rooms','Master Voice والرومات المؤقتة.')+`<div class="card"><div class="form-grid">${field('Enable','voiceEnabled',d.enabled,'checkbox')}${field('Master Channel ID','masterVoice',c.masterChannelId||'')}${field('User Limit','voiceLimit',c.userLimit||0,'number')}${field('Prefix','voicePrefix',c.prefix||'🔊')}</div><div class="actions">${button('saveDynamicVoice','حفظ')} ${button('voiceRename','إعادة تسمية روم','soft')} ${button('voiceLock','قفل/فتح روم','soft')}</div><p class="muted">إنشاء الرومات المؤقتة يتم تلقائياً عند دخول Master Voice.</p></div>`; }
  function renderBooster() { const d=sectionDoc('boosterRewards'), c=d.config||{}; return basicHeader('boosterRewards','💜','Booster Rewards','مكافآت داعمي السيرفر وخصائصهم.')+`<div class="card"><div class="form-grid">${field('Enable','boosterEnabled',d.enabled,'checkbox')}${field('Booster Role','boosterRole',c.roleId||'')}${field('Live Command Prefix','boosterPrefix',c.commandPrefix||'!')}${field('Private Voice Category','boosterVoiceCategory',c.voiceCategoryId||'')}${field('Custom Color','boosterColor',c.defaultColor||'8b5cf6')}</div><div class="actions">${button('saveBooster','حفظ')}</div></div>`; }
  function renderAlliances() { const d=sectionDoc('alliances'), c=d.config||{}; return basicHeader('alliances','🔗','Cross-Server Sync & Alliance Hub','ربط سيرفرات نفس المالك.')+`<div class="card"><div class="form-grid">${field('Enable','allianceEnabled',d.enabled,'checkbox')}${field('Alliance ID','allianceId',c.allianceId||'')}${field('Shared Economy','sharedEconomy',Boolean(c.sharedEconomy),'checkbox')}${field('Cross-Ban','crossBan',Boolean(c.crossBan),'checkbox')}${field('Level Sync','levelSync',Boolean(c.levelSync),'checkbox')}</div><div class="actions">${button('saveAlliances','حفظ')}</div></div>`; }
  function renderTournaments() { return basicHeader('tournaments','🏆','Tournament & Esports Hub','إنشاء بطولة وبناء Bracket وتسجيل النتائج.')+`<div class="page-grid"><div class="card span-5"><div class="form-grid">${field('Tournament Name','tName','RET Championship','text','full')}${field('Game','tGame','Valorant')}${field('Max Teams','tMax',16,'number')}</div><div class="actions">${button('createTournament','إنشاء البطولة')}</div></div><div class="card span-7"><div id="tournamentList" class="empty">Loading…</div></div></div>`; }
  function renderBackups() { return basicHeader('backups','☁','Cloud Backup & Template Cloner','Snapshot للرومات والرتب والصلاحيات والإيموجيز.')+`<div class="card"><div class="actions">${button('createBackup','إنشاء Snapshot')} <button id="refreshBackups" class="btn btn-soft">تحديث القائمة</button></div><div id="backupList" class="empty">Loading…</div><p class="muted">التخزين المحلي في RET persistent storage هو الوضع الافتراضي؛ طبقة S3 يمكن تفعيلها على الباك إند.</p></div>`; }
  function renderStreamers() { const d=sectionDoc('streamers'), c=d.config||{}; return basicHeader('streamers','📺','Live Streamer Showcase','تجميع المذيعين وإظهار حالة البث.')+`<div class="card"><div class="form-grid">${field('Enable','streamEnabled',d.enabled,'checkbox')}${field('Alert Channel','streamChannel',c.channelId||'')}${textarea('Entries JSON','streamEntries',JSON.stringify(c.entries||[{provider:'twitch',login:'example'}],null,2),'full')}</div><div class="actions">${button('saveStreamers','حفظ')} ${button('checkStreamers','فحص الآن','soft')}</div><div id="streamStatuses" class="empty">No status loaded.</div></div>`; }
  function renderStorefront() { return basicHeader('storefront','🛍','Subscription & Digital Goods Storefront','Catalog للرتب والمنتجات الرقمية، مع فصل مزود الدفع عن إدارة المنتجات.')+`<div class="page-grid"><div class="card span-5"><div class="form-grid">${field('Product Name','pName','Premium Role','text','full')}${field('Price','pPrice',5,'number')}${field('Currency','pCurrency','USD')}${field('Role ID','pRole','')}${field('Delivery','pDelivery','')}</div><div class="actions">${button('createProduct','إضافة منتج')}</div></div><div class="card span-7"><div id="storeList" class="empty">Loading…</div></div></div>`; }
  function renderHeatmap() { return basicHeader('activityHeatmap','🔥','Member Activity Heatmap','خريطة 7 أيام × 24 ساعة للنشاط المسجل.')+`<div class="card"><div id="heatmap" class="heatmap"></div><div id="heatmapLegend" class="muted" style="margin-top:10px">جارٍ تحميل البيانات…</div></div><div class="card" style="margin-top:14px"><h3>Most Active Channels</h3><div id="activeChannels" class="empty">Loading…</div></div>`; }

  function basicHeader(id, icon, title, desc, tone='') { return `<div class="section-banner ${tone}"><div><span class="kicker">${icon} RET MODULE</span><h2>${title}</h2><p>${desc}</p></div><div class="pill">${id}</div></div>`; }

  function renderDashboard() {
    const root = $('#dashboardContent'); if (!root || !currentGuildData) return;
    const renderers = { overview:renderOverview, moderation:renderModeration, tickets:renderTickets, welcome:renderWelcome, roles:renderRoles, economy:renderEconomy, leveling:renderLeveling, logging:renderLogging, music:renderMusic, giveaways:renderGiveaways, visuals:renderVisuals, socials:renderSocials, customCommands:renderCustomCommands, verification:renderVerification, embeds:renderEmbeds, invites:renderInvites, polls:renderPolls, games:renderGames, monitor:renderMonitor, broadcast:renderBroadcast, analytics:renderAnalytics, escrow:renderEscrow, dynamicVoice:renderDynamicVoice, boosterRewards:renderBooster, alliances:renderAlliances, tournaments:renderTournaments, backups:renderBackups, streamers:renderStreamers, storefront:renderStorefront, activityHeatmap:renderHeatmap };
    root.innerHTML = renderers[activeSection] ? renderers[activeSection]() : renderOverview();
    const meta = [...coreSections, ...nextGenSections].find(s => s[0] === activeSection);
    if ($('#pageTitle')) $('#pageTitle').textContent = meta?.[2] || 'Overview';
    bindSectionActions();
  }

  function jsonFrom(id) { try { return JSON.parse($(id.startsWith('#')?id:`#${id}`).value || '{}'); } catch { throw new Error(`JSON غير صالح في ${id}`); } }
  function bool(id) { return Boolean($(id)?.checked); }
  function val(id) { return $(id)?.value ?? ''; }

  function bindSectionActions() {
    $('#guildSelect')?.addEventListener('change', selectGuild);
    $('#saveGeneral')?.addEventListener('click', async () => { try { await patch(`/api/guild/${currentGuildId}/settings`, { prefix:val('prefixInput'), language:val('langInput') }); await selectGuild(); toast('تم حفظ الإعدادات الأساسية.'); } catch(e) { toast(e.message,'error'); } });
    const save = async (section, config, enabled) => { try { await saveSection(section, config, enabled); await selectGuild(); toast('تم الحفظ والتطبيق فورياً.'); } catch(e) { toast(e.message,'error'); } };
    $('#saveModeration')?.addEventListener('click',()=>save('moderation',{ blockLinks:bool('blockLinks'), blockedWords:val('blockedWords').split(',').map(x=>x.trim()).filter(Boolean), antiRaid:{enabled:bool('raidEnabled'),threshold:Number(val('raidThreshold'))||8}},bool('modEnabled')));
    $('#saveTickets')?.addEventListener('click',()=>save('tickets',{categoryId:val('ticketCategory'),supportRoleId:val('ticketSupportRole'),channelId:val('ticketChannel'),buttonLabel:val('ticketLabel')},bool('ticketEnabled')));
    $('#sendTicketPanel')?.addEventListener('click', async()=>{try{await post(`/api/guild/${currentGuildId}/action`,{action:'ticket_panel',data:{channelId:val('ticketChannel'),buttonLabel:val('ticketLabel')}});toast('تم إرسال Ticket Panel.');}catch(e){toast(e.message,'error')}});
    $('#saveWelcome')?.addEventListener('click',()=>save('welcome',{channelId:val('welcomeChannel'),message:val('welcomeMessage'),leaveChannelId:val('leaveChannel'),leaveMessage:val('leaveMessage')},bool('welcomeEnabled')));
    $('#saveRoles')?.addEventListener('click',()=>save('roles',{autoRoleIds:val('autoRoleIds').split(',').map(x=>x.trim()).filter(Boolean),roleMap:jsonFrom('roleMap')},bool('rolesEnabled')));
    $('#saveEconomy')?.addEventListener('click',()=>save('economy',{currency:val('currency'),startingBalance:Number(val('startingBalance'))||0,dailyReward:Number(val('dailyReward'))||0,workMin:Number(val('workMin'))||0,workMax:Number(val('workMax'))||0},bool('ecoEnabled')));
    $('#saveLeveling')?.addEventListener('click',()=>save('leveling',{xpPerMessage:Number(val('xpPerMessage'))||15,xpPerLevel:Number(val('xpPerLevel'))||100,announceChannelId:val('xpChannel'),voiceXP:bool('voiceXP')},bool('levelEnabled')));
    $('#saveLogging')?.addEventListener('click',()=>save('logging',{channelId:val('logChannel'),events:jsonFrom('logEvents')},bool('loggingEnabled')));
    $('#saveMusic')?.addEventListener('click',()=>save('music',{voiceChannelId:val('musicVoice'),volume:Number(val('musicVolume'))||100,queueLimit:Number(val('queueLimit'))||50,filters:jsonFrom('musicFilters')},bool('musicEnabled')));
    $('#saveGiveaways')?.addEventListener('click',()=>save('giveaways',{duration:Number(val('gwDuration'))||3600,requiredRoleId:val('gwRole'),requiredLevel:Number(val('gwLevel'))||0},bool('gwEnabled')));
    $('#saveVisuals')?.addEventListener('click',()=>save('visuals',{bannerURL:val('bannerURL'),counterCategoryId:val('voiceCounterCategory'),memberCountChannelId:val('memberCounterChannel'),voiceCountChannelId:val('voiceCounterChannel')},bool('visualsEnabled')));
    $('#saveSocials')?.addEventListener('click',()=>save('socials',{channelId:val('socialChannel'),entries:jsonFrom('socialSources')},bool('socialEnabled')));
    $('#saveCustomCommands')?.addEventListener('click',()=>save('customCommands',{commands:jsonFrom('customCommandsJSON')},true));
    $('#saveVerification')?.addEventListener('click',()=>save('verification',{channelId:val('verifyChannel'),roleId:val('verifiedRole'),label:val('verifyLabel'),captchaProvider:val('captchaProvider')},bool('verifyEnabled')));
    ['embedTitle','embedDescription','embedColor','embedFooter'].forEach(id=>$('#'+id)?.addEventListener('input', updateEmbedPreview));
    $('#sendEmbed')?.addEventListener('click',async()=>{try{await post(`/api/guild/${currentGuildId}/action`,{action:'embed_send',data:{channelId:val('embedChannel'),title:val('embedTitle'),description:val('embedDescription'),color:val('embedColor'),footer:val('embedFooter')}});toast('تم إرسال الإيمبد.');}catch(e){toast(e.message,'error')}});
    $('#saveInvites')?.addEventListener('click',()=>save('invites',{reward:Number(val('inviteReward'))||0,logChannelId:val('inviteLogChannel'),roleThreshold:Number(val('inviteThreshold'))||0,rewardRoleId:val('inviteRole')},bool('inviteEnabled')));
    $('#savePolls')?.addEventListener('click',()=>save('polls',{channelId:val('pollChannel'),suggestionsChannelId:val('suggestionsChannel'),allowAnonymous:bool('pollAnon')},bool('pollsEnabled')));
    $('#saveGames')?.addEventListener('click',()=>save('games',{channelId:val('gamesChannel'),cooldown:Number(val('gamesCooldown'))||5,enabledGames:val('gamesJSON').split(',').map(x=>x.trim()).filter(Boolean)},bool('gamesEnabled')));
    $('#saveEscrow')?.addEventListener('click',()=>save('escrow',{channelId:val('escrowChannel'),mediatorRoleId:val('escrowRole'),feePercent:Number(val('escrowFee'))||0},bool('escrowEnabled')));
    $('#saveDynamicVoice')?.addEventListener('click',()=>save('dynamicVoice',{masterChannelId:val('masterVoice'),userLimit:Number(val('voiceLimit'))||0,prefix:val('voicePrefix')},bool('voiceEnabled')));
    $('#saveBooster')?.addEventListener('click',()=>save('boosterRewards',{roleId:val('boosterRole'),commandPrefix:val('boosterPrefix'),voiceCategoryId:val('boosterVoiceCategory'),defaultColor:val('boosterColor')},bool('boosterEnabled')));
    $('#saveAlliances')?.addEventListener('click',()=>save('alliances',{allianceId:val('allianceId'),sharedEconomy:bool('sharedEconomy'),crossBan:bool('crossBan'),levelSync:bool('levelSync')},bool('allianceEnabled')));
    $('#createBackup')?.addEventListener('click',async()=>{try{await post(`/api/guild/${currentGuildId}/backups`,{});toast('تم إنشاء Snapshot بنجاح.');loadBackups();}catch(e){toast(e.message,'error')}});
    $('#refreshBackups')?.addEventListener('click',loadBackups);
    $('#checkStreamers')?.addEventListener('click',loadStreamersStatus);
    $('#saveStreamers')?.addEventListener('click',async()=>{try{await patch(`/api/guild/${currentGuildId}/streamers`,{enabled:bool('streamEnabled'),entries:jsonFrom('streamEntries')});toast('تم حفظ مصادر البث.');loadStreamersStatus();}catch(e){toast(e.message,'error')}});
    $('#createProduct')?.addEventListener('click',async()=>{try{await post(`/api/guild/${currentGuildId}/store`,{name:val('pName'),description:'',price:Number(val('pPrice'))||0,currency:val('pCurrency'),roleId:val('pRole'),digitalDelivery:val('pDelivery'),type:val('pRole')?'role':'digital'});toast('تمت إضافة المنتج.');loadStore();}catch(e){toast(e.message,'error')}});
    $('#createTournament')?.addEventListener('click',async()=>{try{await post(`/api/guild/${currentGuildId}/tournaments`,{name:val('tName'),game:val('tGame'),maxTeams:Number(val('tMax'))||16});toast('تم إنشاء البطولة.');loadTournaments();}catch(e){toast(e.message,'error')}});
    $('#createBackup')?.addEventListener('click',async()=>{try{await post(`/api/guild/${currentGuildId}/backups`,{});toast('Snapshot created.');loadBackups();}catch(e){toast(e.message,'error')}});
    $('#sendBroadcast')?.addEventListener('click',async()=>{try{const text=val('broadcastMessage').trim(); if(!text) throw new Error('اكتب الرسالة أولاً.'); const result=await post('/api/developer/broadcast',{message:text,channelId:val('broadcastChannel')});toast(`تم الإرسال: ${result.delivered} / ${result.total}`);}catch(e){toast(e.message,'error')}});
    $('#voiceRename')?.addEventListener('click', async()=>{const id=prompt('Channel ID');const name=prompt('الاسم الجديد');if(!id||!name)return;try{await post(`/api/guild/${currentGuildId}/action`,{action:'voice_rename',data:{channelId:id,name}});toast('تم تغيير الاسم.')}catch(e){toast(e.message,'error')}});
    $('#voiceLock')?.addEventListener('click', async()=>{const id=prompt('Channel ID');if(!id)return;try{await post(`/api/guild/${currentGuildId}/action`,{action:'voice_lock',data:{channelId:id,locked:true}});toast('تم قفل الروم.')}catch(e){toast(e.message,'error')}});
    if (activeSection==='analytics') loadAnalytics();
    if (activeSection==='monitor') loadMonitor();
    if (activeSection==='activityHeatmap') loadHeatmap();
    if (activeSection==='tournaments') loadTournaments();
    if (activeSection==='backups') loadBackups();
    if (activeSection==='streamers') loadStreamersStatus();
    if (activeSection==='storefront') loadStore();
    updateEmbedPreview();
  }
  function updateEmbedPreview() { if (!$('#embedPreview')) return; $('#previewTitle').textContent=val('embedTitle')||'RET Announcement'; $('#previewDescription').textContent=val('embedDescription')||'اكتب وصف الإيمبد هنا...'; $('#embedPreview .embed-bar').style.background=val('embedColor')||'#8b5cf6'; }

  async function loadAnalytics() { try { const r=await api(`/api/guild/${currentGuildId}/analytics/recommendations`); $('#analyticsResults').innerHTML=r.recommendations.map(x=>`<div class="card" style="margin-bottom:10px"><span class="pill">${escapeHTML(x.severity)}</span><h3>${escapeHTML(x.title)}</h3><p>${escapeHTML(x.body)}</p></div>`).join(''); } catch(e){toast(e.message,'error')} }
  async function loadMonitor() { try { const r=await api('/api/status'); $('#monitorOnline').textContent=r.online?'LIVE':'OFF'; $('#monitorUptime').textContent=formatDuration(r.uptime); $('#monitorGuilds').textContent=Number(r.guilds||0).toLocaleString(); $('#monitorMemory').textContent=JSON.stringify(r.memory,null,2); } catch(e){toast(e.message,'error')} }
  async function loadHeatmap() { try { const r=await api(`/api/guild/${currentGuildId}/activity-heatmap`); const flat=r.heatmap.flat(); const max=Math.max(1,...flat); $('#heatmap').innerHTML=r.heatmap.map((row,day)=>row.map((v,h)=>{const level=v?Math.min(4,Math.ceil(v/max*4)):0;return `<span class="heat-cell" data-level="${level}" title="Day ${day} ${h}:00 • ${v}"></span>`}).join('')).join(''); $('#heatmapLegend').textContent=`Max activity bucket: ${max}`; $('#activeChannels').innerHTML=r.channels.length?`<table class="table"><thead><tr><th>Channel</th><th>Events</th></tr></thead><tbody>${r.channels.map(c=>`<tr><td>${escapeHTML(c.name||c.id||'Unknown')}</td><td>${c.count}</td></tr>`).join('')}</tbody></table>`:'لا توجد بيانات نشاط بعد.'; } catch(e){toast(e.message,'error')} }
  async function loadTournaments() { try { const r=await api(`/api/guild/${currentGuildId}/tournaments`); $('#tournamentList').innerHTML=r.tournaments.length?r.tournaments.map(t=>`<div class="card" style="margin-bottom:10px"><b>${escapeHTML(t.name)}</b><p>${escapeHTML(t.game)} • ${t.teams.length} teams • ${escapeHTML(t.status)}</p><div class="actions"><button class="btn btn-soft" data-build="${t._id}">Build Bracket</button></div></div>`).join(''):'لا توجد بطولات.'; $$('[data-build]').forEach(b=>b.onclick=async()=>{try{await post(`/api/guild/${currentGuildId}/tournaments/${b.dataset.build}/build-bracket`,{});toast('تم بناء الـBracket.');loadTournaments();}catch(e){toast(e.message,'error')}}); }catch(e){toast(e.message,'error')} }
  async function loadBackups() { if (!$('#backupList')) return; try { const r=await api(`/api/guild/${currentGuildId}/backups`); $('#backupList').innerHTML=r.backups.length?`<table class="table"><thead><tr><th>Backup</th><th>Size</th><th>Checksum</th></tr></thead><tbody>${r.backups.map(b=>`<tr><td>${escapeHTML(b.backupId)}</td><td>${Number(b.bytes).toLocaleString()} bytes</td><td><code>${escapeHTML(b.checksum.slice(0,16))}…</code></td></tr>`).join('')}</tbody></table>`:'لا توجد نسخ بعد.'; } catch(e){toast(e.message,'error')} }
  async function loadStreamersStatus() { if (!$('#streamStatuses')) return; try{const r=await api(`/api/guild/${currentGuildId}/streamers`); $('#streamStatuses').innerHTML=r.statuses.length?r.statuses.map(s=>`<div class="card" style="margin-top:10px"><b>${escapeHTML(s.provider)}</b><p>${escapeHTML(s.status)}${s.login?' • '+escapeHTML(s.login):''}${s.username?' • '+escapeHTML(s.username):''}</p></div>`).join(''):'لا توجد مصادر.';}catch(e){toast(e.message,'error')} }
  async function loadStore() { if(!$('#storeList')) return; try{const r=await api(`/api/guild/${currentGuildId}/store`);$('#storeList').innerHTML=r.products.length?`<table class="table"><thead><tr><th>Product</th><th>Type</th><th>Price</th></tr></thead><tbody>${r.products.map(p=>`<tr><td>${escapeHTML(p.name)}</td><td>${escapeHTML(p.type)}</td><td>${p.price} ${escapeHTML(p.currency)}</td></tr>`).join('')}</tbody></table>`:'لا توجد منتجات.';}catch(e){toast(e.message,'error')} }

  async function initDashboard() {
    renderNav();
    try { await loadMe(); await loadGuilds(); } catch (error) { toast(error.message, 'error'); setTimeout(()=>{ window.location.href = `${API_BASE}/auth/discord`; }, 1200); }
    $('#mobileMenu')?.addEventListener('click',()=>$('#sidebar')?.classList.toggle('open'));
    $('#logoutBtn')?.addEventListener('click',async()=>{try{await post('/auth/logout',{});}finally{window.location.href='index.html';}});
  }

  async function initDeveloper() {
    try { const r=await api('/api/developer/overview'); renderDeveloper(r); } catch(e){ toast(e.message,'error'); setTimeout(()=>{window.location.href='dashboard.html';},1200); }
  }
  function renderDeveloper(r) {
    const root=$('#developerContent'); if(!root)return;
    root.innerHTML = `<div class="section-banner"><div><span class="kicker">DEVELOPER CORE</span><h2>Owner Control Plane</h2><p>Premium، Global Blacklist، Broadcast، وحالة البوت.</p></div><span class="pill">${r.bot.online?'ONLINE':'OFFLINE'}</span></div><div class="page-grid"><div class="card span-4"><span class="muted">Guilds</span><div class="metric">${r.bot.guilds}</div></div><div class="card span-4"><span class="muted">Members</span><div class="metric">${r.bot.users}</div></div><div class="card span-4"><span class="muted">Users in DB</span><div class="metric">${r.users}</div></div><div class="card span-6"><h3>Premium Access</h3><div class="form-grid">${field('Target Type','premiumType','guild')}${field('Target ID','premiumId','')}${field('Tier','premiumTier','pro')}</div><div class="actions">${button('grantPremium','تطبيق Premium')}</div></div><div class="card span-6"><h3>Global Blacklist</h3><div class="form-grid">${field('Scope','blacklistScope','guild')}${field('Target ID','blacklistId','')}${field('Reason','blacklistReason','Violation / policy reason')}</div><div class="actions">${button('blacklistAdd','حظر','danger')} ${button('blacklistRemove','فك الحظر','soft')}</div></div><div class="card span-12"><h3>Owner Broadcast</h3>${textarea('Message','devBroadcast','','full')||''}<div class="actions"><button id="devBroadcastBtn" class="btn btn-danger">إرسال لجميع السيرفرات</button></div></div><div class="card span-12"><h3>Recent Broadcasts</h3><div id="devBroadcasts">${r.recentBroadcasts?.length?r.recentBroadcasts.map(b=>`<div class="card" style="margin-top:8px"><b>${escapeHTML(b.status)}</b><p>${escapeHTML(b.message)}</p><span class="muted">${b.delivered}/${b.sentTo}</span></div>`).join(''):'لا يوجد'}</div></div></div>`;
    $('#grantPremium')?.addEventListener('click',async()=>{try{await patch('/api/developer/premium',{targetType:val('premiumType'),targetId:val('premiumId'),tier:val('premiumTier')});toast('تم تحديث Premium.');}catch(e){toast(e.message,'error')}});
    $('#blacklistAdd')?.addEventListener('click',async()=>{try{await post('/api/developer/blacklist',{scope:val('blacklistScope'),targetId:val('blacklistId'),reason:val('blacklistReason')});toast('تم تطبيق الحظر.');}catch(e){toast(e.message,'error')}});
    $('#blacklistRemove')?.addEventListener('click',async()=>{try{await api(`/api/developer/blacklist/${encodeURIComponent(val('blacklistScope'))}/${encodeURIComponent(val('blacklistId'))}`,{method:'DELETE'});toast('تم فك الحظر.');}catch(e){toast(e.message,'error')}});
    $('#devBroadcastBtn')?.addEventListener('click',async()=>{try{const m=val('devBroadcast').trim();if(!m)throw new Error('اكتب الرسالة أولاً.');const x=await post('/api/developer/broadcast',{message:m});toast(`Delivered ${x.delivered}/${x.total}`);}catch(e){toast(e.message,'error')}});
  }

  if (page === 'home') { renderFeatureGrid(); loadBotIdentity(); }
  if (page === 'dashboard') { initDashboard(); }
  if (page === 'developer') { initDeveloper(); }
  loadBotIdentity();
  setInterval(loadBotIdentity, 30000);
})();
