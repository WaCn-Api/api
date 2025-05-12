//模拟点击
async function 模拟点击(element, { scale = 1.05, duration = 300 } = {}) {
  if (!element) {
    console.error("无法点击: 元素不存在");
    return;
  }

  try {
    // 模拟完整的点击过程
    const events = ["mousedown", "mouseup", "click"];
    events.forEach((eventType) => {
      element.dispatchEvent(
        new MouseEvent(eventType, {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
    });

    // 添加视觉反馈
    element.style.transition = `all ${duration}ms`;
    element.style.transform = `scale(${scale})`;

    // 移除这一行，避免重复触发
    // element.click();

    // 恢复原始状态
    await new Promise((resolve) => {
      setTimeout(() => {
        element.style.transform = "";
        resolve();
      }, duration);
    });

    return true;
  } catch (error) {
    console.error("模拟点击失败:", error);
    return false;
  }
}

// 跳转聊天窗口
async function 跳转聊天窗口(item) {
  try {
    // 获取href属性值
    const href = item;
    if (!href) throw new Error("找不到href属性");

    // 通过修改location.hash来触发路由变化
    window.location.hash = href.replace("#", "");
    console.log("跳转到聊天窗口:", href);

    return true;
  } catch (error) {
    console.error("跳转聊天窗口失败:", error);
    return false;
  }
}

async function 模拟发送(msg, id) {
  // 获取输入框元素
  // const inputContainer = document.querySelector('.input-message-container');
  // const input = inputContainer.querySelector('.input-message-input');
  // const placeholder = inputContainer.querySelector('.input-field-placeholder');

  // 定位输入框（主输入区域）
  const input = document.querySelector(
    '.input-message-input[contenteditable="true"][data-peer-id="' +
      id.replace("#", "") +
      '"]'
  );

  // 检测输入框是否可用
  function 检测输入框可用() {
    // 检查contenteditable属性
    const isEditable = input.getAttribute("contenteditable") === "true";
    return isEditable;
  }

  // 如果输入框不可用
  if (!检测输入框可用()) {
    console.error("无法发送消息: 输入框不可用或聊天未开始");
    return false;
  }

  // console.log(msg)

  try {
    // 设置消息内容
    input.textContent = msg;

    // 触发输入事件
    const event = new Event("input", { bubbles: true });
    input.dispatchEvent(event);

    // console.log(input.textContent, 'input.textContent.value')

    // 确保发送按钮可用
    const sendButton = document.querySelector(".btn-send");
    if (!sendButton || sendButton.disabled) {
      console.error("无法发送消息: 发送按钮不可用");
      return false;
    }

    // 点击发送按钮
    sendButton.click();

    // 等待消息发送完成（可根据需要调整延迟）
    await new Promise((resolve) => setTimeout(resolve, 300));
    input.textContent = "";
    return true;
  } catch (error) {
    console.error("模拟发送失败:", error);
    return false;
  }
}

async function 模拟发送图片(图片数据, id) {
  async function 随机延迟(min = 10, max = 50) {
    await new Promise((resolve) =>
      setTimeout(resolve, min + Math.random() * (max - min))
    );
  }

  try {
    // 1. 点击附件按钮
    const attachBtn = document.querySelector(
      ".btn-icon.btn-menu-toggle.attach-file"
    );
    if (!attachBtn) throw new Error("找不到附件按钮");
    模拟点击(attachBtn);
    await 随机延迟(100, 200);

    // 2. 点击图片视频选项
    const photoVideoItem = [
      ...document.querySelectorAll(".btn-menu-item-text"),
    ].find((el) => el.textContent.trim() === "Photo or Video");
    if (!photoVideoItem) throw new Error("找不到图片/视频选项");
    模拟点击(photoVideoItem);
    await 随机延迟(100, 200);

    // 3. 获取文件输入框并替换文件
    const fileInput = document.querySelector('input[type="file"]');
    if (!fileInput) throw new Error("找不到文件输入框");

    const dataTransfer = new DataTransfer();
    if (图片数据 instanceof File || 图片数据 instanceof Blob) {
      dataTransfer.items.add(图片数据);
    } else if (typeof 图片数据 === "string") {
      const blob = await (await fetch(图片数据)).blob();
      dataTransfer.items.add(
        new File([blob], "image.png", { type: blob.type })
      );
    } else {
      throw new Error("不支持的图片数据格式");
    }

    fileInput.files = dataTransfer.files;
    fileInput.dispatchEvent(new Event("change", { bubbles: true }));
    fileInput.blur(); // 移除焦点

    console.log("图片已成功替换并触发上传");
    await 随机延迟(100, 200);

    // 4. 点击发送按钮
    const sendBtn = [
      ...document.querySelectorAll(".btn-primary.btn-color-primary"),
    ].find((btn) => btn.querySelector(".i18n")?.textContent.trim() === "Send");
    if (!sendBtn) throw new Error("找不到发送按钮");
    模拟点击(sendBtn);

    // 5. 确保文件选择框关闭
    await 随机延迟(100, 200);
    document.body.click(); // 点击空白处关闭
    const closeBtn = document.querySelector(".btn-menu-close, .btn-cancel");
    if (closeBtn) 模拟点击(closeBtn);
    return true;
  } catch (error) {
    console.error("模拟失败:", error);
    return false;
  }
}

async function 模拟发送文本加图片(图片数据, 文本消息, id) {
  async function 随机延迟(min = 10, max = 50) {
    await new Promise((resolve) =>
      setTimeout(resolve, min + Math.random() * (max - min))
    );
  }

  try {
    // 1. 点击附件按钮
    const attachBtn = document.querySelector(
      ".btn-icon.btn-menu-toggle.attach-file"
    );
    if (!attachBtn) throw new Error("找不到附件按钮");
    模拟点击(attachBtn);
    await 随机延迟(100, 200);

    // 2. 点击图片视频选项
    const photoVideoItem = [
      ...document.querySelectorAll(".btn-menu-item-text"),
    ].find((el) => el.textContent.trim() === "Photo or Video");
    if (!photoVideoItem) throw new Error("找不到图片/视频选项");
    模拟点击(photoVideoItem);
    await 随机延迟(100, 200);

    // 3. 获取文件输入框并替换文件
    const fileInput = document.querySelector('input[type="file"]');
    if (!fileInput) throw new Error("找不到文件输入框");

    const dataTransfer = new DataTransfer();
    if (图片数据 instanceof File || 图片数据 instanceof Blob) {
      dataTransfer.items.add(图片数据);
    } else if (typeof 图片数据 === "string") {
      const blob = await (await fetch(图片数据)).blob();
      dataTransfer.items.add(
        new File([blob], "image.png", { type: blob.type })
      );
    } else {
      throw new Error("不支持的图片数据格式");
    }

    fileInput.files = dataTransfer.files;
    fileInput.dispatchEvent(new Event("change", { bubbles: true }));
    fileInput.blur(); // 移除焦点

    console.log("图片已成功替换并触发上传");
    await 随机延迟(100, 200);

    const input = document.querySelectorAll(
      '.input-message-input[contenteditable="true"]'
    )[2];
    input.textContent = 文本消息;
    // 触发输入事件
    const event = new Event("input", { bubbles: true });
    input.dispatchEvent(event);

    await 随机延迟(100, 200);
    // 4. 点击发送按钮
    const sendBtn = [
      ...document.querySelectorAll(".btn-primary.btn-color-primary"),
    ].find((btn) => btn.querySelector(".i18n")?.textContent.trim() === "Send");
    if (!sendBtn) throw new Error("找不到发送按钮");
    模拟点击(sendBtn);

    // 5. 确保文件选择框关闭
    await 随机延迟(100, 200);
    document.body.click(); // 点击空白处关闭
    const closeBtn = document.querySelector(".btn-menu-close, .btn-cancel");
    if (closeBtn) 模拟点击(closeBtn);
    return true;
  } catch (error) {
    console.error("模拟失败:", error);
    return false;
  }
}

async function 模拟发送先文本后图片() {}

async function 模拟发送先图片后文本() {}

async function 删除联系人(contact) {
  console.log("删除联系人:", contact);
  try {
    // 1. 首先确保联系人在可视区域内
    const scrollableDiv = document.querySelector(
      'div.scrollable.scrollable-y.tabs-tab.chatlist-parts.active[data-filter-id="0"]'
    );
    if (!scrollableDiv) throw new Error("找不到滚动容器");

    // 先滚动到顶部
    scrollableDiv.scrollTop = 0;
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 查找联系人函数
    async function 查找联系人() {
      // 获取当前可见的所有联系人
      const visibleContacts = scrollableDiv.querySelectorAll(
        "ul.chatlist > a.row"
      );

      // 通过href查找联系人
      for (let item of visibleContacts) {
        const itemHref = item.getAttribute("href");

        // 使用href精确匹配
        if (itemHref === contact.href) {
          console.log("找到联系人:", contact.title, contact.href);
          contact.item = item;
          return true;
        }
      }

      // 如果当前页面没找到，继续滚动
      const previousScrollTop = scrollableDiv.scrollTop;
      const scrollDistance = Math.min(scrollableDiv.clientHeight * 2, 500);
      scrollableDiv.scrollTop += scrollDistance;

      // 等待滚动完成
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 检查是否还能继续滚动
      if (scrollableDiv.scrollTop === previousScrollTop) {
        console.log("已滚动到底部仍未找到联系人");
        return false;
      }

      // 递归继续查找
      return await 查找联系人();
    }

    // 开始查找联系人
    const found = await 查找联系人();
    if (!found) {
      throw new Error(`无法找到联系人: ${contact.title} (${contact.href})`);
    }

    // 等待菜单出现
    await new Promise((resolve) => setTimeout(resolve, 200));

    // 1. 右键点击联系人
    const event = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    contact.item.dispatchEvent(event);

    // 等待菜单出现
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 2. 点击删除群组按钮
    const deleteBtn = [
      ...document.querySelectorAll(".btn-menu-item.rp-overflow.danger"),
    ].find(
      (btn) => btn.querySelector(".i18n")?.textContent.trim() === "Delete Chat"
    );
    if (!deleteBtn) throw new Error("找不到删除群组按钮");
    await 模拟点击(deleteBtn);

    // 等待确认框出现
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 3. 点击"为所有成员删除"复选框
    const checkbox = document.querySelector(
      ".checkbox-field.checkbox-ripple.hover-effect.rp"
    );
    if (checkbox) {
      await 模拟点击(checkbox);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    // 4. 点击确认删除按钮
    const confirmBtn = [
      ...document.querySelectorAll(".popup-button.btn.danger"),
    ].find(
      (btn) => btn.querySelector(".i18n")?.textContent.trim() === "Delete chat"
    );
    if (!confirmBtn) throw new Error("找不到确认删除按钮");
    await 模拟点击(confirmBtn);

    return true;
  } catch (error) {
    console.error("删除联系人失败:", error);
    return false;
  }
}

async function 获取联系人列表() {
  const scrollableDiv = document.querySelector(
    'div.scrollable.scrollable-y.tabs-tab.chatlist-parts.active[data-filter-id="0"]'
  );
  const collectedChats = new Set();

  // 定义需要屏蔽的联系人列表
  const 屏蔽联系人 = ["Saved Messages", "Telegram"];

  // 记录上一次收集到的数量
  let previousCount = 0;
  let noNewItemsCount = 0;

  async function scrollAndCollect() {
    if (!scrollableDiv) throw new Error("找不到滚动容器");

    // 保存当前滚动位置和高度
    const previousScrollTop = scrollableDiv.scrollTop;
    const previousScrollHeight = scrollableDiv.scrollHeight;

    // 收集当前可见的联系人数据
    collectChatData();

    // 检查是否有新增联系人
    const currentCount = collectedChats.size;
    console.log(`当前已收集: ${currentCount} 个联系人`);

    if (currentCount === previousCount) {
      noNewItemsCount++;
      // 如果连续3次没有新增联系人，可能已到达底部
      if (noNewItemsCount >= 3) {
        console.log("似乎已到达列表底部");
        return;
      }
    } else {
      noNewItemsCount = 0;
      previousCount = currentCount;
    }

    // 计算滚动距离，确保滚动足够远
    const scrollDistance = Math.max(scrollableDiv.clientHeight * 2, 1000);

    // 执行滚动
    scrollableDiv.scrollTop = previousScrollTop + scrollDistance;

    // 等待DOM更新和新内容加载
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 检查是否真正滚动了
    if (scrollableDiv.scrollTop === previousScrollTop) {
      console.log("无法继续滚动，可能已到达底部");
      // 尝试最后一次滚动到真正的底部
      scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
      await new Promise((resolve) => setTimeout(resolve, 500));
      collectChatData();
      return;
    }

    // 继续下一轮滚动
    await scrollAndCollect();
  }

  function collectChatData() {
    scrollableDiv.querySelectorAll("ul.chatlist > a.row").forEach((item) => {
      const title =
        item["dialogDom"]?.["titleSpan"]?.textContent ||
        item.querySelector(".title span")?.textContent ||
        "无标题";

      // 检查是否在屏蔽列表中
      if (!屏蔽联系人.includes(title)) {
        const href = item.getAttribute("href");

        // 检查是否已存在同名联系人
        const existingContact = Array.from(collectedChats).find(
          (chat) => chat.title === title
        );

        if (existingContact) {
          // 如果存在同名联系人,检查href是否相同
          if (existingContact.href !== href) {
            // href不同,说明是不同的联系人,使用标题和href来去重
            const uniqueKey = `${title} (${href})`;
            const exists = Array.from(collectedChats).some(
              (chat) => chat.title === uniqueKey
            );

            if (!exists) {
              // 加上href后缀来区分不同的联系人
              collectedChats.add({ title: uniqueKey, item, href });
              console.log(`添加重名但不同href的联系人: ${uniqueKey}`);
            } else {
              console.log(`跳过重复联系人: ${uniqueKey}`);
            }
          } else {
            // href相同,完全重复,跳过
            console.log(`跳过完全重复的联系人: ${title}`);
          }
        } else {
          // 不存在同名联系人,直接添加
          collectedChats.add({ title, item, href });
          console.log(`添加新联系人: ${title}`);
        }
      }
    });
  }

  try {
    // 确保滚动到顶部开始
    scrollableDiv.scrollTop = 0;
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 开始滚动收集
    await scrollAndCollect();

    // 最后再滚动到顶部
    scrollableDiv.scrollTop = 0;

    console.log("完成联系人收集，总数:", collectedChats.size);
    return Array.from(collectedChats);
  } catch (error) {
    console.error("获取联系人列表失败:", error);
    throw error;
  }
}

// 联系人数据存储
let 联系人数据 = [];
let 当前选中联系人 = new Set();

function 注入浮动窗口() {
  // 先检查是否已存在浮动窗口
  if (document.getElementById("custom-floating-window-host")) {
    console.log("浮动窗口已存在，跳过注入");
    return;
  }

  // 创建宿主元素并添加到body
  const host = document.createElement("div");
  host.id = "custom-floating-window-host";
  host.style.all = "initial"; // 重置所有样式
  document.body.appendChild(host);

  // 创建 Shadow Root 隔离样式
  const shadowRoot = host.attachShadow({ mode: "open" });

  // 创建浮动窗口主容器
  const 浮动窗口 = document.createElement("div");
  浮动窗口.id = "custom-floating-window";

  // 创建样式元素
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
        /* border-radius: 8px; */
        /* box-shadow: 0 4px 12px rgb(0 0 0 / 15%); */
        z-index: 99999999;
        overflow: auto;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        color: #333333;
        resize: none;
        padding: 0;
        margin: 0;
        
      }
      

      body {
        padding-right: 320px !important; 
      }

      
      .telegram-app {
        max-width: calc(100% - 320px) !important; 
      }


      .chat-list, .messages-container {
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
        padding: 8px 8px;
        background-color: #0088cc;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: background-color 0.2s;
        
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
      
      #custom-floating-window .contact-item.selected .contact-label {
        font-weight: bold;
        color: #006699;
      }
      
      #custom-floating-window .action-buttons {
        margin: 15px 0;
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        align-items: center;
        justify-content: space-between;
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
      
      #custom-floating-window .close-btn {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #666666;
        padding: 0;
        margin: 0;
      }
      
      .Select.Send {
        // padding: 12px;
        border-radius: 8px;
        // background-color: #f5f5f5;
        margin: 10px 0;
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
  
      .Select.Send .option-item input[type="radio"]:checked + .option-label {
        color: #0088cc;
        font-weight: bold;
        
      }
  
      .Select.Send .option-item input[type="radio"]:checked {
        accent-color: #0088cc;
      }
  
      .send-controls{
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
  
      /* 当有图片时隐藏占位符 */
      .preview-area.has-image .preview-placeholder {
        display: none;
      }
  
      .preview-area.has-image .preview-image {
        display: block;
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

      /* 为了防止内容被固定的元素遮挡，需要给 content-area 添加底部内边距 */
      #custom-floating-window .content-area {
        padding-bottom: 315px;
      }
  
  
    `;

  // 构建窗口HTML结构
  浮动窗口.innerHTML = `
      <div class="title-bar">
        <span>TG-消息群发模块1.5</span>
        <!--<button class="close-btn">&times;</button>-->
      </div>
      <div class="content-area">
        <div class="control-panel">
          <button id="loadContactsBtn" style="width: 100%; font-size: 14px;">📋 加载未归档消息列表</button>
          <div id="contactsContainer" class="contact-list"></div>
          
          <div class="action-buttons">
            <button id="selectAllBtn">全选</button>
            <button id="invertSelectBtn">反选</button>
            <button id="clearSelectBtn">清空</button>
            <button id="sclxr">删除选中联系人</button>
          </div>
          
          <div class="message-input">
            <textarea id="messageInput" placeholder="请输入要发送的消息内容..."></textarea></br>
  
            <div class="file-upload-container">
              <div class="upload-controls">
                <label for="IpImg" class="upload-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                  </svg>
                  选择文件
                </label>
                <input type="file" id="IpImg" accept="image/jpeg, image/png, image/bmp, image/webp, image/avif, image/gif, video/mp4, video/webm">
                <button id="clear-btn" type="button" class="clear-btn" disabled  style="padding: 9.5px 16px;" >
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
                    <span class="option-label">默认模式(有啥发啥，同时有图片和文本会同时发送，具体哪个先发出去取决于网络)</span>
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

  // 将样式和浮动窗口添加到Shadow DOM
  shadowRoot.appendChild(style);
  shadowRoot.appendChild(浮动窗口);

  // 辅助函数：更新状态消息
  function 更新状态消息(message, type = "info") {
    const statusElement = shadowRoot.getElementById("statusMessage");
    statusElement.textContent = message;
    statusElement.className = "status-message";

    if (type === "success") {
      statusElement.classList.add("status-success");
    } else if (type === "error") {
      statusElement.classList.add("status-error");
    }
  }

  更新状态消息(`已拓展群发功能.`, "success");

  // 添加这一行来确保主界面不被遮挡
  document.body.style.paddingRight = "320px";

  const fileInput = shadowRoot.getElementById("IpImg");
  const preview = shadowRoot.getElementById("preview");
  const clearBtn = shadowRoot.getElementById("clear-btn");
  const previewArea = shadowRoot.querySelector(".preview-area");

  let fileInputImg;

  fileInput.addEventListener("change", function (e) {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];

      // 检查文件类型
      if (!file.type.startsWith("image/")) {
        alert("请选择图片文件");
        return;
      }

      // 创建FileReader读取文件
      const reader = new FileReader();

      reader.onload = function (event) {
        // 使用Data URL预览
        preview.src = event.target.result;

        // 显示预览并更新UI状态
        if (previewArea) {
          previewArea.classList.add("has-image");
          previewArea.style.display = "flex";
        } else {
          preview.style.display = "block";
        }

        if (clearBtn) {
          clearBtn.disabled = false;
        }

        // 存储图片数据
        fileInputImg = event.target.result;
        // console.log('图片数据已加载:', file);
      };

      reader.onerror = function () {
        console.error("文件读取失败");
        if (clearBtn) clearBtn.disabled = true;
      };

      reader.readAsDataURL(file);

      // 同时创建Blob URL备用
      const blobUrl = URL.createObjectURL(file);
      // console.log('Blob URL创建:', blobUrl);
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      // 重置预览
      preview.src = "";
      if (previewArea) {
        previewArea.classList.remove("has-image");
        previewArea.style.display = "none";
      } else {
        preview.style.display = "none";
      }

      // 重置文件输入
      fileInput.value = "";

      // 清除存储的图片数据
      fileInputImg = null;

      // 释放Blob URL内存
      if (preview.src.startsWith("blob:")) {
        URL.revokeObjectURL(preview.src);
      }

      // 禁用清除按钮
      if (clearBtn) {
        clearBtn.disabled = true;
      }
    });

    // 初始状态禁用清除按钮
    clearBtn.disabled = true;
  }

  //输入框被点击
  shadowRoot.getElementById("messageInput").addEventListener("click", () => {
    //让飞机输入框不可用
    let dx = document.querySelector(
      '.input-message-input[style*="height: 37px;"]'
    );
    if (dx) {
      dx.contentEditable = false; // 禁用编辑
    }
  });

  // 监听焦点消失事件
  shadowRoot.getElementById("messageInput").addEventListener("blur", () => {
    // 让飞机输入框不可用
    document.querySelector(
      '.input-message-input[style*="height: 37px;"]'
    ).contentEditable = true;
  });

  // 在浮动窗口HTML结构中,找到textarea元素,添加paste事件监听
  shadowRoot
    .getElementById("messageInput")
    .addEventListener("paste", async (e) => {
      //让飞机输入框不可用
      document.querySelector(
        '.input-message-input[style*="height: 37px;"]'
      ).contentEditable = false;

      console.log("粘贴事件被触发了");
      e.preventDefault(); // 阻止默认粘贴行为
      e.stopPropagation(); // 阻止事件冒泡

      // 获取剪贴板数据
      const items = e.clipboardData.items;

      for (let item of items) {
        // 检查是否是图片
        if (item.type.indexOf("image") !== -1) {
          // 获取图片文件
          const file = item.getAsFile();

          // 创建FileReader读取文件
          const reader = new FileReader();

          reader.onload = function (event) {
            // 使用Data URL预览
            const preview = shadowRoot.getElementById("preview");
            const previewArea = shadowRoot.querySelector(".preview-area");
            const clearBtn = shadowRoot.getElementById("clear-btn");

            preview.src = event.target.result;

            // 显示预览并更新UI状态
            if (previewArea) {
              previewArea.classList.add("has-image");
              previewArea.style.display = "flex";
            } else {
              preview.style.display = "block";
            }

            if (clearBtn) {
              clearBtn.disabled = false;
            }

            // 存储图片数据
            fileInputImg = event.target.result;

            // 提示用户
            更新状态消息("已粘贴图片,可以发送了", "success");
          };

          reader.onerror = function () {
            console.error("图片读取失败");
            更新状态消息("图片读取失败", "error");
          };

          reader.readAsDataURL(file);
          return;
        }
      }

      // 如果没有图片,执行普通文本粘贴
      const text = e.clipboardData.getData("text/plain");
      // const text = e.clipboardData.getData('text/html') || e.clipboardData.getData('text/plain');
      const messageInput = shadowRoot.getElementById("messageInput");
      const start = messageInput.selectionStart;
      const end = messageInput.selectionEnd;
      const value = messageInput.value;

      messageInput.value = value.slice(0, start) + text + value.slice(end);
      messageInput.selectionStart = messageInput.selectionEnd =
        start + text.length;
    });

  // 加载联系人按钮功能
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
          '<div style="padding: 20px; text-align: center;">正在加载联系人列表，请稍候...</div>';

        // 获取联系人数据
        联系人数据 = await 获取联系人列表();
        console.log("联系人数据:", 联系人数据);

        if (联系人数据.length === 0) {
          contactsContainer.innerHTML =
            '<div style="padding: 20px; text-align: center; color: #666;">没有找到任何联系人</div>';
          return;
        }

        // 渲染联系人列表
        let contactsHTML = "";
        联系人数据.forEach((contact, index) => {
          // 使用href作为联系人的唯一标识
          const contactId = `contact-${index}-${contact.href.replace(
            /[^a-z0-9]/gi,
            "_"
          )}`;
          contactsHTML += `
    <div class="contact-item" data-contact-id="${contactId}" data-href="${contact.href}">
      <input type="checkbox" id="${contactId}" class="contact-checkbox" data-href="${contact.href}" value="${contact.title}">
      <label for="${contactId}" class="contact-label" data-href="${contact.href}" title="${contact.title}">${contact.title}</label>
    </div>
  `;
        });

        contactsContainer.innerHTML = contactsHTML;

        更新状态消息(
          `已加载 ` + 联系人数据.length + ` 个联系人数据`,
          "success"
        );

        // 添加联系人选择事件
        const contactItems = shadowRoot.querySelectorAll(".contact-item");
        contactItems.forEach((item) => {
          const checkbox = item.querySelector(".contact-checkbox");

          item.addEventListener("click", (e) => {
            // 如果点击的是复选框本身，不处理
            if (e.target === checkbox) return;

            // 判断是否按下了Ctrl或Shift键
            const 是多选模式 = e.ctrlKey || e.shiftKey;

            if (!是多选模式) {
              // 单选模式 - 先取消所有选择
              shadowRoot.querySelectorAll(".contact-checkbox").forEach((cb) => {
                cb.checked = false;
                cb.parentElement.classList.remove("selected");
              });
              当前选中联系人.clear();
            }

            // 切换当前项的选择状态
            checkbox.checked = !checkbox.checked;

            // 更新UI状态
            if (checkbox.checked) {
              item.classList.add("selected");
              当前选中联系人.add({
                title: checkbox.value,
                href: checkbox.dataset.href,
              });
              更新状态消息(
                `已选中 ` + 当前选中联系人.size + ` 个联系人`,
                "success"
              );
            } else {
              item.classList.remove("selected");
              // 遍历Set查找要删除的项
              for (let existingContact of 当前选中联系人) {
                if (existingContact.href === checkbox.dataset.href) {
                  当前选中联系人.delete(existingContact);
                  break;
                }
              }
              更新状态消息(
                `已选中 ` + 当前选中联系人.size + ` 个联系人`,
                "success"
              );
            }
          });

          // 处理复选框直接点击
          checkbox.addEventListener("click", (e) => {
            e.stopPropagation();

            if (checkbox.checked) {
              item.classList.add("selected");
              当前选中联系人.add({
                title: checkbox.value,
                href: checkbox.dataset.href,
              });
              更新状态消息(
                `已选中 ` + 当前选中联系人.size + ` 个联系人`,
                "success"
              );
            } else {
              item.classList.remove("selected");
              // 遍历Set查找要删除的项
              for (let existingContact of 当前选中联系人) {
                if (existingContact.href === checkbox.dataset.href) {
                  当前选中联系人.delete(existingContact);
                  break;
                }
              }
              更新状态消息(
                `已选中 ` + 当前选中联系人.size + ` 个联系人`,
                "success"
              );
            }
          });
        });
      } catch (error) {
        console.error("加载联系人失败:", error);
        contactsContainer.innerHTML = `
          <div class="status-error" style="padding: 15px;">
            <p>加载联系人失败: ${error.message}</p>
            <button onclick="location.reload()" style="margin-top: 10px;">刷新页面重试</button>
          </div>
        `;
      } finally {
        加载按钮.disabled = false;
        加载按钮.textContent = "📋 加载联系人列表";
      }
    });

  // 全选按钮
  shadowRoot.getElementById("selectAllBtn").addEventListener("click", () => {
    const checkboxes = shadowRoot.querySelectorAll(".contact-checkbox");
    当前选中联系人.clear();

    checkboxes.forEach((checkbox) => {
      checkbox.checked = true;
      checkbox.parentElement.classList.add("selected");
      当前选中联系人.add({
        title: checkbox.value,
        href: checkbox.dataset.href,
      });
    });

    更新状态消息(`已全选 ` + 当前选中联系人.size + ` 个联系人`, "success");
  });

  // 反选按钮
  shadowRoot.getElementById("invertSelectBtn").addEventListener("click", () => {
    const checkboxes = shadowRoot.querySelectorAll(".contact-checkbox");
    当前选中联系人.clear();

    checkboxes.forEach((checkbox) => {
      checkbox.checked = !checkbox.checked;

      if (checkbox.checked) {
        checkbox.parentElement.classList.add("selected");
        当前选中联系人.add({
          title: checkbox.value,
          href: checkbox.dataset.href,
        });
      } else {
        checkbox.parentElement.classList.remove("selected");
      }
    });

    更新状态消息(
      `已反选，当前选中 ` + 当前选中联系人.size + ` 个联系人`,
      "success"
    );
  });

  // 清空按钮
  shadowRoot.getElementById("clearSelectBtn").addEventListener("click", () => {
    shadowRoot.querySelectorAll(".contact-checkbox").forEach((checkbox) => {
      checkbox.checked = false;
      checkbox.parentElement.classList.remove("selected");
    });

    当前选中联系人.clear();
    更新状态消息("已清空所有选择");
  });

  // 删除联系人按钮事件处理
  shadowRoot.getElementById("sclxr").addEventListener("click", async () => {
    if (当前选中联系人.size === 0) {
      更新状态消息("请至少选择一个要删除的联系人", "error");
      return;
    }

    // 确认是否删除
    if (
      !confirm(
        `确定要删除选中的 ${当前选中联系人.size} 个联系人吗？此操作不可恢复！`
      )
    ) {
      return;
    }

    const deleteBtn = shadowRoot.getElementById("sclxr");
    const originalText = deleteBtn.textContent;
    deleteBtn.disabled = true;
    deleteBtn.textContent = "删除中...";

    let successCount = 0;
    let failCount = 0;

    try {
      const 所有选中联系人 = Array.from(当前选中联系人);

      console.log("所有选中联系人:", 所有选中联系人);

      for (const contactInfo of 所有选中联系人) {
        // 通过href匹配联系人
        const contact = 联系人数据.find((c) => c.href === contactInfo.href);

        if (!contact) {
          console.error(
            `未找到联系人: ${contactInfo.title} (${contactInfo.href})`
          );
          failCount++;
          continue;
        }

        try {
          // 执行删除操作
          const result = await 删除联系人(contact);
          await new Promise((resolve) => setTimeout(resolve, 100));

          if (result) {
            successCount++;

            // 从联系人数据中移除
            联系人数据 = 联系人数据.filter((c) => c.href !== contact.href);

            // 从当前选中集合中移除
            当前选中联系人.delete(contactInfo);

            // 从DOM中移除对应元素
            const contactElement = shadowRoot.querySelector(
              `.contact-item[data-href="${contact.href}"]`
            );
            if (contactElement) {
              contactElement.remove();
            }
          } else {
            failCount++;
          }

          // 随机延迟避免操作过快
          await new Promise((resolve) =>
            setTimeout(resolve, Math.floor(Math.random() * 300) + 200)
          );
        } catch (error) {
          console.error(`删除联系人 ${contactInfo.title} 失败:`, error);
          failCount++;
        }
      }

      if (failCount === 0) {
        更新状态消息(`成功删除 ${successCount} 个联系人`, "success");
      } else {
        更新状态消息(
          `删除完成: 成功 ${successCount} 个, 失败 ${failCount} 个`,
          "warning"
        );
      }
    } catch (error) {
      console.error("批量删除联系人失败:", error);
      更新状态消息("批量删除联系人失败: " + error.message, "error");
    } finally {
      deleteBtn.disabled = false;
      deleteBtn.textContent = originalText;
    }
  });

  // 获取当前选中的发送选项
  function getSelectedSendOption() {
    const selectedOption = shadowRoot.querySelector(
      '.Select.Send input[name="sendOption"]:checked'
    );
    return selectedOption ? selectedOption.value : "default";
  }

  // 监听选项变化
  shadowRoot
    .querySelectorAll('.Select.Send input[name="sendOption"]')
    .forEach((radio) => {
      radio.addEventListener("change", function () {
        // console.log('当前选中:', this.value);
        // console.log(getSelectedSendOption());
        // 这里可以添加选项变化时的处理逻辑
      });
    });

  // 群发消息按钮
  shadowRoot
    .getElementById("sendBatchBtn")
    .addEventListener("click", async () => {
      //让飞机输入框可用
      let dx = document.querySelector(
        '.input-message-input[style*="height: 37px;"]'
      );
      if (dx) {
        dx.contentEditable = true; // 禁用编辑
      }

      const messageInput = shadowRoot.getElementById("messageInput");
      const message = messageInput.value.trim();

      if (!message && !fileInputImg) {
        更新状态消息("请输入要发送的消息内容", "error");
        return;
      }

      if (当前选中联系人.size === 0) {
        更新状态消息("请至少选择一个联系人", "error");
        return;
      }

      const progressContainer = shadowRoot.getElementById("progressContainer");
      const progressText = shadowRoot.getElementById("progressText");
      const progressPercent = shadowRoot.getElementById("progressPercent");
      const progressBar = shadowRoot.getElementById("progressBar");

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

      console.log("当前选中联系人:", 当前选中联系人);
      console.log("所有联系人:", 所有联系人);

      for (let i = 0; i < 总数量; i++) {
        // 在群发消息的循环中
        const contactName = 所有联系人[i];
        // 使用href查找联系人
        const contact = 联系人数据.find((c) => c.href === contactName.href);

        if (!contact) {
          console.error(
            `未找到联系人: ${contactName.title} (${contactName.href})`
          );
          failCount++;
          continue;
        }

        try {
          // 更新进度显示
          const progress = Math.floor(((i + 1) / 总数量) * 100);
          progressText.textContent = `发送中 (${
            i + 1
          }/${总数量}) 成功: ${successCount}, 失败: ${failCount}`;
          progressPercent.textContent = `${progress}%`;
          progressBar.style.width = `${progress}%`;

          // 1. 首先确保联系人在可视区域内
          const scrollableDiv = document.querySelector(
            'div.scrollable.scrollable-y.tabs-tab.chatlist-parts.active[data-filter-id="0"]'
          );
          if (!scrollableDiv) throw new Error("找不到滚动容器");

          // 先滚动到顶部
          scrollableDiv.scrollTop = 0;
          await new Promise((resolve) => setTimeout(resolve, 200));

          async function 查找联系人() {
            // 获取当前可见的所有联系人
            const visibleContacts = scrollableDiv.querySelectorAll(
              "ul.chatlist > a.row"
            );

            // 遍历查找匹配的联系人
            for (let item of visibleContacts) {
              const itemHref = item.getAttribute("href");

              // 使用href进行匹配
              if (itemHref === contact.href) {
                console.log("找到目标联系人:", contact.title);
                contact.item = item; // 更新contact的item为当前找到的DOM元素
                return true;
              }
            }

            // 如果当前页面没找到,继续滚动
            const previousScrollTop = scrollableDiv.scrollTop;
            const scrollDistance = Math.min(
              scrollableDiv.clientHeight * 2,
              500
            );
            scrollableDiv.scrollTop += scrollDistance;

            // 等待滚动完成
            await new Promise((resolve) => setTimeout(resolve, 200));

            // 检查是否还能继续滚动
            if (scrollableDiv.scrollTop === previousScrollTop) {
              console.log("已滚动到底部仍未找到联系人");
              return false;
            }

            // 递归继续查找
            return await 查找联系人();
          }

          // 开始查找联系人
          const found = await 查找联系人();
          if (!found) {
            throw new Error(`无法找到联系人: ${contact.title}`);
          }

          // 等待菜单出现
          await new Promise((resolve) => setTimeout(resolve, 200));

          await 跳转聊天窗口(contact.href);

          await 模拟点击(contact.item);

          let sendResult = false;
          const sendOptionItem = getSelectedSendOption();

          // 等待输入框准备就绪
          await new Promise((resolve) => setTimeout(resolve, 500));

          // 尝试查找滚动到底部按钮
          const goDownButton = document.querySelector(
            "button.bubbles-go-down.chat-secondary-button.btn-circle"
          );

          if (goDownButton) {
            console.log("找到了滚动到底部按钮");
            await 模拟点击(goDownButton);
          } else {
            console.log("没找到滚动到底部按钮");
          }

          try {
            switch (sendOptionItem) {
              case "default":
                if (fileInputImg && message) {
                  sendResult = await 模拟发送图片(fileInputImg, contact.href);
                  if (sendResult) {
                    sendResult = await 模拟发送(message, contact.href);
                  }
                } else if (fileInputImg) {
                  sendResult = await 模拟发送图片(fileInputImg, contact.href);
                } else if (message) {
                  sendResult = await 模拟发送(message, contact.href);
                }
                break;

              case "imageAndText":
                if (fileInputImg && message) {
                  sendResult = await 模拟发送文本加图片(
                    fileInputImg,
                    message,
                    contact.href
                  );
                }
                break;

              case "textOnly":
                if (message) {
                  sendResult = await 模拟发送(message, contact.href);
                }
                break;

              case "imageOnly":
                if (fileInputImg) {
                  sendResult = await 模拟发送图片(fileInputImg, contact.href);
                }
                break;
            }

            if (sendResult) {
              successCount++;
            } else {
              failCount++;
            }
          } catch (error) {
            console.error(`发送消息失败:`, error);
            failCount++;
          }

          // 随机延迟
          await new Promise((resolve) =>
            setTimeout(resolve, Math.floor(Math.random() * 511) + 409)
          );
        } catch (error) {
          console.error(`处理联系人 ${contactName} 失败:`, error);
          failCount++;
        }
      }

      // 完成后的处理
      progressText.textContent = `发送完成 (${总数量}/${总数量}) 成功: ${successCount}, 失败: ${failCount}`;
      progressPercent.textContent = "100%";
      progressBar.style.width = "100%";

      发送按钮.disabled = false;
      发送按钮.textContent = 原按钮文本;

      if (failCount === 0) {
        更新状态消息(`消息已成功发送给 ${successCount} 个联系人`, "success");
      } else {
        更新状态消息(
          `发送完成: 成功 ${successCount} 个, 失败 ${failCount} 个`,
          failCount === 总数量 ? "error" : "warning"
        );
      }

      messageInput.value = "";
      shadowRoot.getElementById("clear-btn").click(); // 清空预览和图片数据
    });
}

// 调用函数注入浮动窗口
注入浮动窗口();
