// 模拟真实点击事件,适用于发送按钮等需要确保事件流的场景
async function 模拟真实点击(element) {
  if (!element) return false;

  // 滚动到可视区域
  element.scrollIntoView({ behavior: "auto", block: "center" });
  await new Promise((resolve) => setTimeout(resolve, 100));

  const box = element.getBoundingClientRect();
  const x = box.left + box.width / 2;
  const y = box.top + box.height / 2;

  // 触发一系列鼠标事件模拟真实点击
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

  // 最后执行原生点击
  element.click();
  return true;
}

//这可以获取到正确的DOM结构，包含输入框、发送按钮和图片预览，适用于图片或图片加文本的发送模式
function 图片或图片加文本发送模式获取DOM() {
  // ✅ 第1步：找发送按钮（最稳锚点）
  const sendBtn = document
    .querySelector('[data-icon="wds-ic-send-filled"]')
    ?.closest('[role="button"]');

  if (!sendBtn) {
    return { ok: false, step: 1, msg: "没找到发送按钮" };
  }

  // ✅ 第2步：找输入框（往上找作用域）
  let node = sendBtn;
  let input = null;

  while (node && !input) {
    input = node.querySelector('[contenteditable="true"]');
    node = node.parentElement;
  }

  if (!input) {
    return { ok: false, step: 2, msg: "没找到输入框" };
  }

  // ✅ 第3步：找图片预览（同作用域）
  node = sendBtn;
  let image = null;

  while (node && !image) {
    image = node.querySelector("img, canvas");
    node = node.parentElement;
  }

  if (!image) {
    return { ok: false, step: 3, msg: "没找到图片预览" };
  }

  // ✅ 全部命中
  return {
    ok: true,
    sendBtn,
    input,
    image,
  };
}

//这可以获取到正确的DOM结构，包含输入框和发送按钮，但不包含图片预览，适用于单文本发送模式
function 单文本发送模式获取DOM() {
  const footer = document.querySelector("footer");
  if (!footer) return null;

  const input = footer.querySelector(
    '[contenteditable="true"][role="textbox"]',
  );

  const sendBtn = footer
    .querySelector('[data-icon="wds-ic-send-filled"]')
    ?.closest('button, [role="button"]');

  return {
    footer,
    input,
    sendBtn,
    ok: !!(input && sendBtn),
  };
}

// /**
//  * 点击聊天列表项 - 根据标题名称点击对应的聊天
//  * @param {string} chatName - 要点击的聊天名称（标题）
//  * @returns {Promise<boolean>} - 点击成功返回true，失败返回false
//  */
// // 基本用法
// await 点击聊天列表("Diamond Investment Club 🇺🇸I");

// // 或者
// 点击聊天列表("Diamond Investment Club 🇺🇸I").then(success => {
//   if (success) {
//     console.log("点击成功");
//   }
// });

// await 点击聊天列表('Diamond Investment Club 🇺🇸I')
// await 点击聊天列表('Diamond Investment Club 🇺🇸M')
// await 点击聊天列表('Diamond Investment Club 🇺🇸✈️✈️')
// await 点击聊天列表('Diamond Investment Club 🇺🇸✈️🚀')
// await 点击聊天列表('Diamond Investment Club 🇺🇸🚀')

async function 点击聊天列表(chatName) {
  // 字符串标准化函数
  function normalizeString(str) {
    if (!str) return "";
    return str.replace(/\s+/g, " ").trim().toLowerCase();
  }

  // 查找可点击的元素
  function findClickableElement(element) {
    return (
      element.closest('[role="gridcell"]') ||
      element.closest('div[tabindex="0"]') ||
      element.closest('[role="row"]') ||
      element.closest('[role="listitem"]') ||
      element.closest(".chat") ||
      element.closest('[data-testid="chat-list-item"]') ||
      element.closest("._ak8q") || // WhatsApp的聊天项类
      element.closest('[data-testid="chat-list"] [role="button"]')
    );
  }

  // 模拟真实点击事件
  async function performSimulatedClick(element) {
    if (!element) return false;

    // 滚动到可视区域
    element.scrollIntoView({ behavior: "auto", block: "center" });
    await new Promise((resolve) => setTimeout(resolve, 100));

    const box = element.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;

    // 触发一系列鼠标事件模拟真实点击
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

    // 最后执行原生点击
    element.click();
    return true;
  }

  // 主逻辑
  try {
    console.log(`🔍 正在查找聊天: "${chatName}"`);

    if (!chatName) {
      throw new Error("聊天名称不能为空");
    }

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
          await performSimulatedClick(clickable);
          console.log(`✅ 成功点击聊天: "${chatName}"`);
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
        await performSimulatedClick(item);
        console.log(`✅ 成功点击聊天: "${chatName}"`);
        return true;
      }
    }

    // 方法3: 通过部分匹配查找（用于手机号等情况）
    const cleanName = chatName.replace(/[^0-9]/g, "");
    if (cleanName.length >= 5) {
      const allRows = document.querySelectorAll('[role="row"], ._ak8q');
      for (let row of allRows) {
        const fullText = row.textContent || "";
        if (fullText.includes(cleanName)) {
          console.log(`✅ 找到聊天: "${chatName}" (通过部分ID匹配)`);
          await performSimulatedClick(row);
          console.log(`✅ 成功点击聊天: "${chatName}"`);
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

// // 基本用法
// 获取未归档群组().then(groups => {
//   console.log(`获取到 ${groups.length} 个群组`);

//   // 打印群组信息
//   groups.forEach((group, index) => {
//     console.log(`${index + 1}. ${group.name} (${group.participantCount}人)`);
//     console.log(`   ID: ${group.id}`);
//     console.log(`   未读: ${group.unreadCount}`);
//     console.log(`   置顶: ${group.pinned ? '是' : '否'}`);
//     console.log(`   静音: ${group.isMuted ? '是' : '否'}`);
//     console.log('---');
//   });
// });

// // 根据名称查找特定群组
// 获取未归档群组().then(groups => {
//   const 技术群 = groups.find(g => g.name.includes("技术"));
//   if (技术群) {
//     console.log(`找到群组: ${技术群.name}`);
//     console.log(`群组ID: ${技术群.id}`);
//   }
// });

// // 获取群组ID列表
// 获取未归档群组().then(groups => {
//   const groupIds = groups.map(g => g.id);
//   console.log("所有群组ID:", groupIds);
// });

// /**
//  * 获取未归档群组列表
//  * @returns {Promise<Array>} - 返回未归档群组数组
//  */
async function 获取未归档群组() {
  // ==================== 初始化必要的API模块 ====================
  async function initAPI() {
    try {
      // 只需要 Chat 模块
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

  // ==================== 等待模块加载 ====================
  async function waitForModules(maxAttempts = 30) {
    for (let attempts = 1; attempts <= maxAttempts; attempts++) {
      try {
        await initAPI();

        // 只检查需要的模块
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

  // ==================== 主逻辑 ====================
  try {
    console.log("🔍 正在获取未归档群组列表...");

    // 等待模块加载
    const modulesLoaded = await waitForModules();
    if (!modulesLoaded) {
      throw new Error("无法加载WhatsApp模块");
    }

    // 获取所有聊天
    const allChats = window.Store.Chat.getModelsArray();

    if (!allChats || !Array.isArray(allChats)) {
      console.error("❌ 无法获取聊天列表");
      return [];
    }

    // 筛选未归档的群组
    const groups = allChats
      .filter((chat) => {
        // 判断是否为群组（ID以 @g.us 结尾或 isGroup 为 true）
        const isGroup =
          chat.id?._serialized?.endsWith("@g.us") ||
          chat.isGroup === true ||
          chat.id?.endsWith?.("@g.us");

        // 判断是否未归档（archive 为 false 或不存在）
        const isNotArchived = !chat.archive;

        return isGroup && isNotArchived;
      })
      .map((chat) => {
        // 获取参与者数量
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

    // 按名称排序
    groups.sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));

    return groups;
  } catch (error) {
    console.error("❌ 获取未归档群组失败:", error);
    return [];
  }
}

/**
 * 发送图片内容到指定群组（完整自包含版本）
 * @param {string} groupName - 群组名称
 * @param {string} imgBase64 - 图片的 base64 数据
 * @returns {Promise<boolean>} - 发送成功返回 true
 */
async function 发送图片内容(groupName, imgBase64) {
  // ==================== 辅助函数 ====================
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

  // ==================== 点击聊天相关函数 ====================
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

    async function performSimulatedClick(element) {
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
            await performSimulatedClick(clickable);
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
          await performSimulatedClick(item);
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
            await performSimulatedClick(row);
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

  // ==================== 智能图片粘贴函数 ====================
  function _getEditContainer(inputDom) {
    if (!inputDom) return null;
    const container = inputDom.closest(".copyable-area");
    if (container) return container;
    return (
      inputDom.closest('[role="textbox"]')?.parentElement ||
      inputDom.closest('div[tabindex="-1"]') ||
      inputDom.closest("footer") ||
      inputDom.parentElement
    );
  }

  async function _smartPasteFile(file, timeout = 5000) {
    return new Promise((resolve) => {
      try {
        const inputDom = getInputDom();
        if (!inputDom) {
          resolve(false);
          return;
        }

        // 记录粘贴前的预览状态
        const beforeDom = 图片或图片加文本发送模式获取DOM();
        const hadPreviewBefore = beforeDom && beforeDom.ok && beforeDom.image;

        const clipboardData = new DataTransfer();
        clipboardData.items.add(file);

        const pasteEvent = new ClipboardEvent("paste", {
          clipboardData: clipboardData,
          bubbles: true,
          cancelable: true,
        });

        inputDom.dispatchEvent(pasteEvent);

        const checkInterval = 100;
        const maxChecks = timeout / checkInterval;
        let checks = 0;

        const checkPreview = setInterval(() => {
          try {
            // ✅ 使用 图片或图片加文本发送模式获取DOM 检测
            const currentDom = 图片或图片加文本发送模式获取DOM();
            const hasPreviewNow =
              currentDom && currentDom.ok && currentDom.image;

            // 如果之前没有预览，现在有了，说明粘贴成功
            if (!hadPreviewBefore && hasPreviewNow) {
              clearInterval(checkPreview);
              console.log(
                `✅ 图片预览已出现 (通过 图片或图片加文本发送模式获取DOM)`,
              );
              setTimeout(() => resolve(true), 500);
            }
            // 如果之前就有预览，检测是否有新的预览（通过对比图片src）
            else if (hadPreviewBefore && hasPreviewNow) {
              // 简单处理：只要有预览就认为成功
              clearInterval(checkPreview);
              console.log(`✅ 图片预览存在`);
              setTimeout(() => resolve(true), 500);
            } else if (checks++ >= maxChecks) {
              clearInterval(checkPreview);
              console.log(`ℹ️ 图片粘贴超时，但可能已成功`);
              resolve(true);
            }
          } catch (e) {
            clearInterval(checkPreview);
            resolve(true);
          }
        }, checkInterval);
      } catch (error) {
        console.error("粘贴失败:", error);
        resolve(false);
      }
    });
  }

  // _verifyImageLoaded 函数
  async function _verifyImageLoaded(timeout = 5000) {
    // 默认5秒
    const startTime = Date.now();
    const checkInterval = 100; // 100ms 检测一次

    console.log(`⏳ 开始检测图片预览，超时设置: ${timeout}ms`);

    while (Date.now() - startTime < timeout) {
      try {
        const dom = 图片或图片加文本发送模式获取DOM();
        if (dom && dom.ok && dom.image) {
          const loadTime = Date.now() - startTime;
          console.log(`✅ 图片预览已出现 (耗时: ${loadTime}ms)`);
          return true;
        }
      } catch (e) {
        // 忽略错误
      }

      await new Promise((r) => setTimeout(r, checkInterval));
    }

    console.warn(`⚠️ 图片加载超时 (${timeout}ms)`);
    return false;
  }

  // ==================== 估算图片大小 ====================
  function estimateBase64Size(base64Data) {
    const cleanBase64 = base64Data.includes("base64,")
      ? base64Data.split("base64,")[1]
      : base64Data;
    const sizeInBytes = cleanBase64.length * 0.75;
    return sizeInBytes / 1024; // 返回 KB
  }

  // ==================== 获取发送按钮 ====================
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

  // ==================== 主函数逻辑 ====================
  try {
    console.log(`📷 发送图片到 "${groupName}"`);

    // 1. 点击打开聊天
    const clicked = await 点击聊天列表(groupName);
    if (!clicked) {
      throw new Error(`无法打开聊天: ${groupName}`);
    }

    // 等待聊天界面加载
    await new Promise((r) => setTimeout(r, 1000));

    // 2. 获取输入框
    const inputDom = getInputDom();
    if (!inputDom) {
      throw new Error("找不到输入框");
    }

    // 计算图片大小并显示
    const fileSizeKB = estimateBase64Size(imgBase64);
    console.log(`📊 图片大小: ${fileSizeKB.toFixed(2)}KB`);

    // 3. 聚焦输入框
    inputDom.focus();
    inputDom.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));

    // 4. 转换并粘贴图片
    const mimeType = getMimeType(imgBase64);
    const extension = getExtension(mimeType);
    const blob = base64ToBlob(imgBase64, mimeType);
    const file = new File([blob], `image.${extension}`, { type: mimeType });

    // 根据图片大小动态调整超时时间
    const pasteTimeout = Math.min(5000 + Math.floor(fileSizeKB * 10), 15000);

    console.log(`⏳ 正在粘贴图片，超时设置: ${pasteTimeout}ms`);

    const pasteSuccess = await _smartPasteFile(file, pasteTimeout);

    if (!pasteSuccess) {
      throw new Error("图片粘贴失败");
    }

    // 5. 等待图片处理
    const processDelay = Math.min(1000 + Math.floor(fileSizeKB * 5), 5000);
    console.log(`⏳ 等待图片处理: ${processDelay}ms...`);
    await new Promise((r) => setTimeout(r, processDelay));

    // 6. 验证图片是否加载
    const imageLoaded = await _verifyImageLoaded(8000);
    if (!imageLoaded) {
      console.warn("⚠️ 图片可能未完全加载，继续尝试发送");
    }

    // 7. 获取并点击发送按钮
    const sendButton = getSendButton();
    if (!sendButton) {
      throw new Error("找不到发送按钮");
    }

    // 检查按钮是否可用
    const isDisabled =
      sendButton.hasAttribute("disabled") ||
      sendButton.getAttribute("aria-disabled") === "true";

    if (isDisabled) {
      console.log("⏳ 发送按钮不可用，等待激活...");
      await new Promise((r) => setTimeout(r, 1000));
    }

    // 点击发送
    sendButton.click();
    console.log(`✅ 图片发送成功: ${groupName}`);

    // 8. 等待发送完成
    await new Promise((r) => setTimeout(r, 1000));

    return true;
  } catch (error) {
    console.error(`❌ 图片发送失败: ${groupName}`, error.message);
    return false;
  }
}

/**
 * 发送文本内容到指定群组（简单版）
 * @param {string} groupName - 群组名称（与聊天列表显示一致）
 * @param {string} content - 要发送的文本内容
 * @returns {Promise<boolean>} - 发送成功返回 true，失败返回 false
 */
async function 发送文本内容(groupName, content) {
  try {
    console.log(`📨 发送到 "${groupName}": "${content.substring(0, 30)}..."`);

    // 1. 点击打开聊天
    const clicked = await 点击聊天列表(groupName);
    if (!clicked) {
      throw new Error(`无法打开聊天: ${groupName}`);
    }

    // 等待聊天界面加载（DOM 更新）
    await new Promise((r) => setTimeout(r, 800));

    // 2. 获取输入框
    const dom = 单文本发送模式获取DOM();
    if (!dom || !dom.input) {
      throw new Error("无法获取输入框");
    }

    // 3. 直接实现 insertTextAtCursor 的功能（内联）
    dom.input.focus();

    let textInserted = false;
    try {
      // 尝试使用 execCommand
      document.execCommand("insertText", false, content);
      textInserted = true;
    } catch (e) {
      // 降级方案：直接修改 innerText
      if (dom.input.innerText) {
        dom.input.innerText += "\n" + content;
      } else {
        dom.input.innerText = content;
      }
      dom.input.dispatchEvent(new Event("input", { bubbles: true }));
      textInserted = true;
    }

    if (!textInserted) {
      throw new Error("输入文本失败");
    }
    console.log("  已输入文本");

    // 等待 UI 更新，发送按钮变为可用
    await new Promise((r) => setTimeout(r, 200));

    // 4. 重新获取 DOM，确保发送按钮已存在
    const updatedDom = 单文本发送模式获取DOM();
    if (!updatedDom || !updatedDom.sendBtn) {
      throw new Error("无法获取发送按钮（可能输入后仍未出现）");
    }

    // 5. 点击发送
    await 模拟真实点击(updatedDom.sendBtn);
    console.log(`✅ 发送成功: ${groupName}`);

    // 6. 随机延迟 100~300ms
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
 * 估算Base64图片大小 (KB)
 * @param {string} base64Data - base64图片数据
 * @returns {number} - 图片大小(KB)
 */
function estimateBase64Size(base64Data) {
  if (!base64Data) return 0;
  const cleanBase64 = base64Data.includes("base64,")
    ? base64Data.split("base64,")[1]
    : base64Data;
  const sizeInBytes = cleanBase64.length * 0.75;
  return sizeInBytes / 1024; // 返回 KB
}

/**
 * 发送图文内容到指定群组（先发图片，后发文字）
 * @param {string} groupName - 群组名称
 * @param {string} imgBase64 - 图片的 base64 数据
 * @param {string} text - 要发送的文本内容
 * @param {number} textDelay - 图片发送后等待发送文字的延迟（默认1500ms）
 * @returns {Promise<boolean>} - 发送成功返回 true
 */
async function 发送图文内容(groupName, imgBase64, text, textDelay = 1500) {
  try {
    console.log(`📷📨 发送图文到 "${groupName}"`);

    // 估算图片大小
    const fileSizeKB = estimateBase64Size(imgBase64);
    console.log(`  图片大小: ${fileSizeKB.toFixed(2)}KB`);
    console.log(
      `  文本内容: "${text.substring(0, 30)}${text.length > 30 ? "..." : ""}"`,
    );

    // 1. 先发送图片
    console.log(`  📷 步骤1: 发送图片...`);
    const imageResult = await 发送图片内容(groupName, imgBase64);

    if (!imageResult) {
      throw new Error("图片发送失败，终止图文发送");
    }

    // 2. 等待一段时间，让图片发送完成并恢复界面
    console.log(`  ⏳ 等待 ${textDelay}ms 后发送文字...`);
    await new Promise((r) => setTimeout(r, textDelay));

    // 3. 再发送文字
    console.log(`  📨 步骤2: 发送文字...`);
    const textResult = await 发送文本内容(groupName, text);

    if (textResult) {
      console.log(`✅ 图文发送成功: ${groupName}`);
      return true;
    } else {
      throw new Error("文字发送失败");
    }
  } catch (error) {
    console.error(`❌ 图文发送失败: ${groupName}`, error.message);
    return false;
  }
}

/**
 * 发送文本+图片内容到指定群组（先发文字，后发图片）
 * @param {string} groupName - 群组名称
 * @param {string} text - 要发送的文本内容
 * @param {string} imgBase64 - 图片的 base64 数据
 * @param {number} imageDelay - 文字发送后等待发送图片的延迟（默认1500ms）
 * @returns {Promise<boolean>} - 发送成功返回 true
 */
async function 发送文本图片内容(groupName, text, imgBase64, imageDelay = 1500) {
  try {
    console.log(`📨📷 发送文本+图片到 "${groupName}"`);

    // 估算图片大小
    const fileSizeKB = estimateBase64Size(imgBase64);
    console.log(
      `  文本内容: "${text.substring(0, 30)}${text.length > 30 ? "..." : ""}"`,
    );
    console.log(`  图片大小: ${fileSizeKB.toFixed(2)}KB`);

    // 1. 先发送文字
    console.log(`  📨 步骤1: 发送文字...`);
    const textResult = await 发送文本内容(groupName, text);

    if (!textResult) {
      throw new Error("文字发送失败，终止后续发送");
    }

    // 2. 等待一段时间，让文字发送完成并恢复界面
    console.log(`  ⏳ 等待 ${imageDelay}ms 后发送图片...`);
    await new Promise((r) => setTimeout(r, imageDelay));

    // 3. 再发送图片
    console.log(`  📷 步骤2: 发送图片...`);
    const imageResult = await 发送图片内容(groupName, imgBase64);

    if (imageResult) {
      console.log(`✅ 文本+图片发送成功: ${groupName}`);
      return true;
    } else {
      throw new Error("图片发送失败");
    }
  } catch (error) {
    console.error(`❌ 文本+图片发送失败: ${groupName}`, error.message);
    return false;
  }
}

/**
 * 发送图文同条消息（图片+文字描述）
 * @param {string} groupName - 群组名称
 * @param {string} imgBase64 - 图片的 base64 数据
 * @param {string} caption - 图片描述文字
 * @returns {Promise<boolean>} - 发送成功返回 true
 */
async function 发送图文同条(groupName, imgBase64, caption) {
  // ==================== 辅助函数 ====================
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
    return sizeInBytes / 1024; // 返回 KB
  }

  function 图片或图片加文本发送模式获取DOM() {
    const sendBtn = document
      .querySelector('[data-icon="wds-ic-send-filled"]')
      ?.closest('[role="button"]');

    if (!sendBtn) {
      return { ok: false, step: 1, msg: "没找到发送按钮" };
    }

    let node = sendBtn;
    let input = null;

    while (node && !input) {
      input = node.querySelector('[contenteditable="true"]');
      node = node.parentElement;
    }

    if (!input) {
      return { ok: false, step: 2, msg: "没找到输入框" };
    }

    node = sendBtn;
    let image = null;

    while (node && !image) {
      image = node.querySelector("img, canvas");
      node = node.parentElement;
    }

    if (!image) {
      return { ok: false, step: 3, msg: "没找到图片预览" };
    }

    return {
      ok: true,
      sendBtn,
      input,
      image,
    };
  }

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

    async function performSimulatedClick(element) {
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

    try {
      console.log(`🔍 正在查找聊天: "${chatName}"`);

      if (!chatName) throw new Error("聊天名称不能为空");

      const titleElements = document.querySelectorAll(
        'span[dir="auto"][title], div[title], span[title]',
      );
      for (let el of titleElements) {
        const title = el.getAttribute("title") || "";
        if (normalizeString(title) === normalizeString(chatName)) {
          const clickable = findClickableElement(el);
          if (clickable) {
            console.log(`✅ 找到聊天: "${chatName}" (通过title属性)`);
            await performSimulatedClick(clickable);
            return true;
          }
        }
      }

      const chatItems = document.querySelectorAll(
        '[role="row"], [role="listitem"], .chat, [data-testid="chat-list-item"], ._ak8q',
      );
      for (let item of chatItems) {
        const textContent = item.textContent || "";
        if (normalizeString(textContent).includes(normalizeString(chatName))) {
          console.log(`✅ 找到聊天: "${chatName}" (通过文本内容)`);
          await performSimulatedClick(item);
          return true;
        }
      }

      const cleanName = chatName.replace(/[^0-9]/g, "");
      if (cleanName.length >= 5) {
        const allRows = document.querySelectorAll('[role="row"], ._ak8q');
        for (let row of allRows) {
          const fullText = row.textContent || "";
          if (fullText.includes(cleanName)) {
            console.log(`✅ 找到聊天: "${chatName}" (通过部分ID匹配)`);
            await performSimulatedClick(row);
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

  // ==================== 主函数逻辑 ====================
  try {
    console.log(`📷📝 发送图文同条到 "${groupName}"`);

    // 估算图片大小
    const fileSizeKB = estimateBase64Size(imgBase64);
    console.log(`  图片大小: ${fileSizeKB.toFixed(2)}KB`);
    console.log(
      `  描述文字: "${caption.substring(0, 30)}${caption.length > 30 ? "..." : ""}"`,
    );

    // 1. 点击打开聊天
    const clicked = await 点击聊天列表(groupName);
    if (!clicked) {
      throw new Error(`无法打开聊天: ${groupName}`);
    }

    // 等待聊天界面加载
    await new Promise((r) => setTimeout(r, 1000));

    // 2. 获取输入框
    const inputDom = getInputDom();
    if (!inputDom) {
      throw new Error("找不到输入框");
    }

    // 3. 聚焦输入框
    inputDom.focus();
    inputDom.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));

    // 4. 转换并粘贴图片
    const mimeType = getMimeType(imgBase64);
    const extension = getExtension(mimeType);
    const blob = base64ToBlob(imgBase64, mimeType);
    const file = new File([blob], `image.${extension}`, { type: mimeType });

    // 5. 粘贴图片
    const clipboardData = new DataTransfer();
    clipboardData.items.add(file);

    const pasteEvent = new ClipboardEvent("paste", {
      clipboardData: clipboardData,
      bubbles: true,
      cancelable: true,
    });

    inputDom.dispatchEvent(pasteEvent);
    console.log(`  ⏳ 图片已粘贴，等待预览生成...`);

    // 6. 循环检测图片预览
    let imageFound = false;
    const maxAttempts = 40; // 最多等待4秒
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 100));

      const dom = 图片或图片加文本发送模式获取DOM();
      if (dom && dom.ok && dom.image) {
        imageFound = true;
        console.log(`  ✅ 图片预览已出现 (${(i + 1) * 100}ms)`);
        break;
      }
    }

    if (!imageFound) {
      throw new Error("图片预览未生成");
    }

    // 7. 如果有文字描述，输入文字（图片预览后输入文字会自动成为图片的描述）
    if (caption && caption.trim()) {
      console.log(`  ⏳ 输入图片描述文字...`);

      // 等待一下确保图片预览稳定
      await new Promise((r) => setTimeout(r, 300));

      // 输入文字
      document.execCommand("insertText", false, caption);
      inputDom.dispatchEvent(new Event("input", { bubbles: true }));

      console.log(`  ✅ 描述文字已输入`);

      // 再等待一下让 UI 更新
      await new Promise((r) => setTimeout(r, 300));
    }

    // 8. 获取并点击发送按钮
    const sendButton = getSendButton();
    if (!sendButton) {
      throw new Error("找不到发送按钮");
    }

    // 检查按钮是否可用
    const isDisabled =
      sendButton.hasAttribute("disabled") ||
      sendButton.getAttribute("aria-disabled") === "true";

    if (isDisabled) {
      console.log("  ⏳ 发送按钮不可用，等待激活...");
      await new Promise((r) => setTimeout(r, 500));
    }

    // 点击发送
    sendButton.click();
    console.log(`✅ 图文同条发送成功: ${groupName}`);

    // 9. 等待发送完成
    await new Promise((r) => setTimeout(r, 1000));

    return true;
  } catch (error) {
    console.error(`❌ 图文同条发送失败: ${groupName}`, error.message);
    return false;
  }
}

// ==================== 浮动窗口代码====================
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
        <span>WA-消息群发模块1.3.1 <span id="userName" style="color: #007bff;"></span></span>
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

        // 等待异步获取群组
        联系人数据 = await 获取未归档群组();

        // 没有群组时显示提示
        if (!联系人数据 || 联系人数据.length === 0) {
          contactsContainer.innerHTML =
            '<div style="padding: 20px; text-align: center; color: #666;">没有找到任何群组</div>';
          return;
        }

        // 生成群组列表 HTML
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

        // 绑定事件
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
    更新状态消息("已清空所有选择");
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

      // 先显示所有待发送的群组信息
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

          console.log(`\n📨 [${i + 1}/${总数量}] 正在发送到: ${groupName}`);

          let sendResult = false;

          switch (sendOption) {
            case "default":
              if (fileInputImg && message) {
                console.log(`  模式: 图文同发`);
                sendResult = await 发送图文同条(
                  groupName,
                  fileInputImg,
                  message,
                );
              } else if (fileInputImg) {
                console.log(`  模式: 仅图片 `);
                sendResult = await 发送图片内容(groupName, fileInputImg);
              } else if (message) {
                console.log(`  模式: 仅文本`);
                sendResult = await 发送文本内容(groupName, message);
              }
              break;

            case "imageAndText":
              if (fileInputImg && message) {
                console.log(`  模式: 图文同发 (强制)`);
                sendResult = await 发送图文同条(
                  groupName,
                  fileInputImg,
                  message,
                );
              }
              break;

            case "LeftimageAndText":
              if (fileInputImg && message) {
                console.log(`  模式: 先图后文 (强制)`);
                sendResult = await 发送图文内容(
                  groupName,
                  fileInputImg,
                  message,
                );
              }
              break;

            case "TextAndimage":
              if (fileInputImg && message) {
                console.log(`  模式: 先文后图 (强制)`);
                sendResult = await 发送文本图片内容(
                  groupName,
                  message,
                  fileInputImg,
                );
              }
              break;

            case "textOnly":
              if (message) {
                console.log(`  模式: 仅文本 (强制)`);
                sendResult = await 发送文本内容(groupName, message);
              }
              break;

            case "imageOnly":
              if (fileInputImg) {
                console.log(`  模式: 仅图片 (强制)`);
                //要发送的图片消息内容
                sendResult = await 发送图片内容(groupName, fileInputImg);
              }
              break;
          }

          if (sendResult) {
            successCount++;
            console.log(`  ✅ 发送成功: ${groupName}`);
          } else {
            failCount++;
            console.log(`  ❌ 发送失败: ${groupName}`);
          }

          // 快速随机延迟 (100-300ms)
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
          failCount === 总数量 ? "error" : "warning",
        );
      }

      // 显示失败列表
      if (failCount > 0) {
        console.log("❌ 发送失败的群组:");
        所有联系人.forEach((id, index) => {
          // 这里需要记录失败的具体ID
        });
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
