// ==================== 通用工具函数 ====================

// 模拟真实点击事件
async function 模拟真实点击(element) {
  if (!element) return false;
  element.scrollIntoView({ behavior: "auto", block: "center" });
  await new Promise((resolve) => setTimeout(resolve, 100));
  const box = element.getBoundingClientRect();
  const x = box.left + box.width / 2;
  const y = box.top + box.height / 2;
  const events = [
    { type: "mousedown", buttons: 1 },
    { type: "mouseup", buttons: 0 },
    { type: "click", buttons: 0 },
  ];
  for (const { type, buttons } of events) {
    const event = new MouseEvent(type, {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      buttons: buttons,
      button: 0,
      composed: true,
    });
    element.dispatchEvent(event);
    await new Promise((resolve) => setTimeout(resolve, 35));
  }
  element.click();
  return true;
}

// 获取输入框（通用）
function getInputDom() {
  const selectors = [
    "footer p._aupe.copyable-text",
    'footer div[contenteditable="true"]',
    'footer .lexical-rich-text-input div[contenteditable="true"]',
    'div[role="textbox"][contenteditable="true"]',
    'footer .x1hx0egp[contenteditable="true"]',
    '.lexical-rich-text-input div[contenteditable="true"]',
    '.x1hx0egp[contenteditable="true"]',
  ];
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el) return el;
  }
  return null;
}

// 获取发送按钮（通用）
function getSendButton() {
  const selectors = [
    'div[role="button"][aria-label="发送"]',
    'span[data-icon="send"]',
    'button[aria-label="发送"]',
    'div[aria-label="发送"][role="button"]',
    ".x1f6kntn",
    'span[data-icon="wds-ic-send-filled"]',
  ];
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el) return el;
  }
  return null;
}

// 图片处理函数
function getMimeType(dataURL) {
  return dataURL.split(";")[0].split(":")[1];
}
function getExtension(mimeType) {
  const extensions = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/bmp": "bmp",
    "image/avif": "avif",
  };
  return extensions[mimeType] || "png";
}
function base64ToBlob(base64Data, mimeType) {
  const base64 = base64Data.includes("base64,")
    ? base64Data.split("base64,")[1]
    : base64Data;
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new Blob([array], { type: mimeType });
}
function estimateBase64Size(base64Data) {
  if (!base64Data) return 0;
  const cleanBase64 = base64Data.includes("base64,")
    ? base64Data.split("base64,")[1]
    : base64Data;
  const sizeInBytes = cleanBase64.length * 0.75;
  return sizeInBytes / 1024; // KB
}

// 图片或图片加文本发送模式获取DOM
function 图片或图片加文本发送模式获取DOM() {
  const sendBtn = document
    .querySelector('[data-icon="wds-ic-send-filled"]')
    ?.closest('[role="button"]');
  if (!sendBtn) return { ok: false, step: 1, msg: "没找到发送按钮" };
  let node = sendBtn;
  let input = null;
  while (node && !input) {
    input = node.querySelector('[contenteditable="true"]');
    node = node.parentElement;
  }
  if (!input) return { ok: false, step: 2, msg: "没找到输入框" };
  node = sendBtn;
  let image = null;
  while (node && !image) {
    image = node.querySelector("img, canvas");
    node = node.parentElement;
  }
  if (!image) return { ok: false, step: 3, msg: "没找到图片预览" };
  return { ok: true, sendBtn, input, image };
}

// 单文本发送模式获取DOM
function 单文本发送模式获取DOM() {
  const footer = document.querySelector("footer");
  if (!footer) return null;
  const input = footer.querySelector(
    '[contenteditable="true"][role="textbox"]',
  );
  const sendBtn = footer
    .querySelector('[data-icon="wds-ic-send-filled"]')
    ?.closest('button, [role="button"]');
  return { footer, input, sendBtn, ok: !!(input && sendBtn) };
}

// 点击聊天列表
async function 点击聊天列表(chatName) {
  function normalizeString(str) {
    if (!str) return "";
    return str.replace(/\s+/g, " ").trim().toLowerCase();
  }
  function findClickableElement(element) {
    return (
      element.closest('[role="gridcell"]') ||
      element.closest('div[tabindex="0"]') ||
      element.closest('[role="row"]') ||
      element.closest('[role="listitem"]') ||
      element.closest(".chat") ||
      element.closest('[data-testid="chat-list-item"]') ||
      element.closest("._ak8q") ||
      element.closest('[data-testid="chat-list"] [role="button"]')
    );
  }
  try {
    console.log(`🔍 正在查找聊天: "${chatName}"`);
    if (!chatName) throw new Error("聊天名称不能为空");
    // 方法1: 通过标题属性查找
    const titleElements = document.querySelectorAll(
      'span[dir="auto"][title], div[title], span[title]',
    );
    for (let el of titleElements) {
      const title = el.getAttribute("title") || "";
      if (normalizeString(title) === normalizeString(chatName)) {
        const clickable = findClickableElement(el);
        if (clickable) {
          console.log(`✅ 找到聊天: "${chatName}" (通过title属性)`);
          await 模拟真实点击(clickable);
          return true;
        }
      }
    }
    // 方法2: 通过文本内容查找
    const chatItems = document.querySelectorAll(
      '[role="row"], [role="listitem"], .chat, [data-testid="chat-list-item"], ._ak8q',
    );
    for (let item of chatItems) {
      const textContent = item.textContent || "";
      if (normalizeString(textContent).includes(normalizeString(chatName))) {
        console.log(`✅ 找到聊天: "${chatName}" (通过文本内容)`);
        await 模拟真实点击(item);
        return true;
      }
    }
    // 方法3: 通过部分匹配查找
    const cleanName = chatName.replace(/[^0-9]/g, "");
    if (cleanName.length >= 5) {
      const allRows = document.querySelectorAll('[role="row"], ._ak8q');
      for (let row of allRows) {
        const fullText = row.textContent || "";
        if (fullText.includes(cleanName)) {
          console.log(`✅ 找到聊天: "${chatName}" (通过部分ID匹配)`);
          await 模拟真实点击(row);
          return true;
        }
      }
    }
    console.error(`❌ 未找到聊天: "${chatName}"`);
    return false;
  } catch (error) {
    console.error(`❌ 点击聊天失败:`, error);
    return false;
  }
}

// 获取未归档群组
async function 获取未归档群组() {
  async function initAPI() {
    try {
      window["Store"] = Object["assign"](
        {},
        window["require"]("WAWebCollections"),
      );
      console.log("✅ API 初始化成功");
      return true;
    } catch (error) {
      console.error("❌ API 初始化失败:", error);
      return false;
    }
  }
  async function waitForModules(maxAttempts = 30) {
    for (let attempts = 1; attempts <= maxAttempts; attempts++) {
      try {
        await initAPI();
        if (window.Store?.Chat?.getModelsArray) {
          console.log("✅ 聊天模块加载成功");
          return true;
        }
        console.log(`⏳ 等待模块加载... (${attempts}/${maxAttempts})`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        if (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else {
          console.error("❌ 模块加载失败:", e);
        }
      }
    }
    return false;
  }
  try {
    console.log("🔍 正在获取未归档群组列表...");
    const modulesLoaded = await waitForModules();
    if (!modulesLoaded) throw new Error("无法加载WhatsApp模块");
    const allChats = window.Store.Chat.getModelsArray();
    if (!allChats || !Array.isArray(allChats)) {
      console.error("❌ 无法获取聊天列表");
      return [];
    }
    const groups = allChats
      .filter((chat) => {
        const isGroup =
          chat.id?._serialized?.endsWith("@g.us") ||
          chat.isGroup === true ||
          chat.id?.endsWith?.("@g.us");
        const isNotArchived = !chat.archive;
        return isGroup && isNotArchived;
      })
      .map((chat) => {
        let participantCount = 0;
        if (chat.groupMetadata?.participants) {
          participantCount = chat.groupMetadata.participants.length;
        } else if (chat.participants) {
          participantCount = chat.participants.length;
        } else if (chat.participantCount) {
          participantCount = chat.participantCount;
        }
        return {
          id: chat.id?._serialized || chat.id,
          name:
            chat.name ||
            chat.formattedTitle ||
            chat.formattedName ||
            "未命名群组",
          participantCount: participantCount,
          isMuted: chat.muteExpiration > 0,
          unreadCount: chat.unreadCount || 0,
          isArchived: chat.archive || false,
          pinned: chat.pin || false,
        };
      });
    console.log(`✅ 成功获取 ${groups.length} 个未归档群组`);
    groups.sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
    return groups;
  } catch (error) {
    console.error("❌ 获取未归档群组失败:", error);
    return [];
  }
}

// ==================== 图片粘贴通用函数 ====================
async function pasteImageToInput(imgBase64, options = {}) {
  const { timeout = 5000, checkPreview = true } = options;
  const inputDom = getInputDom();
  if (!inputDom) throw new Error("找不到输入框");
  const beforeDom = 图片或图片加文本发送模式获取DOM();
  const hadPreviewBefore = beforeDom && beforeDom.ok && beforeDom.image;
  const mimeType = getMimeType(imgBase64);
  const extension = getExtension(mimeType);
  const blob = base64ToBlob(imgBase64, mimeType);
  const file = new File([blob], `image.${extension}`, { type: mimeType });
  const clipboardData = new DataTransfer();
  clipboardData.items.add(file);
  const pasteEvent = new ClipboardEvent("paste", {
    clipboardData: clipboardData,
    bubbles: true,
    cancelable: true,
  });
  inputDom.dispatchEvent(pasteEvent);
  if (!checkPreview) return true;
  // 等待预览出现
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    await new Promise((r) => setTimeout(r, 100));
    const currentDom = 图片或图片加文本发送模式获取DOM();
    if (currentDom && currentDom.ok && currentDom.image) {
      console.log(`✅ 图片预览已出现 (耗时: ${Date.now() - startTime}ms)`);
      return true;
    }
  }
  console.warn(`⚠️ 图片预览超时 (${timeout}ms)`);
  return false;
}

// ==================== 发送函数 ====================

/**
 * 发送图片内容到指定群组
 */
async function 发送图片内容(groupName, imgBase64) {
  try {
    console.log(`📷 发送图片到 "${groupName}"`);
    const clicked = await 点击聊天列表(groupName);
    if (!clicked) throw new Error(`无法打开聊天: ${groupName}`);
    await new Promise((r) => setTimeout(r, 1000));

    const inputDom = getInputDom();
    if (!inputDom) throw new Error("找不到输入框");

    const fileSizeKB = estimateBase64Size(imgBase64);
    console.log(`📊 图片大小: ${fileSizeKB.toFixed(2)}KB`);

    inputDom.focus();
    inputDom.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));

    const pasteTimeout = Math.min(5000 + Math.floor(fileSizeKB * 10), 15000);
    console.log(`⏳ 正在粘贴图片，超时设置: ${pasteTimeout}ms`);
    const pasteSuccess = await pasteImageToInput(imgBase64, {
      timeout: pasteTimeout,
    });
    if (!pasteSuccess) throw new Error("图片粘贴失败");

    const processDelay = Math.min(1000 + Math.floor(fileSizeKB * 5), 5000);
    console.log(`⏳ 等待图片处理: ${processDelay}ms...`);
    await new Promise((r) => setTimeout(r, processDelay));

    const sendButton = getSendButton();
    if (!sendButton) throw new Error("找不到发送按钮");

    const isDisabled =
      sendButton.hasAttribute("disabled") ||
      sendButton.getAttribute("aria-disabled") === "true";
    if (isDisabled) {
      console.log("⏳ 发送按钮不可用，等待激活...");
      await new Promise((r) => setTimeout(r, 1000));
    }

    sendButton.click();
    console.log(`✅ 图片发送成功: ${groupName}`);
    await new Promise((r) => setTimeout(r, 1000));
    return true;
  } catch (error) {
    console.error(`❌ 图片发送失败: ${groupName}`, error.message);
    return false;
  }
}

/**
 * 发送文本内容到指定群组
 */
async function 发送文本内容(groupName, content) {
  try {
    console.log(`📨 发送到 "${groupName}": "${content.substring(0, 30)}..."`);
    const clicked = await 点击聊天列表(groupName);
    if (!clicked) throw new Error(`无法打开聊天: ${groupName}`);
    await new Promise((r) => setTimeout(r, 800));

    const dom = 单文本发送模式获取DOM();
    if (!dom || !dom.input) throw new Error("无法获取输入框");

    dom.input.focus();
    let textInserted = false;
    try {
      document.execCommand("insertText", false, content);
      textInserted = true;
    } catch (e) {
      if (dom.input.innerText) {
        dom.input.innerText += "\n" + content;
      } else {
        dom.input.innerText = content;
      }
      dom.input.dispatchEvent(new Event("input", { bubbles: true }));
      textInserted = true;
    }
    if (!textInserted) throw new Error("输入文本失败");
    console.log("  已输入文本");

    await new Promise((r) => setTimeout(r, 200));
    const updatedDom = 单文本发送模式获取DOM();
    if (!updatedDom || !updatedDom.sendBtn) throw new Error("无法获取发送按钮");

    await 模拟真实点击(updatedDom.sendBtn);
    console.log(`✅ 发送成功: ${groupName}`);
    await new Promise((r) =>
      setTimeout(r, Math.floor(Math.random() * 201) + 100),
    );
    return true;
  } catch (error) {
    console.error(`❌ 发送失败: ${groupName}`, error.message);
    return false;
  }
}

/**
 * 发送图文内容（先图后文）
 */
async function 发送图文内容(groupName, imgBase64, text, textDelay = 1500) {
  try {
    console.log(`📷📨 发送图文（先图后文）到 "${groupName}"`);
    const imageResult = await 发送图片内容(groupName, imgBase64);
    if (!imageResult) throw new Error("图片发送失败");
    console.log(`  ⏳ 等待 ${textDelay}ms 后发送文字...`);
    await new Promise((r) => setTimeout(r, textDelay));
    const textResult = await 发送文本内容(groupName, text);
    if (!textResult) throw new Error("文字发送失败");
    console.log(`✅ 图文发送成功: ${groupName}`);
    return true;
  } catch (error) {
    console.error(`❌ 图文发送失败: ${groupName}`, error.message);
    return false;
  }
}

/**
 * 发送文本图片内容（先文后图）
 */
async function 发送文本图片内容(groupName, text, imgBase64, imageDelay = 1500) {
  try {
    console.log(`📨📷 发送文本+图片（先文后图）到 "${groupName}"`);
    const textResult = await 发送文本内容(groupName, text);
    if (!textResult) throw new Error("文字发送失败");
    console.log(`  ⏳ 等待 ${imageDelay}ms 后发送图片...`);
    await new Promise((r) => setTimeout(r, imageDelay));
    const imageResult = await 发送图片内容(groupName, imgBase64);
    if (!imageResult) throw new Error("图片发送失败");
    console.log(`✅ 文本+图片发送成功: ${groupName}`);
    return true;
  } catch (error) {
    console.error(`❌ 文本+图片发送失败: ${groupName}`, error.message);
    return false;
  }
}

/**
 * 发送图文同条（图片+描述）
 */
async function 发送图文同条(groupName, imgBase64, caption) {
  try {
    console.log(`📷📝 发送图文同条到 "${groupName}"`);
    const clicked = await 点击聊天列表(groupName);
    if (!clicked) throw new Error(`无法打开聊天: ${groupName}`);
    await new Promise((r) => setTimeout(r, 1000));

    const inputDom = getInputDom();
    if (!inputDom) throw new Error("找不到输入框");

    inputDom.focus();
    inputDom.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));

    const fileSizeKB = estimateBase64Size(imgBase64);
    console.log(`  图片大小: ${fileSizeKB.toFixed(2)}KB`);

    console.log(`  ⏳ 粘贴图片...`);
    const pasteSuccess = await pasteImageToInput(imgBase64, { timeout: 8000 });
    if (!pasteSuccess) throw new Error("图片预览未生成");

    if (caption && caption.trim()) {
      console.log(`  ⏳ 输入图片描述文字...`);
      await new Promise((r) => setTimeout(r, 300));
      document.execCommand("insertText", false, caption);
      inputDom.dispatchEvent(new Event("input", { bubbles: true }));
      console.log(`  ✅ 描述文字已输入`);
      await new Promise((r) => setTimeout(r, 300));
    }

    const sendButton = getSendButton();
    if (!sendButton) throw new Error("找不到发送按钮");

    const isDisabled =
      sendButton.hasAttribute("disabled") ||
      sendButton.getAttribute("aria-disabled") === "true";
    if (isDisabled) {
      console.log("  ⏳ 发送按钮不可用，等待激活...");
      await new Promise((r) => setTimeout(r, 500));
    }

    sendButton.click();
    console.log(`✅ 图文同条发送成功: ${groupName}`);
    await new Promise((r) => setTimeout(r, 1000));
    return true;
  } catch (error) {
    console.error(`❌ 图文同条发送失败: ${groupName}`, error.message);
    return false;
  }
}

// ==================== 浮动窗口代码 ====================
function 注入浮动窗口() {
  // 创建宿主元素并添加到body
  const host = document.createElement("div");
  host.id = "custom-floating-window-host";
  host.style.all = "initial";
  document.body.appendChild(host);

  const shadowRoot = host.attachShadow({ mode: "open" });

  const 浮动窗口 = document.createElement("div");
  浮动窗口.id = "custom-floating-window";

  const style = document.createElement("style");
  style.textContent = `
      #custom-floating-window {
        position: fixed;
        width: 310px;
        height: 100%;
        right: 0;
        top: 0px;
        background-color: #ffffff;
        border: 1px solid #cccccc;
        z-index: 99999999;
        overflow: auto;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #333333;
        resize: none;
        padding: 0;
        margin: 0;
      }

      body {
        padding-right: 320px !important; 
      }

      .telegram-app, .chat-list, .messages-container {
        max-width: calc(100% - 320px) !important; 
      }
      
      #custom-floating-window .title-bar {
        padding: 10px 15px;
        cursor: move;
        background-color: #f0f0f0;
        border-bottom: 1px solid #dddddd;
        user-select: none;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      #custom-floating-window .content-area {
        padding: 15px;
      }
      
      #custom-floating-window button {
        padding: 8px 12px;
        background-color: #0088cc;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: background-color 0.2s;
        margin-right: 8px;
      }
      
      #custom-floating-window button:hover {
        background-color: #006699;
      }
      
      #custom-floating-window button:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
      }
      
      #custom-floating-window .contact-list {
        margin-top: 15px;
        max-height: 275px;
        overflow-y: auto;
        border: 1px solid #dddddd;
        border-radius: 4px;
        padding: 5px;
        display: none;
        background-color: #fafafa;
      }
      
      #custom-floating-window .contact-item {
        display: flex;
        align-items: stretch;
        padding: 8px 10px;
        margin-bottom: 6px;
        border-radius: 4px;
        transition: all 0.2s;
        cursor: pointer;
        background-color: white;
        border: 1px solid #eeeeee;
      }
      
      #custom-floating-window .contact-item:hover {
        background-color: #f5f5f5;
      }
      
      #custom-floating-window .contact-item.selected {
        background-color: #e6f2ff;
        border-left: 3px solid #0088cc;
      }
      
      #custom-floating-window .contact-checkbox {
        width: 12px;
        height: 12px;
        margin-right: 10px;
        cursor: pointer;
        accent-color: #0088cc;
      }
      
      #custom-floating-window .contact-label {
        cursor: pointer;
        user-select: none;
        flex-grow: 1;
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      #custom-floating-window .action-buttons {
        margin: 15px 0;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        justify-content: center;
      }
      
      #custom-floating-window .action-buttons button {
        padding: 6px 10px;
        background-color: #f0f0f0;
        color: #333333;
        border: 1px solid #cccccc;
      }
      
      #custom-floating-window .action-buttons button:hover {
        background-color: #e0e0e0;
      }
      
      #custom-floating-window textarea {
        width: 100%;
        height: 100px;
        padding: 10px;
        border: 1px solid #dddddd;
        border-radius: 4px;
        resize: vertical;
        font-family: inherit;
        font-size: 14px;
        margin-top: 10px;
        box-sizing: border-box;
      }
      
      #custom-floating-window textarea:focus {
        outline: none;
        border-color: #0088cc;
        box-shadow: 0 0 0 2px rgba(0, 136, 204, 0.2);
      }
      
      #custom-floating-window #progressContainer {
        margin-top: 10px;
        display: none;
      }
      
      #custom-floating-window .progress-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
        font-size: 13px;
        color: #666666;
      }
      
      #custom-floating-window .progress-bar-container {
        height: 20px;
        background-color: #e9ecef;
        border-radius: 4px;
        overflow: hidden;
      }
      
      #custom-floating-window .progress-bar {
        height: 100%;
        width: 0%;
        background-color: #007bff;
        transition: width 0.3s ease;
      }
      
      #custom-floating-window .status-message {
        margin-top: 10px;
        padding: 8px;
        border-radius: 4px;
        font-size: 13px;
      }
      
      #custom-floating-window .status-success {
        background-color: #d4edda;
        color: #155724;
      }
      
      #custom-floating-window .status-error {
        background-color: #f8d7da;
        color: #721c24;
      }

      #custom-floating-window #dbzt {
        position: fixed;
        bottom: 0px;
        width: 310px;
        right: 0px;
        background: white;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        z-index: 999999;
      }

      #custom-floating-window .content-area {
        padding-bottom: 315px;
      }

      .Select.Send .option-group {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .Select.Send .option-item {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        border-radius: 6px;
        background-color: white;
        border: 1px solid #ddd;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 12px;
      }

      .Select.Send .option-item:hover {
        border-color: #0088cc;
      }

      .Select.Send .option-item input[type="radio"] {
        margin-right: 8px;
      }

      .Select.Send .option-item input[type="radio"]:checked {
        accent-color: #0088cc;
      }

      .send-controls {
        display: flex;
        justify-content: center;
      }

      .file-upload-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
        max-width: 600px;
        margin: 10px auto;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }

      .upload-controls {
        display: flex;
        gap: 12px;
        align-items: center;
        justify-content: space-between;
      }

      .upload-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
      }

      .upload-btn:hover {
        background-color: #0069d9;
      }

      .upload-btn svg {
        width: 14px;
        height: 14px;
      }

      #IpImg {
        display: none;
      }

      .clear-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background-color: #f8f9fa;
        color: #dc3545;
        border: 1px solid #ddd;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
      }

      .clear-btn:hover {
        background-color: #f1f1f1;
      }

      .clear-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        color: #6c757d;
      }

      .clear-btn svg {
        width: 14px;
        height: 14px;
      }

      .preview-area {
        border: 2px dashed #ddd;
        border-radius: 8px;
        padding: 5px;
        text-align: center;
        min-height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        background-color: #f9f9f9;
        display: none;
      }

      .preview-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        color: #999;
      }

      .preview-placeholder svg {
        opacity: 0.6;
      }

      .preview-placeholder p {
        margin: 0;
        font-size: 14px;
      }

      .preview-image {
        max-width: 100%;
        max-height: 200px;
        display: none;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      .preview-area.has-image .preview-placeholder {
        display: none;
      }

      .preview-area.has-image .preview-image {
        display: block;
      }
    `;

  浮动窗口.innerHTML = `
      <div class="title-bar">
        <span>WA-消息群发模块1.3.2 <span id="userName" style="color: #007bff;"></span></span>
      </div>
      <div class="content-area">
        <div class="control-panel">
          <button id="loadContactsBtn" style="width: 100%; font-size: 14px;">📋 加载未归档群组列表</button>
          <div id="contactsContainer" class="contact-list"></div>
          
          <div class="action-buttons">
            <button id="selectAllBtn">全选</button>
            <button id="invertSelectBtn">反选</button>
            <button id="clearSelectBtn">清空</button>
          </div>
          
          <div class="message-input">
            <textarea id="messageInput" placeholder="请输入要发送的消息内容..."></textarea>
  
            <div class="file-upload-container">
              <div class="upload-controls">
                <label for="IpImg" class="upload-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.9z"/>
                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                  </svg>
                  选择文件
                </label>
                <input type="file" id="IpImg" accept="image/*">
                <button id="clear-btn" type="button" class="clear-btn" disabled style="padding: 9.5px 16px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                  </svg>
                  清空
                </button>
              </div>
              
              <div class="preview-area">
                <div class="preview-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#ccc" viewBox="0 0 16 16">
                    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                    <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
                  </svg>
                  <p>图片预览区域</p>
                </div>
                <img id="preview" src="" alt="预览图" class="preview-image">
              </div>
            </div>
          </div>

          <div id="dbzt">
            <div id="dbzt-s" style="margin: 10px;">
              <div class="Select Send">
                <div class="option-group">
                  <label class="option-item">
                    <input type="radio" name="sendOption" value="default" checked>
                    <span class="option-label">默认模式</span>
                  </label>
                  <label class="option-item">
                    <input type="radio" name="sendOption" value="imageAndText">
                    <span class="option-label">图文同发</span>
                  </label>
                  <label class="option-item">
                    <input type="radio" name="sendOption" value="LeftimageAndText">
                    <span class="option-label">先图后文</span>
                  </label>
                  <label class="option-item">
                    <input type="radio" name="sendOption" value="TextAndimage">
                    <span class="option-label">先文后图</span>
                  </label>
                  <label class="option-item">
                    <input type="radio" name="sendOption" value="textOnly">
                    <span class="option-label">仅文本</span>
                  </label>
                  <label class="option-item">
                    <input type="radio" name="sendOption" value="imageOnly">
                    <span class="option-label">仅图片</span>
                  </label>
                </div>
              </div>

              <div class="send-controls">
                <button id="sendBatchBtn" style="background-color: #28a745;margin: 10px 0;width: 100%;">开始群发</button>
              </div>

              <div id="progressContainer">
                <div class="progress-info">
                  <span id="progressText">准备发送...</span>
                  <span id="progressPercent">0%</span>
                </div>
                <div class="progress-bar-container">
                  <div id="progressBar" class="progress-bar"></div>
                </div>
              </div>
    
              <div id="statusMessage" class="status-message"></div>
            </div>
          </div>
        </div>
      </div>
    `;

  shadowRoot.appendChild(style);
  shadowRoot.appendChild(浮动窗口);

  document.body.style.paddingRight = "320px";
  const app = document.getElementById("app");
  if (app) {
    app.style.maxWidth = "calc(100% - 310px)";
  }

  // ==================== 浮动窗口逻辑 ====================
  let 联系人数据 = [];
  let 当前选中联系人 = new Set();
  let fileInputImg = null;

  const fileInput = shadowRoot.getElementById("IpImg");
  const preview = shadowRoot.getElementById("preview");
  const clearBtn = shadowRoot.getElementById("clear-btn");
  const previewArea = shadowRoot.querySelector(".preview-area");
  const messageInput = shadowRoot.getElementById("messageInput");
  const progressContainer = shadowRoot.getElementById("progressContainer");
  const progressText = shadowRoot.getElementById("progressText");
  const progressPercent = shadowRoot.getElementById("progressPercent");
  const progressBar = shadowRoot.getElementById("progressBar");
  const statusMessage = shadowRoot.getElementById("statusMessage");

  function 更新状态消息(message, type = "info") {
    statusMessage.textContent = message;
    statusMessage.className = "status-message";
    if (type === "success") {
      statusMessage.classList.add("status-success");
    } else if (type === "error") {
      statusMessage.classList.add("status-error");
    }
  }

  function getSelectedSendOption() {
    const selectedOption = shadowRoot.querySelector(
      '.Select.Send input[name="sendOption"]:checked',
    );
    return selectedOption ? selectedOption.value : "default";
  }

  // 文件上传处理
  fileInput.addEventListener("change", function (e) {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        alert("请选择图片文件");
        return;
      }
      const reader = new FileReader();
      reader.onload = function (event) {
        preview.src = event.target.result;
        if (previewArea) {
          previewArea.classList.add("has-image");
          previewArea.style.display = "flex";
        } else {
          preview.style.display = "block";
        }
        if (clearBtn) {
          clearBtn.disabled = false;
        }
        fileInputImg = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // 清空按钮
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      preview.src = "";
      if (previewArea) {
        previewArea.classList.remove("has-image");
        previewArea.style.display = "none";
      } else {
        preview.style.display = "none";
      }
      fileInput.value = "";
      fileInputImg = null;
      clearBtn.disabled = true;
    });
  }

  // 粘贴图片
  messageInput.addEventListener("paste", async (e) => {
    e.preventDefault();
    const items = e.clipboardData.items;
    for (let item of items) {
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = function (event) {
          preview.src = event.target.result;
          if (previewArea) {
            previewArea.classList.add("has-image");
            previewArea.style.display = "flex";
          }
          if (clearBtn) {
            clearBtn.disabled = false;
          }
          fileInputImg = event.target.result;
          更新状态消息("已粘贴图片", "success");
        };
        reader.readAsDataURL(file);
        return;
      }
    }
    // 文本粘贴
    const text = e.clipboardData.getData("text/plain");
    const start = messageInput.selectionStart;
    const end = messageInput.selectionEnd;
    messageInput.value =
      messageInput.value.slice(0, start) + text + messageInput.value.slice(end);
    messageInput.selectionStart = messageInput.selectionEnd =
      start + text.length;
  });

  // 加载联系人
  shadowRoot
    .getElementById("loadContactsBtn")
    .addEventListener("click", async function () {
      const 加载按钮 = this;
      const contactsContainer = shadowRoot.getElementById("contactsContainer");

      try {
        加载按钮.disabled = true;
        加载按钮.textContent = "加载中...";
        contactsContainer.style.display = "block";
        contactsContainer.innerHTML =
          '<div style="padding: 20px; text-align: center;">正在加载群组列表...</div>';

        联系人数据 = await 获取未归档群组();

        if (!联系人数据 || 联系人数据.length === 0) {
          contactsContainer.innerHTML =
            '<div style="padding: 20px; text-align: center; color: #666;">没有找到任何群组</div>';
          return;
        }

        let contactsHTML = "";
        联系人数据.forEach((contact, index) => {
          const contactId = `contact-${index}`;
          const memberCount = contact.participantCount || 0;
          contactsHTML += `
          <div class="contact-item" data-contact-id="${contactId}">
            <input type="checkbox" id="${contactId}" class="contact-checkbox" value="${contact.id}">
            <label for="${contactId}" class="contact-label" title="${contact.name}">${contact.name} (${memberCount}人)</label>
          </div>
        `;
        });

        contactsContainer.innerHTML = contactsHTML;
        更新状态消息(`已加载 ${联系人数据.length} 个群组`, "success");

        const contactItems = shadowRoot.querySelectorAll(".contact-item");
        contactItems.forEach((item) => {
          const checkbox = item.querySelector(".contact-checkbox");

          item.addEventListener("click", (e) => {
            if (e.target === checkbox) return;
            checkbox.checked = !checkbox.checked;
            if (checkbox.checked) {
              item.classList.add("selected");
              当前选中联系人.add(checkbox.value);
            } else {
              item.classList.remove("selected");
              当前选中联系人.delete(checkbox.value);
            }
            更新状态消息(`已选中 ${当前选中联系人.size} 个群组`, "success");
          });

          checkbox.addEventListener("click", (e) => {
            e.stopPropagation();
            if (checkbox.checked) {
              item.classList.add("selected");
              当前选中联系人.add(checkbox.value);
            } else {
              item.classList.remove("selected");
              当前选中联系人.delete(checkbox.value);
            }
            更新状态消息(`已选中 ${当前选中联系人.size} 个群组`, "success");
          });
        });
      } catch (error) {
        console.error("加载失败:", error);
        contactsContainer.innerHTML = `
        <div class="status-error" style="padding: 15px;">
          <p>加载失败: ${error.message}</p>
        </div>
      `;
      } finally {
        加载按钮.disabled = false;
        加载按钮.textContent = "📋 加载未归档群组列表";
      }
    });

  // 全选
  shadowRoot.getElementById("selectAllBtn").addEventListener("click", () => {
    const checkboxes = shadowRoot.querySelectorAll(".contact-checkbox");
    当前选中联系人.clear();
    checkboxes.forEach((checkbox) => {
      checkbox.checked = true;
      checkbox.parentElement.classList.add("selected");
      当前选中联系人.add(checkbox.value);
    });
    更新状态消息(`已全选 ${当前选中联系人.size} 个群组`, "success");
  });

  // 反选
  shadowRoot.getElementById("invertSelectBtn").addEventListener("click", () => {
    const checkboxes = shadowRoot.querySelectorAll(".contact-checkbox");
    当前选中联系人.clear();
    checkboxes.forEach((checkbox) => {
      checkbox.checked = !checkbox.checked;
      if (checkbox.checked) {
        checkbox.parentElement.classList.add("selected");
        当前选中联系人.add(checkbox.value);
      } else {
        checkbox.parentElement.classList.remove("selected");
      }
    });
    更新状态消息(`已反选，当前选中 ${当前选中联系人.size} 个群组`, "success");
  });

  // 清空选择
  shadowRoot.getElementById("clearSelectBtn").addEventListener("click", () => {
    shadowRoot.querySelectorAll(".contact-checkbox").forEach((checkbox) => {
      checkbox.checked = false;
      checkbox.parentElement.classList.remove("selected");
    });
    当前选中联系人.clear();
    更新状态消息("已清空所有选择", "success");
  });

  // 群发消息
  shadowRoot
    .getElementById("sendBatchBtn")
    .addEventListener("click", async () => {
      const message = messageInput.value.trim();
      if (!message && !fileInputImg) {
        更新状态消息("请输入要发送的消息内容", "error");
        return;
      }
      if (当前选中联系人.size === 0) {
        更新状态消息("请至少选择一个群组", "error");
        return;
      }

      progressContainer.style.display = "block";
      progressText.textContent = `准备发送 (0/${当前选中联系人.size})`;
      progressPercent.textContent = "0%";
      progressBar.style.width = "0%";

      const 发送按钮 = shadowRoot.getElementById("sendBatchBtn");
      const 原按钮文本 = 发送按钮.textContent;
      发送按钮.disabled = true;
      发送按钮.textContent = "发送中...";

      let successCount = 0;
      let failCount = 0;
      const 所有联系人 = Array.from(当前选中联系人);
      const 总数量 = 所有联系人.length;
      const sendOption = getSelectedSendOption();

      console.log("📋 准备发送到以下群组:");
      所有联系人.forEach((id, index) => {
        const group = 联系人数据.find((g) => g.id === id);
        console.log(`  ${index + 1}. ${group?.name || id}`);
      });

      for (let i = 0; i < 总数量; i++) {
        const contactId = 所有联系人[i];
        const group = 联系人数据.find((g) => g.id === contactId);
        const groupName = group?.name || contactId;

        try {
          const progress = Math.floor(((i + 1) / 总数量) * 100);
          progressText.textContent = `发送中 (${i + 1}/${总数量}) 成功: ${successCount}, 失败: ${failCount}`;
          progressPercent.textContent = `${progress}%`;
          progressBar.style.width = `${progress}%`;
          更新状态消息("正在发送消息给" + groupName, "success");
          console.log(`\n📨 [${i + 1}/${总数量}] 正在发送到: ${groupName}`);

          // 在 switch 之前添加检查
          const hasImage = !!fileInputImg;
          const hasText = !!message;

          // 模式验证和提示
          function validateSendOption(option, hasImage, hasText) {
            const imageTextModes = [
              "imageAndText",
              "LeftimageAndText",
              "TextAndimage",
            ];

            if (imageTextModes.includes(option) && (!hasImage || !hasText)) {
              if (!hasImage && !hasText) {
                return {
                  valid: false,
                  message: "图文模式需要同时提供图片和文本，当前两者都为空",
                };
              } else if (!hasImage) {
                return {
                  valid: false,
                  message: "图文模式需要提供图片，当前只有文本",
                };
              } else if (!hasText) {
                return {
                  valid: false,
                  message: "图文模式需要提供文本，当前只有图片",
                };
              }
            }

            if (option === "textOnly" && !hasText) {
              return { valid: false, message: "仅文本模式需要提供文本内容" };
            }

            if (option === "imageOnly" && !hasImage) {
              return { valid: false, message: "仅图片模式需要提供图片" };
            }

            return { valid: true, message: "" };
          }

          // 执行验证
          const validation = validateSendOption(sendOption, hasImage, hasText);
          if (!validation.valid) {
            console.warn(`⚠️ 群发跳过: ${validation.message}`);
            更新状态消息(`跳过: ${validation.message}`, "error");

            // 恢复按钮状态
            发送按钮.disabled = false;
            发送按钮.textContent = 原按钮文本;
            progressContainer.style.display = "none";
            return;
          }

          // 原来的 switch 代码
          let sendResult = false;
          switch (sendOption) {
            case "default":
              if (hasImage && hasText) {
                console.log(`  模式: 图文同发`);
                sendResult = await 发送图文同条(
                  groupName,
                  fileInputImg,
                  message,
                );
              } else if (hasImage) {
                console.log(`  模式: 仅图片`);
                sendResult = await 发送图片内容(groupName, fileInputImg);
              } else if (hasText) {
                console.log(`  模式: 仅文本`);
                sendResult = await 发送文本内容(groupName, message);
              }
              break;

            case "imageAndText":
              // 已经过验证，这里一定有图片和文本
              console.log(`  模式: 图文同发 (强制)`);
              sendResult = await 发送图文同条(groupName, fileInputImg, message);
              break;

            case "LeftimageAndText":
              // 已经过验证，这里一定有图片和文本
              console.log(`  模式: 先图后文 (强制)`);
              sendResult = await 发送图文内容(groupName, fileInputImg, message);
              break;

            case "TextAndimage":
              // 已经过验证，这里一定有图片和文本
              console.log(`  模式: 先文后图 (强制)`);
              sendResult = await 发送文本图片内容(
                groupName,
                message,
                fileInputImg,
              );
              break;

            case "textOnly":
              // 已经过验证，这里一定有文本
              console.log(`  模式: 仅文本 (强制)`);
              sendResult = await 发送文本内容(groupName, message);
              break;

            case "imageOnly":
              // 已经过验证，这里一定有图片
              console.log(`  模式: 仅图片 (强制)`);
              sendResult = await 发送图片内容(groupName, fileInputImg);
              break;
          }

          if (sendResult) {
            successCount++;
            console.log(`  ✅ 发送成功: ${groupName}`);
          } else {
            failCount++;
            console.log(`  ❌ 发送失败: ${groupName}`);
          }

          await new Promise((resolve) =>
            setTimeout(resolve, Math.floor(Math.random() * 201) + 100),
          );
        } catch (error) {
          console.error(`  ❌ 发送给 ${groupName} 失败:`, error);
          failCount++;
        }
      }

      progressText.textContent = `发送完成 (${总数量}/${总数量}) 成功: ${successCount}, 失败: ${failCount}`;
      progressPercent.textContent = "100%";
      progressBar.style.width = "100%";

      if (failCount === 0) {
        更新状态消息(`消息已成功发送给 ${successCount} 个群组`, "success");
      } else {
        更新状态消息(
          `发送完成: 成功 ${successCount} 个, 失败 ${failCount} 个`,
          failCount === 总数量 ? "error" : "success",
        );
      }

      messageInput.value = "";
      shadowRoot.getElementById("clear-btn").click();

      发送按钮.disabled = false;
      发送按钮.textContent = 原按钮文本;
    });

  更新状态消息("已拓展群发功能", "success");
}

// 调用函数注入浮动窗口
注入浮动窗口();
