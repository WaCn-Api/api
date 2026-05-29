// ✅ 版本号：修改这里即可，无需在代码里逐处查找
const WA_VERSIONS = "v6.0.1";

// 图片出现就要改变布局
const observer = new MutationObserver(() => {
  const overlay = document.querySelector(".overlay");
  if (overlay && !overlay.style.width) {
    overlay.style.width = "calc(100% - 309px)";
    console.log("已修改 .overlay 宽度");
  }
});
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

//改变whatsapp布局
document
  .getElementById("app")
  .setAttribute("style", "width: calc(100% - 309px);");

async function 注入控制面板(WA_VERSION) {
  // 创建宿主元素并添加到body
  const host = document.createElement("div");
  host.id = "custom-floating-window-host";
  host.style.all = "initial";
  document.body.appendChild(host);

  const shadowRoot = host.attachShadow({ mode: "open" });

  window._shadowRoot = shadowRoot; // ✅ 加这行,全局可用

  const 控制面板 = document.createElement("div");
  控制面板.id = "custom-floating-window";

  const style = document.createElement("style");
  style.textContent = `
      #custom-floating-window {
        position: fixed;
        width: 310px;
        height: 100%;
        right: 0;
        top: 0px;
        background-color: #ffffff;
        border: 1px solid #28a745;
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

      /* ===== 定时发送样式 ===== */
      .sched-card {
        background:#fafafa;
        border:1px solid #eee;
        border-radius:6px;
        padding:8px 10px;
        margin-bottom:6px;
        position:relative;
      }
      .sched-card.running {
        border-left:3px solid #4CAF50;
        background:#f1f8e9;
      }
      .sched-card .card-delay {
        font-size:11px;
        color:#ff9800;
        font-weight:bold;
        margin-bottom:3px;
      }
      .sched-card .card-text {
        font-size:12px;
        color:#333;
        white-space:pre-wrap;
        word-break:break-all;
        max-height:48px;
        overflow:hidden;
        line-height:1.4;
      }
      .sched-card .card-actions {
        display:flex;
        gap:4px;
        margin-top:6px;
        justify-content:flex-end;
      }
      .sched-card .card-actions button {
        font-size:11px;
        padding:3px 7px;
        border-radius:3px;
        border:1px solid #ddd;
        background:#fff;
        cursor:pointer;
        color:#555;
        margin:0;
        line-height:1.4;
      }
      .sched-card .card-actions button:disabled {
        opacity:.4;
        cursor:not-allowed;
      }
      .sched-card .card-actions .del-btn { color:#f44336; border-color:#ffcdd2; }
      .sched-card .card-actions .edit-btn { color:#2196F3; border-color:#bbdefb; }
    `;

  控制面板.innerHTML = `
      <div class="title-bar" style="background-color: #28a745; color: white;">
        <span>WA-消息群发模块(群组报表) ${WA_VERSION} <span id="userName" style="color: #007bff;"></span></span>
      </div>
      <div class="content-area">
        <div class="control-panel">
          <button id="分离当前页面" style="width: 100%;    font-size: 14px;    background-color: #cc0000;    margin-bottom: 10px;">分离当前页面</button>
          <button id="loadGroupsBtn" style="width: 100%;    font-size: 14px;    background-color: #cc0000;    margin-bottom: 10px;">采集未归档群组数据</button>
          <button id="loadContactsBtn" style="width: 100%; font-size: 14px;">加载未归档群组列表</button>
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
                <button id="scheduleOpenBtn" style="background-color:#ff9800;margin: 10px 0 10px 5px;width:100%;">⏰ 定时发送管理</button>
              </div>

              <!-- 👇 点赞功能按钮 -->
              <div style="margin: 0 0 10px 0; padding: 0 0 10px 0; border-bottom: 1px solid #eee;">
                <button id="reactionPanelToggleBtn" style="width:100%;background:#9c27b0;font-size:13px;margin-bottom:6px;">👍 点赞面板</button>
                <button id="translateToggleBtn" style="width:100%;background:#1a73e8;font-size:13px;">🌐 开启自动翻译</button>
              </div>
              <!-- 👆 点赞功能按钮结束 -->
              <!-- 👇 回复功能按钮 -->
              <div style="margin: 0 0 10px 0; padding: 0 0 10px 0; border-bottom: 1px solid #eee;">
                <button id="replyPanelToggleBtn" style="width:100%;background:#00897b;font-size:13px;margin:0;">↩️ 回复面板</button>
              </div>
              <!-- 👆 回复功能按钮结束 -->

              <!-- 👇 在这里添加客户标记控制按钮 -->
              <div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 4px;">
                <div style="display: flex; gap: 10px; justify-content: center;">
                  <button id="customerMarkToggleBtn" class="is-off">⭐ 开启客户标记</button>
                  <button id="clearDataBtn">清除数据</button>
                </div>
              </div>
              <!-- 👆 客户标记控制按钮结束 -->


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

      <!-- 👍 点赞面板抽屉 -->
      <div id="reactionDrawer" style="
        display:none;
        position:fixed;
        right:310px;
        top:0;
        width:300px;
        height:100%;
        background:#fff;
        border:1px solid #9c27b0;
        z-index:999999998;
        overflow:hidden;
        flex-direction:column;
        box-shadow:-4px 0 16px rgba(0,0,0,.18);
        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
        font-size:13px;
      ">
        <!-- 标题栏 -->
        <div style="background:#9c27b0;color:#fff;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <span style="font-weight:bold;font-size:14px;">👍 点赞面板</span>
          <button id="reactionCloseBtn" style="background:transparent;border:none;color:#fff;font-size:18px;cursor:pointer;padding:0;line-height:1;margin:0;">✕</button>
        </div>

        <!-- 🎨 自定义表情输入区域（输入即自动选择） -->
        <div id="customEmojiArea" style="padding:10px;border-bottom:1px solid #eee;flex-shrink:0;background:#fafafa;">
            <div style="font-size:11px;color:#aaa;margin-bottom:6px;">🎨 自定义表情（输入即自动选择）</div>
            <div style="display:flex;gap:6px;align-items:center;">
                <div id="customEmojiPreview" style="font-size:28px;background:#f0f0f0;padding:6px 12px;border-radius:8px;min-width:50px;text-align:center;">👍</div>
                <div style="flex:1;">
                    <input id="customEmojiInput" type="text" placeholder="输入任意表情，如: ✈️ 🎉 🎂 💯" 
                          style="width:100%;padding:8px 10px;border:1px solid #ddd;border-radius:4px;font-size:14px;box-sizing:border-box;">
                </div>
                <button id="clearCustomEmojiBtn" style="padding:6px 12px;background:#e0e0e0;color:#666;border:none;border-radius:4px;cursor:pointer;">清空</button>
            </div>
            <div style="margin-top:6px;font-size:10px;color:#999;display:flex;flex-wrap:wrap;gap:4px;">
                <span>💡 常用:</span>
                <span class="quick-custom-emoji" data-emoji="👍" style="cursor:pointer;font-size:16px;padding:2px;">👍</span>
                <span class="quick-custom-emoji" data-emoji="❤️" style="cursor:pointer;font-size:16px;padding:2px;">❤️</span>
                <span class="quick-custom-emoji" data-emoji="🎉" style="cursor:pointer;font-size:16px;padding:2px;">🎉</span>
                <span class="quick-custom-emoji" data-emoji="🎂" style="cursor:pointer;font-size:16px;padding:2px;">🎂</span>
                <span class="quick-custom-emoji" data-emoji="💯" style="cursor:pointer;font-size:16px;padding:2px;">💯</span>
                <span class="quick-custom-emoji" data-emoji="🤣" style="cursor:pointer;font-size:16px;padding:2px;">🤣</span>
                <span class="quick-custom-emoji" data-emoji="🥳" style="cursor:pointer;font-size:16px;padding:2px;">🥳</span>
                <span class="quick-custom-emoji" data-emoji="🔥" style="cursor:pointer;font-size:16px;padding:2px;">🔥</span>
                <span class="quick-custom-emoji" data-emoji="⭐" style="cursor:pointer;font-size:16px;padding:2px;">⭐</span>
                <span class="quick-custom-emoji" data-emoji="💪" style="cursor:pointer;font-size:16px;padding:2px;">💪</span>
                <span class="quick-custom-emoji" data-emoji="✈️" style="cursor:pointer;font-size:16px;padding:2px;">✈️</span>
            </div>
        </div>

        <!-- Emoji 选择 -->
        <div style="padding:10px;border-bottom:1px solid #eee;flex-shrink:0;">
          <div style="font-size:11px;color:#aaa;margin-bottom:6px;">选择表情</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="reaction-emoji-btn" data-emoji="👍" style="font-size:20px;padding:4px 8px;border:2px solid #9c27b0;border-radius:8px;background:#fff;cursor:pointer;transition:all 0.2s;">👍</button>
            <button class="reaction-emoji-btn" data-emoji="❤️" style="font-size:20px;padding:4px 8px;border:2px solid #eee;border-radius:8px;background:#fff;cursor:pointer;transition:all 0.2s;">❤️</button>
            <button class="reaction-emoji-btn" data-emoji="👌" style="font-size:20px;padding:4px 8px;border:2px solid #eee;border-radius:8px;background:#fff;cursor:pointer;transition:all 0.2s;">👌</button>
            <button class="reaction-emoji-btn" data-emoji="☕" style="font-size:20px;padding:4px 8px;border:2px solid #eee;border-radius:8px;background:#fff;cursor:pointer;transition:all 0.2s;">☕</button>
            <button class="reaction-emoji-btn" data-emoji="✍️" style="font-size:20px;padding:4px 8px;border:2px solid #eee;border-radius:8px;background:#fff;cursor:pointer;transition:all 0.2s;">✍️</button>
            <button class="reaction-emoji-btn" data-emoji="👀" style="font-size:20px;padding:4px 8px;border:2px solid #eee;border-radius:8px;background:#fff;cursor:pointer;transition:all 0.2s;">👀</button>
            <button class="reaction-emoji-btn" data-emoji="🤷‍♂️" style="font-size:20px;padding:4px 8px;border:2px solid #eee;border-radius:8px;background:#fff;cursor:pointer;transition:all 0.2s;">🤷‍♂️</button>
            <button class="reaction-emoji-btn" data-emoji="📝" style="font-size:20px;padding:4px 8px;border:2px solid #eee;border-radius:8px;background:#fff;cursor:pointer;transition:all 0.2s;">📝</button>
            <button class="reaction-emoji-btn" data-emoji="🍻" style="font-size:20px;padding:4px 8px;border:2px solid #eee;border-radius:8px;background:#fff;cursor:pointer;transition:all 0.2s;">🍻</button>
            <button class="reaction-emoji-btn" data-emoji="😂" style="font-size:20px;padding:4px 8px;border:2px solid #eee;border-radius:8px;background:#fff;cursor:pointer;transition:all 0.2s;">😂</button>
            <button class="reaction-emoji-btn" data-emoji="🥳" style="font-size:20px;padding:4px 8px;border:2px solid #eee;border-radius:8px;background:#fff;cursor:pointer;transition:all 0.2s;">🥳</button>
            <button class="reaction-emoji-btn" data-emoji="🤩" style="font-size:20px;padding:4px 8px;border:2px solid #eee;border-radius:8px;background:#fff;cursor:pointer;transition:all 0.2s;">🤩</button>
            <button class="reaction-emoji-btn" data-emoji="🥰" style="font-size:20px;padding:4px 8px;border:2px solid #eee;border-radius:8px;background:#fff;cursor:pointer;transition:all 0.2s;">🥰</button>
            <button class="reaction-emoji-btn" data-emoji="😵" style="font-size:20px;padding:4px 8px;border:2px solid #eee;border-radius:8px;background:#fff;cursor:pointer;transition:all 0.2s;">😵</button>
            <button class="reaction-emoji-btn" data-emoji="✊" style="font-size:20px;padding:4px 8px;border:2px solid #eee;border-radius:8px;background:#fff;cursor:pointer;transition:all 0.2s;">✊</button>
            <button class="reaction-emoji-btn" data-emoji="😮" style="font-size:20px;padding:4px 8px;border:2px solid #eee;border-radius:8px;background:#fff;cursor:pointer;transition:all 0.2s;">😮</button>
            <button class="reaction-emoji-btn" data-emoji="😢" style="font-size:20px;padding:4px 8px;border:2px solid #eee;border-radius:8px;background:#fff;cursor:pointer;transition:all 0.2s;">😢</button>
            <button class="reaction-emoji-btn" data-emoji="🙏" style="font-size:20px;padding:4px 8px;border:2px solid #eee;border-radius:8px;background:#fff;cursor:pointer;transition:all 0.2s;">🙏</button>
            <button class="reaction-emoji-btn" data-emoji="🙌" style="font-size:20px;padding:4px 8px;border:2px solid #eee;border-radius:8px;background:#fff;cursor:pointer;transition:all 0.2s;">🙌</button>
            <button class="reaction-emoji-btn" data-emoji="👏" style="font-size:20px;padding:4px 8px;border:2px solid #eee;border-radius:8px;background:#fff;cursor:pointer;transition:all 0.2s;">👏</button>
            <button class="reaction-emoji-btn" data-emoji="🔥" style="font-size:20px;padding:4px 8px;border:2px solid #eee;border-radius:8px;background:#fff;cursor:pointer;transition:all 0.2s;">🔥</button>
            <button class="reaction-emoji-btn" data-emoji="💯" style="font-size:20px;padding:4px 8px;border:2px solid #eee;border-radius:8px;background:#fff;cursor:pointer;transition:all 0.2s;">💯</button>
          </div>
          <div style="margin-top:8px;font-size:12px;color:#666;">已选: <span id="selectedEmojiDisplay" style="font-size:16px;">👍</span></div>
        </div>

        <!-- 点赞目标 -->
        <div style="padding:10px;border-bottom:1px solid #eee;flex-shrink:0;">
          <div style="font-size:11px;color:#aaa;margin-bottom:6px;">点赞目标</div>
          <div style="display:flex;flex-direction:column;gap:6px;">
            <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;">
              <input type="radio" name="reactionTarget" value="last" checked style="accent-color:#9c27b0;"> 最后一条消息
            </label>
            <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;">
              <input type="radio" name="reactionTarget" value="all"> 所有消息
            </label>
            <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;">
              <input type="radio" name="reactionTarget" value="keyword"> 关键词匹配
            </label>
            <input id="reactionKeyword" type="text" placeholder="输入关键词..." style="display:none;padding:5px 8px;border:1px solid #ddd;border-radius:4px;font-size:12px;width:100%;box-sizing:border-box;">
            <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;">
              <input type="radio" name="reactionTarget" value="index"> 第 N 条
            </label>
            <div id="reactionIndexRow" style="display:none;align-items:center;gap:6px;">
              <input id="reactionIndex" type="number" value="1" min="1" style="width:60px;padding:4px 6px;border:1px solid #ddd;border-radius:4px;font-size:12px;">
              <span style="font-size:12px;color:#666;">（负数从末尾算，-1=最后一条）</span>
            </div>
          </div>
        </div>

        <!-- 群组列表 -->
        <div style="padding:10px;border-bottom:1px solid #eee;flex-shrink:0;">
          <div style="margin-bottom:6px;">
            <div style="font-size:11px;color:#aaa;">选择群组（在主面板勾选，此处同步显示）</div>
          </div>
          <div id="reactionGroupList" style="max-height:180px;overflow-y:auto;border:1px solid #eee;border-radius:4px;padding:4px;font-size:12px;background:#fafafa;"><div style="text-align:center;color:#aaa;padding:20px;">请先在主面板加载群组列表</div></div>
        </div>

        <!-- 间隔设置 -->
        <div style="padding:10px;border-bottom:1px solid #eee;flex-shrink:0;display:flex;align-items:center;gap:8px;">
          <span style="font-size:12px;color:#666;white-space:nowrap;">每条间隔</span>
          <input id="reactionDelay" type="number" value="0" min="0" style="width:50px;padding:4px 6px;border:1px solid #ddd;border-radius:4px;font-size:12px;">
          <span style="font-size:12px;color:#666;">秒</span>
        </div>

        <!-- 开始/停止按钮 -->
        <div style="padding:10px;flex-shrink:0;display:flex;gap:8px;">
          <button id="reactionStartBtn" style="flex:1;background:#9c27b0;color:#fff;border:none;border-radius:4px;padding:8px 0;font-size:13px;cursor:pointer;margin:0;">▶ 开始点赞</button>
          <button id="reactionStopBtn" style="flex:1;background:#f44336;color:#fff;border:none;border-radius:4px;padding:8px 0;font-size:13px;cursor:pointer;margin:0;display:none;">⏹ 停止</button>
        </div>

        <!-- 状态 -->
        <div id="reactionStatus" style="padding:0 10px 10px;font-size:12px;color:#666;"></div>
      </div>

      <!-- ↩️ 回复面板抽屉 -->
      <div id="replyDrawer" style="
        display:none;
        position:fixed;
        right:310px;
        top:0;
        width:300px;
        height:100%;
        background:#fff;
        border:1px solid #00897b;
        z-index:999999998;
        overflow:hidden;
        flex-direction:column;
        box-shadow:-4px 0 16px rgba(0,0,0,.18);
        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
        font-size:13px;
      ">
        <!-- 标题栏 -->
        <div style="background:#00897b;color:#fff;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <span style="font-weight:bold;font-size:14px;">↩️ 批量回复消息</span>
          <button id="replyCloseBtn" style="background:transparent;border:none;color:#fff;font-size:18px;cursor:pointer;padding:0;line-height:1;margin:0;">✕</button>
        </div>

        <!-- 回复目标 -->
        <div style="padding:10px;border-bottom:1px solid #eee;flex-shrink:0;">
          <div style="font-size:11px;color:#aaa;margin-bottom:6px;">回复目标</div>
          <div style="display:flex;flex-direction:column;gap:6px;">
            <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;">
              <input type="radio" name="replyTarget" value="last" checked style="accent-color:#00897b;"> 最后一条消息
            </label>
            <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;">
              <input type="radio" name="replyTarget" value="keyword"> 关键词匹配
            </label>
            <input id="replyKeyword" type="text" placeholder="输入关键词..." style="display:none;padding:5px 8px;border:1px solid #ddd;border-radius:4px;font-size:12px;width:100%;box-sizing:border-box;">
            <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;">
              <input type="radio" name="replyTarget" value="index"> 第 N 条
            </label>
            <div id="replyIndexRow" style="display:none;align-items:center;gap:6px;">
              <input id="replyIndex" type="number" value="1" min="1" style="width:60px;padding:4px 6px;border:1px solid #ddd;border-radius:4px;font-size:12px;">
              <span style="font-size:12px;color:#666;">（负数从末尾算，-1=最后一条）</span>
            </div>
          </div>
        </div>

        <!-- 发送内容预览（读取主面板） -->
        <div style="padding:10px;border-bottom:1px solid #eee;flex-shrink:0;">
          <div style="font-size:11px;color:#aaa;margin-bottom:6px;">回复内容（来自主面板）</div>
          <div id="replyContentPreview" style="background:#f5f5f5;border:1px solid #eee;border-radius:6px;overflow:hidden;min-height:36px;">
            <!-- 图片缩略图行 -->
            <div id="replyImgPreview" style="display:none;padding:6px;border-bottom:1px solid #eee;">
              <img id="replyImgThumb" src="" alt="" style="max-width:100%;max-height:120px;border-radius:4px;display:block;object-fit:contain;">
            </div>
            <!-- 文本行 -->
            <div id="replyTextPreview" style="padding:6px 8px;font-size:12px;color:#333;line-height:1.5;white-space:pre-wrap;word-break:break-all;min-height:28px;"></div>
          </div>
          <div id="replyModePreview" style="margin-top:4px;font-size:11px;color:#9c27b0;"></div>
        </div>

        <!-- 群组列表 -->
        <div style="padding:10px;border-bottom:1px solid #eee;flex-shrink:0;">
          <div style="margin-bottom:6px;">
            <div style="font-size:11px;color:#aaa;">选择群组（在主面板勾选，此处同步显示）</div>
          </div>
          <div id="replyGroupList" style="max-height:160px;overflow-y:auto;border:1px solid #eee;border-radius:4px;padding:4px;font-size:12px;background:#fafafa;">
            <div style="text-align:center;color:#aaa;padding:20px;">请先在主面板加载群组列表</div>
          </div>
        </div>

        <!-- 间隔设置 -->
        <div style="padding:10px;border-bottom:1px solid #eee;flex-shrink:0;display:flex;align-items:center;gap:8px;">
          <span style="font-size:12px;color:#666;white-space:nowrap;">每条间隔</span>
          <input id="replyDelay" type="number" value="1" min="0" style="width:50px;padding:4px 6px;border:1px solid #ddd;border-radius:4px;font-size:12px;">
          <span style="font-size:12px;color:#666;">秒</span>
        </div>

        <!-- 开始/停止 -->
        <div style="padding:10px;flex-shrink:0;display:flex;gap:8px;">
          <button id="replyStartBtn" style="flex:1;background:#00897b;color:#fff;border:none;border-radius:4px;padding:8px 0;font-size:13px;cursor:pointer;margin:0;">▶ 开始回复</button>
          <button id="replyStopBtn" style="flex:1;background:#f44336;color:#fff;border:none;border-radius:4px;padding:8px 0;font-size:13px;cursor:pointer;margin:0;display:none;">⏹ 停止</button>
        </div>

        <!-- 状态 -->
        <div id="replyStatus" style="padding:0 10px 10px;font-size:12px;color:#666;"></div>
      </div>

      <!-- ⏰ 定时发送抽屉（在主面板左侧滑出） -->
      <div id="scheduleDrawer" style="
        display:none;
        position:fixed;
        right:310px;
        top:0;
        width:300px;
        height:100%;
        background:#fff;
        border: 1px solid rgb(255, 152, 0);
        z-index:999999998;
        overflow:hidden;
        flex-direction:column;
        box-shadow:-4px 0 16px rgba(0,0,0,.18);
        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
        font-size:13px;
      ">
        <!-- 标题栏 -->
        <div style="background:#ff9800;color:#fff;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <span style="font-weight:bold;font-size:14px;">⏰ 定时发送管理</span>
          <button id="schedCloseBtn" style="background:transparent;border:none;color:#fff;font-size:18px;cursor:pointer;padding:0;line-height:1;margin:0;">✕</button>
        </div>

        <!-- 添加区 -->
        <div style="padding:10px;border-bottom:1px solid #eee;flex-shrink:0;background:#fffbf5;">
          <div style="font-size:11px;color:#aaa;margin-bottom:6px;letter-spacing:.5px;">📋 添加定时任务</div>
          <div style="display:flex;gap:5px;align-items:center;margin-bottom:6px;flex-wrap:wrap;">
            <input id="schedDelayMin" type="number" min="0" placeholder="分" style="width:50px;padding:4px 6px;border:1px solid #ddd;border-radius:4px;font-size:13px;"/>
            <span style="font-size:12px;color:#666;">分</span>
            <input id="schedDelaySecAdd" type="number" min="0" max="59" placeholder="秒" style="width:48px;padding:4px 6px;border:1px solid #ddd;border-radius:4px;font-size:13px;"/>
            <span style="font-size:12px;color:#666;">秒后发送</span>
          </div>
          <textarea id="schedText" placeholder="输入定时发送的文本内容..." style="width:100%;height:66px;padding:6px;border:1px solid #ddd;border-radius:4px;font-size:13px;resize:vertical;box-sizing:border-box;font-family:inherit;"></textarea>
          <div style="display:flex;gap:6px;margin-top:6px;">
            <button id="schedAddBtn" style="flex:1;background:#ff9800;color:#fff;border:none;border-radius:4px;padding:7px 0;font-size:12px;cursor:pointer;margin:0;">＋ 添加到队尾</button>
            <button id="schedInsertBtn" style="flex:1;background:#2196F3;color:#fff;border:none;border-radius:4px;padding:7px 0;font-size:12px;cursor:pointer;margin:0;">⬆ 插入队首</button>
          </div>
        </div>

        <!-- 队列控制栏 -->
        <div style="padding:8px 10px;border-bottom:1px solid #eee;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;background:#f9f9f9;">
          <span style="font-size:11px;color:#888;">📌 待发队列</span>
          <div style="display:flex;gap:4px;">
            <button id="schedStartBtn" style="background:#4CAF50;color:#fff;border:none;border-radius:4px;padding:4px 10px;font-size:12px;cursor:pointer;margin:0;">▶ 开始</button>
            <button id="schedPauseBtn" style="background:#FF9800;color:#fff;border:none;border-radius:4px;padding:4px 10px;font-size:12px;cursor:pointer;margin:0;display:none;">⏸ 暂停</button>
            <button id="schedStopBtn" style="background:#f44336;color:#fff;border:none;border-radius:4px;padding:4px 10px;font-size:12px;cursor:pointer;margin:0;display:none;">⏹ 停止</button>
          </div>
        </div>

        <!-- 倒计时 -->
        <div id="schedCountdown" style="display:none;background:#fff3e0;border-bottom:1px solid #ffe0b2;padding:7px 12px;text-align:center;font-size:12px;color:#e65100;flex-shrink:0;"></div>

        <!-- 任务列表 -->
        <div style="flex:1;overflow-y:auto;padding:8px;">
          <div id="schedTaskList"></div>
          <div id="schedEmpty" style="text-align:center;color:#ccc;font-size:12px;padding:24px 0;">暂无定时任务<br>点击上方添加 ➕</div>
        </div>

        <!-- 编辑弹窗（绝对定位覆盖抽屉） -->
        <div id="schedEditModal" style="display:none;position:absolute;inset:0;background:rgba(0,0,0,.45);z-index:10;align-items:center;justify-content:center;">
          <div style="background:#fff;border-radius:10px;padding:18px;width:260px;box-shadow:0 4px 24px rgba(0,0,0,.3);">
            <div style="font-weight:bold;margin-bottom:10px;font-size:14px;">✏️ 编辑定时任务</div>
            <div style="display:flex;gap:5px;align-items:center;margin-bottom:8px;">
              <input id="editDelayMin" type="number" min="0" placeholder="分" style="width:52px;padding:5px;border:1px solid #ddd;border-radius:4px;font-size:13px;"/>
              <span style="font-size:12px;">分</span>
              <input id="editDelaySec" type="number" min="0" max="59" placeholder="秒" style="width:50px;padding:5px;border:1px solid #ddd;border-radius:4px;font-size:13px;"/>
              <span style="font-size:12px;">秒后发</span>
            </div>
            <textarea id="editText" style="width:100%;height:80px;padding:6px;border:1px solid #ddd;border-radius:4px;font-size:13px;resize:vertical;box-sizing:border-box;font-family:inherit;"></textarea>
            <div style="display:flex;gap:8px;margin-top:10px;">
              <button id="editSaveBtn" style="flex:1;background:#4CAF50;color:#fff;border:none;border-radius:4px;padding:8px 0;font-size:13px;cursor:pointer;margin:0;">✅ 保存</button>
              <button id="editCancelBtn" style="flex:1;background:#9E9E9E;color:#fff;border:none;border-radius:4px;padding:8px 0;font-size:13px;cursor:pointer;margin:0;">取消</button>
            </div>
          </div>
        </div>
      </div>
    `;

  shadowRoot.appendChild(style);
  shadowRoot.appendChild(控制面板);

  function 初始化图片输入监听() {
    const fileInput = shadowRoot.querySelector("#IpImg");
    const textarea = shadowRoot.querySelector("#messageInput");
    const preview = shadowRoot.querySelector("#preview");
    const previewArea = shadowRoot.querySelector(".preview-area");
    const placeholder = shadowRoot.querySelector(".preview-placeholder");
    const clearBtn = shadowRoot.querySelector("#clear-btn");

    function 显示图片预览(file) {
      if (!file || !file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        preview.src = e.target.result;
        preview.style.display = "block";
        previewArea.style.display = "flex";
        placeholder.style.display = "none";
        clearBtn.disabled = false;
      };
      reader.readAsDataURL(file);
    }

    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) 显示图片预览(file);
    });

    textarea.addEventListener("paste", (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let item of items) {
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          const file = item.getAsFile();
          显示图片预览(file);

          const dt = new DataTransfer();
          dt.items.add(file);
          fileInput.files = dt.files;
          break;
        }
      }
    });

    clearBtn.addEventListener("click", () => {
      preview.src = "";
      preview.style.display = "none";
      previewArea.style.display = "none";
      placeholder.style.display = "flex";
      fileInput.value = "";
      clearBtn.disabled = true;
    });
  }

  初始化图片输入监听();

  function 初始化列表操作按钮() {
    const container = window._shadowRoot.querySelector("#contactsContainer");
    const selectAllBtn = window._shadowRoot.querySelector("#selectAllBtn");
    const invertSelectBtn =
      window._shadowRoot.querySelector("#invertSelectBtn");
    const clearSelectBtn = window._shadowRoot.querySelector("#clearSelectBtn");

    function notifyContactsChanged() {
      window._shadowRoot.dispatchEvent(new CustomEvent("contactsUpdated"));
    }

    // 全选
    selectAllBtn.addEventListener("click", () => {
      container.querySelectorAll(".contact-checkbox").forEach((cb) => {
        cb.checked = true;
        cb.closest(".contact-item").classList.add("selected");
      });
      notifyContactsChanged();
    });

    // 反选
    invertSelectBtn.addEventListener("click", () => {
      container.querySelectorAll(".contact-checkbox").forEach((cb) => {
        cb.checked = !cb.checked;
        cb.closest(".contact-item").classList.toggle("selected", cb.checked);
      });
      notifyContactsChanged();
    });

    // 清空
    clearSelectBtn.addEventListener("click", () => {
      container.querySelectorAll(".contact-checkbox").forEach((cb) => {
        cb.checked = false;
        cb.closest(".contact-item").classList.remove("selected");
      });
      notifyContactsChanged();
    });

    // 点击 item 切换选中，同步通知点赞面板
    container.addEventListener("change", (e) => {
      if (e.target.classList.contains("contact-checkbox")) {
        e.target
          .closest(".contact-item")
          .classList.toggle("selected", e.target.checked);
        notifyContactsChanged();
      }
    });
  }

  初始化列表操作按钮();
}

(async () => {
  if (window.location.hostname.includes("web.whatsapp.com")) {
    console.log("当前在 WhatsApp Web");

    // 缩小布局窗口
    // document.body.style.zoom = "75%";

    // 调用函数注入浮动窗口
    await 注入控制面板(WA_VERSIONS);
  }
})();

//-------------------------------------------------------------------------------------通用工具函数-------------------------------------------------------------------------------------

function 等待目标出现(getter, timeout = 15000) {
  return new Promise((resolve) => {
    const start = Date.now();
    const timer = setInterval(() => {
      const val = getter();
      if (val) {
        clearInterval(timer);
        resolve(val);
      }
      if (Date.now() - start > timeout) {
        clearInterval(timer);
        resolve(null);
      }
    }, 10);
  });
}

async function 模拟真实点击(element) {
  if (!element) return false;

  element.scrollIntoView({ behavior: "auto", block: "center" });
  await new Promise((r) => setTimeout(r, 300));

  const box = element.getBoundingClientRect();
  const x = box.left + box.width / 2;
  const y = box.top + box.height / 2;

  const events = [
    { type: "mousedown", buttons: 1 },
    { type: "mouseup", buttons: 0 },
    { type: "click", buttons: 0 },
  ];

  for (const { type, buttons } of events) {
    element.dispatchEvent(
      new MouseEvent(type, {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
        buttons,
        button: 0,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 50));
  }

  element.click();
  return true;
}

// 等待输入框懒加载出现后再操作
async function 模拟真实输入(text, element) {
  const inputBox =
    element ||
    (await 等待目标出现(() =>
      document.querySelector('[data-testid="conversation-compose-box-input"]'),
    ));

  if (!inputBox) return false;

  inputBox.focus();
  await new Promise((r) => setTimeout(r, 50));
  inputBox.innerText = text;
  inputBox.dispatchEvent(
    new InputEvent("input", {
      bubbles: true,
      inputType: "insertText",
      data: text,
    }),
  );

  return true;
}

//--------------------------------------------------------------------------------------图片操作--------------------------------------------------------------------------------------

function 获取已选图片() {
  const fileInput = window._shadowRoot.querySelector("#IpImg");
  return fileInput.files[0] || false;
}

async function 获取已选图片Base64() {
  const file = 获取已选图片();
  if (!file) return false;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result); // data:image/png;base64,xxx
    reader.readAsDataURL(file);
  });
}

async function 清空图片输入() {
  return await 模拟真实点击(window._shadowRoot.querySelector("#clear-btn"));
}

function 清空文本输入框() {
  const inputEl = window._shadowRoot.getElementById("messageInput");
  if (inputEl) {
    inputEl.value = "";
    // 触发 input 事件，确保界面同步更新
    inputEl.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

async function 清空所有输入() {
  if (await 清空图片输入()) {
    清空文本输入框();
    return true;
  } else {
    return false;
  }
}

//-------------------------------------------------------------------------------------------加载未归档群到列表-------------------------------------------------------------------------------------------
async function 获取未归档群组() {
  try {
    if (!window.Store) {
      window.Store = Object.assign({}, window.require("WAWebCollections"));
    }

    const groups = window.Store.Chat.getModelsArray()
      .filter((chat) => {
        const isGroup =
          chat.id?._serialized?.endsWith("@g.us") || chat.isGroup === true;
        const notArchived = !chat.archive;
        return isGroup && notArchived;
      })
      .map((chat) => ({
        id: chat.id?._serialized,
        name:
          chat.name ||
          chat.formattedTitle ||
          chat.formattedName ||
          "未命名群组",
        participantCount:
          chat.participantCount ||
          chat.groupMetadata?.participants?.length ||
          chat.participants?.length ||
          0,
      }));

    groups.sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
    console.log(`📋 找到 ${groups.length} 个未归档群组`);
    return groups;
  } catch (error) {
    console.error("获取群组失败:", error);
    return [];
  }
}

async function 加载群组到列表() {
  const container = window._shadowRoot.querySelector("#contactsContainer");
  if (!container) {
    console.error("❌ 找不到联系人容器");
    return;
  }

  container.innerHTML =
    '<div style="padding: 8px; color: #999;">加载中...</div>';

  const groups = await 获取未归档群组();
  if (!groups.length) {
    container.innerHTML =
      '<div style="padding: 8px; color: #999;">没有找到群组</div>';
    return;
  }

  container.innerHTML = groups
    .map(
      (group, index) => `
    <div class="contact-item selected" data-contact-id="contact-${index}">
      <input type="checkbox" id="contact-${index}" class="contact-checkbox" value="${group.id}" checked>
      <label for="contact-${index}" class="contact-label" title="${group.name}">
        ${group.name} (${group.participantCount}人)
      </label>
    </div>
  `,
    )
    .join("");

  container.style.display = "block";

  // 通知点赞面板刷新群组展示
  window._shadowRoot.dispatchEvent(new CustomEvent("contactsUpdated"));

  console.log(`✅ 已加载 ${groups.length} 个群组`);
}

function 获取已选群组() {
  const checkboxes = window._shadowRoot.querySelectorAll(
    ".contact-checkbox:checked",
  );
  return Array.from(checkboxes).map((cb) => ({
    id: cb.value,
    name: cb
      .closest(".contact-item")
      .querySelector(".contact-label")
      .getAttribute("title"),
  }));
}
//初始化列表
await 加载群组到列表();
//绑定事件到按钮
const loadingData = window._shadowRoot
  .querySelector("#loadContactsBtn")
  .addEventListener("click", 加载群组到列表);

//------------------------------------------------------------------------------采集未归档群组数据--------------------------------------------------------------------------------------------

// 添加手机号码归属地查询函数（全球国家/地区）
function 查询号码归属地(phoneNumber) {
  // 去掉+号，只保留数字
  const num = phoneNumber.replace("+", "");

  // 全球国家/地区代码数据库（按代码长度排序，长的优先）
  const countryCodes = [
    { code: "1", country: "美国/加拿大", region: "北美" },
    { code: "7", country: "俄罗斯/哈萨克斯坦", region: "东欧" },
    { code: "20", country: "埃及", region: "非洲" },
    { code: "27", country: "南非", region: "非洲" },
    { code: "30", country: "希腊", region: "南欧" },
    { code: "31", country: "荷兰", region: "西欧" },
    { code: "32", country: "比利时", region: "西欧" },
    { code: "33", country: "法国", region: "西欧" },
    { code: "34", country: "西班牙", region: "南欧" },
    { code: "36", country: "匈牙利", region: "东欧" },
    { code: "39", country: "意大利", region: "南欧" },
    { code: "40", country: "罗马尼亚", region: "东欧" },
    { code: "41", country: "瑞士", region: "西欧" },
    { code: "43", country: "奥地利", region: "中欧" },
    { code: "44", country: "英国", region: "西欧" },
    { code: "45", country: "丹麦", region: "北欧" },
    { code: "46", country: "瑞典", region: "北欧" },
    { code: "47", country: "挪威", region: "北欧" },
    { code: "48", country: "波兰", region: "东欧" },
    { code: "49", country: "德国", region: "西欧" },
    { code: "51", country: "秘鲁", region: "南美" },
    { code: "52", country: "墨西哥", region: "北美" },
    { code: "53", country: "古巴", region: "加勒比海" },
    { code: "54", country: "阿根廷", region: "南美" },
    { code: "55", country: "巴西", region: "南美" },
    { code: "56", country: "智利", region: "南美" },
    { code: "57", country: "哥伦比亚", region: "南美" },
    { code: "58", country: "委内瑞拉", region: "南美" },
    { code: "60", country: "马来西亚", region: "东南亚" },
    { code: "61", country: "澳大利亚", region: "大洋洲" },
    { code: "62", country: "印度尼西亚", region: "东南亚" },
    { code: "63", country: "菲律宾", region: "东南亚" },
    { code: "64", country: "新西兰", region: "大洋洲" },
    { code: "65", country: "新加坡", region: "东南亚" },
    { code: "66", country: "泰国", region: "东南亚" },
    { code: "81", country: "日本", region: "东亚" },
    { code: "82", country: "韩国", region: "东亚" },
    { code: "84", country: "越南", region: "东南亚" },
    { code: "86", country: "中国", region: "东亚" },
    { code: "90", country: "土耳其", region: "中东" },
    { code: "91", country: "印度", region: "南亚" },
    { code: "92", country: "巴基斯坦", region: "南亚" },
    { code: "93", country: "阿富汗", region: "南亚" },
    { code: "94", country: "斯里兰卡", region: "南亚" },
    { code: "95", country: "缅甸", region: "东南亚" },
    { code: "98", country: "伊朗", region: "中东" },
    { code: "211", country: "南苏丹", region: "非洲" },
    { code: "212", country: "摩洛哥", region: "非洲" },
    { code: "213", country: "阿尔及利亚", region: "非洲" },
    { code: "216", country: "突尼斯", region: "非洲" },
    { code: "218", country: "利比亚", region: "非洲" },
    { code: "220", country: "冈比亚", region: "非洲" },
    { code: "221", country: "塞内加尔", region: "非洲" },
    { code: "222", country: "毛里塔尼亚", region: "非洲" },
    { code: "223", country: "马里", region: "非洲" },
    { code: "224", country: "几内亚", region: "非洲" },
    { code: "225", country: "科特迪瓦", region: "非洲" },
    { code: "226", country: "布基纳法索", region: "非洲" },
    { code: "227", country: "尼日尔", region: "非洲" },
    { code: "228", country: "多哥", region: "非洲" },
    { code: "229", country: "贝宁", region: "非洲" },
    { code: "230", country: "毛里求斯", region: "非洲" },
    { code: "231", country: "利比里亚", region: "非洲" },
    { code: "232", country: "塞拉利昂", region: "非洲" },
    { code: "233", country: "加纳", region: "非洲" },
    { code: "234", country: "尼日利亚", region: "非洲" },
    { code: "235", country: "乍得", region: "非洲" },
    { code: "236", country: "中非共和国", region: "非洲" },
    { code: "237", country: "喀麦隆", region: "非洲" },
    { code: "238", country: "佛得角", region: "非洲" },
    { code: "239", country: "圣多美和普林西比", region: "非洲" },
    { code: "240", country: "赤道几内亚", region: "非洲" },
    { code: "241", country: "加蓬", region: "非洲" },
    { code: "242", country: "刚果共和国", region: "非洲" },
    { code: "243", country: "刚果民主共和国", region: "非洲" },
    { code: "244", country: "安哥拉", region: "非洲" },
    { code: "245", country: "几内亚比绍", region: "非洲" },
    { code: "246", country: "迪戈加西亚岛", region: "非洲" },
    { code: "247", country: "阿森松岛", region: "非洲" },
    { code: "248", country: "塞舌尔", region: "非洲" },
    { code: "249", country: "苏丹", region: "非洲" },
    { code: "250", country: "卢旺达", region: "非洲" },
    { code: "251", country: "埃塞俄比亚", region: "非洲" },
    { code: "252", country: "索马里", region: "非洲" },
    { code: "253", country: "吉布提", region: "非洲" },
    { code: "254", country: "肯尼亚", region: "非洲" },
    { code: "255", country: "坦桑尼亚", region: "非洲" },
    { code: "256", country: "乌干达", region: "非洲" },
    { code: "257", country: "布隆迪", region: "非洲" },
    { code: "258", country: "莫桑比克", region: "非洲" },
    { code: "260", country: "赞比亚", region: "非洲" },
    { code: "261", country: "马达加斯加", region: "非洲" },
    { code: "262", country: "留尼汪/马约特", region: "非洲" },
    { code: "263", country: "津巴布韦", region: "非洲" },
    { code: "264", country: "纳米比亚", region: "非洲" },
    { code: "265", country: "马拉维", region: "非洲" },
    { code: "266", country: "莱索托", region: "非洲" },
    { code: "267", country: "博茨瓦纳", region: "非洲" },
    { code: "268", country: "斯威士兰", region: "非洲" },
    { code: "269", country: "科摩罗", region: "非洲" },
    { code: "290", country: "圣赫勒拿", region: "非洲" },
    { code: "291", country: "厄立特里亚", region: "非洲" },
    { code: "297", country: "阿鲁巴", region: "加勒比海" },
    { code: "298", country: "法罗群岛", region: "北欧" },
    { code: "299", country: "格陵兰", region: "北美" },
    { code: "350", country: "直布罗陀", region: "南欧" },
    { code: "351", country: "葡萄牙", region: "南欧" },
    { code: "352", country: "卢森堡", region: "西欧" },
    { code: "353", country: "爱尔兰", region: "西欧" },
    { code: "354", country: "冰岛", region: "北欧" },
    { code: "355", country: "阿尔巴尼亚", region: "南欧" },
    { code: "356", country: "马耳他", region: "南欧" },
    { code: "357", country: "塞浦路斯", region: "南欧" },
    { code: "358", country: "芬兰", region: "北欧" },
    { code: "359", country: "保加利亚", region: "东欧" },
    { code: "370", country: "立陶宛", region: "东欧" },
    { code: "371", country: "拉脱维亚", region: "东欧" },
    { code: "372", country: "爱沙尼亚", region: "东欧" },
    { code: "373", country: "摩尔多瓦", region: "东欧" },
    { code: "374", country: "亚美尼亚", region: "中东" },
    { code: "375", country: "白俄罗斯", region: "东欧" },
    { code: "376", country: "安道尔", region: "南欧" },
    { code: "377", country: "摩纳哥", region: "西欧" },
    { code: "378", country: "圣马力诺", region: "南欧" },
    { code: "379", country: "梵蒂冈", region: "南欧" },
    { code: "380", country: "乌克兰", region: "东欧" },
    { code: "381", country: "塞尔维亚", region: "南欧" },
    { code: "382", country: "黑山", region: "南欧" },
    { code: "383", country: "科索沃", region: "南欧" },
    { code: "385", country: "克罗地亚", region: "南欧" },
    { code: "386", country: "斯洛文尼亚", region: "中欧" },
    { code: "387", country: "波黑", region: "南欧" },
    { code: "389", country: "北马其顿", region: "南欧" },
    { code: "420", country: "捷克", region: "中欧" },
    { code: "421", country: "斯洛伐克", region: "中欧" },
    { code: "423", country: "列支敦士登", region: "中欧" },
    { code: "500", country: "福克兰群岛", region: "南美" },
    { code: "501", country: "伯利兹", region: "中美" },
    { code: "502", country: "危地马拉", region: "中美" },
    { code: "503", country: "萨尔瓦多", region: "中美" },
    { code: "504", country: "洪都拉斯", region: "中美" },
    { code: "505", country: "尼加拉瓜", region: "中美" },
    { code: "506", country: "哥斯达黎加", region: "中美" },
    { code: "507", country: "巴拿马", region: "中美" },
    { code: "508", country: "圣皮埃尔和密克隆", region: "北美" },
    { code: "509", country: "海地", region: "加勒比海" },
    { code: "590", country: "瓜德罗普", region: "加勒比海" },
    { code: "591", country: "玻利维亚", region: "南美" },
    { code: "592", country: "圭亚那", region: "南美" },
    { code: "593", country: "厄瓜多尔", region: "南美" },
    { code: "594", country: "法属圭亚那", region: "南美" },
    { code: "595", country: "巴拉圭", region: "南美" },
    { code: "596", country: "马提尼克", region: "加勒比海" },
    { code: "597", country: "苏里南", region: "南美" },
    { code: "598", country: "乌拉圭", region: "南美" },
    { code: "599", country: "荷属安的列斯", region: "加勒比海" },
    { code: "670", country: "东帝汶", region: "东南亚" },
    { code: "672", country: "诺福克岛", region: "大洋洲" },
    { code: "673", country: "文莱", region: "东南亚" },
    { code: "674", country: "瑙鲁", region: "大洋洲" },
    { code: "675", country: "巴布亚新几内亚", region: "大洋洲" },
    { code: "676", country: "汤加", region: "大洋洲" },
    { code: "677", country: "所罗门群岛", region: "大洋洲" },
    { code: "678", country: "瓦努阿图", region: "大洋洲" },
    { code: "679", country: "斐济", region: "大洋洲" },
    { code: "680", country: "帕劳", region: "大洋洲" },
    { code: "681", country: "瓦利斯和富图纳", region: "大洋洲" },
    { code: "682", country: "库克群岛", region: "大洋洲" },
    { code: "683", country: "纽埃", region: "大洋洲" },
    { code: "684", country: "美属萨摩亚", region: "大洋洲" },
    { code: "685", country: "萨摩亚", region: "大洋洲" },
    { code: "686", country: "基里巴斯", region: "大洋洲" },
    { code: "687", country: "新喀里多尼亚", region: "大洋洲" },
    { code: "688", country: "图瓦卢", region: "大洋洲" },
    { code: "689", country: "法属波利尼西亚", region: "大洋洲" },
    { code: "690", country: "托克劳", region: "大洋洲" },
    { code: "691", country: "密克罗尼西亚", region: "大洋洲" },
    { code: "692", country: "马绍尔群岛", region: "大洋洲" },
    { code: "850", country: "朝鲜", region: "东亚" },
    { code: "852", country: "香港", region: "东亚" },
    { code: "853", country: "澳门", region: "东亚" },
    { code: "855", country: "柬埔寨", region: "东南亚" },
    { code: "856", country: "老挝", region: "东南亚" },
    { code: "880", country: "孟加拉国", region: "南亚" },
    { code: "886", country: "台湾", region: "东亚" },
    { code: "960", country: "马尔代夫", region: "南亚" },
    { code: "961", country: "黎巴嫩", region: "中东" },
    { code: "962", country: "约旦", region: "中东" },
    { code: "963", country: "叙利亚", region: "中东" },
    { code: "964", country: "伊拉克", region: "中东" },
    { code: "965", country: "科威特", region: "中东" },
    { code: "966", country: "沙特阿拉伯", region: "中东" },
    { code: "967", country: "也门", region: "中东" },
    { code: "968", country: "阿曼", region: "中东" },
    { code: "970", country: "巴勒斯坦", region: "中东" },
    { code: "971", country: "阿联酋", region: "中东" },
    { code: "972", country: "以色列", region: "中东" },
    { code: "973", country: "巴林", region: "中东" },
    { code: "974", country: "卡塔尔", region: "中东" },
    { code: "975", country: "不丹", region: "南亚" },
    { code: "976", country: "蒙古", region: "东亚" },
    { code: "977", country: "尼泊尔", region: "南亚" },
    { code: "992", country: "塔吉克斯坦", region: "中亚" },
    { code: "993", country: "土库曼斯坦", region: "中亚" },
    { code: "994", country: "阿塞拜疆", region: "中东" },
    { code: "995", country: "格鲁吉亚", region: "中东" },
    { code: "996", country: "吉尔吉斯斯坦", region: "中亚" },
    { code: "998", country: "乌兹别克斯坦", region: "中亚" },
  ];

  // 按代码长度降序排序，确保长的优先匹配
  countryCodes.sort((a, b) => b.code.length - a.code.length);

  for (const item of countryCodes) {
    if (num.startsWith(item.code)) {
      return `${item.country} (${item.region})`;
    }
  }

  return "未知地区";
}

// 从文本提取手机号 【修复：保留+号，修正过滤条件】
function 提取号码(text) {
  if (!text) return [];

  const regex = /\+[\d\s\(\)\-]{9,20}/g;
  const matches = text.match(regex) || [];

  return [
    ...new Set(
      matches
        .map((p) => p.replace(/[\s\(\)\-]/g, "")) // 保留 + 号，只去掉空格括号横线
        .filter((p) => /^\+\d{7,15}$/.test(p)), // 必须以+开头，后接7-15位数字
    ),
  ];
}

async function 采集未归档群组数据() {
  const groups = await 获取未归档群组();
  if (!groups.length) {
    console.error("❌ 没有找到未归档群组");
    return;
  }

  console.log(`🚀 开始依次点击 ${groups.length} 个群组`);

  let 聚合号码数据 = [];

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    console.log(`📌 [${i + 1}/${groups.length}] 正在打开: ${group.name}`);

    const success = await 搜索并点击聊天(group.name);

    if (!success) {
      console.warn(`⚠️ 跳过: ${group.name}`);
      continue;
    }

    // 等待群手机号码出现，说明聊天已完全加载
    const inputBox = await 等待目标出现(() => {
      const el = document.querySelector('[data-testid="selectable-text"]');
      if (!el) return null;

      const text = el.innerText || el.textContent;
      // 检查是否包含电话号码（有 + 号或数字）
      if (text && /[\+][\d\s\(\)\-]{8,}/.test(text)) {
        return el; // 是号码，返回元素
      }
      return null; // 不是号码，继续等待
    }, 10000);

    if (inputBox) {
      const groupPhoneNumber = document.querySelector(
        '[data-testid="selectable-text"]',
      ).innerText;
      //   console.log(`✅ 群组: ${group.name}，号码: ${groupPhoneNumber}`);
      聚合号码数据.push({
        name: group.name,
        phoneNumber: 提取号码(groupPhoneNumber),
      });
    }
  }

  async function 保存号码JSON(聚合数据) {
    // 1. 统计每个号码
    const 号码映射 = new Map();

    for (const 群组 of 聚合数据) {
      const 群组名 = 群组.name;
      const 号码列表 = 群组.phoneNumber || [];

      for (const 号码 of 号码列表) {
        if (!号码映射.has(号码)) {
          号码映射.set(号码, {
            号码: 号码,
            归属地: 查询号码归属地(号码),
            出现次数: 0,
            所在群组: [],
          });
        }
        const 记录 = 号码映射.get(号码);
        记录.出现次数++;
        if (!记录.所在群组.includes(群组名)) {
          记录.所在群组.push(群组名);
        }
      }
    }

    // 2. 分类：独立号码 / 重复号码
    const 独立号码 = [];
    const 重复号码 = [];

    for (const 记录 of 号码映射.values()) {
      if (记录.出现次数 === 1) {
        独立号码.push(记录);
      } else {
        重复号码.push(记录);
      }
    }

    // 3. 按国家统计
    const 国家统计 = new Map();
    for (const 记录 of 号码映射.values()) {
      const 国家 = 记录.归属地;
      if (!国家统计.has(国家)) {
        国家统计.set(国家, { 国家, 数量: 0, 独立: 0, 重复: 0 });
      }
      const 统计 = 国家统计.get(国家);
      统计.数量++;
      if (记录.出现次数 === 1) {
        统计.独立++;
      } else {
        统计.重复++;
      }
    }
    const 国家统计列表 = Array.from(国家统计.values()).sort(
      (a, b) => b.数量 - a.数量,
    );

    // 4. 按群组统计
    const 群组统计 = 聚合数据.map((群组) => ({
      群组名: 群组.name,
      总号码数: 群组.phoneNumber?.length || 0,
      独立号码数: 0,
      重复号码数: 0,
    }));

    // 计算每个群组的独立/重复号码数
    for (const 群组 of 聚合数据) {
      const 群组名 = 群组.name;
      const 号码列表 = 群组.phoneNumber || [];
      for (const 号码 of 号码列表) {
        const 记录 = 号码映射.get(号码);
        const 群组统计项 = 群组统计.find((g) => g.群组名 === 群组名);
        if (记录.出现次数 === 1) {
          群组统计项.独立号码数++;
        } else {
          群组统计项.重复号码数++;
        }
      }
    }

    // 5. 构建最终JSON
    const 结果 = {
      元数据: {
        生成时间: new Date().toLocaleString("zh-CN"),
        数据来源: "WhatsApp未归档群组采集",
        群组数量: 聚合数据.length,
        总号码数: 号码映射.size,
        独立号码数: 独立号码.length,
        重复号码数: 重复号码.length,
        重复率: ((重复号码.length / 号码映射.size) * 100).toFixed(2) + "%",
      },
      按国家统计: 国家统计列表,
      按群组统计: 群组统计,
      独立号码列表: 独立号码,
      重复号码列表: 重复号码.sort((a, b) => b.出现次数 - a.出现次数),
    };

    // 6. 保存文件
    const json = JSON.stringify(结果, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const 时间 = `${new Date().getFullYear()}_${new Date().getMonth() + 1}_${new Date().getDate()}_${new Date().getHours()}_${new Date().getMinutes()}`;
    a.download = `号码分析报告_${时间}.json`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);

    const appDir = await api.getAppDirectory();

    const results = await api.saveDataToFile(
      appDir + "whatsapp_customers.json",
      json,
    );

    const result = await api.saveDataToFile(
      appDir + "群组数据\\" + `号码分析报告_${时间}.json`,
      json,
    );

    if (results.success) {
      console.log("✅ 文件已保存");
    } else {
      console.error("❌ 保存失败", results.error);
    }
  }

  await 保存号码JSON(聚合号码数据);
  console.log("✅ 所有群组已遍历完毕");
  //   console.log(聚合号码数据);
}

//绑定事件到按钮
window._shadowRoot
  .querySelector("#loadGroupsBtn")
  .addEventListener("click", () => 采集未归档群组数据());

//-------------------------------------------------------------------------分离标签功能------------------------------------------------------------------------------------
const btn = window._shadowRoot.getElementById("分离当前页面");

btn.addEventListener("click", async () => {
  const result = await api.popOutCurrentTab();
  if (result.success) {
    console.log("标签页已弹出，ID:", result.tabId);
  }
});

//-------------------------------------------------------------------------------------------打开群聊并发送消息-------------------------------------------------------------------------------------------

// 等待文本发送按钮懒加载出现后再点击
async function 点击文本发送按钮() {
  const xpath =
    '//button[@aria-label="发送"]//*[local-name()="svg"]//*[local-name()="path" and contains(@d, "M5.4 19.425")]/ancestor::button';

  const button = await 等待目标出现(
    () =>
      document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue,
  );

  return await 模拟真实点击(button);
}

// 等待图文发送按钮懒加载出现后再点击  图文同发 和发送图片 用这个函数点击发送按钮
async function 点击文本带图片发送按钮() {
  const xpath =
    '//div[@role="button"]//*[local-name()="svg"]//*[local-name()="path" and contains(@d, "M5.4 19.425")]/ancestor::div[@role="button"]';

  const button = await 等待目标出现(
    () =>
      document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue,
  );

  return await 模拟真实点击(button);
}

async function 搜索并点击聊天(chatName) {
  const searchBox = await 等待目标出现(() =>
    document.querySelector('input[data-tab="3"]'),
  );
  if (!searchBox) {
    console.error("❌ 搜索框未找到");
    return false;
  }

  searchBox.focus();
  await new Promise((r) => setTimeout(r, 300));

  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  ).set;
  nativeInputValueSetter.call(searchBox, chatName);
  searchBox.dispatchEvent(new Event("input", { bubbles: true }));

  // 等待搜索结果中的 span 出现
  const span = await 等待目标出现(() => {
    const spans = document.querySelectorAll(
      '[role="grid"] span[dir="auto"][title]',
    );
    for (let s of spans) {
      if (s.getAttribute("title") === chatName) return s;
    }
    return null;
  }, 8000);

  if (!span) {
    console.error(`❌ 搜索无结果: "${chatName}"`);
    return false;
  }

  // ✅ 直接对 span 触发 mousedown/mouseup/click，不 focus cell 避免列表消失
  span.dispatchEvent(
    new MouseEvent("mousedown", { bubbles: true, cancelable: true }),
  );
  await new Promise((r) => setTimeout(r, 50));
  span.dispatchEvent(
    new MouseEvent("mouseup", { bubbles: true, cancelable: true }),
  );
  await new Promise((r) => setTimeout(r, 50));
  span.dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true }),
  );

  await new Promise((r) => setTimeout(r, 300));

  // 清空搜索框
  nativeInputValueSetter.call(searchBox, "");
  searchBox.dispatchEvent(new Event("input", { bubbles: true }));

  console.log(`✅ 已打开: "${chatName}"`);
  return true;
}

const 群发模块 = {
  // base64 -> Blob（用于 clipboard paste）
  base64转Blob(base64) {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];

    const binary = atob(arr[1]);
    const u8arr = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      u8arr[i] = binary.charCodeAt(i);
    }

    return new Blob([u8arr], { type: mime });
  },

  // 获取输入框
  getInputDom() {
    const selectors = [
      "footer p._aupe.copyable-text",
      'footer div[contenteditable="true"]',
      'div[role="textbox"][contenteditable="true"]',
      '.lexical-rich-text-input div[contenteditable="true"]',
      '.x1hx0egp[contenteditable="true"]',
    ];

    for (const s of selectors) {
      const el = document.querySelector(s);
      if (el) return el;
    }
    return null;
  },

  // =========================
  // ✍️ 文本发送
  // =========================
  async 发送文本消息(groupName, text, 是否打开聊天 = true) {
    if (!groupName || !text) {
      console.warn("⚠️ 群名或文本为空");
      return false;
    }

    if (是否打开聊天) {
      const ok = await 搜索并点击聊天(groupName);
      if (!ok) return false;
    }

    if (await 模拟真实输入(text)) {
      if (!(await 点击文本发送按钮())) {
        console.error("❌ 点击发送按钮失败");
        return false;
      }
      return true;
    }
    return false;
  },

  // =========================
  // 🖼️ 图片发送（paste版）
  // =========================
  async 发送图片消息(groupName, imgBase64, 是否打开聊天 = true) {
    if (!groupName || !imgBase64) {
      console.warn("⚠️ 群名或图片为空");
      return false;
    }

    if (是否打开聊天) {
      const ok = await 搜索并点击聊天(groupName);
      if (!ok) return false;
    }

    // const opened = await 搜索并点击聊天(groupName);
    // if (!opened) {
    //   console.warn("❌ 打开聊天失败");
    //   return false;
    // }

    const input = this.getInputDom();
    if (!input) {
      console.error("❌ 找不到输入框");
      return false;
    }

    input.focus();
    input.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));

    // 🔥 关键：模拟 paste（稳定核心）
    const blob = this.base64转Blob(imgBase64);

    const clipboardData = new DataTransfer();
    clipboardData.items.add(new File([blob], "image.png", { type: blob.type }));

    const pasteEvent = new ClipboardEvent("paste", {
      clipboardData,
      bubbles: true,
      cancelable: true,
    });

    input.dispatchEvent(pasteEvent);

    // console.log("🖼️ 已触发 paste 注入图片");

    if (!(await 点击文本带图片发送按钮())) {
      console.error("❌ 点击发送按钮失败");
      return false;
    }

    // console.log(`✅ 图片发送完成 -> ${groupName}`);
    return true;
  },
  // =========================
  // 🖼️+✍️ 图文
  // =========================
  async 发送图文同发消息(groupName, imgBase64, text) {
    if (!groupName || !imgBase64 || !text) {
      console.error("❌ 参数不完整");
      return false;
    }

    const opened = await 搜索并点击聊天(groupName);
    if (!opened) return false;

    const 输入状态 = await 模拟真实输入(text);
    if (!输入状态) return false;

    const input = this.getInputDom();
    if (!input) return false;

    input.focus();

    const blob = this.base64转Blob(imgBase64);

    const clipboardData = new DataTransfer();
    clipboardData.items.add(new File([blob], "image.png", { type: blob.type }));

    const pasteEvent = new ClipboardEvent("paste", {
      clipboardData,
      bubbles: true,
    });

    input.dispatchEvent(pasteEvent);

    if (!(await 点击文本带图片发送按钮())) {
      console.error("❌ 点击发送按钮失败");
      return false;
    }

    // console.log(`✅ 图文同发完成 -> ${groupName}`);
    return true;
  },
  async 发送先文本后图片消息(groupName, imgBase64, text) {
    if (!groupName || !imgBase64 || !text) {
      console.error("❌ 参数不完整");
      return false;
    }

    if (await 群发模块.发送文本消息(groupName, text)) {
      if (await 群发模块.发送图片消息(groupName, imgBase64, false)) {
        return true;
      } else {
        console.error("❌ 发送图片失败");
        return false;
      }
    } else {
      console.error("❌ 发送文本失败");
      return false;
    }
  },
  async 发送先图片后文本消息(groupName, imgBase64, text) {
    if (!groupName || !imgBase64 || !text) {
      console.error("❌ 参数不完整");
      return false;
    }

    if (await 群发模块.发送图片消息(groupName, imgBase64)) {
      if (await 群发模块.发送文本消息(groupName, text, false)) {
        return true;
      } else {
        console.error("❌ 发送文本失败");
        return false;
      }
    } else {
      console.error("❌ 发送图片失败");
      return false;
    }
  },
  //有什么发什么 （文本、图片都有就图文同发，只有文本就文本，只有图片就图片）
  async 发送默认消息(groupName, imgBase64, text) {
    // 参数校验
    if (!groupName) {
      console.error("❌ 群名不能为空");
      return false;
    }

    const hasText = text && text.trim().length > 0;
    const hasImage = imgBase64 && imgBase64.length > 0;

    // 情况1：什么都没有
    if (!hasText && !hasImage) {
      console.error("❌ 文本和图片都为空，无法发送");
      return false;
    }

    // 情况2：图文都有 → 图文同发
    if (hasText && hasImage) {
      console.log("📝🖼️ 检测到图文，使用图文同发模式");
      return await this.发送图文同发消息(groupName, imgBase64, text);
    }

    // 情况3：只有文本
    if (hasText && !hasImage) {
      console.log("📝 只有文本，发送文本消息");
      return await this.发送文本消息(groupName, text);
    }

    // 情况4：只有图片
    if (!hasText && hasImage) {
      console.log("🖼️ 只有图片，发送图片消息");
      return await this.发送图片消息(groupName, imgBase64);
    }

    return false;
  },
};

function 获取发送模式() {
  const selected = window._shadowRoot.querySelector(
    'input[name="sendOption"]:checked',
  );
  return selected ? selected.value : null;
}

let 群发按钮是否可用 = true;
async function 开始群发() {
  if (!群发按钮是否可用) {
    console.error("❌ 正在群发中，请勿重复点击");
    return;
  }
  群发按钮是否可用 = false;
  const groups = 获取已选群组();
  if (!groups.length) {
    console.error("❌ 没有选择群组");
    return;
  }

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    console.log(`📌 [${i + 1}/${groups.length}] 正在打开: ${group.name}`);
    const 发送模式 = 获取发送模式();
    switch (发送模式) {
      case "default":
        await 群发模块.发送默认消息(
          group.name,
          await 获取已选图片Base64(),
          window._shadowRoot.getElementById("messageInput").value,
        );
        break;

      case "imageAndText":
        await 群发模块.发送图文同发消息(
          group.name,
          await 获取已选图片Base64(),
          window._shadowRoot.getElementById("messageInput").value,
        );
        break;

      case "LeftimageAndText":
        await 群发模块.发送先图片后文本消息(
          group.name,
          await 获取已选图片Base64(),
          window._shadowRoot.getElementById("messageInput").value,
        );
        break;
      case "TextAndimage":
        await 群发模块.发送先文本后图片消息(
          group.name,
          await 获取已选图片Base64(),
          window._shadowRoot.getElementById("messageInput").value,
        );
        break;

      case "textOnly":
        await 群发模块.发送文本消息(
          group.name,
          window._shadowRoot.getElementById("messageInput").value,
        );
        break;

      case "imageOnly":
        await 群发模块.发送图片消息(group.name, await 获取已选图片Base64());
        break;
    }
  }

  console.log("✅ 所有消息发送完毕");

  await 清空所有输入();
  群发按钮是否可用 = true;
}

//绑定事件到按钮
window._shadowRoot
  .querySelector("#sendBatchBtn")
  .addEventListener("click", () => 开始群发());

// //-------------------------------------------------------------------------------------------点赞功能-------------------------------------------------------------------------------------------

// //   window._shadowRoot
// //   .querySelector("#reactionDrawer")
// //   .setAttribute("style", "display: block;");

// // ==================== 点赞模块（完整版） ====================
// (() => {
//   // 在点赞模块开始处添加这两个函数

//   // 提取消息自身的文本，排除引用/回复块中的文字
//   function extractMsgText(msgElement) {
//     // WhatsApp 回复消息结构：
//     //   [data-testid="quoted-message"]  ← 引用块（原句）
//     //   [data-testid="selectable-text"] ← 本条消息正文
//     // 如果直接 querySelector 会拿到引用块里的 selectable-text，导致误匹配。
//     // 正确做法：先把引用块从查找范围内排除。

//     // 克隆节点，移除引用块后再取文本（不影响真实 DOM）
//     const clone = msgElement.cloneNode(true);
//     clone
//       .querySelectorAll(
//         '[data-testid="quoted-message"], [data-testid="quoted-mention"]',
//       )
//       .forEach((el) => el.remove());

//     const textElement = clone.querySelector('[data-testid="selectable-text"]');
//     if (textElement) {
//       return textElement.innerText || textElement.textContent || "";
//     }
//     return "";
//   }

//   // 同步群组列表：纯展示，不克隆 checkbox，避免 querySelectorAll 读到重复节点
//   // 点赞时仍通过 获取已选群组() 读取主面板的真实选中状态
//   function syncReactionGroupList() {
//     const container = window._shadowRoot.getElementById("reactionGroupList");
//     if (!container) return;

//     const groups = 获取已选群组();
//     if (groups.length === 0) {
//       container.innerHTML =
//         '<div style="padding: 8px; color: #999;">请先在主面板选择群组</div>';
//       return;
//     }

//     container.innerHTML = groups
//       .map(
//         (g) => `
//         <div style="padding:4px 6px;font-size:12px;display:flex;align-items:center;gap:6px;">
//           <span style="color:#9c27b0;font-size:10px;">✓</span>
//           <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${g.name}">${g.name}</span>
//         </div>`,
//       )
//       .join("");
//   }

//   let reactionRunning = false;
//   let reactionStopRequested = false;
//   let selectedEmoji = "👍";
//   let totalScrollAttempts = 0;
//   let translateWasEnabled = false; // ✅ 新增这一行

//   const reactionDrawer = window._shadowRoot.getElementById("reactionDrawer");
//   const reactionOpenBtn = window._shadowRoot.getElementById(
//     "reactionPanelToggleBtn",
//   );
//   const reactionCloseBtn =
//     window._shadowRoot.getElementById("reactionCloseBtn");
//   const reactionStartBtn =
//     window._shadowRoot.getElementById("reactionStartBtn");
//   const reactionStopBtn = window._shadowRoot.getElementById("reactionStopBtn");
//   const reactionStatus = window._shadowRoot.getElementById("reactionStatus");
//   const reactionGroupList =
//     window._shadowRoot.getElementById("reactionGroupList");
//   const selectedEmojiDisplay = window._shadowRoot.getElementById(
//     "selectedEmojiDisplay",
//   );
//   const reactionKeyword = window._shadowRoot.getElementById("reactionKeyword");
//   const reactionIndexRow =
//     window._shadowRoot.getElementById("reactionIndexRow");

//   // 打开/关闭面板
//   reactionOpenBtn.addEventListener("click", () => {
//     const isOpen = reactionDrawer.style.display === "flex";
//     reactionDrawer.style.display = isOpen ? "none" : "flex";
//     if (!isOpen) syncReactionGroupList();
//   });

//   reactionCloseBtn.addEventListener("click", () => {
//     reactionDrawer.style.display = "none";
//   });

//   // 监听主面板选中变化（全选/反选/清空/单个勾选）及重新加载，点赞面板打开时自动刷新
//   window._shadowRoot.addEventListener("contactsUpdated", () => {
//     if (reactionDrawer.style.display === "flex") {
//       syncReactionGroupList();
//     }
//   });

//   // ==================== 自定义表情功能（直接使用输入框原始值） ====================

//   const customEmojiInput =
//     window._shadowRoot.getElementById("customEmojiInput");
//   const customEmojiPreview =
//     window._shadowRoot.getElementById("customEmojiPreview");
//   const clearCustomEmojiBtn = window._shadowRoot.getElementById(
//     "clearCustomEmojiBtn",
//   );

//   // 设置自定义表情（直接使用输入框的值）
//   function setCustomEmoji() {
//     const rawValue = customEmojiInput?.value.trim();
//     if (rawValue && rawValue.length > 0) {
//       selectedEmoji = rawValue;
//       if (customEmojiPreview) customEmojiPreview.textContent = selectedEmoji;
//       if (selectedEmojiDisplay)
//         selectedEmojiDisplay.textContent = selectedEmoji;

//       // 取消其他表情的高亮
//       window._shadowRoot
//         .querySelectorAll(".reaction-emoji-btn")
//         .forEach((b) => {
//           b.style.borderColor = "#eee";
//         });

//       setStatus(`✅ 已选择: ${selectedEmoji}`);
//     }
//   }

//   // 输入时实时更新
//   if (customEmojiInput) {
//     customEmojiInput.addEventListener("input", () => {
//       const val = customEmojiInput.value;
//       if (customEmojiPreview) customEmojiPreview.textContent = val || "?";
//       if (val && val.trim()) {
//         setCustomEmoji();
//       }
//     });

//     customEmojiInput.addEventListener("change", () => {
//       if (customEmojiInput.value && customEmojiInput.value.trim()) {
//         setCustomEmoji();
//       }
//     });
//   }

//   // 清空按钮
//   if (clearCustomEmojiBtn) {
//     clearCustomEmojiBtn.addEventListener("click", () => {
//       if (customEmojiInput) customEmojiInput.value = "";
//       if (customEmojiPreview) customEmojiPreview.textContent = "?";
//       setStatus("📝 已清空");
//     });
//   }

//   // 快捷表情点击
//   window._shadowRoot.querySelectorAll(".quick-custom-emoji").forEach((el) => {
//     el.addEventListener("click", () => {
//       const emoji = el.getAttribute("data-emoji");
//       if (emoji && customEmojiInput) {
//         customEmojiInput.value = emoji;
//         if (customEmojiPreview) customEmojiPreview.textContent = emoji;
//         selectedEmoji = emoji;
//         if (selectedEmojiDisplay) selectedEmojiDisplay.textContent = emoji;

//         window._shadowRoot
//           .querySelectorAll(".reaction-emoji-btn")
//           .forEach((b) => {
//             b.style.borderColor = "#eee";
//           });

//         setStatus(`✅ 已选择: ${selectedEmoji}`);
//       }
//     });
//   });

//   // Emoji 快捷按钮（原有的）
//   window._shadowRoot.querySelectorAll(".reaction-emoji-btn").forEach((btn) => {
//     btn.addEventListener("click", () => {
//       window._shadowRoot
//         .querySelectorAll(".reaction-emoji-btn")
//         .forEach((b) => (b.style.borderColor = "#eee"));
//       btn.style.borderColor = "#9c27b0";
//       selectedEmoji = btn.dataset.emoji;
//       if (selectedEmojiDisplay)
//         selectedEmojiDisplay.textContent = selectedEmoji;
//       // 同步到自定义输入框预览
//       if (customEmojiPreview) customEmojiPreview.textContent = selectedEmoji;
//       setStatus(`✅ 已选择: ${selectedEmoji}`);
//     });
//   });

//   const firstEmojiBtn = window._shadowRoot.querySelector(".reaction-emoji-btn");
//   if (firstEmojiBtn) firstEmojiBtn.style.borderColor = "#9c27b0";

//   // 切换目标选项显示
//   window._shadowRoot
//     .querySelectorAll('input[name="reactionTarget"]')
//     .forEach((radio) => {
//       radio.addEventListener("change", () => {
//         if (reactionKeyword)
//           reactionKeyword.style.display =
//             radio.value === "keyword" ? "block" : "none";
//         if (reactionIndexRow)
//           reactionIndexRow.style.display =
//             radio.value === "index" ? "flex" : "none";
//       });
//     });

//   // ==================== 工具函数 ====================
//   function sleep(ms) {
//     return new Promise((r) => setTimeout(r, ms));
//   }

//   // 智能等待：每 pollMs 检查一次 condFn()，最多等 maxMs，条件满足立即返回
//   async function waitFor(condFn, maxMs = 2000, pollMs = 60) {
//     const deadline = Date.now() + maxMs;
//     while (Date.now() < deadline) {
//       const result = condFn();
//       if (result) return result;
//       await sleep(pollMs);
//     }
//     return null;
//   }

//   function setStatus(msg) {
//     if (reactionStatus) {
//       reactionStatus.textContent = msg;
//     }
//     console.log("[点赞]", msg);
//   }

//   // 将公共工具函数挂到 window，供其他模块（如回复模块）复用
//   window.sleep = sleep;
//   window.waitFor = waitFor;
//   window.getMessageScroller = getMessageScroller;
//   window.scrollToBottom = scrollToBottom;
//   window.scrollUpToLoadMessages = scrollUpToLoadMessages;
//   window.findTargetMessages = findTargetMessages;
//   window.extractMsgText = extractMsgText;

//   // ==================== 消息滚动和查找 ====================
//   function getMessageScroller() {
//     // 结构特征：包含消息元素 data-pre-plain-text 的可滚动容器
//     // 优先用 data-testid（稳定语义属性）
//     const byTestId = document.querySelector(
//       '[data-testid="conversation-panel-messages"]',
//     );
//     if (byTestId && byTestId.scrollHeight > byTestId.clientHeight)
//       return byTestId;

//     // 次选：#main 下 role="region" 的可滚动区
//     const byRole = document.querySelector('#main [role="region"]');
//     if (byRole && byRole.scrollHeight > byRole.clientHeight) return byRole;

//     // 兜底：找包含消息的最近可滚动祖先
//     const firstMsg = document.querySelector("[data-id]");
//     if (firstMsg) {
//       let el = firstMsg.parentElement;
//       while (el && el !== document.body) {
//         if (el.scrollHeight > el.clientHeight + 10) return el;
//         el = el.parentElement;
//       }
//     }
//     return null;
//   }

//   function getAllMessageElements() {
//     // ✅ 以 [data-id] 行为单位，只取已渲染的（有 selectable-text 的）
//     const rows = Array.from(document.querySelectorAll("[data-id]")).filter(
//       (row) => row.querySelector('[data-testid="selectable-text"]') !== null,
//     );
//     if (rows.length > 0) {
//       console.log(`✅ 找到 ${rows.length} 条已渲染消息`);
//     } else {
//       console.warn("⚠️ 未找到任何已渲染消息");
//     }
//     return rows;
//   }

//   async function scrollToBottom(scroller) {
//     if (!scroller) return;
//     let lastScrollTop = -1;
//     let attempts = 0;
//     while (attempts < 10) {
//       scroller.scrollTop = scroller.scrollHeight;
//       await sleep(400);
//       if (scroller.scrollTop === lastScrollTop) break;
//       lastScrollTop = scroller.scrollTop;
//       attempts++;
//     }
//   }

//   async function scrollUpToLoadMessages(scroller, maxScrolls = 50) {
//     if (!scroller) return;
//     let scrollCount = 0;
//     let noChangeCount = 0;
//     while (scrollCount < maxScrolls && !reactionStopRequested) {
//       const currentCount = document.querySelectorAll("[data-id]").length;
//       scroller.scrollTop = Math.max(0, scroller.scrollTop - 200);
//       await sleep(400);
//       const newCount = document.querySelectorAll("[data-id]").length;
//       if (newCount === currentCount) {
//         noChangeCount++;
//         if (noChangeCount >= 5) break;
//       } else {
//         noChangeCount = 0;
//       }
//       scrollCount++;
//     }
//   }

//   function findTargetMessages(targetType, keyword, index) {
//     // ✅ 以 [data-id] 行为单位——每行对应一条消息
//     // data-virtualized="false" 的才是实际渲染的（虚拟滚动中可见的）
//     const allRows = Array.from(document.querySelectorAll("[data-id]")).filter(
//       (row) => {
//         // 只要已经渲染的（不是 virtualized 占位）
//         return row.querySelector('[data-testid="selectable-text"]') !== null;
//       },
//     );

//     if (allRows.length === 0) {
//       console.log("[调试] 未找到任何已渲染消息行");
//       return [];
//     }

//     // 过滤掉系统消息（无文字内容）
//     const messagesArray = allRows.filter((row) => {
//       const text = extractMsgText(row);
//       return text.length > 0 && !text.includes("已将该群组的设置更改为");
//     });

//     console.log(`[调试] 总共找到 ${messagesArray.length} 条有效消息`);
//     if (messagesArray.length === 0) return [];

//     switch (targetType) {
//       case "last":
//         console.log("[调试] 返回最后一条消息");
//         return [messagesArray[messagesArray.length - 1]];

//       case "all":
//         console.log(`[调试] 返回所有 ${messagesArray.length} 条消息`);
//         return messagesArray;

//       case "keyword": {
//         console.log(`[调试] 搜索关键词: "${keyword}"`);
//         const matched = [];
//         const normKw = keyword.toLowerCase().replace(/[''']/g, "'");
//         for (let i = 0; i < messagesArray.length; i++) {
//           const text = extractMsgText(messagesArray[i]);
//           const normText = text.toLowerCase().replace(/[''']/g, "'");
//           console.log(
//             `[消息 ${i + 1}] 前120: ${JSON.stringify(text.substring(0, 120))}`,
//           );
//           if (normText.includes(normKw)) {
//             matched.push(messagesArray[i]);
//             console.log(`[调试] ✅ 匹配 [${i + 1}]`);
//           }
//         }
//         console.log(`[调试] 匹配到 ${matched.length} 条消息`);
//         return matched;
//       }

//       case "index": {
//         const absN = Math.abs(index);
//         const idx = messagesArray.length - absN;
//         if (idx >= 0 && idx < messagesArray.length) {
//           console.log(`[调试] 返回倒数第 ${absN} 条 (index: ${idx})`);
//           return [messagesArray[idx]];
//         }
//         console.log(
//           `[调试] 索引 ${index} 超出范围（共 ${messagesArray.length} 条）`,
//         );
//         return [];
//       }

//       default:
//         return [];
//     }
//   }

//   // ==================== 表情面板操作 ====================
//   function getEmojiPanelScroller() {
//     const emojiSpan = document.querySelector("[data-emoji]");
//     if (emojiSpan) {
//       let parent = emojiSpan.parentElement;
//       while (parent) {
//         if (parent.scrollHeight > parent.clientHeight) return parent;
//         parent = parent.parentElement;
//       }
//     }
//     const virtualList = document.querySelector(
//       '[style*="height"][style*="transform"]',
//     );
//     if (virtualList) {
//       let parent = virtualList.parentElement;
//       while (parent) {
//         const style = window.getComputedStyle(parent);
//         if (style.overflowY === "auto" || style.overflowY === "scroll")
//           return parent;
//         parent = parent.parentElement;
//       }
//     }
//     const containers = document.querySelectorAll('div[style*="overflow"]');
//     for (const el of containers) {
//       if (el.scrollHeight > el.clientHeight && el.querySelector("[data-emoji]"))
//         return el;
//     }
//     return null;
//   }

//   function getAllCategoryButtons() {
//     // 结构特征：表情面板的分类按钮都是 role="tab" 或带已知分类名的 button
//     // role="tab" 是最稳定的，其次是 aria-label/title 含分类关键词
//     const byTab = document.querySelectorAll(
//       '[role="tablist"] [role="tab"], [role="tab"][aria-label], [role="tab"][title]',
//     );
//     if (byTab.length > 0) return byTab;

//     // 次选：button 带 aria-label 含已知分类名（多语言）
//     return document.querySelectorAll(
//       'button[aria-label*="表情"], button[aria-label*="人物"], button[aria-label*="动物"],' +
//         'button[aria-label*="食物"], button[aria-label*="活动"], button[aria-label*="旅行"],' +
//         'button[aria-label*="物件"], button[aria-label*="符号"], button[aria-label*="旗帜"],' +
//         'button[aria-label*="Smileys"], button[aria-label*="People"], button[aria-label*="Animals"],' +
//         'button[title*="表情"], button[title*="人物"], button[title*="动物"]',
//     );
//   }

//   function findEmojiInCurrentView(targetEmoji) {
//     const allEmojis = document.querySelectorAll("[data-emoji]");
//     for (const span of allEmojis) {
//       if (span.getAttribute("data-emoji") !== targetEmoji) continue;
//       if (!span.offsetParent) continue;
//       const rect = span.getBoundingClientRect();
//       if (rect.top > 0 && rect.bottom < window.innerHeight) return span;
//     }
//     return null;
//   }

//   async function scrollAndFindInCurrentCategory(
//     targetEmoji,
//     categoryName = "",
//   ) {
//     const scroller = getEmojiPanelScroller();
//     if (!scroller) return null;
//     let found = findEmojiInCurrentView(targetEmoji);
//     if (found) return found;
//     let scrollCount = 0;
//     let lastScrollTop = -1;
//     let noChangeCount = 0;
//     const maxScrolls = 200;
//     const scrollStep = 120;
//     while (scrollCount < maxScrolls && !reactionStopRequested) {
//       scroller.scrollTop += scrollStep;
//       await sleep(100);
//       if (Math.abs(scroller.scrollTop - lastScrollTop) < 5) {
//         noChangeCount++;
//         if (noChangeCount >= 5) break;
//       } else {
//         noChangeCount = 0;
//       }
//       lastScrollTop = scroller.scrollTop;
//       found = findEmojiInCurrentView(targetEmoji);
//       if (found) {
//         totalScrollAttempts += scrollCount;
//         found.scrollIntoView({ block: "center", behavior: "auto" });
//         await sleep(200);
//         return found;
//       }
//       scrollCount++;
//     }
//     totalScrollAttempts += scrollCount;
//     return null;
//   }

//   async function findEmojiAcrossAllCategories(targetEmoji) {
//     const categoryButtons = getAllCategoryButtons();
//     const triedCategories = new Set();

//     // 先尝试在当前分类查找
//     let found = await scrollAndFindInCurrentCategory(targetEmoji, "当前");
//     if (found) return found;

//     for (let i = 0; i < categoryButtons.length; i++) {
//       if (reactionStopRequested) return null;
//       const btn = categoryButtons[i];
//       const label =
//         btn.getAttribute("aria-label") ||
//         btn.getAttribute("title") ||
//         btn.textContent?.trim() ||
//         `分类${i + 1}`;
//       if (triedCategories.has(label)) continue;
//       triedCategories.add(label);
//       if (label.includes("肤色") || label.includes("skin")) continue;
//       btn.click();
//       await sleep(600);
//       found = await scrollAndFindInCurrentCategory(targetEmoji, label);
//       if (found) return found;
//     }

//     // 如果没找到，滚动到顶部再试一次
//     const scroller = getEmojiPanelScroller();
//     if (scroller) {
//       scroller.scrollTop = 0;
//       await sleep(300);
//       for (let i = 0; i < categoryButtons.length; i++) {
//         if (reactionStopRequested) return null;
//         const btn = categoryButtons[i];
//         const label = btn.getAttribute("aria-label") || "";
//         if (label.includes("肤色")) continue;
//         btn.click();
//         await sleep(500);
//         found = await scrollAndFindInCurrentCategory(
//           targetEmoji,
//           `${label}(2)`,
//         );
//         if (found) return found;
//       }
//     }
//     return null;
//   }

//   // ==================== 肤色选择器处理 ====================

//   // 找到当前可见的肤色弹出面板
//   // 结构特征：role="application" 的浮层，直接包含 li[role="button"] + img[alt]，
//   // 且第一项 img alt 就是基础表情（无肤色），后5项含肤色修饰符
//   function getSkinTonePopup() {
//     for (const el of document.querySelectorAll('[role="application"]')) {
//       if (!el.offsetParent) continue;
//       const items = el.querySelectorAll('li[role="button"]');
//       if (items.length >= 2) {
//         // 确认是肤色面板：至少有一项 img alt 含肤色修饰符
//         for (const li of items) {
//           const alt = li.querySelector("img")?.getAttribute("alt") || "";
//           if (/[\u{1F3FB}-\u{1F3FF}]/u.test(alt)) return el;
//         }
//       }
//     }
//     return null;
//   }

//   function hasSkinTonePicker() {
//     return !!getSkinTonePopup();
//   }

//   // 肤色修饰符 → 列表索引（第0项是无肤色原版，第1-5是带肤色）
//   const SKIN_TONE_MAP = { "🏻": 1, "🏼": 2, "🏽": 3, "🏾": 4, "🏿": 5 };

//   function clickSkinToneInPopup(popup, targetEmoji) {
//     const items = popup.querySelectorAll('li[role="button"]');
//     if (!items.length) return false;

//     // 解析目标肤色修饰符
//     const skinMatch = targetEmoji.match(/[\u{1F3FB}-\u{1F3FF}]/u);
//     const skinToneIndex = skinMatch ? (SKIN_TONE_MAP[skinMatch[0]] ?? 0) : 0;

//     if (skinToneIndex > 0 && items[skinToneIndex]) {
//       // 点击对应肤色
//       console.log(`🎨 选择肤色 index=${skinToneIndex}`);
//       items[skinToneIndex].click();
//       return true;
//     }

//     // 无肤色需求 → 点第一项（原版，alt 不含肤色修饰）
//     items[0].click();
//     console.log(`🎨 选择默认肤色（无）`);
//     return true;
//   }

//   async function smartClickEmoji(emojiElement, targetEmoji) {
//     const emoji = emojiElement.getAttribute("data-emoji");
//     console.log(`🖱️ 点击表情: ${emoji}`);

//     emojiElement.click();
//     await sleep(150); // 给浏览器渲染时间

//     // 先检查：肤色面板是否已经出现
//     const skinPopup = getSkinTonePopup();
//     if (skinPopup) {
//       console.log("🎨 检测到肤色面板，准备选择...");
//       await sleep(100);
//       clickSkinToneInPopup(skinPopup, targetEmoji);
//       // 等肤色面板消失（最多等 1.5s）
//       await waitFor(() => !getSkinTonePopup(), 1500, 40);
//       return true;
//     }

//     // 没有肤色面板 → 等一会再检查一次（有时面板出现有延迟）
//     await sleep(300);
//     const skinPopup2 = getSkinTonePopup();
//     if (skinPopup2) {
//       console.log("🎨 延迟后检测到肤色面板，准备选择...");
//       clickSkinToneInPopup(skinPopup2, targetEmoji);
//       await waitFor(() => !getSkinTonePopup(), 1500, 40);
//       return true;
//     }

//     // 没有肤色面板 → 直接当成成功（WhatsApp 自动选了默认肤色）
//     return true;
//   }

//   async function reactToOneMessage(msgElement, targetEmoji) {
//     try {
//       // 找到真正需要 hover 的行元素（.focusable-list-item 或 data-id 容器）
//       const dataId =
//         msgElement.closest("[data-id]")?.getAttribute("data-id") || null;

//       const hoverTarget =
//         msgElement.closest(".focusable-list-item") ||
//         msgElement.closest("[data-id]") ||
//         msgElement;

//       hoverTarget.scrollIntoView({ behavior: "auto", block: "center" });

//       // ✅ 智能等待：DOM 稳定后重新查找元素（防虚拟列表回收旧引用点错消息）
//       let liveTarget = hoverTarget;
//       if (dataId) {
//         // 等元素稳定出现在 DOM 里（最多等 800ms，出现即停）
//         const fresh = await waitFor(
//           () => document.querySelector(`[data-id="${CSS.escape(dataId)}"]`),
//           800,
//           30,
//         );
//         if (fresh) {
//           liveTarget = fresh;
//           // 如果重建后不在视口，再滚一次，等它出现
//           const rect = fresh.getBoundingClientRect();
//           if (rect.top < 0 || rect.bottom > window.innerHeight) {
//             fresh.scrollIntoView({ behavior: "auto", block: "center" });
//             await waitFor(
//               () => {
//                 const r = fresh.getBoundingClientRect();
//                 return r.top >= 0 && r.bottom <= window.innerHeight
//                   ? true
//                   : null;
//               },
//               600,
//               30,
//             );
//           }
//         }
//       }

//       // 触发 hover，让 WhatsApp 显示操作按钮
//       const triggerHover = () => {
//         liveTarget.dispatchEvent(
//           new MouseEvent("mouseover", { bubbles: true }),
//         );
//         liveTarget.dispatchEvent(
//           new MouseEvent("mouseenter", { bubbles: true }),
//         );
//         liveTarget.dispatchEvent(
//           new MouseEvent("mousemove", { bubbles: true }),
//         );
//       };
//       triggerHover();

//       // ✅ 智能等待心情按钮，出现即操作；等不到就再 hover 一次再等
//       const MOOD_SEL =
//         '[aria-label="留下心情"], [aria-label="React to message"]';
//       let moodBtn = await waitFor(
//         () => document.querySelector(MOOD_SEL),
//         1200,
//         40,
//       );
//       if (!moodBtn) {
//         triggerHover();
//         moodBtn = await waitFor(
//           () => document.querySelector(MOOD_SEL),
//           800,
//           40,
//         );
//       }
//       if (!moodBtn) return false;

//       moodBtn.click();

//       // ✅ 等快捷表情面板，出现即操作
//       await waitFor(() => document.querySelector("[data-emoji]"), 1000, 40);

//       // 🔥 直接查找完整的带肤色表情
//       const quickEmojis = document.querySelectorAll("[data-emoji]");
//       for (let i = 0; i < quickEmojis.length; i++) {
//         const emoji = quickEmojis[i].getAttribute("data-emoji");
//         // 直接匹配完整表情（包括肤色）
//         if (emoji === targetEmoji) {
//           if (quickEmojis[i].offsetParent) {
//             return await smartClickEmoji(quickEmojis[i], targetEmoji);
//           }
//         }
//       }

//       // 如果没找到完整匹配，再尝试基础表情匹配（用于没有肤色的情况）
//       const baseEmoji = targetEmoji.replace(/[\u{1F3FB}-\u{1F3FF}]/u, "");
//       if (baseEmoji !== targetEmoji) {
//         for (let i = 0; i < quickEmojis.length; i++) {
//           const emoji = quickEmojis[i].getAttribute("data-emoji");
//           if (emoji === baseEmoji) {
//             if (quickEmojis[i].offsetParent) {
//               return await smartClickEmoji(quickEmojis[i], targetEmoji);
//             }
//           }
//         }
//       }

//       const moreBtn = document.querySelector(
//         '[aria-label="更多回应"], [aria-label="更多心情"]',
//       );
//       if (!moreBtn) {
//         // 在完整面板中查找带肤色的表情
//         const found = await findEmojiAcrossAllCategories(targetEmoji);
//         if (found) return await smartClickEmoji(found, targetEmoji);
//         // 如果没找到，再找基础表情
//         if (baseEmoji !== targetEmoji) {
//           const foundBase = await findEmojiAcrossAllCategories(baseEmoji);
//           if (foundBase) return await smartClickEmoji(foundBase, targetEmoji);
//         }
//         document.body.click();
//         return false;
//       }

//       moreBtn.click();
//       // 智能等待完整表情面板
//       await waitFor(() => document.querySelector('[role="tab"]'), 1500, 80);

//       // 优先查找完整的带肤色表情
//       let foundEmoji = await findEmojiAcrossAllCategories(targetEmoji);
//       if (!foundEmoji && baseEmoji !== targetEmoji) {
//         foundEmoji = await findEmojiAcrossAllCategories(baseEmoji);
//       }

//       if (foundEmoji) return await smartClickEmoji(foundEmoji, targetEmoji);

//       document.body.click();
//       return false;
//     } catch (error) {
//       console.error("点赞出错:", error);
//       return false;
//     }
//   }

//   // ==================== 群组点赞主流程 ====================
//   async function runReactionForGroup(
//     groupName,
//     emoji,
//     target,
//     keyword,
//     index,
//     delayMs,
//   ) {
//     setStatus(`${groupName}: 正在打开聊天...`);
//     const clicked = await 搜索并点击聊天(groupName);
//     if (!clicked) return;

//     // ✅ 智能等待聊天内容加载（等消息出现，而不是固定等 3 秒）
//     await waitFor(() => document.querySelector("[data-id]"), 4000, 80);

//     const scroller = getMessageScroller();
//     if (!scroller) return;

//     await scrollToBottom(scroller);
//     // ✅ 等滚动完成后消息容器稳定
//     await waitFor(() => document.querySelector("[data-id]"), 1000, 40);

//     // 如果是关键词模式，边滚动边查找，找到即停
//     if (target === "keyword" && keyword) {
//       setStatus(`${groupName}: 正在搜索关键词 "${keyword}"...`);

//       // 用 data-id 去重，防止滚动过程中同一条消息被重复收集
//       const seenIds = new Set();

//       function collectUniqueMatches() {
//         const results = findTargetMessages(target, keyword, index);
//         const fresh = [];
//         for (const el of results) {
//           const id = el.getAttribute("data-id") || el.dataset.id;
//           if (id && seenIds.has(id)) continue;
//           if (id) seenIds.add(id);
//           fresh.push(el);
//         }
//         return fresh;
//       }

//       let foundMessages = null;
//       // 先在当前已加载的消息里找一次（最新消息往往就在视口内）
//       const quickCheck = collectUniqueMatches();
//       if (quickCheck.length > 0) {
//         foundMessages = quickCheck;
//         setStatus(`${groupName}: 找到 ${foundMessages.length} 条匹配消息`);
//       }

//       if (!foundMessages) {
//         // 向上滚动加载历史消息，智能等待懒加载完成
//         const SCROLL_STEP = 1200;
//         const MAX_SCROLLS = 400;
//         const LOAD_WAIT = 1500;
//         const STABLE_THRESHOLD = 4; // 消息数连续N次不增加 → 到顶了

//         let scrollCount = 0;
//         let stableCount = 0;
//         let lastMsgCount = document.querySelectorAll("[data-id]").length;

//         while (
//           scrollCount < MAX_SCROLLS &&
//           !reactionStopRequested &&
//           !foundMessages
//         ) {
//           const prevTop = scroller.scrollTop;
//           scroller.scrollTop = Math.max(0, scroller.scrollTop - SCROLL_STEP);

//           // 已经到顶了
//           if (scroller.scrollTop === 0 && prevTop === 0) break;

//           // 等待懒加载：轮询消息数，稳定后再匹配（最多等 LOAD_WAIT ms）
//           await waitFor(
//             () => {
//               const cur = document.querySelectorAll("[data-id]").length;
//               return cur > lastMsgCount ? cur : null;
//             },
//             LOAD_WAIT,
//             80,
//           );

//           const newMsgCount = document.querySelectorAll("[data-id]").length;
//           if (newMsgCount === lastMsgCount) {
//             stableCount++;
//             if (stableCount >= STABLE_THRESHOLD) break;
//           } else {
//             stableCount = 0;
//             lastMsgCount = newMsgCount;
//           }

//           setStatus(
//             `${groupName}: 搜索中... 已加载 ${newMsgCount} 条 (第${scrollCount + 1}屏)`,
//           );
//           const newMatches = collectUniqueMatches();
//           if (newMatches.length > 0) {
//             foundMessages = newMatches;
//             setStatus(`${groupName}: 找到 ${foundMessages.length} 条匹配消息`);
//             break;
//           }

//           scrollCount++;
//         }
//       }

//       if (!foundMessages || foundMessages.length === 0) {
//         setStatus(`${groupName}: 未找到包含 "${keyword}" 的消息`);
//         return;
//       }

//       // 点赞操作
//       for (let i = 0; i < foundMessages.length; i++) {
//         if (reactionStopRequested) break;
//         setStatus(`${groupName}: 点赞 ${i + 1}/${foundMessages.length}`);
//         await reactToOneMessage(foundMessages[i], emoji);
//         if (i < foundMessages.length - 1) await sleep(delayMs);
//       }
//       return;
//     }

//     // 其他模式保持原逻辑
//     // all 模式需要加载所有历史消息；last/index 模式只需最新消息，scrollToBottom 已够
//     if (target === "all") {
//       await scrollUpToLoadMessages(scroller, 40);
//     }

//     const targetMessages = findTargetMessages(target, keyword, index);
//     if (targetMessages.length === 0) {
//       setStatus(`${groupName}: 未找到目标消息`);
//       return;
//     }

//     setStatus(`${groupName}: 找到 ${targetMessages.length} 条消息`);
//     for (let i = 0; i < targetMessages.length; i++) {
//       if (reactionStopRequested) break;
//       setStatus(`${groupName}: 点赞 ${i + 1}/${targetMessages.length}`);
//       await reactToOneMessage(targetMessages[i], emoji);
//       if (i < targetMessages.length - 1) await sleep(delayMs);
//     }
//   }

//   // ==================== 翻译开关辅助函数 ====================
//   function getTranslateBtn() {
//     return window._shadowRoot.getElementById("translateToggleBtn");
//   }

//   function isTranslateEnabled() {
//     const btn = getTranslateBtn();
//     return btn && btn.style.background === "rgb(217, 48, 37)";
//   }

//   function restoreTranslateIfNeeded() {
//     if (!translateWasEnabled) return;
//     const btn = getTranslateBtn();
//     if (btn && btn.style.background !== "rgb(217, 48, 37)") {
//       btn.click();
//       console.log("[点赞] 已恢复自动翻译");
//     }
//     translateWasEnabled = false;
//   }

//   // ==================== 开始/停止 ====================
//   reactionStartBtn.addEventListener("click", async () => {
//     // 如果自动翻译开启，先关闭并记录状态
//     const translateBtn = getTranslateBtn();
//     console.log("[调试] translateBtn 元素:", translateBtn);
//     if (translateBtn) {
//       console.log("[调试] translateBtn 背景色:", translateBtn.style.background);
//     }
//     translateWasEnabled = isTranslateEnabled();
//     console.log("[调试] translateWasEnabled:", translateWasEnabled);
//     if (translateWasEnabled) {
//       translateBtn.click();
//       console.log("[点赞] 已关闭自动翻译");
//     }

//     const selectedGroups = 获取已选群组();
//     if (selectedGroups.length === 0) {
//       setStatus("❌ 请先选择群组");
//       return;
//     }
//     const targetType =
//       window._shadowRoot.querySelector('input[name="reactionTarget"]:checked')
//         ?.value || "last";
//     const keyword =
//       window._shadowRoot.getElementById("reactionKeyword")?.value.trim() || "";
//     const index =
//       parseInt(window._shadowRoot.getElementById("reactionIndex")?.value) || 1;
//     const delayMs =
//       (parseInt(window._shadowRoot.getElementById("reactionDelay")?.value) ||
//         3) * 1000;
//     if (targetType === "keyword" && !keyword) {
//       setStatus("❌ 请输入关键词");
//       return;
//     }
//     reactionRunning = true;
//     reactionStopRequested = false;
//     reactionStartBtn.style.display = "none";
//     reactionStopBtn.style.display = "block";
//     totalScrollAttempts = 0;
//     let totalGroups = 0;
//     for (let i = 0; i < selectedGroups.length; i++) {
//       if (reactionStopRequested) break;

//       const group = selectedGroups[i];
//       const groupName = group.name;

//       setStatus(`[${i + 1}/${selectedGroups.length}] ${groupName}`);
//       await runReactionForGroup(
//         groupName,
//         selectedEmoji,
//         targetType,
//         keyword,
//         index,
//         delayMs,
//       );
//       totalGroups++;
//       if (i < selectedGroups.length - 1 && !reactionStopRequested) {
//         await sleep(2000);
//       }
//     }
//     reactionRunning = false;
//     reactionStartBtn.style.display = "block";
//     reactionStopBtn.style.display = "none";

//     restoreTranslateIfNeeded();

//     if (reactionStopRequested) {
//       setStatus(`⏹ 已停止。完成 ${totalGroups} 个群组`);
//     } else {
//       setStatus(`🎉 完成！共 ${totalGroups} 个群组`);
//     }
//   });

//   reactionStopBtn.addEventListener("click", () => {
//     reactionStopRequested = true;
//     setStatus("⏹ 正在停止...");
//     restoreTranslateIfNeeded();
//   });
// })();

// // ==================== 回复模块 ====================
// (function () {
//   let replyRunning = false;
//   let replyStopRequested = false;

//   const replyDrawer = window._shadowRoot.getElementById("replyDrawer");
//   const replyOpenBtn = window._shadowRoot.getElementById("replyPanelToggleBtn");
//   const replyCloseBtn = window._shadowRoot.getElementById("replyCloseBtn");
//   const replyStartBtn = window._shadowRoot.getElementById("replyStartBtn");
//   const replyStopBtn = window._shadowRoot.getElementById("replyStopBtn");
//   const replyStatusEl = window._shadowRoot.getElementById("replyStatus");

//   function setReplyStatus(msg) {
//     if (replyStatusEl) replyStatusEl.textContent = msg;
//     console.log("[回复]", msg);
//   }

//   // ── 群组列表同步展示（与点赞模块同一套 contactsUpdated 事件）──
//   function syncReplyGroupList() {
//     const container = window._shadowRoot.getElementById("replyGroupList");
//     if (!container) return;
//     const groups = 获取已选群组();
//     if (groups.length === 0) {
//       container.innerHTML =
//         '<div style="padding:8px;color:#999;">请先在主面板选择群组</div>';
//       return;
//     }
//     container.innerHTML = groups
//       .map(
//         (g) => `
//         <div style="padding:4px 6px;font-size:12px;display:flex;align-items:center;gap:6px;">
//           <span style="color:#00897b;font-size:10px;">✓</span>
//           <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${g.name}">${g.name}</span>
//         </div>`,
//       )
//       .join("");
//   }

//   // ── 面板开关 ──
//   // 刷新内容预览（读主面板输入框 + #preview 图片 + 发送模式）
//   function syncReplyContentPreview() {
//     if (replyDrawer.style.display !== "flex") return;

//     const imgPreviewRow = window._shadowRoot.getElementById("replyImgPreview");
//     const imgThumb = window._shadowRoot.getElementById("replyImgThumb");
//     const textPreviewEl = window._shadowRoot.getElementById("replyTextPreview");
//     const modePreviewEl = window._shadowRoot.getElementById("replyModePreview");
//     if (!textPreviewEl) return;

//     const text = window._shadowRoot.getElementById("messageInput")?.value || "";
//     // 直接读主面板 #preview 的 src（FileReader 已经处理好了）
//     const imgSrc = window._shadowRoot.getElementById("preview")?.src || "";
//     const hasImg =
//       imgSrc && !imgSrc.endsWith("#") && imgSrc !== window.location.href;
//     const mode = 获取发送模式() || "default";

//     const modeLabels = {
//       default: "默认模式",
//       imageAndText: "图文同发",
//       LeftimageAndText: "先图后文",
//       TextAndimage: "先文后图",
//       textOnly: "仅文本",
//       imageOnly: "仅图片",
//     };

//     // 图片缩略图
//     if (imgPreviewRow && imgThumb) {
//       if (hasImg) {
//         imgThumb.src = imgSrc;
//         imgPreviewRow.style.display = "block";
//       } else {
//         imgThumb.src = "";
//         imgPreviewRow.style.display = "none";
//       }
//     }

//     // 文本
//     if (!text && !hasImg) {
//       textPreviewEl.textContent = "（主面板暂无内容）";
//       textPreviewEl.style.color = "#aaa";
//     } else if (text) {
//       textPreviewEl.textContent =
//         text.length > 80 ? text.slice(0, 80) + "…" : text;
//       textPreviewEl.style.color = "#333";
//     } else {
//       textPreviewEl.textContent = "";
//     }

//     // 模式标签
//     if (modePreviewEl) {
//       modePreviewEl.textContent = `发送模式：${modeLabels[mode] || mode}`;
//     }
//   }

//   replyOpenBtn?.addEventListener("click", () => {
//     const isOpen = replyDrawer.style.display === "flex";
//     replyDrawer.style.display = isOpen ? "none" : "flex";
//     if (!isOpen) {
//       syncReplyGroupList();
//       syncReplyContentPreview();
//     }
//   });
//   replyCloseBtn?.addEventListener("click", () => {
//     replyDrawer.style.display = "none";
//   });

//   // 监听主面板输入框变化，实时刷新预览
//   window._shadowRoot
//     .getElementById("messageInput")
//     ?.addEventListener("input", syncReplyContentPreview);
//   // 监听发送模式切换
//   window._shadowRoot
//     .querySelectorAll('input[name="sendOption"]')
//     .forEach((r) => r.addEventListener("change", syncReplyContentPreview));
//   // 监听图片选择（change 后 #preview src 是异步更新的，用 MutationObserver 最准确）
//   const previewImg = window._shadowRoot.getElementById("preview");
//   if (previewImg) {
//     new MutationObserver(syncReplyContentPreview).observe(previewImg, {
//       attributes: true,
//       attributeFilter: ["src"],
//     });
//   }
//   // 清空按钮（src 置空由 MutationObserver 捕获，这里保留一个兜底）
//   window._shadowRoot
//     .querySelector("#clear-btn")
//     ?.addEventListener("click", () => setTimeout(syncReplyContentPreview, 80));

//   // 监听主面板选中变化，打开时实时刷新
//   window._shadowRoot.addEventListener("contactsUpdated", () => {
//     if (replyDrawer.style.display === "flex") syncReplyGroupList();
//   });

//   // ── 目标选择联动：关键词输入框 / 第N条行 显隐 ──
//   replyDrawer
//     ?.querySelectorAll('input[name="replyTarget"]')
//     .forEach((radio) => {
//       radio.addEventListener("change", () => {
//         const kw = window._shadowRoot.getElementById("replyKeyword");
//         const idxRow = window._shadowRoot.getElementById("replyIndexRow");
//         if (kw) kw.style.display = radio.value === "keyword" ? "block" : "none";
//         if (idxRow)
//           idxRow.style.display = radio.value === "index" ? "flex" : "none";
//       });
//     });

//   // ── 触发 WhatsApp 回复操作 ──
//   // 复用点赞模块已有的 waitFor / sleep（定义在同一作用域外层，全局可用）
//   // 输入框区域的回复预览 selector（footer 里，不是消息里的 quoted-message）
//   const REPLY_PREVIEW_SEL =
//     'footer [data-testid="quoted-message"], [data-testid="reply-preview"], [role="complementary"] [data-testid="quoted-message"]';

//   // payload = { text, imgBase64, mode }
//   async function replyToOneMessage(msgElement, payload) {
//     try {
//       const dataId =
//         msgElement.closest("[data-id]")?.getAttribute("data-id") || null;
//       const hoverTarget =
//         msgElement.closest(".focusable-list-item") ||
//         msgElement.closest("[data-id]") ||
//         msgElement;

//       hoverTarget.scrollIntoView({ behavior: "auto", block: "center" });

//       // 重新从 DOM 取最新引用（防虚拟列表回收）
//       let liveTarget = hoverTarget;
//       if (dataId) {
//         const fresh = await window.waitFor(
//           () => document.querySelector(`[data-id="${CSS.escape(dataId)}"]`),
//           800,
//           30,
//         );
//         if (fresh) {
//           liveTarget = fresh;
//           const rect = fresh.getBoundingClientRect();
//           if (rect.top < 0 || rect.bottom > window.innerHeight) {
//             fresh.scrollIntoView({ behavior: "auto", block: "center" });
//             await window.waitFor(
//               () => {
//                 const r = fresh.getBoundingClientRect();
//                 return r.top >= 0 && r.bottom <= window.innerHeight
//                   ? true
//                   : null;
//               },
//               600,
//               30,
//             );
//           }
//         }
//       }

//       // ── 方式1：双击消息内容区触发回复（最可靠，与手势一致）──
//       // WhatsApp 对 [data-testid="msg-container"] 内容区双击会直接进入回复模式
//       const msgContainer =
//         liveTarget.querySelector('[data-testid="msg-container"]') || liveTarget;
//       const rect = msgContainer.getBoundingClientRect();
//       const clickX = rect.left + rect.width / 2;
//       const clickY = rect.top + rect.height / 2;

//       const dblClickOpts = {
//         bubbles: true,
//         cancelable: true,
//         view: window,
//         clientX: clickX,
//         clientY: clickY,
//       };

//       const triggerDblClick = () => {
//         msgContainer.dispatchEvent(new MouseEvent("mousedown", dblClickOpts));
//         msgContainer.dispatchEvent(new MouseEvent("mouseup", dblClickOpts));
//         msgContainer.dispatchEvent(new MouseEvent("click", dblClickOpts));
//         msgContainer.dispatchEvent(new MouseEvent("mousedown", dblClickOpts));
//         msgContainer.dispatchEvent(new MouseEvent("mouseup", dblClickOpts));
//         msgContainer.dispatchEvent(new MouseEvent("click", dblClickOpts));
//         msgContainer.dispatchEvent(new MouseEvent("dblclick", dblClickOpts));
//       };

//       triggerDblClick();

//       // 等待 footer 里的引用预览出现
//       let replyPreview = await window.waitFor(
//         () => document.querySelector(REPLY_PREVIEW_SEL),
//         1000,
//         40,
//       );

//       // ── 方式2：双击没触发，改用 hover → 点回复按钮 ──
//       if (!replyPreview) {
//         console.log("[回复] 双击未触发，尝试 hover 按钮...");

//         const triggerHover = () => {
//           liveTarget.dispatchEvent(
//             new MouseEvent("mouseover", { bubbles: true }),
//           );
//           liveTarget.dispatchEvent(
//             new MouseEvent("mouseenter", { bubbles: true }),
//           );
//           liveTarget.dispatchEvent(
//             new MouseEvent("mousemove", { bubbles: true }),
//           );
//         };
//         triggerHover();

//         // WhatsApp 中文：回复；英文：Reply
//         const REPLY_BTN_SEL = '[aria-label="回复"], [aria-label="Reply"]';
//         let replyBtn = await window.waitFor(
//           () => document.querySelector(REPLY_BTN_SEL),
//           1200,
//           40,
//         );
//         if (!replyBtn) {
//           triggerHover();
//           replyBtn = await window.waitFor(
//             () => document.querySelector(REPLY_BTN_SEL),
//             800,
//             40,
//           );
//         }

//         // 方式3：回复按钮也没有，打开"..."菜单找
//         if (!replyBtn) {
//           console.log("[回复] hover 按钮未出现，尝试更多菜单...");
//           const moreBtn = document.querySelector(
//             '[aria-label="更多选项"], [aria-label="More options"]',
//           );
//           if (moreBtn) {
//             moreBtn.click();
//             replyBtn = await window.waitFor(
//               () => document.querySelector(REPLY_BTN_SEL),
//               800,
//               40,
//             );
//           }
//         }

//         if (!replyBtn) {
//           console.warn("[回复] 三种方式均未找到回复入口，跳过此条");
//           return false;
//         }

//         replyBtn.click();
//         replyPreview = await window.waitFor(
//           () => document.querySelector(REPLY_PREVIEW_SEL),
//           1500,
//           40,
//         );
//       }

//       if (!replyPreview) {
//         console.warn("[回复] footer 引用预览未出现，触发失败");
//         return false;
//       }

//       const { text, imgBase64, mode } = payload;

//       // ── 底层：在引用已激活状态下粘贴图片发送（第1条，带引用）──
//       async function pasteAndSendImage(captionText) {
//         const input = 群发模块.getInputDom();
//         if (!input || !imgBase64) return false;
//         input.focus();
//         input.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
//         const blob = 群发模块.base64转Blob(imgBase64);
//         const dt = new DataTransfer();
//         dt.items.add(new File([blob], "image.png", { type: blob.type }));
//         input.dispatchEvent(
//           new ClipboardEvent("paste", {
//             clipboardData: dt,
//             bubbles: true,
//             cancelable: true,
//           }),
//         );
//         // 等图片预览弹窗出现
//         await window.waitFor(
//           () => document.querySelector('[data-testid="media-editor"]'),
//           2000,
//           50,
//         );
//         if (captionText) {
//           const captionBox = document.querySelector(
//             '[data-testid="media-caption-input-container"] [contenteditable]',
//           );
//           if (captionBox) await 模拟真实输入(captionText, captionBox);
//         }
//         await 点击文本带图片发送按钮();
//         await window.sleep(300);
//         return true;
//       }

//       // ── 底层：在引用已激活状态下输入文本并发送（带引用）──
//       async function sendTextWithReply(sendText) {
//         const inputBox = await 等待目标出现(() =>
//           document.querySelector(
//             '[data-testid="conversation-compose-box-input"]',
//           ),
//         );
//         if (!inputBox || !sendText) return false;
//         await 模拟真实输入(sendText, inputBox);
//         await window.sleep(200);
//         inputBox.dispatchEvent(
//           new KeyboardEvent("keydown", {
//             key: "Enter",
//             code: "Enter",
//             keyCode: 13,
//             bubbles: true,
//           }),
//         );
//         // 等引用预览消失确认发送完成
//         await window.waitFor(
//           () => !document.querySelector(REPLY_PREVIEW_SEL),
//           2500,
//           60,
//         );
//         await window.sleep(300);
//         return true;
//       }

//       // ── 底层：不带引用直接发文本（第2条）──
//       async function sendTextPlain(sendText) {
//         const inputBox = await 等待目标出现(() =>
//           document.querySelector(
//             '[data-testid="conversation-compose-box-input"]',
//           ),
//         );
//         if (!inputBox || !sendText) return false;
//         await 模拟真实输入(sendText, inputBox);
//         await window.sleep(200);
//         inputBox.dispatchEvent(
//           new KeyboardEvent("keydown", {
//             key: "Enter",
//             code: "Enter",
//             keyCode: 13,
//             bubbles: true,
//           }),
//         );
//         await window.sleep(500);
//         return true;
//       }

//       // ── 发送模式决定第1条（带引用）是图还是文 ──
//       switch (mode) {
//         case "textOnly":
//         case "default":
//           // 第1条（带引用）：文本
//           await sendTextWithReply(text);
//           break;

//         case "imageOnly":
//           // 第1条（带引用）：图片
//           await pasteAndSendImage("");
//           break;

//         case "imageAndText":
//           // 第1条（带引用）：图片 + 说明文字同发
//           await pasteAndSendImage(text);
//           break;

//         case "LeftimageAndText":
//           // 先图后文
//           // 第1条（带引用）：图片
//           await pasteAndSendImage("");
//           // 第2条（不带引用）：文本
//           await sendTextPlain(text);
//           break;

//         case "TextAndimage":
//           // 先文后图
//           // 第1条（带引用）：文本
//           await sendTextWithReply(text);
//           // 第2条（不带引用）：图片
//           await pasteAndSendImage("");
//           break;

//         default:
//           await sendTextWithReply(text);
//       }

//       return true;
//     } catch (err) {
//       console.error("[回复] 出错:", err);
//       return false;
//     }
//   }

//   // ── 单个群组回复主流程（复用点赞模块的 findTargetMessages 搜索逻辑）──
//   async function runReplyForGroup(
//     groupName,
//     payload,
//     target,
//     keyword,
//     index,
//     delayMs,
//   ) {
//     setReplyStatus(`${groupName}: 正在打开聊天...`);
//     const clicked = await 搜索并点击聊天(groupName);
//     if (!clicked) return;

//     await window.waitFor(() => document.querySelector("[data-id]"), 4000, 80);

//     const scroller = window.getMessageScroller();
//     if (!scroller) return;

//     await window.scrollToBottom(scroller);
//     await window.waitFor(() => document.querySelector("[data-id]"), 1000, 40);

//     let targetMessages = [];

//     if (target === "keyword" && keyword) {
//       setReplyStatus(`${groupName}: 正在搜索关键词 "${keyword}"...`);
//       const seenIds = new Set();

//       function collectUnique() {
//         const results = window.findTargetMessages(target, keyword, index);
//         const fresh = [];
//         for (const el of results) {
//           const id = el.getAttribute("data-id") || el.dataset.id;
//           if (id && seenIds.has(id)) continue;
//           if (id) seenIds.add(id);
//           fresh.push(el);
//         }
//         return fresh;
//       }

//       const quickCheck = collectUnique();
//       if (quickCheck.length > 0) {
//         targetMessages = quickCheck;
//         setReplyStatus(
//           `${groupName}: 找到 ${targetMessages.length} 条匹配消息`,
//         );
//       } else {
//         const SCROLL_STEP = 1200,
//           MAX_SCROLLS = 400,
//           LOAD_WAIT = 1500,
//           STABLE_THRESHOLD = 4;
//         let scrollCount = 0,
//           stableCount = 0;
//         let lastMsgCount = document.querySelectorAll("[data-id]").length;

//         while (
//           scrollCount < MAX_SCROLLS &&
//           !replyStopRequested &&
//           !targetMessages.length
//         ) {
//           const prevTop = scroller.scrollTop;
//           scroller.scrollTop = Math.max(0, scroller.scrollTop - SCROLL_STEP);
//           if (scroller.scrollTop === 0 && prevTop === 0) break;

//           await window.waitFor(
//             () => {
//               const cur = document.querySelectorAll("[data-id]").length;
//               return cur > lastMsgCount ? cur : null;
//             },
//             LOAD_WAIT,
//             80,
//           );

//           const newMsgCount = document.querySelectorAll("[data-id]").length;
//           if (newMsgCount === lastMsgCount) {
//             if (++stableCount >= STABLE_THRESHOLD) break;
//           } else {
//             stableCount = 0;
//             lastMsgCount = newMsgCount;
//           }

//           setReplyStatus(
//             `${groupName}: 搜索中... 已加载 ${newMsgCount} 条 (第${scrollCount + 1}屏)`,
//           );
//           const matches = collectUnique();
//           if (matches.length > 0) {
//             targetMessages = matches;
//             setReplyStatus(
//               `${groupName}: 找到 ${targetMessages.length} 条匹配消息`,
//             );
//           }
//           scrollCount++;
//         }
//       }

//       if (!targetMessages.length) {
//         setReplyStatus(`${groupName}: 未找到包含 "${keyword}" 的消息`);
//         return;
//       }
//     } else {
//       if (target === "all") await window.scrollUpToLoadMessages(scroller, 40);
//       targetMessages = window.findTargetMessages(target, keyword, index);
//       if (!targetMessages.length) {
//         setReplyStatus(`${groupName}: 未找到目标消息`);
//         return;
//       }
//     }

//     setReplyStatus(
//       `${groupName}: 找到 ${targetMessages.length} 条消息，开始回复...`,
//     );
//     for (let i = 0; i < targetMessages.length; i++) {
//       if (replyStopRequested) break;
//       setReplyStatus(`${groupName}: 回复 ${i + 1}/${targetMessages.length}`);
//       await replyToOneMessage(targetMessages[i], payload);
//       if (i < targetMessages.length - 1) await window.sleep(delayMs);
//     }
//   }

//   // ── 开始按钮 ──
//   replyStartBtn?.addEventListener("click", async () => {
//     const selectedGroups = 获取已选群组();
//     if (!selectedGroups.length) {
//       setReplyStatus("❌ 请先选择群组");
//       return;
//     }

//     // 读取主面板内容
//     const text = window._shadowRoot.getElementById("messageInput")?.value || "";
//     const imgBase64 = await 获取已选图片Base64();
//     const mode = 获取发送模式() || "default";

//     // 校验：根据模式判断是否有有效内容
//     const needText = [
//       "default",
//       "textOnly",
//       "imageAndText",
//       "LeftimageAndText",
//       "TextAndimage",
//     ].includes(mode);
//     const needImg = [
//       "imageOnly",
//       "imageAndText",
//       "LeftimageAndText",
//       "TextAndimage",
//     ].includes(mode);
//     if (needText && !text && mode !== "default") {
//       setReplyStatus("❌ 主面板文本内容为空");
//       return;
//     }
//     if (needImg && !imgBase64) {
//       setReplyStatus("❌ 主面板未选择图片");
//       return;
//     }
//     if (mode === "default" && !text && !imgBase64) {
//       setReplyStatus("❌ 主面板无内容");
//       return;
//     }

//     const payload = { text, imgBase64, mode };

//     const target =
//       window._shadowRoot.querySelector('input[name="replyTarget"]:checked')
//         ?.value || "last";
//     const keyword =
//       window._shadowRoot.getElementById("replyKeyword")?.value.trim() || "";
//     const index =
//       parseInt(window._shadowRoot.getElementById("replyIndex")?.value) || 1;
//     const delayMs =
//       (parseInt(window._shadowRoot.getElementById("replyDelay")?.value) || 1) *
//       1000;

//     if (target === "keyword" && !keyword) {
//       setReplyStatus("❌ 请输入关键词");
//       return;
//     }

//     replyRunning = true;
//     replyStopRequested = false;
//     replyStartBtn.style.display = "none";
//     replyStopBtn.style.display = "block";

//     let totalGroups = 0;
//     for (let i = 0; i < selectedGroups.length; i++) {
//       if (replyStopRequested) break;
//       const group = selectedGroups[i];
//       setReplyStatus(`[${i + 1}/${selectedGroups.length}] ${group.name}`);
//       await runReplyForGroup(
//         group.name,
//         payload,
//         target,
//         keyword,
//         index,
//         delayMs,
//       );
//       totalGroups++;
//       if (i < selectedGroups.length - 1 && !replyStopRequested)
//         await window.sleep(2000);
//     }

//     replyRunning = false;
//     replyStartBtn.style.display = "block";
//     replyStopBtn.style.display = "none";
//     setReplyStatus(
//       replyStopRequested
//         ? `⏹ 已停止。完成 ${totalGroups} 个群组`
//         : `🎉 完成！共 ${totalGroups} 个群组`,
//     );
//   });

//   // ── 停止按钮 ──
//   replyStopBtn?.addEventListener("click", () => {
//     replyStopRequested = true;
//     setReplyStatus("⏹ 正在停止...");
//   });
// })();
