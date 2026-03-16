// ==================== WhatsApp Web 消息发送工具（快速优化版 - 带自动打开聊天功能） ====================
// 使用方法：直接粘贴到 WhatsApp Web 控制台运行

(function () {
  "use strict";

  // ==================== 0. 初始化 API ====================
  async function initAPI() {
    try {
      window["Store"] = Object["assign"](
        {},
        window["require"]("WAWebCollections"),
      );
      window["Store"]["AppState"] =
        window["require"]("WAWebSocketModel")["Socket"];
      window["Store"]["BlockContact"] = window["require"](
        "WAWebBlockContactAction",
      );
      window["Store"]["Conn"] = window["require"]("WAWebConnModel")["Conn"];
      window["Store"]["DownloadManager"] = window["require"](
        "reganaMdaolnwoDbeWAW".split("").reverse().join(""),
      )["downloadManager"];
      window["Store"]["GroupQueryAndUpdate"] =
        window["require"]("WAWebGroupQueryJob")[
          "queryAndUpdateGroupMetadataById"
        ];
      window["Store"]["MediaPrep"] = window["require"](
        "aideMwaRperPbeWAW".split("").reverse().join(""),
      );
      window["Store"]["MediaObject"] = window["require"]("WAWebMediaStorage");
      window["Store"]["MediaTypes"] = window["require"]("WAWebMmsMediaTypes");
      window["Store"]["MediaUpload"] = window["require"](
        "WAWebMediaMmsV4Upload",
      );
      window["Store"]["MsgKey"] = window["require"](
        "yeKgsMbeWAW".split("").reverse().join(""),
      );
      window["Store"]["NumberInfo"] = window["require"]("WAPhoneUtils");
      window["Store"]["OpaqueData"] = window["require"]("WAWebMediaOpaqueData");
      window["Store"]["QueryProduct"] = window["require"](
        "egdirBgolataCtcudorPziBbeWAW".split("").reverse().join(""),
      );
      window["Store"]["QueryOrder"] = window["require"](
        "egdirBredrOziBbeWAW".split("").reverse().join(""),
      );
      window["Store"]["SendClear"] = window["require"]("WAWebChatClearBridge");
      window["Store"]["SendDelete"] = window["require"](
        "WAWebDeleteChatAction",
      );
      window["Store"]["SendMessage"] = window["require"](
        "WAWebSendMsgChatAction",
      );
      window["Store"]["EditMessage"] = window["require"](
        "WAWebSendMessageEditAction",
      );
      window["Store"]["SendSeen"] = window["require"](
        "WAWebUpdateUnreadChatAction",
      );
      window["Store"]["User"] = window["require"]("WAWebUserPrefsMeUser");
      window["Store"]["ContactMethods"] = window["require"](
        "WAWebContactGetters",
      );
      window["Store"]["UploadUtils"] = window["require"](
        "reganaMdaolpUbeWAW".split("").reverse().join(""),
      );
      window["Store"]["UserConstructor"] = window["require"](
        "diWbeWAW".split("").reverse().join(""),
      );
      window["Store"]["Validators"] = window["require"]("WALinkify");
      window["Store"]["VCard"] = window["require"]("WAWebFrontendVcardUtils");
      window["Store"]["WidFactory"] = window["require"]("WAWebWidFactory");
      window["Store"]["ProfilePic"] = window["require"](
        "egdirBbmuhTciPeliforPtcatnoCbeWAW".split("").reverse().join(""),
      );
      window["Store"]["PresenceUtils"] = window["require"](
        "noitcAtahCecneserPbeWAW".split("").reverse().join(""),
      );
      window["Store"]["ChatState"] = window["require"]("WAWebChatStateBridge");
      window["Store"]["findCommonGroups"] = window["require"](
        "WAWebFindCommonGroupsContactAction",
      )["findCommonGroups"];
      window["Store"]["StatusUtils"] = window["require"](
        "egdirBsutatStcatnoCbeWAW".split("").reverse().join(""),
      );
      window["Store"]["ConversationMsgs"] = window["require"](
        "segasseMdaoLtahCbeWAW".split("").reverse().join(""),
      );
      window["Store"]["sendReactionToMsg"] = window["require"](
        "WAWebSendReactionMsgAction",
      )["sendReactionToMsg"];
      window["Store"]["createOrUpdateReactionsModule"] = window["require"](
        "WAWebDBCreateOrUpdateReactions",
      );
      window["Store"]["EphemeralFields"] = window["require"](
        "WAWebGetEphemeralFieldsMsgActionsUtils",
      );
      window["Store"]["MsgActionChecks"] = window["require"](
        "ytilibapaCnoitcAgsMbeWAW".split("").reverse().join(""),
      );
      window["Store"]["QuotedMsg"] = window["require"](
        "slitUledoMgsMdetouQbeWAW".split("").reverse().join(""),
      );
      window["Store"]["LinkPreview"] = window["require"](
        "WAWebLinkPreviewChatAction",
      );
      window["Store"]["Socket"] = window["require"](
        "qIdneSdetacerpeDAW".split("").reverse().join(""),
      );
      window["Store"]["SocketWap"] = window["require"]("WAWap");
      window["Store"]["SearchContext"] = window["require"](
        "hcraeSegasseMtahCbeWAW".split("").reverse().join(""),
      )["getSearchContext"];
      window["Store"]["DrawerManager"] =
        window["require"]("WAWebDrawerManager")["DrawerManager"];
      window["Store"]["LidUtils"] = window["require"]("WAWebApiContact");
      window["Store"]["WidToJid"] = window["require"](
        "diJoTdiWbeWAW".split("").reverse().join(""),
      );
      window["Store"]["JidToWid"] = window["require"](
        "diWoTdiJbeWAW".split("").reverse().join(""),
      );
      window["Store"]["getMsgInfo"] = window["require"](
        "WAWebApiMessageInfoStore",
      )["queryMsgInfo"];
      window["Store"]["pinUnpinMsg"] = window["require"](
        "noitcAegasseMniPdneSbeWAW".split("").reverse().join(""),
      )["sendPinInChatMsg"];
      window["Store"]["QueryExist"] = window["require"]("WAWebQueryExistsJob")[
        "queryWidExists"
      ];
      window["Store"]["ReplyUtils"] = window["require"]("WAWebMsgReply");
      window["Store"]["Settings"] = window["require"]("WAWebUserPrefsGeneral");
      window["Store"]["BotSecret"] = window["require"](
        "terceSegasseMtoBbeWAW".split("").reverse().join(""),
      );
      window["Store"]["BotProfiles"] = window["require"](
        "WAWebBotProfileCollection",
      );
      window["Store"]["ForwardUtils"] = {
        ...window["require"]("WAWebForwardMessagesToChat"),
      };
      window["Store"]["StickerTools"] = {
        ...window["require"]("slitUegamIbeWAW".split("").reverse().join("")),
        ...window["require"]("WAWebAddWebpMetadata"),
      };
      window["Store"]["GroupUtils"] = {
        ...window["require"]("WAWebGroupCreateJob"),
        ...window["require"](
          "boJofnIyfidoMpuorGbeWAW".split("").reverse().join(""),
        ),
        ...window["require"]("WAWebExitGroupAction"),
        ...window["require"]("WAWebContactProfilePicThumbBridge"),
      };
      window["Store"]["GroupParticipants"] = {
        ...window["require"](
          "noitcApuorGstnapicitraPyfidoMbeWAW".split("").reverse().join(""),
        ),
        ...window["require"](
          "CPRstnapicitraPddAspuorGxamSAW".split("").reverse().join(""),
        ),
      };
      window["Store"]["GroupInvite"] = {
        ...window["require"]("WAWebGroupInviteJob"),
        ...window["require"]("WAWebGroupQueryJob"),
      };
      window["Store"]["GroupInviteV4"] = {
        ...window["require"]("WAWebGroupInviteV4Job"),
        ...window["require"](
          "segasseMdneStahCbeWAW".split("").reverse().join(""),
        ),
      };
      window["Store"]["MembershipRequestUtils"] = {
        ...window["require"](
          "erotStseuqeRlavorppApihsrebmeMipAbeWAW".split("").reverse().join(""),
        ),
        ...window["require"](
          "CPRnoitcAstseuqeRpihsrebmeMspuorGxamSAW"
            .split("")
            .reverse()
            .join(""),
        ),
      };

      if (
        !window["Store"]["Chat"]["_find"] ||
        !window["Store"]["Chat"]["findImpl"]
      ) {
        window["Store"]["Chat"]["_find"] = (_0x59180e) => {
          const _0x10e010 = window["Store"]["Chat"]["get"](_0x59180e);
          return _0x10e010
            ? Promise["resolve"](_0x10e010)
            : Promise["resolve"]({
                id: _0x59180e,
              });
        };
        window["Store"]["Chat"]["findImpl"] = window["Store"]["Chat"]["_find"];
      }

      console.log("✅ API 初始化成功");
      return true;
    } catch (error) {
      console.error("❌ API 初始化失败:", error);
      return false;
    }
  }

  // ==================== 1. 等待 WhatsApp 核心模块加载 ====================
  function waitForModules(callback, maxAttempts = 30) {
    let attempts = 0;

    const checkModules = async () => {
      attempts++;
      try {
        await initAPI();

        const modules = {
          SendAction: window.require
            ? window.require("WAWebSendTextMsgChatAction")
            : null,
          MsgModel: window.require ? window.require("WAWebMsgModel") : null,
          ChatCollections: window.require
            ? window.require("WAWebCollections")?.Chat
            : null,
          Store: window.Store,
        };

        if (modules.SendAction && modules.ChatCollections && modules.Store) {
          console.log("✅ WhatsApp 模块加载成功");
          callback(modules);
        } else {
          if (attempts < maxAttempts) {
            console.log(`⏳ 等待模块加载... (${attempts}/${maxAttempts})`);
            setTimeout(() => checkModules(), 1000);
          } else {
            console.error("❌ 模块加载超时，请刷新页面重试");
          }
        }
      } catch (e) {
        if (attempts < maxAttempts) {
          setTimeout(() => checkModules(), 1000);
        } else {
          console.error("❌ 模块加载失败:", e);
        }
      }
    };

    checkModules();
  }

  // ==================== 辅助函数 ====================
  function getInputDom() {
    const selectors = ["footer p._aupe.copyable-text"];

    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el) {
        return el;
      }
    }
    return null;
  }

  function getSendButton() {
    const selectors = ['div[role="button"][aria-label="发送"]'];

    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el) {
        return el;
      }
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

  function insertTextAtCursor(text) {
    const inputDom = getInputDom();
    if (!inputDom) return false;

    inputDom.focus();

    try {
      document.execCommand("insertText", false, text);
      return true;
    } catch (e) {
      if (inputDom.innerText) {
        inputDom.innerText += "\n" + text;
      } else {
        inputDom.innerText = text;
      }

      inputDom.dispatchEvent(new Event("input", { bubbles: true }));
      return true;
    }
  }

  // ==================== 优化后的消息发送核心类（快速版）====================
  class MessageSenderCore {
    constructor(modules) {
      this.modules = modules;
      // 优化后的延迟设置 - 大幅减少等待时间
      this.delays = {
        afterOpenChat: 500,      // 打开聊天后等待300ms (原1500ms)
        afterPaste: 500,         // 粘贴后等待200ms (原2000ms)
        afterCaption: 500,       // 添加描述后等待100ms (原500ms)
        beforeSend: 500,         // 发送前等待200ms (原800ms)
        betweenMessages: 500,    // 消息间隔200ms (原1000ms)
        clickInterval: 35,       // 点击事件间隔15ms (原50ms)
        retryDelay: 300,         // 重试前等待300ms (原1000ms)
        progressUpdate: 150       // 进度更新间隔50ms
      };
    }

    async sendText(chat, text) {
      if (!text?.trim()) {
        throw new Error("消息内容不能为空");
      }

      try {
        const msgData = await this.modules.SendAction.createTextMsgData(
          chat,
          text,
          {},
        );

        if (!msgData) {
          throw new Error("消息数据创建失败");
        }

        await this.modules.SendAction.addAndSendTextMsg(chat, msgData, []);
        return true;
      } catch (error) {
        console.error("发送文本失败:", error);
        throw error;
      }
    }

    async pasteImage(base64Data, caption = "") {
      const inputDom = getInputDom();
      if (!inputDom) {
        throw new Error("找不到输入框");
      }

      // 1. 聚焦输入框
      inputDom.focus();
      inputDom.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));

      // 2. 转换Base64为File对象
      const mimeType = getMimeType(base64Data);
      const extension = getExtension(mimeType);
      const blob = base64ToBlob(base64Data, mimeType);
      const file = new File([blob], `image.${extension}`, { type: mimeType });

      // 3. 粘贴图片
      const pasteSuccess = await this._pasteFile(file);
      if (!pasteSuccess) {
        throw new Error("图片粘贴失败");
      }

      // 4. 等待图片加载（优化后的短延迟）
      await this.sleep(this.delays.afterPaste);

      // 5. 添加描述文字
      if (caption?.trim()) {
        insertTextAtCursor(caption);
        await this.sleep(this.delays.afterCaption);
      }

      return true;
    }

    async _pasteFile(file) {
      return new Promise((resolve) => {
        try {
          const inputDom = getInputDom();
          if (!inputDom) {
            resolve(false);
            return;
          }

          const clipboardData = new DataTransfer();
          clipboardData.items.add(file);

          const pasteEvent = new ClipboardEvent("paste", {
            clipboardData: clipboardData,
            bubbles: true,
            cancelable: true,
          });

          inputDom.dispatchEvent(pasteEvent);

          // 减少等待时间，但确保粘贴完成
          setTimeout(() => resolve(true), 500);
        } catch (error) {
          console.error("粘贴失败:", error);
          resolve(false);
        }
      });
    }

    triggerSend() {
      const sendButton = getSendButton();
      const inputDom = getInputDom();

      if (sendButton) {
        sendButton.click();
        return true;
      }

      if (inputDom) {
        // 快速发送 - 直接触发Enter事件
        const enterEvent = new KeyboardEvent("keydown", {
          key: "Enter",
          code: "Enter",
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true,
          composed: true,
        });
        inputDom.dispatchEvent(enterEvent);

        // 无需等待keyup，直接返回
        return true;
      }

      return false;
    }

    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  }

  // ==================== 优化后的聊天窗口管理器（快速版）====================
  class ChatWindowManager {
    constructor(modules, core) {
      this.modules = modules;
      this.core = core;
    }

    async openChat(identifier) {
      try {
        console.log(`🔍 正在尝试打开聊天: ${identifier}`);

        // 策略1：如果是群组ID格式，先通过API获取聊天信息
        if (identifier.includes("@g.us")) {
          console.log("📋 检测到群组ID，尝试通过API获取聊天信息...");
          const chatInfo = await this._getChatInfoById(identifier);

          if (chatInfo) {
            console.log(`✅ 通过API获取到聊天信息:`, chatInfo);

            // 先尝试通过API直接打开
            const apiOpened = await this._openViaAPI(chatInfo);
            if (apiOpened) {
              return true;
            }

            // 如果API失败，尝试用名称精确查找
            if (chatInfo.name) {
              console.log(`📋 尝试使用名称"${chatInfo.name}"查找...`);
              const found = await this._findAndClickChatExact(chatInfo.name);
              if (found) {
                await this.core.sleep(this.core.delays.afterOpenChat);
                return true;
              }
            }
          }
        }

        // 策略2：直接通过ID查找（清理后的ID）
        console.log("📋 尝试通过清理后的ID查找...");
        const cleanId = identifier.replace(/[^0-9]/g, "");
        const foundById = await this._findChatByPartialId(cleanId);
        if (foundById) {
          await this.core.sleep(this.core.delays.afterOpenChat);
          return true;
        }

        // 策略3：精确名称匹配
        console.log("📋 尝试通过名称精确查找...");
        const found = await this._findAndClickChatExact(identifier);
        if (found) {
          await this.core.sleep(this.core.delays.afterOpenChat);
          return true;
        }

        // 策略4：尝试WPP API
        if (window.WPP?.chat?.open) {
          try {
            console.log("📋 尝试通过WPP API打开...");
            window.WPP.chat.open(identifier);
            await this.core.sleep(this.core.delays.afterOpenChat);
            return true;
          } catch (e) {
            console.log("WPP API打开失败");
          }
        }

        // 策略5：列出所有可用聊天供参考
        await this._listAvailableChats();

        console.error("❌ 未找到聊天项");
        return false;
      } catch (error) {
        console.error("❌ 打开聊天失败:", error);
        return false;
      }
    }

    async _getChatInfoById(chatId) {
      try {
        // 方法1：通过Store API获取
        if (this.modules?.ChatCollections) {
          const allChats = this.modules.ChatCollections.getModelsArray();
          const targetChat = allChats.find(
            (chat) => chat.id._serialized === chatId || chat.id === chatId,
          );

          if (targetChat) {
            return {
              id: targetChat.id._serialized || targetChat.id,
              name:
                targetChat.name ||
                targetChat.formattedTitle ||
                targetChat.formattedName,
              isGroup:
                targetChat.isGroup ||
                targetChat.id._serialized?.endsWith("@g.us"),
            };
          }
        }

        // 方法2：通过Contact API获取
        if (window.Store?.Contact?.get) {
          const contact = window.Store.Contact.get(chatId);
          if (contact) {
            return {
              id: chatId,
              name: contact.name || contact.formattedName || contact.pushname,
              isGroup: false,
            };
          }
        }

        return null;
      } catch (error) {
        console.error("获取聊天信息失败:", error);
        return null;
      }
    }

    async _openViaAPI(chatInfo) {
      try {
        // 尝试直接设置active chat
        if (this.modules?.ChatCollections) {
          const chat = this.modules.ChatCollections.get(chatInfo.id);
          if (chat) {
            this.modules.ChatCollections.setActive(chat);
            console.log("✅ 通过API设置active chat成功");
            return true;
          }
        }
        return false;
      } catch (e) {
        console.log("API打开失败:", e);
        return false;
      }
    }

    async _findChatByPartialId(partialId) {
      if (!partialId || partialId.length < 5) return false;

      console.log(`🔍 尝试通过部分ID查找: ${partialId}`);

      // 查找所有聊天项
      const chatRows = document.querySelectorAll('[role="row"]');

      for (let row of chatRows) {
        const fullText = row.textContent || "";
        const dataAttrs = Array.from(row.querySelectorAll("[data-id], [id]"))
          .map((el) => el.getAttribute("data-id") || el.id)
          .join(" ");

        const combinedText = fullText + " " + dataAttrs;

        // 如果文本中包含部分ID
        if (combinedText.includes(partialId)) {
          console.log("✅ 通过部分ID匹配成功");
          const clickable = row.querySelector('[role="gridcell"]') || row;
          await this._simulateRealClick(clickable);
          return true;
        }
      }

      return false;
    }

    async _findAndClickChatExact(exactName) {
      if (!exactName) return false;

      // 策略A：通过title属性匹配
      const titleElements = document.querySelectorAll(
        'span[dir="auto"][title]',
      );
      for (let el of titleElements) {
        const title = el.getAttribute("title") || "";
        if (title === exactName || title.includes(exactName)) {
          console.log("✅ 通过title属性匹配成功:", title);
          const clickable = this._findClickableElement(el);
          if (clickable) {
            await this._simulateRealClick(clickable);
            return true;
          }
        }
      }

      // 策略B：通过名称容器匹配
      const nameElements = document.querySelectorAll(
        '._ak8q span, .x1iyjqo2, span[dir="auto"]',
      );
      for (let el of nameElements) {
        const name = el.textContent?.trim() || el.getAttribute("title") || "";
        if (name === exactName || name.includes(exactName)) {
          console.log("✅ 通过名称容器匹配成功:", name);
          const clickable = this._findClickableElement(el);
          if (clickable) {
            await this._simulateRealClick(clickable);
            return true;
          }
        }
      }

      return false;
    }

    async _listAvailableChats() {
      console.log("📋 当前可用的聊天列表:");
      const chatRows = document.querySelectorAll('[role="row"]');

      const chats = [];
      for (let row of chatRows) {
        const nameEl = row.querySelector(
          'span[dir="auto"][title], ._ak8q span',
        );
        const name =
          nameEl?.textContent?.trim() ||
          nameEl?.getAttribute("title") ||
          "未知";
        const idAttr = row.getAttribute("data-id") || "";

        chats.push({ name, id: idAttr });
        console.log(`  - ${name} (${idAttr})`);
      }

      return chats;
    }

    _findClickableElement(element) {
      return (
        element.closest('[role="gridcell"]') ||
        element.closest('div[tabindex="0"]') ||
        element.closest('[role="row"]')
      );
    }

    async _simulateRealClick(element) {
      if (!element) return false;

      element.scrollIntoView({ behavior: "auto", block: "center" }); // 改为auto，减少动画时间
      await this.core.sleep(100); // 减少滚动等待时间

      const box = element.getBoundingClientRect();
      const x = box.left + box.width / 2;
      const y = box.top + box.height / 2;

      // 减少事件数量，只触发关键事件
      const events = [
        { type: "mousedown", buttons: 1 },
        { type: "mouseup", buttons: 0 },
        { type: "click", buttons: 0 },
      ];

      for (let i = 0; i < events.length; i++) {
        const { type, buttons } = events[i];

        const event = new MouseEvent(type, {
          view: window,
          bubbles: true,
          cancelable: true,
          clientX: x,
          clientY: y,
          screenX: x,
          screenY: y,
          buttons: buttons,
          button: 0,
          composed: true,
        });

        element.dispatchEvent(event);
        await this.core.sleep(this.core.delays.clickInterval);
      }

      element.click();
      return true;
    }

    async send(options = {}) {
      const {
        text = "",
        imageBase64 = null,
        targetId = null,
        autoSend = true,
        maxRetries = 1, // 减少重试次数，加快速度
      } = options;

      let lastError;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          // 1. 打开目标聊天
          if (targetId) {
            console.log(
              `📋 尝试打开聊天 (${attempt + 1}/${maxRetries + 1}): ${targetId}`,
            );
            const opened = await this.chatWindowManager.openChat(targetId);
            if (!opened) {
              throw new Error(`无法打开聊天: ${targetId}`);
            }
            await this.core.sleep(this.core.delays.afterOpenChat);
          }

          const chat = this.getCurrentChat();
          if (!chat) {
            throw new Error("未找到当前聊天，请先选择一个聊天");
          }

          // 2. 发送图片（如果有）
          if (imageBase64) {
            await this.core.pasteImage(imageBase64, text);
          }
          // 3. 仅发送文本（如果没有图片）
          else if (text) {
            await this.core.sendText(chat, text);
          }

          // 4. 自动发送
          if (autoSend && imageBase64) {
            await this.core.sleep(this.core.delays.beforeSend);
            this.core.triggerSend();
          }

          console.log(`✅ 发送成功 (尝试 ${attempt + 1})`);
          return true;
        } catch (error) {
          lastError = error;
          console.warn(`⚠️ 尝试 ${attempt + 1} 失败:`, error.message);

          if (attempt < maxRetries) {
            console.log(`⏳ 快速重试...`);
            await this.core.sleep(this.core.delays.retryDelay);
          }
        }
      }

      console.error("❌ 发送失败，已达最大重试次数:", lastError);
      return false;
    }
  }

  // ==================== 优化后的消息发送器 ====================
  class MessageSender {
    constructor(modules, groupManager) {
      this.modules = modules;
      this.groupManager = groupManager;
      this.core = new MessageSenderCore(modules);
      this.chatWindowManager = new ChatWindowManager(modules, this.core);
      this.currentChat = null;
      this._setupChatMonitor();
    }

    _setupChatMonitor() {
      const checkActiveChat = () => {
        try {
          const activeChat = this.modules.ChatCollections?.getActive();
          if (activeChat && activeChat.id !== this.currentChat?.id) {
            this.currentChat = activeChat;
          }
        } catch (e) {
          // ignore
        }
        setTimeout(checkActiveChat, 1000);
      };
      checkActiveChat();
    }

    getCurrentChat() {
      return this.currentChat || this.modules.ChatCollections?.getActive();
    }

    // ===== 统一发送方法 =====
    async send(options = {}) {
      const {
        text = "",
        imageBase64 = null,
        targetId = null,
        autoSend = true,
      } = options;

      try {
        // 1. 打开目标聊天
        if (targetId) {
          const opened = await this.chatWindowManager.openChat(targetId);
          if (!opened) {
            throw new Error(`无法打开聊天: ${targetId}`);
          }
          await this.core.sleep(this.core.delays.afterOpenChat);
        }

        const chat = this.getCurrentChat();
        if (!chat) {
          throw new Error("未找到当前聊天，请先选择一个聊天");
        }

        // 2. 发送图片（如果有）
        if (imageBase64) {
          await this.core.pasteImage(imageBase64, text);
        }
        // 3. 仅发送文本（如果没有图片）
        else if (text) {
          await this.core.sendText(chat, text);
        }

        // 4. 自动发送
        if (autoSend && imageBase64) {
          await this.core.sleep(this.core.delays.beforeSend);
          this.core.triggerSend();
        }

        return true;
      } catch (error) {
        console.error("发送失败:", error);
        return false;
      }
    }

    // ===== 批量发送（快速版）=====
    async sendBatch(messages, options = {}) {
      const { delay = 200, targetId = null, imageBase64 = null } = options; // 默认200ms间隔

      if (!Array.isArray(messages) || messages.length === 0) {
        console.error("❌ 请提供要发送的消息数组");
        return;
      }

      // 如果指定了目标，先打开一次
      if (targetId) {
        const opened = await this.chatWindowManager.openChat(targetId);
        if (!opened) {
          console.error("❌ 无法打开指定聊天窗口");
          return;
        }
        await this.core.sleep(this.core.delays.afterOpenChat);
      }

      console.log(`📦 准备发送 ${messages.length} 条消息，间隔 ${delay}ms`);

      for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        console.log(
          `📨 [${i + 1}/${messages.length}] 发送: "${msg.substring(0, 30)}${msg.length > 30 ? "..." : ""}"`,
        );

        const success = await this.send({
          text: msg,
          imageBase64: i === 0 ? imageBase64 : null, // 只在第一条消息附带图片
          autoSend: true,
        });

        if (!success) {
          console.error(`❌ 第 ${i + 1} 条消息发送失败，停止发送`);
          break;
        }

        if (i < messages.length - 1) {
          await this.core.sleep(delay);
        }
      }

      console.log("✅ 批量发送完成");
    }

    // ===== 保留兼容性方法 =====
    async sendMessage(text) {
      return this.send({ text, autoSend: false });
    }

    async sendToGroup(groupId, text) {
      return this.send({ text, targetId: groupId, autoSend: false });
    }

    async sendBase64Image(base64Data, caption = "", autoSend = false) {
      return this.send({
        text: caption,
        imageBase64: base64Data,
        autoSend,
      });
    }

    async sendBase64ImageToGroup(
      groupId,
      base64Data,
      caption = "",
      autoSend = false,
    ) {
      return this.send({
        text: caption,
        imageBase64: base64Data,
        targetId: groupId,
        autoSend,
      });
    }

    async sendBase64ImageBatch(
      imageDataURLs,
      captions = [],
      autoSend = false,
      delay = 200, // 默认200ms间隔
    ) {
      if (!Array.isArray(imageDataURLs) || imageDataURLs.length === 0) {
        console.error("❌ 请提供要发送的图片数组");
        return;
      }

      console.log(
        `📦 准备发送 ${imageDataURLs.length} 张图片，间隔 ${delay}ms`,
      );

      for (let i = 0; i < imageDataURLs.length; i++) {
        const caption = captions[i] || "";
        console.log(`📨 [${i + 1}/${imageDataURLs.length}] 发送图片`);

        const success = await this.sendBase64Image(
          imageDataURLs[i],
          caption,
          autoSend,
        );

        if (!success) {
          console.error(`❌ 第 ${i + 1} 张图片发送失败，停止发送`);
          break;
        }

        if (i < imageDataURLs.length - 1) {
          await this.core.sleep(delay);
        }
      }

      console.log("✅ 图片批量处理完成");
    }

    getStatus() {
      const chat = this.getCurrentChat();
      return {
        currentChat: chat
          ? {
              id: chat.id._serialized,
              name: chat.name || chat.formattedTitle,
            }
          : null,
        isReady: !!this.modules.SendAction,
        groupsCount: this.groupManager.groups.length,
        inputDomFound: !!getInputDom(),
        sendButtonFound: !!getSendButton(),
      };
    }
  }

  // ==================== 群组管理器（保持不变）====================
  class GroupManager {
    constructor(modules) {
      this.modules = modules;
      this.groups = [];
    }

    getAllGroups() {
      try {
        const allChats = this.modules.ChatCollections.getModelsArray();

        const groups = allChats
          .filter((chat) => {
            const isGroup =
              chat.id._serialized.endsWith("@g.us") || chat.isGroup === true;
            const isNotArchived = !chat.archive;
            return isGroup && isNotArchived;
          })
          .map((chat) => {
            let participantCount = 0;
            if (chat.groupMetadata && chat.groupMetadata.participants) {
              participantCount = chat.groupMetadata.participants.length;
            } else if (chat.participants) {
              participantCount = chat.participants.length;
            }

            return {
              id: chat.id._serialized,
              name: chat.name || chat.formattedTitle || "未命名群组",
              participantCount: participantCount,
              isMuted: chat.muteExpiration > 0,
              unreadCount: chat.unreadCount || 0,
              lastMessageTime: chat.t
                ? new Date(chat.t * 1000).toLocaleString()
                : null,
            };
          });

        this.groups = groups;
        return groups;
      } catch (error) {
        console.error("❌ 获取群组列表失败:", error);
        return [];
      }
    }

    searchGroups(keyword) {
      if (!keyword) return this.groups;
      const lowerKeyword = keyword.toLowerCase();
      return this.groups.filter(
        (group) =>
          group.name.toLowerCase().includes(lowerKeyword) ||
          group.id.includes(keyword),
      );
    }

    findGroupsByName(name) {
      return this.groups.filter((g) =>
        g.name.toLowerCase().includes(name.toLowerCase()),
      );
    }

    refresh() {
      return this.getAllGroups();
    }
  }

  // ==================== API 接口 ====================
  class WhatsAppAPI {
    constructor(sender, groupManager, chatWindowManager) {
      this.sender = sender;
      this.groupManager = groupManager;
      this.chatWindowManager = chatWindowManager;
    }

    // 统一发送方法（推荐使用）
    send(options) {
      return this.sender.send(options);
    }

    // 文本消息（兼容）
    sendMessage(text) {
      return this.sender.sendMessage(text);
    }

    // Base64图片（兼容）
    sendBase64Image(base64Data, caption = "", autoSend = false) {
      return this.sender.sendBase64Image(base64Data, caption, autoSend);
    }

    sendBase64ImageToGroup(
      groupId,
      base64Data,
      caption = "",
      autoSend = false,
    ) {
      return this.sender.sendBase64ImageToGroup(
        groupId,
        base64Data,
        caption,
        autoSend,
      );
    }

    sendBase64ImageBatch(
      imageDataURLs,
      captions = [],
      autoSend = false,
      delay = 200,
    ) {
      return this.sender.sendBase64ImageBatch(
        imageDataURLs,
        captions,
        autoSend,
        delay,
      );
    }

    sendBatch(messages, options) {
      return this.sender.sendBatch(messages, options);
    }

    sendToGroup(groupId, text) {
      return this.sender.sendToGroup(groupId, text);
    }

    async openChat(chatId) {
      return this.chatWindowManager.openChat(chatId);
    }

    getGroups() {
      return this.groupManager.getAllGroups();
    }

    searchGroups(keyword) {
      return this.groupManager.searchGroups(keyword);
    }

    refreshGroups() {
      return this.groupManager.refresh();
    }

    getCurrentChat() {
      return this.sender.getCurrentChat();
    }

    getStatus() {
      return this.sender.getStatus();
    }

    triggerSend() {
      return this.sender.core.triggerSend();
    }

    showHelp() {
      console.log(`
📱 WhatsApp 消息发送工具 v2.0（快速优化版）:

  优化后的延迟设置:
    afterOpenChat: 300ms    (打开聊天后等待)
    afterPaste: 200ms       (粘贴后等待)
    afterCaption: 100ms     (添加描述后等待)
    beforeSend: 200ms       (发送前等待)
    betweenMessages: 200ms  (消息间隔)

  统一发送方法（推荐）:
    send({ text: "消息", targetId: "群组ID", autoSend: true })
    send({ imageBase64: dataURL, text: "描述", targetId: "群组ID", autoSend: true })

  文本消息:
    sendMessage("消息")                    - 发送消息到当前聊天
    sendBatch(["a","b"], { delay: 200 })   - 批量发送消息（快速）
    sendToGroup("群组ID", "消息")            - 自动打开群组并发送消息

  图片消息:
    sendBase64Image(dataURL, "描述", true)  - 粘贴并自动发送
    sendBase64ImageToGroup("群组ID", dataURL, "描述", true) - 自动打开群组并发送图片

  聊天管理:
    openChat("群组ID或名称")          - 自动打开指定聊天窗口
            `);
    }
  }

  // ==================== 初始化 ====================
  function init() {
    console.log("🚀 正在初始化 WhatsApp 消息发送工具 v2.0（快速版）...");

    waitForModules((modules) => {
      try {
        const groupManager = new GroupManager(modules);
        const sender = new MessageSender(modules, groupManager);
        const chatWindowManager = sender.chatWindowManager;
        const api = new WhatsAppAPI(sender, groupManager, chatWindowManager);

        window.__whatsapp = api;

        setTimeout(() => {
          groupManager.getAllGroups();
          console.log("✅ 当前状态:", api.getStatus());
        }, 1000);

        console.log("✅ WhatsApp 消息发送工具初始化成功！");
        console.log("💡 输入 window.__whatsapp.showHelp() 查看帮助");
      } catch (error) {
        console.error("❌ 初始化失败:", error);
      }
    });
  }

  init();
})();

// ==================== 注入浮动窗口（保持不变）====================
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
        <span>WA-消息群发模块1.2 <span id="userName" style="color: #007bff;"></span></span>
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
                    <span class="option-label">图片+文本</span>
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

        if (!window.__whatsapp) {
          throw new Error("WhatsApp API 未初始化");
        }

        联系人数据 = window.__whatsapp.getGroups();

        if (联系人数据.length === 0) {
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
                console.log(`  模式: 图片+文本`);
                sendResult = await window.__whatsapp.send({
                  imageBase64: fileInputImg,
                  text: message,
                  targetId: contactId,
                  autoSend: true,
                  maxRetries: 1, // 减少重试次数
                });
              } else if (fileInputImg) {
                console.log(`  模式: 仅图片`);
                sendResult = await window.__whatsapp.send({
                  imageBase64: fileInputImg,
                  targetId: contactId,
                  autoSend: true,
                  maxRetries: 1,
                });
              } else if (message) {
                console.log(`  模式: 仅文本`);
                sendResult = await window.__whatsapp.send({
                  text: message,
                  targetId: contactId,
                  autoSend: false,
                  maxRetries: 1,
                });
              }
              break;

            case "imageAndText":
              if (fileInputImg && message) {
                console.log(`  模式: 图片+文本 (强制)`);
                sendResult = await window.__whatsapp.send({
                  imageBase64: fileInputImg,
                  text: message,
                  targetId: contactId,
                  autoSend: true,
                  maxRetries: 1,
                });
              }
              break;

            case "textOnly":
              if (message) {
                console.log(`  模式: 仅文本 (强制)`);
                sendResult = await window.__whatsapp.send({
                  text: message,
                  targetId: contactId,
                  autoSend: false,
                  maxRetries: 1,
                });
              }
              break;

            case "imageOnly":
              if (fileInputImg) {
                console.log(`  模式: 仅图片 (强制)`);
                sendResult = await window.__whatsapp.send({
                  imageBase64: fileInputImg,
                  targetId: contactId,
                  autoSend: true,
                  maxRetries: 1,
                });
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

