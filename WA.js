// 后台接口
// await advancedApi.popOutCurrentTab(window.__VbrTabId) 分离当前标签页
// await advancedApi.restorePoppedTab(window.__VbrTabId) 还原当前标签页
// await advancedApi.restorePoppedTab() 依次分离标签页
// await advancedApi.popOutCurrentTab() 依次还原标签页

// ==================== 全局配置 ====================
// 修改此变量即可更改界面显示的工具版本。
// 支持外部提前定义覆盖：window.TOOL_VERSION = "4.0.0";
const TOOL_VERSION = window.TOOL_VERSION || "3.5.2";
// ================================================

// ==================== 本地数据库管理 ====================
const DB_NAME = "WhatsAppCustomerDB";
const DB_VERSION = 1;
const STORE_NAME = "uniqueNumbers";

async function 初始化数据库() {
  return new Promise((resolve, reject) => {
    const detectRequest = indexedDB.open(DB_NAME);
    detectRequest.onsuccess = () => {
      const db = detectRequest.result;
      const hasStore = db.objectStoreNames.contains(STORE_NAME);
      const currentVersion = db.version;
      db.close();

      const openVersion = hasStore ? currentVersion : currentVersion + 1;
      const request = indexedDB.open(DB_NAME, openVersion);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db2 = event.target.result;
        if (!db2.objectStoreNames.contains(STORE_NAME)) {
          const store = db2.createObjectStore(STORE_NAME, { keyPath: "号码" });
          store.createIndex("群组", "所在群组", { unique: false });
          store.createIndex("采集时间", "采集时间", { unique: false });
        }
      };
    };
    detectRequest.onerror = () => reject(detectRequest.error);
  });
}

async function 保存独立号码到数据库(uniqueNumbers) {
  try {
    const db = await 初始化数据库();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const txComplete = new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(new Error("事务被中止"));
    });

    store.clear();
    const timestamp = new Date().toISOString();
    for (const item of uniqueNumbers) {
      store.add({ ...item, 采集时间: timestamp, 标记状态: "客户" });
    }
    await txComplete;
    console.log(`✅ 已保存 ${uniqueNumbers.length} 个独立号码到IndexedDB`);

    if (window.__csharpApiReady && typeof window.saveFile === "function") {
      try {
        await window.saveFile("whatsapp_customers.json", { 保存时间: timestamp, 号码列表: uniqueNumbers });
        const d = new Date();
        await window.saveFile(`群组数据\\号码统计\\${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}_${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}.json`, { 保存时间: timestamp, 号码列表: uniqueNumbers });
      } catch (e) { console.warn("⚠️ C# 文件写入异常:", e); }
    }
    return true;
  } catch (error) {
    console.error("❌ 保存到数据库失败:", error);
    return false;
  }
}

async function 查询号码是否客户(phoneNumber) {
  try {
    const db = await 初始化数据库();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const req = tx.objectStore(STORE_NAME).get(phoneNumber);
      req.onsuccess = () => resolve(!!req.result);
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.error("❌ 查询数据库失败:", error);
    return false;
  }
}

async function 获取所有客户号码() {
  try {
    const db = await 初始化数据库();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const req = tx.objectStore(STORE_NAME).getAll();
      req.onsuccess = () => resolve(req.result.map((r) => r.号码));
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.error("❌ 获取客户号码失败:", error);
    return [];
  }
}

// ==================== 群组成员号码采集器 ====================
async function 获取未归档群数据报表(progressCallback) {
  async function 模拟点击(element) {
    if (!element) return false;
    element.scrollIntoView({ behavior: "auto", block: "center" });
    await new Promise((r) => setTimeout(r, 300));
    const box = element.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    for (const type of ["mousedown", "mouseup", "click"]) {
      element.dispatchEvent(new MouseEvent(type, { view: window, bubbles: true, cancelable: true, clientX: x, clientY: y, buttons: 1, button: 0, composed: true }));
      await new Promise((r) => setTimeout(r, 50));
    }
    element.click();
    return true;
  }

  function 获取号码文本() {
    const el = document.querySelector('span[data-testid="selectable-text"]');
    return el ? el.innerText : null;
  }

  function 提取号码(text) {
    if (!text) return [];
    const regex = /\+[\d\s\(\)\-]{9,20}/g;
    return [...new Set((text.match(regex) || []).map(p => p.replace(/[\s\(\)\-]/g, "")).filter(p => /^\+\d{7,15}$/.test(p)))];
  }

  async function 等待号码加载(timeout = 10000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const text = 获取号码文本();
      if (text) {
        const numbers = 提取号码(text);
        if (numbers.length > 0) return numbers;
      }
      await new Promise(r => setTimeout(r, 500));
    }
    return [];
  }

  function 查找群组点击元素(chatName) {
    const normalize = str => (str || "").replace(/\s+/g, " ").trim().toLowerCase();
    const findClickable = el => el.closest('[role="gridcell"], div[tabindex="0"], [role="row"], [role="listitem"], .chat, [data-testid="chat-list-item"], ._ak8q, [data-testid="chat-list"] [role="button"]');
    for (const el of document.querySelectorAll('span[dir="auto"][title], div[title], span[title]')) {
      if (normalize(el.getAttribute("title")) === normalize(chatName)) {
        const c = findClickable(el);
        if (c) return c;
      }
    }
    for (const item of document.querySelectorAll('[role="row"]')) {
      const t = item.querySelector('span[dir="auto"]');
      if (t && normalize(t.textContent).includes(normalize(chatName))) return item;
    }
    return null;
  }

  async function 获取未归档群组() {
    try {
      if (!window.Store) window.Store = Object.assign({}, window.require("WAWebCollections"));
      const groups = window.Store.Chat.getModelsArray()
        .filter(c => (c.id?._serialized?.endsWith("@g.us") || c.isGroup) && !c.archive)
        .map(c => ({ id: c.id?._serialized, name: c.name || c.formattedTitle || c.formattedName || "未命名群组", participantCount: c.participantCount || c.groupMetadata?.participants?.length || c.participants?.length || 0 }));
      groups.sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
      return groups;
    } catch (e) { console.error("获取群组失败:", e); return []; }
  }

  async function 采集群组号码() {
    const groups = await 获取未归档群组();
    const results = [];
    let successCount = 0, failCount = 0;
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      progressCallback?.({ current: i + 1, total: groups.length, groupName: group.name, status: "processing" });
      try {
        const clickable = 查找群组点击元素(group.name);
        if (!clickable) { failCount++; results.push({ ...group, numbers: [], status: "failed", error: "找不到可点击元素" }); continue; }
        await 模拟点击(clickable);
        const numbers = await 等待号码加载(10000);
        if (numbers.length > 0) successCount++; else failCount++;
        results.push({ ...group, numbers, status: numbers.length > 0 ? "success" : "no_numbers", count: numbers.length });
      } catch (error) { failCount++; results.push({ ...group, numbers: [], status: "error", error: error.message }); }
      await new Promise(r => setTimeout(r, 2000 + Math.random() * 2000));
    }
    return results;
  }

  function 分析号码重复(results) {
    const map = new Map();
    for (const g of results) for (const n of g.numbers || []) {
      if (!map.has(n)) map.set(n, { 号码: n, 重复次数: 0, 所在群组: [] });
      const d = map.get(n); d.重复次数++;
      if (!d.所在群组.includes(g.name)) d.所在群组.push(g.name);
    }
    const all = Array.from(map.values());
    return {
      allNumbers: all,
      duplicateNumbers: all.filter(n => n.重复次数 > 1).sort((a, b) => b.重复次数 - a.重复次数),
      uniqueNumbers: all.filter(n => n.重复次数 === 1).sort((a, b) => a.号码.localeCompare(b.号码))
    };
  }

  function 查询号码归属地(phoneNumber) {
    const num = phoneNumber.replace("+", "");
    const codes = [
      {c:"1",n:"美国/加拿大"},{c:"44",n:"英国"},{c:"86",n:"中国"},{c:"91",n:"印度"},
      {c:"55",n:"巴西"},{c:"62",n:"印尼"},{c:"234",n:"尼日利亚"},{c:"7",n:"俄罗斯"},
      {c:"49",n:"德国"},{c:"52",n:"墨西哥"},{c:"33",n:"法国"},{c:"81",n:"日本"}
    ]; // 简化展示，实际保留原长逻辑
    for (const item of codes.sort((a,b)=>b.c.length-a.c.length)) { if (num.startsWith(item.c)) return item.n; }
    return "未知地区";
  }

  function 生成报告(results, analysis) {
    const { duplicateNumbers, uniqueNumbers, allNumbers } = analysis;
    const date = new Date().toLocaleString();
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:sans-serif;background:#f0f2f5;padding:20px}table{width:100%;border-collapse:collapse;background:#fff}th,td{padding:8px;border:1px solid #ddd;text-align:left}th{background:#075e54;color:#fff}.tab-content{display:none}.tab-content.active{display:block}.tab{cursor:pointer;padding:10px;background:#eee;display:inline-block;margin-right:5px}.tab.active{background:#075e54;color:#fff}</style></head><body>
<h2>📊 WhatsApp群组成员号码分析报告 - ${date}</h2>
<p>总群组: ${results.length} | 独立号码: ${uniqueNumbers.length} | 重复号码: ${duplicateNumbers.length}</p>
<div><div class="tab active" onclick="showTab('dup',this)">🔄 重复</div><div class="tab" onclick="showTab('uniq',this)">✅ 独立</div></div>
<div id="dup" class="tab-content active"><table><tr><th>号码</th><th>归属地</th><th>次数</th><th>所在群组</th></tr>${duplicateNumbers.map((d,i)=>`<tr><td>${d.号码}</td><td>${查询号码归属地(d.号码)}</td><td>${d.重复次数}</td><td>${d.所在群组.join(', ')}</td></tr>`).join('')}</table></div>
<div id="uniq" class="tab-content"><table><tr><th>号码</th><th>归属地</th><th>群组</th></tr>${uniqueNumbers.map(u=>`<tr><td>${u.号码}</td><td>${查询号码归属地(u.号码)}</td><td>${u.所在群组[0]}</td></tr>`).join('')}</div>
<script>function showTab(id,el){document.querySelectorAll('.tab-content').forEach(d=>d.classList.remove('active'));document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));document.getElementById(id).classList.add('active');el.classList.add('active');}</script>
</body></html>`;
  }

  const results = await 采集群组号码();
  const analysis = 分析号码重复(results);
  if (analysis.uniqueNumbers?.length > 0) await 保存独立号码到数据库(analysis.uniqueNumbers);
  
  const html = 生成报告(results, analysis);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  a.download = `群组报告_${new Date().toISOString().slice(0,10)}.html`;
  a.click();
  
  // 尝试在 C# 环境中打开
  if (window.bridge) { try { bridge.openReport(html); } catch(e){} }
  return { results, analysis };
}

// ==================== 客户标记模块 ====================
let 客户标记监控开启 = false;
let 已标记消息的ID集合 = new Set();
let 标记防抖定时器 = null;
let 滚动监听容器引用 = null;

function 启动滚动监听() {
  const containerClass = 'div[data-scrolltracepolicy="wa.web.conversation.messages"]';
  if (滚动监听定时器) clearInterval(滚动监听定时器);
  if (滚动监听容器引用) 滚动监听容器引用.removeEventListener("scroll", 处理滚动);
  滚动监听定时器 = setInterval(() => {
    const container = document.querySelector(containerClass);
    if (container) {
      container.addEventListener("scroll", 处理滚动);
      滚动监听容器引用 = container;
      clearInterval(滚动监听定时器);
      滚动监听定时器 = null;
    }
  }, 200);
}

function 处理滚动() {
  if (标记防抖定时器) clearTimeout(标记防抖定时器);
  标记防抖定时器 = setTimeout(() => { 标记当前可见消息(); 标记防抖定时器 = null; }, 200);
}

function 标记聊天列表() {
  document.querySelectorAll('[role="row"], [role="listitem"], ._ak8q, [data-testid="chat-list-item"]').forEach(item => {
    item.querySelectorAll(".chat-customer-badge").forEach(e => e.remove());
    const span = item.querySelector('span[data-testid="selectable-text"]');
    if (span) {
      const m = span.textContent.match(/\+[\d\s\(\)\-]{9,20}/g);
      if (m) for (const match of m) {
        const num = match.replace(/[\s\(\)\-]/g, "");
        if (window.__客户号码列表?.has(num)) {
          const name = item.querySelector('span[dir="auto"], div[title]');
          if (name && !name.parentNode.querySelector('.chat-customer-badge')) {
            const b = document.createElement("span");
            b.className = "chat-customer-badge customer-badge";
            b.innerHTML = "⭐"; b.title = "客户";
            b.style.cssText = "background:#25D366;color:#fff;padding:2px 6px;border-radius:10px;font-size:11px;margin-left:5px;";
            name.parentNode.appendChild(b); break;
          }
        }
      }
    }
  });
}

function 标记当前聊天窗口(retries = 0) {
  const allSpans = document.querySelectorAll('header span[data-testid="selectable-text"]');
  const numberSpan = [...allSpans].find(s => s.textContent.includes("+"));
  if (!numberSpan && retries < 8) { setTimeout(() => 标记当前聊天窗口(retries + 1), 400); return; }
  const header = numberSpan?.closest("header");
  if (!header) return;
  header.querySelectorAll(".header-customer-badge, .header-group-count").forEach(e => e.remove());
  const matches = numberSpan.textContent.match(/\+[\d\s\(\)\-]{9,20}/g);
  if (!matches) return;
  const nameEl = header.querySelector('span[dir="auto"]:not([data-testid])');
  if (!nameEl) return;
  let count = 0, usCount = 0;
  for (const m of matches) {
    const num = m.replace(/[\s\(\)\-]/g, "");
    if (window.__客户号码列表?.has(num)) {
      count++;
      if (num.startsWith("+1")) usCount++;
    }
  }
  if (count > 0) {
    const b = document.createElement("span"); b.className = "header-customer-badge"; b.innerHTML = `⭐ ${count}位客户`;
    b.style.cssText = "background:#25D366;color:#fff;padding:2px 8px;border-radius:12px;font-size:12px;margin-left:10px;";
    nameEl.parentNode.appendChild(b);
    const info = document.createElement("span"); info.className = "header-group-count";
    info.textContent = `👥 本群有: ${count} 位${usCount?`|美国:${usCount}位`:''} | 时间:${window.__数据采集时间?new Date(window.__数据采集时间).toLocaleString():'未知'}`;
    info.style.cssText = "background:#f39c12;color:#fff;padding:2px 8px;border-radius:12px;font-size:12px;margin-left:6px;";
    nameEl.parentNode.appendChild(info);
  }
}

function 标记当前可见消息() {
  let added = 0;
  document.querySelectorAll("div[data-pre-plain-text]").forEach(msg => {
    const r = msg.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    if (已标记消息的ID集合.has(msg.__msgId || (msg.__msgId = Math.random().toString(36)))) return;
    const pre = msg.getAttribute("data-pre-plain-text") || "";
    const m = pre.match(/\+[\d\s\(\)\-]{9,20}/);
    if (!m) return;
    const num = m[0].replace(/[\s\(\)\-]/g, "");
    if (window.__客户号码列表?.has(num)) {
      const area = msg.closest("._amk4") || msg.closest('[class*="message"]');
      if (area && !area.querySelector(".customer-badge")) {
        const n = area.querySelector("._ahxy, span[dir='auto'][aria-label]");
        if (n) {
          const b = document.createElement("span"); b.className = "customer-badge"; b.innerHTML = "⭐ 客户";
          b.style.cssText = "background:#25D366;color:#fff;padding:2px 6px;border-radius:10px;font-size:11px;margin-left:8px;";
          n.parentNode.appendChild(b); added++;
          已标记消息的ID集合.add(msg.__msgId);
        }
      }
    }
  });
  if (added) console.log(`📊 标记 ${added} 条新消息`);
}

async function 标记客户(开启 = true) {
  if (开启) {
    if (客户标记监控开启) return;
    let list = [];
    if (window.__csharpApiReady && typeof window.readFile === "function") {
      try {
        const f = await window.readFile("whatsapp_customers.json");
        if (f?.号码列表) list = f.号码列表.map(x => x.号码).filter(Boolean);
      } catch(e) {}
    }
    if (list.length === 0) {
      try {
        const db = await 初始化数据库();
        list = await new Promise(r => {
          const req = db.transaction("uniqueNumbers","readonly").objectStore("uniqueNumbers").getAll();
          req.onsuccess = () => r(req.result.map(x=>x.号码)); req.onerror = () => r([]);
        });
      } catch(e) {}
    }
    if (list.length === 0) { alert("❌ 无客户数据"); return; }
    window.__客户号码列表 = new Set(list);
    客户标记监控开启 = true;
    启动滚动监听();
    document.addEventListener("click", 监听聊天点击, true);
    标记聊天列表(); 标记当前聊天窗口(); 标记当前可见消息();
    setTimeout(() => { 标记当前聊天窗口(); 标记当前可见消息(); 启动滚动监听(); }, 1000);
  } else {
    document.removeEventListener("click", 监听聊天点击, true);
    if (滚动监听定时器) { clearInterval(滚动监听定时器); 滚动监听定时器 = null; }
    if (标记防抖定时器) { clearTimeout(标记防抖定时器); 标记防抖定时器 = null; }
    if (滚动监听容器引用) { 滚动监听容器引用.removeEventListener("scroll", 处理滚动); 滚动监听容器引用 = null; }
    document.querySelectorAll(".customer-badge, .chat-customer-badge, .header-customer-badge").forEach(e => e.remove());
    已标记消息的ID集合.clear();
    客户标记监控开启 = false;
    window.__客户号码列表 = null;
  }
}

function 监听聊天点击(e) {
  const item = e.target.closest('[role="row"], [role="listitem"], ._ak8q, [data-testid="chat-list-item"]');
  if (item) {
    标记聊天列表();
    setTimeout(() => { 标记当前聊天窗口(); 标记当前可见消息(); 启动滚动监听(); }, 800);
  }
}

// ==================== 通用工具 & 发送函数 ====================
function getInputDom() {
  return document.querySelector("footer p._aupe.copyable-text, footer div[contenteditable='true'], footer .lexical-rich-text-input div[contenteditable='true']");
}
function getSendButton() {
  return document.querySelector('div[role="button"][aria-label="发送"], span[data-icon="send"], .x1f6kntn[aria-label="发送"]');
}
async function 点击聊天列表(chatName) {
  const norm = s => s?.toLowerCase().replace(/\s+/g,'')||'';
  const findC = el => el.closest('[role="gridcell"], [role="row"], [role="listitem"], ._ak8q, [data-testid="chat-list-item"]');
  for (const el of document.querySelectorAll('span[dir="auto"][title], div[title]')) {
    if (norm(el.getAttribute("title")).includes(norm(chatName))) { await 模拟点击(findC(el) || el); return true; }
  }
  for (const el of document.querySelectorAll('[role="row"], ._ak8q')) {
    if (norm(el.textContent).includes(norm(chatName))) { await 模拟点击(el); return true; }
  }
  return false;
}
async function 模拟点击(el) {
  if (!el) return;
  el.scrollIntoView({block:"center"}); await new Promise(r=>setTimeout(r,200));
  const r = el.getBoundingClientRect();
  const e = new MouseEvent("click", {bubbles:true,clientX:r.left+r.width/2,clientY:r.top+r.height/2});
  el.dispatchEvent(e); el.click();
}
function 单文本发送模式获取DOM() {
  const f = document.querySelector("footer"); const i = f?.querySelector('[contenteditable="true"][role="textbox"]');
  const b = f?.querySelector('[data-icon="wds-ic-send-filled"]')?.closest('button,[role="button"]');
  return {ok:!!(i&&b),input:i,sendBtn:b};
}
async function 发送文本内容(groupName, content) {
  if (!await 点击聊天列表(groupName)) return false;
  await new Promise(r=>setTimeout(r,600));
  const d = 单文本发送模式获取DOM(); if (!d.ok) return false;
  d.input.focus();
  document.execCommand("insertText", false, content.replace(/\n/g, "↵").replace("↵↵", "\n\n").replace("↵", "\n"));
  d.input.dispatchEvent(new Event("input",{bubbles:true})); await new Promise(r=>setTimeout(r,300));
  await 模拟点击(d.sendBtn); return true;
}
function 获取MIME(d) { return d.split(";")[0].split(":")[1]; }
function Base64ToBlob(d) { const b = atob(d.split(",")[1]); const a = new Uint8Array(b.length); for(let i=0;i<b.length;i++) a[i]=b.charCodeAt(i); return new Blob([a],{type:获取MIME(d)}); }
async function pasteImage(imgBase64) {
  const inp = getInputDom(); if (!inp) throw "无输入框";
  const f = new File([Base64ToBlob(imgBase64)], "img.jpg");
  inp.dispatchEvent(new ClipboardEvent("paste",{clipboardData:{items:{add:()=>{}}},bubbles:true}));
  const dt = new DataTransfer(); dt.items.add(f);
  inp.dispatchEvent(new ClipboardEvent("paste",{clipboardData:dt,bubbles:true}));
  await new Promise(r=>setTimeout(r,1000));
}
async function 发送图片内容(groupName, imgBase64) {
  if (!await 点击聊天列表(groupName)) return false; await new Promise(r=>setTimeout(r,800));
  const inp = getInputDom(); inp.focus();
  await pasteImage(imgBase64);
  const btn = getSendButton(); if (btn) btn.click(); await new Promise(r=>setTimeout(r,800)); return true;
}

// ==================== 浮动窗口 UI & 逻辑 ====================
function 注入浮动窗口() {
  const host = document.createElement("div"); host.id = "custom-floating-window-host"; host.style.all = "initial"; document.body.appendChild(host);
  const shadow = host.attachShadow({mode:"open"});
  const style = document.createElement("style");
  style.textContent = `:host{all:initial}#fw{position:fixed;width:310px;height:100%;right:0;top:0;background:#fff;border-left:1px solid #28a745;z-index:99999;font-family:sans-serif;color:#333;display:flex;flex-direction:column}#fw .head{padding:10px;background:#f8f9fa;border-bottom:1px solid #ddd;display:flex;justify-content:space-between;align-items:center;cursor:move}#fw .body{flex:1;overflow-y:auto;padding:15px}#fw button{padding:6px 10px;margin:3px;border:1px solid #ddd;background:#fff;cursor:pointer;border-radius:4px}#fw button:hover{background:#eee}#fw .sel{background:#e6f2ff}#fw textarea{width:100%;height:100px;resize:vertical;margin-top:10px}`;
  shadow.appendChild(style);
  const fw = document.createElement("div"); fw.id = "fw";
  fw.innerHTML = `<div class="head"><span>WA-消息群发模块 v${TOOL_VERSION} <span id="userName" style="color:#007bff"></span></span><button id="fwClose">✕</button></div>
  <div class="body">
    <button id="sepBtn" style="width:100%">📄 分离/还原页面</button>
    <button id="loadGroupsBtn" style="width:100%;margin-top:5px">📥 采集未归档群组报表</button>
    <button id="loadContactsBtn" style="width:100%;margin-top:5px">👥 加载群组列表</button>
    <div id="contactsContainer" style="max-height:200px;overflow:auto;border:1px solid #eee;margin:10px 0;display:none"></div>
    <div style="display:flex;gap:5px;margin-bottom:10px">
      <button id="selAll">全选</button><button id="invSel">反选</button><button id="clearSel">清空</button>
    </div>
    <textarea id="msgInput" placeholder="输入消息内容..."></textarea>
    <input type="file" id="imgUpload" accept="image/*" style="display:none">
    <button id="uploadImgBtn" style="width:100%;margin-top:5px">📷 选择图片</button>
    <img id="preview" style="max-width:100%;display:none;margin:5px 0">
    <div style="margin:10px 0;border-bottom:1px solid #eee;padding-bottom:5px">
      <label><input type="radio" name="mode" value="text" checked> 纯文本</label>
      <label><input type="radio" name="mode" value="img"> 纯图片</label>
      <label><input type="radio" name="mode" value="both"> 图文(同条)</label>
      <label><input type="radio" name="mode" value="sep"> 先文后图</label>
    </div>
    <button id="sendBtn" style="width:100%;background:#28a745;color:#fff">🚀 开始群发</button>
    <button id="schedBtn" style="width:100%;background:#ff9800;color:#fff;margin-top:5px">⏰ 定时发送管理</button>
    <button id="reactBtn" style="width:100%;background:#9c27b0;color:#fff;margin-top:5px">👍 点赞面板</button>
    <button id="transBtn" style="width:100%;background:#1a73e8;color:#fff;margin-top:5px">🌐 自动翻译</button>
    <div style="margin-top:15px;padding:10px;background:#f5f5f5;border-radius:4px;display:flex;gap:10px;justify-content:center">
      <button id="markCustBtn">⭐ 开启客户标记</button><button id="clearDBBtn">🗑 清除客户数据</button>
    </div>
    <div id="progress" style="margin-top:10px;display:none"><div style="height:20px;background:#eee;border-radius:10px;overflow:hidden"><div id="pBar" style="height:100%;width:0%;background:#28a745;transition:width 0.3s"></div></div><div id="pText" style="text-align:center;font-size:12px;margin-top:2px"></div></div>
    <div id="status" style="margin-top:5px;font-size:12px"></div>
  </div>`;
  shadow.appendChild(fw);
  
  // 全局引用
  const $ = id => shadow.getElementById(id);
  let selSet = new Set(), groups = [], imgData = null, sending = false;
  
  $("fwClose").onclick = () => host.remove();
  $("selAll").onclick = () => { selSet.clear(); $$("input[type=checkbox]").forEach(c=>{c.checked=true;c.closest("div").classList.add("sel");selSet.add(c.value)}); uStatus(`已选 ${selSet.size} 个`); };
  $("invSel").onclick = () => { selSet.clear(); $$("input[type=checkbox]").forEach(c=>{c.checked=!c.checked;c.closest("div").classList.toggle("sel",c.checked);if(c.checked)selSet.add(c.value)}); uStatus(`已选 ${selSet.size} 个`); };
  $("clearSel").onclick = () => { selSet.clear(); $$("input[type=checkbox]").forEach(c=>{c.checked=false;c.closest("div").classList.remove("sel")}); uStatus("已清空"); };
  const $$ = q => shadow.querySelectorAll(q);
  const uStatus = t => { $("status").textContent = t; console.log("[Status]", t); };
  
  $("loadContactsBtn").onclick = async () => {
    $("contactsContainer").style.display = "block";
    groups = await (async()=>{if(!window.Store)window.Store=window.require("WAWebCollections");return window.Store.Chat.getModelsArray().filter(c=>c.isGroup&&!c.archive).map(c=>({id:c.id._serialized,name:c.name||c.formattedTitle}))})();
    $("contactsContainer").innerHTML = groups.map(g=>`<div class="item" style="padding:5px;border-bottom:1px solid #eee;cursor:pointer;display:flex;align-items:center"><input type="checkbox" value="${g.id}" style="margin-right:8px"><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${g.name}</span></div>`).join('');
    $$("input[type=checkbox]").forEach(c=>c.onchange=function(){this.checked?selSet.add(this.value):selSet.delete(this.value);this.closest("div").classList.toggle("sel",this.checked);uStatus(`已选 ${selSet.size} 个`)});
  };

  $("uploadImgBtn").onclick = () => $("imgUpload").click();
  $("imgUpload").onchange = e => {
    const f = e.target.files[0]; if(!f)return;
    const r = new FileReader(); r.onload = () => { imgData=r.result; $("preview").src=r.result; $("preview").style.display="block"; };
    r.readAsDataURL(f);
  };

  let sep = false;
  $("sepBtn").onclick = async () => { try{sep?advancedApi.restorePoppedTab(window.__VbrTabId):advancedApi.popOutCurrentTab(window.__VbrTabId);sep=!sep;$( "sepBtn").textContent=sep?"📄 还原页面":"📄 分离页面"}catch(e){}};
  
  $("markCustBtn").onclick = async () => { await 标记客户(!客户标记监控开启); 客户标记监控开启 ? $("markCustBtn").textContent = "⏹ 关闭客户标记" : $("markCustBtn").textContent = "⭐ 开启客户标记"; uStatus(客户标记监控开启?"已开启标记":"已关闭标记"); };
  $("clearDBBtn").onclick = async () => { try{indexedDB.deleteDatabase("WhatsAppCustomerDB").onsuccess=()=>{alert("已清除");location.reload()}}catch(e){} };
  
  $("transBtn").onclick = () => startTranslateModule();
  $("reactBtn").onclick = () => openReactionDrawer();
  $("schedBtn").onclick = () => openScheduleDrawer();

  $("sendBtn").onclick = async () => {
    if(sending||selSet.size===0)return;
    const txt = $("msgInput").value; const mode = $$("input[name=mode]:checked")[0].value;
    if(mode!=='img'&&!txt&&!imgData){uStatus("请输入内容或选图");return}
    sending=true; $("sendBtn").disabled=true;
    $("progress").style.display="block";
    let s=0,f=0,total=selSet.size;
    for(const gid of selSet){
      const g=groups.find(x=>x.id===gid); if(!g)continue;
      $("pBar").style.width=`${(s+f)/total*100}%`; $("pText").textContent=`${g.name} (${s+1}/${total})`;
      try{
        if(mode==='text') await 发送文本内容(g.name,txt);
        else if(mode==='img') await 发送图片内容(g.name,imgData);
        else if(mode==='both'){await pasteImage(imgData);document.execCommand("insertText",false,txt);getSendButton().click();await new Promise(r=>setTimeout(r,1500))}
        else if(mode==='sep'){await 发送文本内容(g.name,txt);await 发送图片内容(g.name,imgData)}
        s++;
      }catch(e){f++}
      await new Promise(r=>setTimeout(r,1500+Math.random()*1000));
    }
    uStatus(`完成: 成功${s} 失败${f}`); sending=false; $("sendBtn").disabled=false; $("progress").style.display="none";
  };
  
  // 抽屉初始化占位
  window.openReactionDrawer = () => initReactionDrawer(shadow);
  window.openScheduleDrawer = () => initScheduleDrawer(shadow);
  window.startTranslateModule = () => initTranslateModule(shadow);
}

// ==================== 点赞模块 ====================
function initReactionDrawer(shadow) {
  if(document.getElementById("reactionDrawer")) return;
  const d = document.createElement("div"); d.id="reactionDrawer";
  d.innerHTML = `<div style="position:fixed;right:310px;top:0;width:300px;height:100%;background:#fff;border-left:1px solid #9c27b0;z-index:999999;box-shadow:-4px 0 10px rgba(0,0,0,0.1);display:flex;flex-direction:column">
    <div style="background:#9c27b0;color:#fff;padding:10px;display:flex;justify-content:space-between"><span>👍 点赞面板</span><button id="rClose" style="background:none;border:none;color:#fff;font-size:18px;cursor:pointer">✕</button></div>
    <div style="padding:10px;flex:1;overflow:auto">
      <div style="font-size:12px;margin-bottom:5px">选择表情</div>
      <div id="emojiGrid" style="display:flex;flex-wrap:wrap;gap:5px;font-size:24px;cursor:pointer">👍❤️😂😮😢🙏👌🔥💯</div>
      <input id="customEmoji" placeholder="自定义表情(如:🚀)" style="width:100%;margin:10px 0;padding:5px">
      <div style="margin:10px 0">目标: <label><input type="radio" name="rt" value="last" checked> 最后一条</label> <label><input type="radio" name="rt" value="keyword"> 关键词</label> <label><input type="radio" name="rt" value="index"> 第N条</label></div>
      <input id="rKeyword" placeholder="关键词/条数" style="width:100%;padding:5px;display:none">
      <div style="margin:10px 0">群组(多选): <div id="rGroups" style="max-height:100px;overflow:auto;border:1px solid #eee;padding:5px;margin-top:5px"></div></div>
      <div style="margin:10px 0">间隔(秒): <input id="rDelay" type="number" value="3" style="width:50px"></div>
      <button id="rStart" style="width:100%;padding:8px;background:#9c27b0;color:#fff;border:none;cursor:pointer">▶ 开始点赞</button>
    </div></div>`;
  document.body.appendChild(d);
  $("rClose").onclick=()=>d.remove();
  $("rt").onchange=()=>$("rKeyword").style.display=$("rt").value==='keyword'||$("rt").value==='index'?'block':'none';
  const groups = window.__groups || []; 
  $("rGroups").innerHTML = groups.map(g=>`<label style="display:block;padding:3px"><input type="checkbox" value="${g.id}"> ${g.name}</label>`).join('');
  
  let selected = "👍", running = false, stop = false;
  $("#emojiGrid").onclick = e => { if(e.target.textContent){selected=e.target.textContent;$("customEmoji").value=selected} };
  $("customEmoji").oninput = e => selected = e.target.value;
  
  $("#rStart").onclick = async () => {
    if(running){stop=true;return}
    running=true; stop=false; $("#rStart").textContent="⏹ 停止";
    const targets = [...$$("input:checked")].map(c=>c.value);
    if(!targets.length){alert("请选择群组");running=false;return}
    for(const gid of targets){
      if(stop)break;
      const g=groups.find(x=>x.id===gid); if(!g)continue;
      await doReactGroup(g.name, selected, $("rt").value, $("rKeyword").value, +$("rDelay").value*1000);
    }
    running=false; $("#rStart").textContent="▶ 开始点赞";
  };
}

async function doReactGroup(name, emoji, type, val, delay) {
  await 点击聊天列表(name); await new Promise(r=>setTimeout(r,1500));
  const msgs = document.querySelectorAll("div[data-pre-plain-text]");
  if(!msgs.length)return;
  let targetMsgs = [];
  if(type==='last') targetMsgs=[msgs[msgs.length-1]];
  else if(type==='index') { const i=parseInt(val); targetMsgs=i<0?[msgs[msgs.length+i]]:[msgs[i-1]]||[]; }
  else if(type==='keyword') {
    const kw = val?.toLowerCase();
    for(const m of msgs) {
      const st = m.querySelector('[data-testid="selectable-text"]'); if(!st)continue;
      // 🔥 核心：克隆并剔除引用内容再匹配
      const clone = st.cloneNode(true);
      clone.querySelectorAll('[data-testid="quoted-message"], [aria-label="引用的消息"], ._aju3, .quoted-mention').forEach(e=>e.remove());
      if(clone.textContent.toLowerCase().includes(kw)) targetMsgs.push(m);
    }
  }
  for(const m of targetMsgs) {
    m.scrollIntoView({block:"center"}); await new Promise(r=>setTimeout(r,200));
    const mood = document.querySelector('[aria-label="留下心情"], [aria-label="React to message"]');
    if(mood) mood.click();
    await new Promise(r=>setTimeout(r,300));
    const opts = document.querySelectorAll("[data-emoji]");
    for(const o of opts) if(o.getAttribute("data-emoji")===emoji){o.click();break}
    await new Promise(r=>setTimeout(r,delay));
  }
}

// ==================== 定时发送模块 ====================
function initScheduleDrawer(shadow) {
  if(document.getElementById("schedDrawer")) return;
  const d = document.createElement("div"); d.id="schedDrawer";
  d.innerHTML = `<div style="position:fixed;right:310px;top:0;width:300px;height:100%;background:#fff;border-left:1px solid #ff9800;z-index:999999;display:flex;flex-direction:column">
    <div style="background:#ff9800;color:#fff;padding:10px;display:flex;justify-content:space-between"><span>⏰ 定时发送</span><button id="sClose" style="background:none;border:none;color:#fff;cursor:pointer">✕</button></div>
    <div style="padding:10px;border-bottom:1px solid #eee"><input id="sMin" type="number" placeholder="分" style="width:40px"> 分 <input id="sSec" type="number" placeholder="秒" style="width:40px"> 秒后发<textarea id="sTxt" style="width:100%;height:50px" placeholder="内容"></textarea><button id="sAdd" style="margin-top:5px;width:100%">➕ 添加</button></div>
    <div id="sList" style="flex:1;overflow:auto;padding:10px"></div></div>`;
  document.body.appendChild(d);
  $("sClose").onclick=()=>d.remove();
  let tasks = [];
  $("sAdd").onclick = () => {
    const min=+$("sMin").value||0, sec=+$("sSec").value||0, txt=$("sTxt").value;
    if(!txt)return; tasks.push({ms:(min*60+sec)*1000, txt}); render();
  };
  const render = () => { $("sList").innerHTML = tasks.map((t,i)=>`<div style="padding:8px;border:1px solid #eee;margin-bottom:5px">${t.ms/1000}s后: ${t.txt.substring(0,20)} <button onclick="schedRun(${i})">执行</button></div>`).join(''); };
  window.schedRun = async (idx) => {
    const t = tasks[idx]; if(!t)return;
    tasks.splice(idx,1); render();
    await new Promise(r=>setTimeout(r,t.ms));
    for(const gid of window.__selGroups||[]) { const g=window.__groups.find(x=>x.id===gid); if(g) await 发送文本内容(g.name, t.txt); await new Promise(r=>setTimeout(r,1000)); }
  };
}

// ==================== 自动翻译模块 ====================
function initTranslateModule(shadow) {
  const TRANSLATE_CLASS = "wa-translate-result";
  let enabled = false, pending = new Set(), cache = new Map();
  const btn = shadow.getElementById("transBtn");
  
  async function translateText(text) {
    if(cache.has(text)) return cache.get(text);
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`);
    const d = await res.json(); const t = d[0].map(x=>x[0]).join('');
    if(t) cache.set(text, t); return t;
  }
  
  function extractText(bubble) {
    const st = bubble.querySelector('[data-testid="selectable-text"]') || (bubble.getAttribute?.("data-testid")==="selectable-text"?bubble:null);
    if(!st) return "";
    const clone = st.cloneNode(true);
    clone.querySelectorAll('[aria-hidden="true"], [data-testid="quoted-message"], [aria-label="引用的消息"], ._aju3, .quoted-mention').forEach(e=>e.remove());
    clone.querySelectorAll('.wa-translate-result').forEach(e=>e.remove()); // 🛡️ 防重复翻译
    clone.querySelectorAll('img[data-plain-text]').forEach(img=>img.replaceWith(document.createTextNode(img.getAttribute('data-plain-text'))));
    return (clone.innerText||'').trim();
  }
  
  function handleBubble(bubble) {
    if(!enabled || bubble.getAttribute('data-translated')==='true') return;
    const txt = extractText(bubble);
    if(txt.length<2) return;
    translateText(txt).then(t => {
      if(t && t!==txt) {
        const div = document.createElement("div"); div.className = TRANSLATE_CLASS;
        div.style.cssText = "margin:4px 0 2px;padding:4px 8px;border-left:3px solid #1a73e8;background:rgba(26,115,232,0.07);font-size:14px;color:#ff00a5;white-space:pre-wrap";
        div.textContent = t;
        bubble.appendChild(div);
        bubble.setAttribute('data-translated','true'); // 🛡️ 标记已处理
      }
    });
  }

  const obs = new MutationObserver(muts => {
    if(!enabled)return;
    muts.forEach(m=>m.addedNodes.forEach(n=>{
      if(n.nodeType!==1)return;
      const sts = n.getAttribute?.("data-testid")==="selectable-text" ? [n] : n.querySelectorAll?.('[data-testid="selectable-text"]')||[];
      sts.forEach(s=>handleBubble(s.parentElement));
    }));
  });
  
  btn.onclick = () => {
    enabled=!enabled;
    btn.textContent = enabled ? "⏸ 暂停翻译" : "🌐 自动翻译";
    btn.style.background = enabled ? "#d93025" : "#1a73e8";
    if(enabled) obs.observe(document.body,{childList:true,subtree:true});
    else obs.disconnect();
  };
}

// ==================== 初始化 ====================
if (window.location.hostname.includes("web.whatsapp.com")) {
  console.log("🚀 WA-Tool v${TOOL_VERSION} Loaded");
  注入浮动窗口();
  // 暴露全局供外部调用或定时模块读取
  Object.defineProperty(window, '__groups', { get: ()=>window.__groupsData||[] });
  window.__groupsData = [];
}
