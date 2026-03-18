// ==================== WhatsApp Web 消息发送工具（智能优化版 - 带弹性处理机制）====================
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
    const selectors = [
      "footer p._aupe.copyable-text",
      'footer div[contenteditable="true"]',
      'footer .lexical-rich-text-input div[contenteditable="true"]',
      'div[role="textbox"][contenteditable="true"]',
      'footer .x1hx0egp[contenteditable="true"]',
      // 新增：针对第二份DOM中不带footer的输入框
      '.lexical-rich-text-input div[contenteditable="true"]',
      '.x1hx0egp[contenteditable="true"]',
    ];

    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el) {
        return el;
      }
    }
    return null;
  }

  function getSendButton() {
    const selectors = [
      'div[role="button"][aria-label="发送"]',
      'span[data-icon="send"]',
      'button[aria-label="发送"]',
      'div[aria-label="发送"][role="button"]',
      ".x1f6kntn", // 第二份DOM中发送按钮的类
    ];

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

  // ==================== 智能延迟计算器 ====================
  class SmartDelayCalculator {
    constructor() {
      // 基础延迟配置
      this.baseDelays = {
        afterOpenChat: 300,
        afterPaste: 200,
        afterCaption: 100,
        beforeSend: 200,
        betweenMessages: 200,
        clickInterval: 35,
        retryDelay: 300,
        progressUpdate: 150,
      };

      // 文件大小对应的延迟系数 (KB)
      this.fileSizeCoefficients = [
        { maxSize: 100, coefficient: 1.0 },
        { maxSize: 500, coefficient: 1.5 },
        { maxSize: 1024, coefficient: 2.0 },
        { maxSize: 5120, coefficient: 3.0 },
        { maxSize: 10240, coefficient: 4.0 },
        { maxSize: Infinity, coefficient: 5.0 },
      ];

      // 网络状态检测
      this.networkQuality = "good";
      this.networkSampleCount = 0;
      this.averageLoadTime = 0;
    }

    // 根据文件大小计算延迟
    calculateFileDelay(fileSizeKB) {
      for (const level of this.fileSizeCoefficients) {
        if (fileSizeKB < level.maxSize) {
          return {
            pasteDelay: Math.floor(
              this.baseDelays.afterPaste * level.coefficient,
            ),
            processDelay: Math.floor(500 * level.coefficient),
            captionDelay: Math.floor(
              this.baseDelays.afterCaption * level.coefficient,
            ),
            sendDelay: Math.floor(
              this.baseDelays.beforeSend * level.coefficient,
            ),
          };
        }
      }
      return {
        pasteDelay: this.baseDelays.afterPaste * 5,
        processDelay: 2500,
        captionDelay: this.baseDelays.afterCaption * 5,
        sendDelay: this.baseDelays.beforeSend * 5,
      };
    }

    // 估算Base64图片大小 (KB)
    estimateBase64Size(base64Data) {
      const cleanBase64 = base64Data.includes("base64,")
        ? base64Data.split("base64,")[1]
        : base64Data;
      const sizeInBytes = cleanBase64.length * 0.75;
      const sizeInKB = sizeInBytes / 1024;
      return sizeInKB;
    }

    // 记录网络状态
    recordLoadTime(loadTime) {
      this.networkSampleCount++;
      this.averageLoadTime =
        (this.averageLoadTime * (this.networkSampleCount - 1) + loadTime) /
        this.networkSampleCount;

      if (this.averageLoadTime < 200) {
        this.networkQuality = "good";
      } else if (this.averageLoadTime < 500) {
        this.networkQuality = "medium";
      } else {
        this.networkQuality = "poor";
      }
    }

    getNetworkFactor() {
      switch (this.networkQuality) {
        case "good":
          return 1.0;
        case "medium":
          return 1.5;
        case "poor":
          return 2.5;
        default:
          return 1.0;
      }
    }

    // 获取智能延迟
    getDelaysForImage(base64Data) {
      const fileSizeKB = this.estimateBase64Size(base64Data);
      const fileDelays = this.calculateFileDelay(fileSizeKB);
      const networkFactor = this.getNetworkFactor();

      console.log(
        `📊 图片大小: ${fileSizeKB.toFixed(2)}KB, 网络质量: ${this.networkQuality}, 延迟系数: ${networkFactor}`,
      );

      return {
        pasteDelay: Math.floor(fileDelays.pasteDelay * networkFactor),
        processDelay: Math.floor(fileDelays.processDelay * networkFactor),
        captionDelay: Math.floor(fileDelays.captionDelay * networkFactor),
        sendDelay: Math.floor(fileDelays.sendDelay * networkFactor),
        totalEstimatedTime: Math.floor(
          (fileDelays.pasteDelay +
            fileDelays.processDelay +
            fileDelays.captionDelay +
            fileDelays.sendDelay) *
            networkFactor,
        ),
      };
    }
  }

  // ==================== 智能消息发送核心类 ====================
  class SmartMessageSenderCore {
    constructor(modules) {
      this.modules = modules;
      this.delayCalculator = new SmartDelayCalculator();
      this.isProcessing = false;
      this.sendQueue = [];
    }

    // ========== 新增：获取正确的编辑容器 ==========
    _getEditContainer(inputDom) {
      if (!inputDom) return null;
      // 优先使用 copyable-area 类（第二份DOM中存在）
      const container = inputDom.closest('.copyable-area');
      if (container) return container;
      // 降级：向上查找包含输入框和预览的公共父级
      return inputDom.closest('[role="textbox"]')?.parentElement ||
             inputDom.closest('div[tabindex="-1"]') ||
             inputDom.closest('footer') || // 保留原逻辑，但实际可能没用
             inputDom.parentElement;
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

    // 增强的图片粘贴方法，带智能等待
    async pasteImage(base64Data, caption = "") {
      const inputDom = getInputDom();
      if (!inputDom) {
        throw new Error("找不到输入框");
      }

      const delays = this.delayCalculator.getDelaysForImage(base64Data);
      console.log(
        `⏱️ 智能延迟: 粘贴后${delays.pasteDelay}ms, 处理${delays.processDelay}ms, 发送前${delays.sendDelay}ms`,
      );

      inputDom.focus();
      inputDom.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));

      const mimeType = getMimeType(base64Data);
      const extension = getExtension(mimeType);
      const blob = base64ToBlob(base64Data, mimeType);
      const file = new File([blob], `image.${extension}`, { type: mimeType });

      const pasteStart = Date.now();
      const pasteSuccess = await this._smartPasteFile(file, delays.pasteDelay);
      const pasteTime = Date.now() - pasteStart;

      if (!pasteSuccess) {
        throw new Error("图片粘贴失败");
      }

      this.delayCalculator.recordLoadTime(pasteTime);

      console.log(`⏳ 等待图片处理: ${delays.processDelay}ms...`);
      await this.sleep(delays.processDelay);

      const imageLoaded = await this._verifyImageLoaded(inputDom);
      if (!imageLoaded) {
        console.warn("⚠️ 图片可能未完全加载，延长等待时间");
        await this.sleep(delays.processDelay);
      }

      if (caption?.trim()) {
        insertTextAtCursor(caption);
        await this.sleep(delays.captionDelay);
      }

      return true;
    }

    // 智能文件粘贴（修改为基于容器）
    async _smartPasteFile(file, timeout) {
      return new Promise((resolve) => {
        try {
          const inputDom = getInputDom();
          if (!inputDom) {
            resolve(false);
            return;
          }

          const container = this._getEditContainer(inputDom);
          const beforePreviewCount = container?.querySelectorAll('img[src*="blob:"]').length || 0;

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
              const currentContainer = this._getEditContainer(inputDom);
              const currentPreviewCount = currentContainer?.querySelectorAll('img[src*="blob:"]').length || 0;
              const hasNewPreview = currentPreviewCount > beforePreviewCount;
              const hasAnyPreview = currentContainer?.querySelector('img[src*="blob:"]') !== null;

              if (hasNewPreview || hasAnyPreview) {
                clearInterval(checkPreview);
                console.log(`✅ 图片预览已出现，等待加载完成`);
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

    // 验证图片是否已加载（修改为基于容器，增加针对第二份DOM的图片类）
    async _verifyImageLoaded(inputDom, timeout = 1500) {
      const container = this._getEditContainer(inputDom);
      if (!container) {
        console.warn("未找到编辑容器，无法验证图片");
        return false;
      }

      const startTime = Date.now();
      while (Date.now() - startTime < timeout) {
        try {
          // 通用 blob 图片
          const anyBlobImage = container.querySelector('img[src*="blob:"]');
          // 第一份DOM中的预览容器
          const previewContainer = container.querySelector(".x78zum5.x6s0dn4.xl56j7k .x1n2onr6 img");
          const attachmentImage = container.querySelector('div[role="tablist"] img[src*="blob:"]');
          // 第二份DOM中的预览容器
          const specificPreview = container.querySelector('._ak3i img[src*="blob:"]');
          const imageContainer = container.querySelector(".x1n2onr6.xsm26vf.xminmjj img");

          const foundImage = anyBlobImage || previewContainer || attachmentImage || specificPreview || imageContainer;

          if (foundImage) {
            if (foundImage.complete && foundImage.naturalHeight > 0) {
              console.log("✅ 图片预览已加载完成");
              return true;
            } else if (foundImage.src && foundImage.src.startsWith("blob:")) {
              console.log("🖼️ 图片blob URL已创建，等待加载完成");
            }
          }
        } catch (e) {}

        await this.sleep(100);
      }

      console.warn(`⚠️ 图片加载超时 (${timeout}ms)`);
      return false;
    }

    // 检查是否有待处理的图片（修改为基于容器，增加针对第二份DOM的图片类）
    _hasImagePending() {
      const inputDom = getInputDom();
      if (!inputDom) return false;
      const container = this._getEditContainer(inputDom);
      if (!container) return false;

      return (
        container.querySelector('img[src*="blob:"]') !== null ||
        container.querySelector("._ak3i img") !== null ||
        container.querySelector('[role="tablist"] img') !== null ||
        container.querySelector(".x1n2onr6.xsm26vf.xminmjj img") !== null
      );
    }

    // 智能发送
    async smartSend(options = {}) {
      const {
        text = "",
        imageBase64 = null,
        targetId = null,
        autoSend = true,
        maxRetries = 3,
        retryDelay = 1000,
        onProgress = null,
      } = options;

      let lastError;
      let attempt = 0;
      const hasImage = !!imageBase64;

      while (attempt < maxRetries) {
        try {
          attempt++;

          if (onProgress) {
            onProgress({ phase: "preparing", attempt });
          }

          if (targetId) {
            console.log(
              `📋 尝试打开聊天 (${attempt}/${maxRetries}): ${targetId}`,
            );
            const opened = await this._openChat(targetId);
            if (!opened) {
              throw new Error(`无法打开聊天: ${targetId}`);
            }
            await this.sleep(this.delayCalculator.baseDelays.afterOpenChat);
          }

          const chat = this._getCurrentChat();
          if (!chat) {
            throw new Error("未找到当前聊天");
          }

          if (hasImage) {
            if (onProgress) onProgress({ phase: "pasting_image", attempt });
            await this.pasteImage(imageBase64, text || "");
          } else if (text) {
            if (onProgress) onProgress({ phase: "sending_text", attempt });
            await this.sendText(chat, text);
          }

          if (autoSend && hasImage) {
            if (onProgress) onProgress({ phase: "triggering_send", attempt });

            await this._verifyBeforeSend();
            this.triggerSend();
            const verified = await this._verifyAfterSend();
            if (!verified) {
              console.log("ℹ️ 发送后验证未通过，但消息可能已发送");
            }
          }

          console.log(`✅ 发送成功 (尝试 ${attempt})`);
          if (onProgress) onProgress({ phase: "success", attempt });

          return true;
        } catch (error) {
          lastError = error;
          console.warn(`⚠️ 尝试 ${attempt} 失败:`, error.message);

          if (onProgress)
            onProgress({ phase: "error", attempt, error: error.message });

          if (attempt < maxRetries) {
            const waitTime = retryDelay * Math.pow(2, attempt - 1);
            console.log(`⏳ 等待 ${waitTime}ms 后重试...`);
            await this.sleep(waitTime);
          }
        }
      }

      console.error("❌ 发送失败，已达最大重试次数:", lastError);
      return false;
    }

    // 打开聊天
    async _openChat(identifier) {
      try {
        console.log(`🔍 正在尝试打开聊天: ${identifier}`);

        if (identifier.includes("@g.us")) {
          const chatInfo = await this._getChatInfoById(identifier);
          if (chatInfo && chatInfo.name) {
            const found = await this._findAndClickChatExact(chatInfo.name);
            if (found) return true;
          }
        }

        const cleanId = identifier.replace(/[^0-9]/g, "");
        const foundById = await this._findChatByPartialId(cleanId);
        if (foundById) return true;

        const found = await this._findAndClickChatExact(identifier);
        if (found) return true;

        if (window.WPP?.chat?.open) {
          try {
            window.WPP.chat.open(identifier);
            await this.sleep(500);
            return true;
          } catch (e) {
            console.log("WPP API打开失败");
          }
        }

        console.error("❌ 未找到聊天项");
        return false;
      } catch (error) {
        console.error("❌ 打开聊天失败:", error);
        return false;
      }
    }

    async _getChatInfoById(chatId) {
      try {
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
            };
          }
        }
        return null;
      } catch (error) {
        return null;
      }
    }

    async _findChatByPartialId(partialId) {
      if (!partialId || partialId.length < 5) return false;

      const chatRows = document.querySelectorAll('[role="row"]');
      for (let row of chatRows) {
        const fullText = row.textContent || "";
        const dataAttrs = Array.from(row.querySelectorAll("[data-id], [id]"))
          .map((el) => el.getAttribute("data-id") || el.id)
          .join(" ");

        if ((fullText + " " + dataAttrs).includes(partialId)) {
          const clickable = row.querySelector('[role="gridcell"]') || row;
          await this._simulateRealClick(clickable);
          return true;
        }
      }
      return false;
    }

    async _findAndClickChatExact(exactName) {
      if (!exactName) return false;

      const titleElements = document.querySelectorAll(
        'span[dir="auto"][title]',
      );
      for (let el of titleElements) {
        const title = el.getAttribute("title") || "";
        if (this._normalizeString(title) === this._normalizeString(exactName)) {
          const clickable = this._findClickableElement(el);
          if (clickable) {
            await this._simulateRealClick(clickable);
            return true;
          }
        }
      }
      return false;
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

      element.scrollIntoView({ behavior: "auto", block: "center" });
      await this.sleep(100);

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
        await this.sleep(this.delayCalculator.baseDelays.clickInterval);
      }

      element.click();
      return true;
    }

    _normalizeString(str) {
      if (!str) return "";
      return str.replace(/\s+/g, " ").trim().toLowerCase();
    }

    _getCurrentChat() {
      try {
        return this.modules.ChatCollections?.getActive();
      } catch (e) {
        return null;
      }
    }

    async _verifyBeforeSend() {
      const inputDom = getInputDom();
      const sendButton = getSendButton();

      if (!inputDom && !sendButton) {
        throw new Error("输入框或发送按钮不存在");
      }

      if (!this._hasImagePending()) {
        return true;
      }

      const container = this._getEditContainer(inputDom);
      const hasImage = container?.querySelector('img[src*="blob:"]');
      if (!hasImage) {
        console.log("ℹ️ 图片可能已被处理，继续发送...");
      }

      return true;
    }

    async _verifyAfterSend() {
      await this.sleep(800);

      const inputDom = getInputDom();
      const sendButton = getSendButton();

      const buttonDisabled = sendButton?.getAttribute("aria-disabled") === "true";
      const inputEmpty = !inputDom?.innerText?.trim();
      const imageGone = !this._hasImagePending();

      const isSuccess = (inputEmpty || imageGone) && !buttonDisabled;

      if (!isSuccess) {
        console.log("ℹ️ 发送后状态检查：", {
          inputEmpty,
          imageGone,
          buttonDisabled,
        });
      }

      return isSuccess;
    }

    triggerSend() {
      const sendButton = getSendButton();
      const inputDom = getInputDom();

      if (sendButton) {
        sendButton.click();
        return true;
      }

      if (inputDom) {
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
        return true;
      }

      return false;
    }

    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  }

  // ==================== 智能消息发送器 ====================
  class SmartMessageSender {
    constructor(modules) {
      this.modules = modules;
      this.core = new SmartMessageSenderCore(modules);
      this.groups = [];
    }

    // 获取所有群组
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
            };
          });

        this.groups = groups;
        return groups;
      } catch (error) {
        console.error("❌ 获取群组列表失败:", error);
        return [];
      }
    }

    // 增强的批量发送方法
    async smartBatchSend(messages, options = {}) {
      const {
        delay = 300,
        targetId = null,
        imageBase64 = null,
        onProgress = null,
        maxRetries = 2,
      } = options;

      if (!Array.isArray(messages) || messages.length === 0) {
        console.error("❌ 请提供要发送的消息数组");
        return;
      }

      console.log(`📦 准备智能发送 ${messages.length} 条消息`);

      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        const isFirst = i === 0;

        console.log(
          `\n📨 [${i + 1}/${messages.length}] 发送: "${msg.substring(0, 30)}..."`,
        );

        const result = await this.core.smartSend({
          text: msg,
          imageBase64: isFirst ? imageBase64 : null,
          targetId: isFirst ? targetId : null,
          autoSend: true,
          maxRetries: maxRetries,
          onProgress: (progress) => {
            if (onProgress) {
              onProgress({
                index: i,
                total: messages.length,
                ...progress,
              });
            }
          },
        });

        if (result) {
          successCount++;
        } else {
          failCount++;
        }

        if (i < messages.length - 1) {
          const waitTime = failCount > 0 ? delay * 1.5 : delay;
          await this.core.sleep(waitTime);
        }
      }

      console.log(`\n✅ 批量发送完成: 成功 ${successCount}, 失败 ${failCount}`);
      return { success: successCount, fail: failCount };
    }

    // 优化的图片发送方法
    async sendImageWithCaption(
      imageBase64,
      caption = "",
      targetId = null,
      autoSend = true,
    ) {
      const fileSize = this.core.delayCalculator.estimateBase64Size(imageBase64);
      console.log(
        `📷 准备发送图片: ${fileSize.toFixed(2)}KB${caption ? " + 文本" : ""}`,
      );

      return this.core.smartSend({
        imageBase64: imageBase64,
        text: caption,
        targetId: targetId,
        autoSend: autoSend,
        maxRetries: 3,
        onProgress: (progress) => {
          console.log(` 进度: ${progress.phase} (尝试 ${progress.attempt})`);
        },
      });
    }

    getStatus() {
      return {
        isReady: !!this.modules.SendAction,
        groupsCount: this.groups.length,
        inputDomFound: !!getInputDom(),
        sendButtonFound: !!getSendButton(),
      };
    }
  }

  // ==================== API 接口 ====================
  class WhatsAppAPI {
    constructor(sender) {
      this.sender = sender;
    }

    async smartSend(options) {
      return this.sender.core.smartSend(options);
    }

    async smartBatchSend(messages, options) {
      return this.sender.smartBatchSend(messages, options);
    }

    async sendImage(imageBase64, caption = "", targetId = null, autoSend = true) {
      return this.sender.sendImageWithCaption(
        imageBase64,
        caption,
        targetId,
        autoSend,
      );
    }

    getGroups() {
      return this.sender.getAllGroups();
    }

    getStatus() {
      return this.sender.getStatus();
    }

    showHelp() {
      console.log(`
📱 WhatsApp 智能消息发送工具 v3.0

✨ 主要特性:
  - 智能延迟计算：根据图片大小自动调整等待时间
  - 网络质量检测：自动适应网络状况
  - 弹性重试机制：智能重试失败的消息
  - 进度反馈：实时了解发送状态

📌 使用方法:

  1. 发送单条消息（自动选择模式）:
     await window.__whatsapp.smartSend({
       text: "消息内容",
       imageBase64: dataURL,  // 可选
       targetId: "群组ID",    // 可选
       autoSend: true
     })

  2. 批量发送（第一条带图片）:
     await window.__whatsapp.smartBatchSend(
       ["消息1", "消息2", "消息3"],
       {
         targetId: "群组ID",
         imageBase64: dataURL,  // 仅第一条附带
         delay: 300             // 消息间隔
       }
     )

  3. 仅发送图片:
     await window.__whatsapp.smartSendImage(dataURL, "描述", "群组ID", true)

  4. 获取群组列表:
     window.__whatsapp.getGroups()

  5. 查看状态:
     window.__whatsapp.getStatus()
      `);
    }
  }

  // ==================== 初始化 ====================
  function init() {
    console.log("🚀 正在初始化 WhatsApp 智能消息发送工具 v3.0...");

    waitForModules((modules) => {
      try {
        const sender = new SmartMessageSender(modules);
        const api = new WhatsAppAPI(sender);

        window.__whatsapp = api;

        sender.getAllGroups();

        console.log("✅ WhatsApp 智能消息发送工具初始化成功！");
        console.log("💡 输入 window.__whatsapp.showHelp() 查看帮助");

        console.log("📊 当前状态:", api.getStatus());
      } catch (error) {
        console.error("❌ 初始化失败:", error);
      }
    });
  }

  init();
})();

// ==================== 浮动窗口代码（保持不变，仅用于演示）====================
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
                sendResult = await window.__whatsapp.smartSend({
                  imageBase64: fileInputImg,
                  text: message,
                  targetId: contactId,
                  autoSend: true,
                  maxRetries: 1, // 减少重试次数
                });
              } else if (fileInputImg) {
                console.log(`  模式: 仅图片`);
                sendResult = await window.__whatsapp.smartSend({
                  imageBase64: fileInputImg,
                  targetId: contactId,
                  autoSend: true,
                  maxRetries: 1,
                });
              } else if (message) {
                console.log(`  模式: 仅文本`);
                sendResult = await window.__whatsapp.smartSend({
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
                sendResult = await window.__whatsapp.smartSend({
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
                sendResult = await window.__whatsapp.smartSend({
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
                sendResult = await window.__whatsapp.smartSend({
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
