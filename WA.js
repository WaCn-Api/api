// ==================== 全局配置 ====================
const CONFIG = {
    CUSTOMER_DATA_FILE: "whatsapp_customers.json",
    CUSTOMER_BACKUP_FILE: "whatsapp_customers_backup.json",
    DB_NAME: "WhatsAppCustomerDB",
    DB_VERSION: 1,
    STORE_NAME: "uniqueNumbers",
    API_TIMEOUT: 5000,
    MARKER: {
        BADGE_EMOJI: "⭐",
        BADGE_TEXT: "客户",
        BADGE_COLOR: "#25D366",
        BADGE_TEXT_COLOR: "white"
    }
};

// ==================== C# API 初始化 ====================

let csharpApiReady = false;
let appDirectory = '';

/**
 * 等待C# API就绪
 */
async function waitForCSharpApi(timeout = CONFIG.API_TIMEOUT) {
    if (csharpApiReady) return true;
    
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        try {
            // 你的后端使用这种方式绑定
            await CefSharp.BindObjectAsync("csharpApi");
            
            if (typeof csharpApi !== 'undefined') {
                // 获取程序目录
                appDirectory = await csharpApi.getAppDirectory();
                console.log('✅ C# API 已就绪，程序目录:', appDirectory);
                
                // 挂载辅助方法
                window.saveFile = async function(filename, data) {
                    try {
                        const jsonStr = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
                        // 拼接完整路径
                        const fullPath = appDirectory + filename;
                        await csharpApi.saveDataToFile(fullPath, jsonStr);
                        return { success: true, path: fullPath };
                    } catch (e) {
                        console.error('保存失败:', e);
                        return { success: false, error: e.message };
                    }
                };

                window.readFile = async function(filename) {
                    try {
                        const fullPath = filename.includes(':\\') || filename.startsWith('/')
                            ? filename
                            : appDirectory + filename;
                        const result = await csharpApi.readDataFromFile(fullPath);
                        return result ? JSON.parse(result) : null;
                    } catch (e) {
                        console.error('读取失败:', e);
                        return null;
                    }
                };
                
                csharpApiReady = true;
                window.__csharpApiReady = true;
                return true;
            }
        } catch (e) {
            // 忽略错误，继续等待
        }
        await new Promise(r => setTimeout(r, 100));
    }
    
    console.warn("⚠️ C# API 未就绪，将使用IndexedDB降级方案");
    return false;
}

// ==================== 工具函数 ====================

/**
 * 模拟真实点击事件
 */
async function 模拟真实点击(element) {
    if (!element) return false;
    
    element.scrollIntoView({ behavior: "auto", block: "center" });
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const box = element.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    
    const events = [
        { type: "mousedown", buttons: 1 },
        { type: "mouseup", buttons: 0 },
        { type: "click", buttons: 0 }
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
            composed: true
        });
        element.dispatchEvent(event);
        await new Promise(resolve => setTimeout(resolve, 35));
    }
    
    element.click();
    return true;
}

/**
 * 获取输入框
 */
function getInputDom() {
    const selectors = [
        "footer p._aupe.copyable-text",
        'footer div[contenteditable="true"]',
        'footer .lexical-rich-text-input div[contenteditable="true"]',
        'div[role="textbox"][contenteditable="true"]',
        'footer .x1hx0egp[contenteditable="true"]',
        '.lexical-rich-text-input div[contenteditable="true"]',
        '.x1hx0egp[contenteditable="true"]'
    ];
    
    for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el) return el;
    }
    return null;
}

/**
 * 获取发送按钮
 */
function getSendButton() {
    const selectors = [
        'div[role="button"][aria-label="发送"]',
        'span[data-icon="send"]',
        'button[aria-label="发送"]',
        'div[aria-label="发送"][role="button"]',
        ".x1f6kntn",
        'span[data-icon="wds-ic-send-filled"]'
    ];
    
    for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el) return el;
    }
    return null;
}

/**
 * 图片处理函数
 */
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
        "image/avif": "avif"
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

// ==================== 本地文件存储管理（适配你的后端）====================

/**
 * 保存客户数据到固定文件
 */
async function saveCustomerDataToFile(customers) {
    try {
        const apiReady = await waitForCSharpApi();
        if (!apiReady) {
            throw new Error("C# API未就绪");
        }

        const timestamp = new Date().toISOString();
        const dataToSave = {
            metadata: {
                version: "1.0",
                lastUpdate: timestamp,
                totalCount: customers.length,
                filename: CONFIG.CUSTOMER_DATA_FILE,
                type: "whatsapp_customers"
            },
            customers: customers.map(item => {
                if (item.号码) {
                    return {
                        ...item,
                        最后更新时间: timestamp
                    };
                } else {
                    return {
                        号码: item,
                        采集时间: timestamp,
                        标记状态: CONFIG.MARKER.BADGE_TEXT,
                        最后更新时间: timestamp,
                        所在群组: item.所在群组 || []
                    };
                }
            })
        };

        console.log(`📁 正在保存客户数据到: ${CONFIG.CUSTOMER_DATA_FILE}`);
        
        // 使用挂载的 saveFile 方法
        const result = await window.saveFile(CONFIG.CUSTOMER_DATA_FILE, dataToSave);
        
        if (result && result.success) {
            console.log(`✅ 客户数据已保存，共 ${customers.length} 个客户`);
            console.log(`📁 保存路径: ${result.path}`);
            
            // 保存备份
            try {
                const backupResult = await window.saveFile(CONFIG.CUSTOMER_BACKUP_FILE, {
                    ...dataToSave,
                    metadata: {
                        ...dataToSave.metadata,
                        isBackup: true,
                        originalFile: CONFIG.CUSTOMER_DATA_FILE,
                        backupTime: timestamp
                    }
                });
                if (backupResult.success) {
                    console.log(`✅ 备份文件已保存: ${CONFIG.CUSTOMER_BACKUP_FILE}`);
                }
            } catch (backupError) {
                console.warn("⚠️ 备份文件保存失败:", backupError.message);
            }
            
            return {
                success: true,
                path: result.path,
                count: customers.length,
                timestamp: timestamp
            };
        } else {
            throw new Error(result?.error || "保存失败");
        }
    } catch (error) {
        console.error("❌ 保存客户数据失败:", error);
        return await saveCustomerDataToIndexedDB(customers);
    }
}

/**
 * 从固定文件加载客户数据
 */
async function loadCustomerDataFromFile() {
    try {
        const apiReady = await waitForCSharpApi();
        if (!apiReady) {
            throw new Error("C# API未就绪");
        }

        console.log(`📁 正在从 ${CONFIG.CUSTOMER_DATA_FILE} 加载客户数据...`);
        
        // 使用挂载的 readFile 方法
        const data = await window.readFile(CONFIG.CUSTOMER_DATA_FILE);
        
        if (data !== null) {
            console.log("✅ 从本地文件读取成功");
            
            let customers = [];
            let metadata = {};
            
            if (Array.isArray(data)) {
                customers = data.map(item => {
                    if (typeof item === 'string') {
                        return { 号码: item };
                    }
                    return item;
                });
                metadata = { version: "0.9", totalCount: customers.length };
            } else if (data.customers) {
                customers = data.customers;
                metadata = data.metadata || {};
            } else {
                customers = [];
                metadata = { format: "unknown" };
            }
            
            console.log(`📊 成功加载 ${customers.length} 个客户号码`);
            if (metadata.lastUpdate) {
                console.log(`🕒 最后更新时间: ${metadata.lastUpdate}`);
            }
            
            return {
                success: true,
                customers: customers,
                metadata: metadata,
                source: 'file'
            };
        } else {
            console.log(`📂 客户数据文件不存在: ${CONFIG.CUSTOMER_DATA_FILE}`);
            
            // 尝试读取备份
            const backupData = await window.readFile(CONFIG.CUSTOMER_BACKUP_FILE);
            if (backupData !== null) {
                console.log("✅ 从备份文件恢复成功");
                return {
                    success: true,
                    customers: backupData.customers || [],
                    metadata: backupData.metadata || {},
                    source: 'backup'
                };
            }
            
            return {
                success: false,
                customers: [],
                source: 'file'
            };
        }
    } catch (error) {
        console.error("❌ 从本地文件加载失败:", error);
        return await loadCustomerDataFromIndexedDB();
    }
}

/**
 * IndexedDB降级存储
 */
async function saveCustomerDataToIndexedDB(customers) {
    return new Promise((resolve) => {
        try {
            const request = indexedDB.open(CONFIG.DB_NAME, CONFIG.DB_VERSION);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(CONFIG.STORE_NAME)) {
                    const store = db.createObjectStore(CONFIG.STORE_NAME, { keyPath: "号码" });
                    store.createIndex("群组", "所在群组", { unique: false });
                    store.createIndex("采集时间", "采集时间", { unique: false });
                }
            };
            
            request.onsuccess = () => {
                const db = request.result;
                const tx = db.transaction(CONFIG.STORE_NAME, "readwrite");
                const store = tx.objectStore(CONFIG.STORE_NAME);
                
                store.clear().onsuccess = () => {
                    const timestamp = new Date().toISOString();
                    let savedCount = 0;
                    
                    customers.forEach(item => {
                        const customerData = {
                            号码: item.号码 || item,
                            采集时间: timestamp,
                            标记状态: CONFIG.MARKER.BADGE_TEXT,
                            所在群组: item.所在群组 || []
                        };
                        
                        store.add(customerData).onsuccess = () => {
                            savedCount++;
                            if (savedCount === customers.length) {
                                console.log(`✅ 已保存 ${savedCount} 个客户到IndexedDB`);
                                resolve({
                                    success: true,
                                    source: 'indexeddb',
                                    count: savedCount
                                });
                            }
                        };
                    });
                };
            };
            
            request.onerror = () => {
                resolve({ success: false, source: 'indexeddb', error: request.error });
            };
        } catch (error) {
            resolve({ success: false, source: 'indexeddb', error: error.message });
        }
    });
}

async function loadCustomerDataFromIndexedDB() {
    return new Promise((resolve) => {
        try {
            const request = indexedDB.open(CONFIG.DB_NAME, CONFIG.DB_VERSION);
            
            request.onsuccess = () => {
                const db = request.result;
                const tx = db.transaction(CONFIG.STORE_NAME, "readonly");
                const store = tx.objectStore(CONFIG.STORE_NAME);
                
                const getAll = store.getAll();
                
                getAll.onsuccess = () => {
                    const customers = getAll.result || [];
                    console.log(`📊 从IndexedDB加载 ${customers.length} 个客户`);
                    resolve({
                        success: true,
                        customers: customers,
                        source: 'indexeddb'
                    });
                };
                
                getAll.onerror = () => {
                    resolve({ success: false, customers: [], source: 'indexeddb' });
                };
            };
            
            request.onerror = () => {
                resolve({ success: false, customers: [], source: 'indexeddb' });
            };
        } catch (error) {
            resolve({ success: false, customers: [], source: 'indexeddb' });
        }
    });
}

/**
 * 手动保存当前客户数据
 */
async function 手动保存客户数据() {
    if (!window.__客户号码列表) {
        console.log("⚠️ 没有客户数据可保存");
        return { success: false, message: "没有客户数据" };
    }
    
    const customers = Array.from(window.__客户号码列表).map(号码 => ({
        号码: 号码,
        标记状态: CONFIG.MARKER.BADGE_TEXT,
        最后更新时间: new Date().toISOString()
    }));
    
    return await saveCustomerDataToFile(customers);
}

/**
 * 手动刷新客户数据
 */
async function 手动刷新客户数据() {
    const loadResult = await loadCustomerDataFromFile();
    
    if (loadResult.success && loadResult.customers.length > 0) {
        window.__客户号码列表 = new Set(loadResult.customers.map(c => c.号码 || c));
        console.log(`✅ 客户数据已刷新，当前 ${window.__客户号码列表.size} 个客户`);
        
        if (window.__客户标记监控开启) {
            标记聊天列表();
            标记当前聊天窗口();
            标记当前可见消息();
        }
        
        return loadResult;
    } else {
        console.log("⚠️ 刷新失败，未找到客户数据");
        return loadResult;
    }
}

/**
 * 查看客户文件信息
 */
async function 查看客户文件信息() {
    try {
        const apiReady = await waitForCSharpApi();
        if (!apiReady) {
            console.log("⚠️ C# API未就绪");
            return;
        }
        
        const data = await window.readFile(CONFIG.CUSTOMER_DATA_FILE);
        
        if (data) {
            console.log("📁 客户数据文件信息:");
            console.log(`   文件名: ${CONFIG.CUSTOMER_DATA_FILE}`);
            console.log(`   完整路径: ${appDirectory}${CONFIG.CUSTOMER_DATA_FILE}`);
            
            if (data.metadata) {
                console.log(`   版本: ${data.metadata.version}`);
                console.log(`   最后更新: ${data.metadata.lastUpdate}`);
                console.log(`   客户数量: ${data.metadata.totalCount}`);
            }
            
            if (data.customers) {
                const sample = data.customers.slice(0, 5).map(c => c.号码).join(', ');
                console.log(`   客户列表: ${sample}${data.customers.length > 5 ? '...' : ''}`);
            }
        } else {
            console.log(`📂 文件不存在: ${appDirectory}${CONFIG.CUSTOMER_DATA_FILE}`);
        }
    } catch (error) {
        console.error("❌ 查看文件信息失败:", error);
    }
}

// ==================== 客户标记系统 ====================

let 客户标记监控开启 = false;
let 已标记消息的ID集合 = new Set();
let 标记防抖定时器 = null;
let 滚动监听定时器 = null;

/**
 * 开启/关闭客户标记
 */
async function 标记客户(开启 = true) {
    console.log("标记客户被调用，开启:", 开启);

    if (开启) {
        if (客户标记监控开启) {
            console.log("⚠️ 客户标记已经开启");
            return;
        }

        try {
            const loadResult = await loadCustomerDataFromFile();
            
            if (loadResult.success && loadResult.customers.length > 0) {
                console.log(`📚 已加载 ${loadResult.customers.length} 个客户号码 (来源: ${loadResult.source})`);
                window.__客户号码列表 = new Set(loadResult.customers.map(c => c.号码 || c));
                
                const sample = Array.from(window.__客户号码列表).slice(0, 3);
                console.log(`📋 示例客户: ${sample.join(', ')}${window.__客户号码列表.size > 3 ? '...' : ''}`);
            } else {
                console.log("⚠️ 未找到客户数据");
                window.__客户号码列表 = new Set();
            }

            启动滚动监听();
            document.addEventListener("click", 监听聊天点击, true);

            客户标记监控开启 = true;
            window.__客户标记监控开启 = true;
            console.log("✅ 客户标记已开启");

            标记聊天列表();
            标记当前聊天窗口();
            标记当前可见消息();
        } catch (error) {
            console.error("❌ 开启失败:", error);
        }
    } else {
        document.removeEventListener("click", 监听聊天点击, true);

        if (滚动监听定时器) {
            clearInterval(滚动监听定时器);
            滚动监听定时器 = null;
        }

        if (标记防抖定时器) {
            clearTimeout(标记防抖定时器);
            标记防抖定时器 = null;
        }

        document.querySelectorAll(".customer-badge, .chat-customer-badge, .header-customer-badge").forEach(el => el.remove());
        已标记消息的ID集合.clear();
        客户标记监控开启 = false;
        window.__客户标记监控开启 = false;
        window.__客户号码列表 = null;
        console.log("🛑 客户标记已关闭");
    }
}

/**
 * 启动滚动监听
 */
function 启动滚动监听() {
    const containerClass = 'div[data-scrolltracepolicy="wa.web.conversation.messages"]';

    if (滚动监听定时器) {
        clearInterval(滚动监听定时器);
    }

    滚动监听定时器 = setInterval(() => {
        const container = document.querySelector(containerClass);
        if (!container) return;

        console.log("✅ 找到消息列表容器，开始监听滚动");
        container.removeEventListener("scroll", 处理滚动);
        container.addEventListener("scroll", 处理滚动);

        clearInterval(滚动监听定时器);
        滚动监听定时器 = null;
    }, 200);
}

/**
 * 处理滚动事件
 */
function 处理滚动() {
    if (标记防抖定时器) {
        clearTimeout(标记防抖定时器);
    }

    标记防抖定时器 = setTimeout(() => {
        console.log("📜 检测到滚动，标记新加载的消息");
        标记当前可见消息();
        标记防抖定时器 = null;
    }, 200);
}

/**
 * 监听聊天点击
 */
function 监听聊天点击(event) {
    const chatItem = event.target.closest(
        '[role="row"], [role="listitem"], ._ak8q, [data-testid="chat-list-item"]'
    );

    if (chatItem) {
        console.log("🖱️ 检测到聊天被点击，准备标记...");

        标记聊天列表();

        setTimeout(() => {
            console.log("⏳ 聊天内容加载完成，开始标记...");
            标记当前聊天窗口();
            标记当前可见消息();
            启动滚动监听();
            console.log("✅ 聊天标记完成");
        }, 800);
    }
}

/**
 * 标记聊天列表
 */
function 标记聊天列表() {
    const chatItems = document.querySelectorAll(
        '[role="row"], [role="listitem"], ._ak8q, [data-testid="chat-list-item"]'
    );
    let 标记数量 = 0;

    chatItems.forEach((item) => {
        item.querySelectorAll(".chat-customer-badge").forEach(el => el.remove());

        const numberSpan = item.querySelector('span[data-testid="selectable-text"]');
        if (numberSpan) {
            const text = numberSpan.textContent || "";
            const matches = text.match(/\+[\d\s\(\)\-]{9,20}/g);

            if (matches) {
                for (const match of matches) {
                    const 号码 = match.replace(/[\s\(\)\-]/g, "");

                    if (window.__客户号码列表?.has(号码)) {
                        const nameEl = item.querySelector('span[dir="auto"], div[title]');
                        if (nameEl) {
                            const badge = document.createElement("span");
                            badge.className = "chat-customer-badge customer-badge";
                            badge.innerHTML = `${CONFIG.MARKER.BADGE_EMOJI} ${CONFIG.MARKER.BADGE_TEXT}`;
                            badge.style.cssText = `
                                background: ${CONFIG.MARKER.BADGE_COLOR};
                                color: ${CONFIG.MARKER.BADGE_TEXT_COLOR};
                                padding: 2px 6px;
                                border-radius: 10px;
                                font-size: 11px;
                                margin-left: 5px;
                                display: inline-block;
                                pointer-events: none;
                            `;
                            nameEl.parentNode.appendChild(badge);
                            标记数量++;
                            console.log(`✅ 聊天列表标记客户: ${号码}`);
                            break;
                        }
                    }
                }
            }
        }
    });

    if (标记数量 > 0) {
        console.log(`📊 聊天列表标记完成，共标记 ${标记数量} 个客户`);
    }
}

/**
 * 标记当前聊天窗口
 */
function 标记当前聊天窗口() {
    const header = document.querySelector("header");
    if (!header) return;

    header.querySelectorAll(".header-customer-badge").forEach(el => el.remove());

    const numberSpan = document.querySelector('header span[data-testid="selectable-text"]');
    if (numberSpan) {
        const text = numberSpan.textContent || "";
        const matches = text.match(/\+[\d\s\(\)\-]{9,20}/g);

        if (matches) {
            for (const match of matches) {
                const 号码 = match.replace(/[\s\(\)\-]/g, "");

                if (window.__客户号码列表?.has(号码)) {
                    const nameEl = header.querySelector('span[dir="auto"]:not([data-testid])');
                    if (nameEl) {
                        const badge = document.createElement("span");
                        badge.className = "header-customer-badge customer-badge";
                        badge.innerHTML = `${CONFIG.MARKER.BADGE_EMOJI} ${CONFIG.MARKER.BADGE_TEXT}`;
                        badge.style.cssText = `
                            background: ${CONFIG.MARKER.BADGE_COLOR};
                            color: ${CONFIG.MARKER.BADGE_TEXT_COLOR};
                            padding: 2px 8px;
                            border-radius: 12px;
                            font-size: 12px;
                            margin-left: 10px;
                            font-weight: bold;
                            display: inline-block;
                            pointer-events: none;
                        `;
                        nameEl.parentNode.appendChild(badge);
                        console.log(`✅ 聊天窗口标记客户: ${号码}`);
                        break;
                    }
                }
            }
        }
    }
}

/**
 * 标记当前可见的消息
 */
function 标记当前可见消息() {
    const messages = document.querySelectorAll("div[data-pre-plain-text]");
    let 新标记数量 = 0;

    messages.forEach((msg) => {
        const rect = msg.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (!isVisible) return;

        if (!msg.__msgId) {
            msg.__msgId = `msg_${Math.random().toString(36).substr(2, 9)}`;
        }

        if (已标记消息的ID集合.has(msg.__msgId)) return;

        const preText = msg.getAttribute("data-pre-plain-text") || "";
        const match = preText.match(/\+[\d\s\(\)\-]{9,20}/);
        if (!match) return;

        const 号码 = match[0].replace(/[\s\(\)\-]/g, "");

        if (window.__客户号码列表?.has(号码)) {
            const senderArea = msg.closest("._amk4") || msg.closest('[class*="message"]');
            if (!senderArea) return;

            if (senderArea.querySelector(".customer-badge")) return;

            const nameEl = senderArea.querySelector('._ahxy, span[dir="auto"][aria-label]');
            if (!nameEl) return;

            const badge = document.createElement("span");
            badge.className = "customer-badge";
            badge.innerHTML = `${CONFIG.MARKER.BADGE_EMOJI} ${CONFIG.MARKER.BADGE_TEXT}`;
            badge.style.cssText = `
                background: ${CONFIG.MARKER.BADGE_COLOR};
                color: ${CONFIG.MARKER.BADGE_TEXT_COLOR};
                padding: 2px 6px;
                border-radius: 10px;
                font-size: 11px;
                margin-left: 8px;
                font-weight: bold;
                display: inline-block;
                pointer-events: none;
            `;

            nameEl.parentNode.appendChild(badge);
            已标记消息的ID集合.add(msg.__msgId);
            新标记数量++;
            console.log(`✅ 标记客户消息: ${号码}`);
        }
    });

    if (新标记数量 > 0) {
        console.log(`📊 本次标记 ${新标记数量} 条新客户消息，总计 ${已标记消息的ID集合.size} 条`);
    }
}

// ==================== 群组号码采集系统 ====================

/**
 * 获取未归档群组
 */
async function 获取未归档群组() {
    try {
        if (!window.Store) {
            window.Store = Object.assign({}, window.require("WAWebCollections"));
        }

        const groups = window.Store.Chat.getModelsArray()
            .filter((chat) => {
                const isGroup = chat.id?._serialized?.endsWith("@g.us") || chat.isGroup === true;
                const notArchived = !chat.archive;
                return isGroup && notArchived;
            })
            .map((chat) => ({
                id: chat.id?._serialized,
                name: chat.name || chat.formattedTitle || chat.formattedName || "未命名群组",
                participantCount: chat.participantCount ||
                    chat.groupMetadata?.participants?.length ||
                    chat.participants?.length ||
                    0
            }));

        groups.sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
        console.log(`📋 找到 ${groups.length} 个未归档群组`);
        return groups;
    } catch (error) {
        console.error("获取群组失败:", error);
        return [];
    }
}

/**
 * 查找群组点击元素
 */
function 查找群组点击元素(chatName) {
    function normalize(str) {
        return (str || "").replace(/\s+/g, " ").trim().toLowerCase();
    }

    function findClickable(el) {
        return (
            el.closest('[role="gridcell"]') ||
            el.closest('div[tabindex="0"]') ||
            el.closest('[role="row"]') ||
            el.closest('[role="listitem"]') ||
            el.closest(".chat") ||
            el.closest('[data-testid="chat-list-item"]') ||
            el.closest("._ak8q") ||
            el.closest('[data-testid="chat-list"] [role="button"]')
        );
    }

    // 通过title属性查找
    for (const el of document.querySelectorAll('span[dir="auto"][title], div[title], span[title]')) {
        if (normalize(el.getAttribute("title")) === normalize(chatName)) {
            const clickable = findClickable(el);
            if (clickable) return clickable;
        }
    }

    // 通过文本内容查找
    for (const item of document.querySelectorAll('[role="row"]')) {
        const textEl = item.querySelector('span[dir="auto"]');
        if (textEl && normalize(textEl.textContent).includes(normalize(chatName))) {
            return item;
        }
    }

    return null;
}

/**
 * 获取号码文本
 */
function 获取号码文本() {
    const el = document.querySelector('span[data-testid="selectable-text"]');
    return el ? el.innerText : null;
}

/**
 * 从文本提取手机号
 */
function 提取号码(text) {
    if (!text) return [];

    const regex = /\+[\d\s\(\)\-]{9,20}/g;
    const matches = text.match(regex) || [];

    return [...new Set(
        matches
            .map(p => p.replace(/[\s\(\)\-]/g, ""))
            .filter(p => /^\+\d{7,15}$/.test(p))
    )];
}

/**
 * 等待号码加载
 */
async function 等待号码加载(timeout = 10000) {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
        const text = 获取号码文本();

        if (text) {
            const numbers = 提取号码(text);
            if (numbers.length > 0) {
                console.log(`  ✅ 检测到 ${numbers.length} 个号码`);
                return numbers;
            }
        }

        const elapsed = Date.now() - startTime;
        console.log(`  ⏳ 等待号码加载中... (${elapsed}ms)`);
        await new Promise(r => setTimeout(r, 500));
    }

    console.log(`  ⚠️ 等待超时 (${timeout}ms)`);
    return [];
}

/**
 * 采集群组号码
 */
async function 采集群组号码(progressCallback) {
    console.log("🔍 开始采集未归档群组成员号码...");

    const groups = await 获取未归档群组();
    console.log(`📋 共 ${groups.length} 个未归档群组\n`);

    const results = [];
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < groups.length; i++) {
        const group = groups[i];

        progressCallback?.({
            current: i + 1,
            total: groups.length,
            groupName: group.name,
            status: "processing"
        });

        console.log(`📌 [${i + 1}/${groups.length}] ${group.name}`);

        try {
            const clickable = 查找群组点击元素(group.name);

            if (!clickable) {
                console.log(`  ❌ 找不到可点击元素，跳过`);
                failCount++;
                results.push({
                    ...group,
                    numbers: [],
                    status: "failed",
                    error: "找不到可点击元素"
                });
                continue;
            }

            console.log(`  🖱️ 点击打开聊天...`);
            await 模拟真实点击(clickable);

            console.log(`  ⏳ 等待号码加载...`);
            const numbers = await 等待号码加载(10000);

            if (numbers.length > 0) {
                successCount++;
                console.log(`  ✅ 获取到 ${numbers.length} 个号码`);
            } else {
                failCount++;
                console.log(`  ⚠️ 未获取到号码`);
            }

            results.push({
                ...group,
                numbers,
                status: numbers.length > 0 ? "success" : "no_numbers",
                count: numbers.length
            });
        } catch (error) {
            console.error(`  处理失败:`, error);
            failCount++;
            results.push({
                ...group,
                numbers: [],
                status: "error",
                error: error.message
            });
        }

        const delay = 2000 + Math.floor(Math.random() * 2000);
        console.log(`  ⏱️ 等待 ${delay}ms...\n`);
        await new Promise(r => setTimeout(r, delay));
    }

    console.log(`\n✅ 采集完成！成功: ${successCount}，失败: ${failCount}`);
    return results;
}

/**
 * 分析号码重复
 */
function 分析号码重复(results) {
    const numberMap = new Map();

    for (const group of results) {
        for (const number of group.numbers || []) {
            if (!numberMap.has(number)) {
                numberMap.set(number, { 号码: number, 重复次数: 0, 所在群组: [] });
            }
            const data = numberMap.get(number);
            data.重复次数++;
            if (!data.所在群组.includes(group.name)) {
                data.所在群组.push(group.name);
            }
        }
    }

    const allNumbers = Array.from(numberMap.values());
    const duplicateNumbers = allNumbers
        .filter(n => n.重复次数 > 1)
        .sort((a, b) => b.重复次数 - a.重复次数);
    const uniqueNumbers = allNumbers
        .filter(n => n.重复次数 === 1)
        .sort((a, b) => a.号码.localeCompare(b.号码));

    return { allNumbers, duplicateNumbers, uniqueNumbers };
}

/**
 * 查询号码归属地
 */
function 查询号码归属地(phoneNumber) {
    const num = phoneNumber.replace("+", "");

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
        { code: "998", country: "乌兹别克斯坦", region: "中亚" }
    ];

    countryCodes.sort((a, b) => b.code.length - a.code.length);

    for (const item of countryCodes) {
        if (num.startsWith(item.code)) {
            return `${item.country} (${item.region})`;
        }
    }

    return "未知地区";
}

/**
 * 生成HTML报告
 */
function 生成报告(results, analysis) {
    const { allNumbers, duplicateNumbers, uniqueNumbers } = analysis;
    const successGroups = results.filter(r => r.status === "success").length;
    const date = new Date().toLocaleString();

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>WhatsApp群组成员号码分析报告</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 20px; background: #f0f2f5; }
    .container { max-width: 1400px; margin: 0 auto; }
    .header { background: #075e54; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-bottom: 30px; }
    .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,.1); }
    .stat-card h3 { margin: 0 0 10px; color: #075e54; }
    .stat-card .number { font-size: 32px; font-weight: bold; color: #128C7E; }
    .tabs { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
    .tab { padding: 10px 20px; background: #e9ecef; border-radius: 5px; cursor: pointer; transition: all .2s; }
    .tab.active { background: #075e54; color: white; }
    .tab:hover:not(.active) { background: #d4d4d4; }
    .tab-content { display: none; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,.1); }
    .tab-content.active { display: block; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #075e54; color: white; padding: 12px; text-align: left; }
    td { padding: 12px; border-bottom: 1px solid #dee2e6; }
    tr:hover { background: #f8f9fa; }
    .badge { background: #25D366; color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px; }
    .duplicate-row { background: #fff3e0; }
    .search-box { margin-bottom: 15px; padding: 10px; width: 300px; border: 1px solid #dee2e6; border-radius: 4px; font-size: 14px; }
    .group-card { border: 1px solid #dee2e6; border-radius: 6px; padding: 15px; margin-bottom: 15px; }
    .group-header { background: #f8f9fa; padding: 10px; margin: -15px -15px 15px; border-radius: 6px 6px 0 0; }
    .group-header h3 { margin: 0; }
    .group-header p { margin: 5px 0 0; font-size: 13px; color: #555; }
    .success { color: #28a745; } .warning { color: #ffc107; } .error { color: #dc3545; }
    details summary { cursor: pointer; color: #075e54; padding: 5px; border-radius: 4px; user-select: none; }
    details summary:hover { background: #e8f5e9; }
    .num-list { max-height: 200px; overflow-y: auto; margin-top: 10px; padding: 5px; background: #f8f9fa; border-radius: 4px; font-size: 13px; }
    .num-list div { padding: 3px 5px; border-bottom: 1px solid #dee2e6; }
  </style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>📊 WhatsApp未归档群组成员号码分析报告</h1>
    <p>生成时间：${date}</p>
  </div>

  <div class="stats">
    <div class="stat-card"><h3>总群组</h3><div class="number">${results.length}</div></div>
    <div class="stat-card"><h3>成功采集</h3><div class="number" style="color:#28a745">${successGroups}</div></div>
    <div class="stat-card"><h3>总号码</h3><div class="number">${allNumbers.length}</div></div>
    <div class="stat-card"><h3>独立号码</h3><div class="number">${uniqueNumbers.length}</div></div>
    <div class="stat-card"><h3>重复号码</h3><div class="number" style="color:#f39c12">${duplicateNumbers.length}</div></div>
  </div>

  <div class="tabs">
    <div class="tab active" onclick="showTab('duplicate', this)">🔄 重复号码 (${duplicateNumbers.length})</div>
    <div class="tab" onclick="showTab('unique', this)">✅ 独立号码 (${uniqueNumbers.length})</div>
    <div class="tab" onclick="showTab('groups', this)">📋 群组详情 (${results.length})</div>
  </div>

  <div id="duplicate" class="tab-content active">
    <h2>🔄 重复号码（出现在多个群组）</h2>
    <input class="search-box" placeholder="搜索号码..." oninput="filterTable('dupTable', this.value)">
    <table id="dupTable">
      <tr><th>序号</th><th>手机号码</th><th>归属地</th><th>重复次数</th><th>所在群组</th></tr>
      ${duplicateNumbers.map((item, i) => `
      <tr class="duplicate-row">
        <td>${i + 1}</td>
        <td><strong>${item.号码}</strong></td>
        <td>${查询号码归属地(item.号码)}</td>
        <td><span class="badge">${item.重复次数}</span></td>
        <td>${item.所在群组.join("、")}</td>
      </tr>`).join("")}
    </table>
  </div>

  <div id="unique" class="tab-content">
    <h2>✅ 独立号码（只在一个群组）</h2>
    <input class="search-box" placeholder="搜索号码..." oninput="filterTable('uniTable', this.value)">
    <table id="uniTable">
      <tr><th>序号</th><th>手机号码</th><th>归属地</th><th>所在群组</th></tr>
      ${uniqueNumbers.map((item, i) => `
      <tr><td>${i + 1}</td><td>${item.号码}</td><td>${查询号码归属地(item.号码)}</td><td>${item.所在群组[0]}</td></tr>`).join("")}
    </table>
  </div>

  <div id="groups" class="tab-content">
    <h2>📋 群组详情</h2>
    <input class="search-box" placeholder="搜索群组..." oninput="filterGroups(this.value)">
    <div id="groups-container">
      ${results.map((group, i) => `
      <div class="group-card" data-name="${group.name}">
        <div class="group-header">
          <h3>${i + 1}. ${group.name}</h3>
          <p>
            成员数: ${group.participantCount} |
            <span class="${group.numbers.length > 0 ? "success" : "warning"}">号码数: ${group.numbers.length}</span> |
            <span class="${group.status === "success" ? "success" : group.status === "no_numbers" ? "warning" : "error"}">状态: ${group.status}</span>
            ${group.error ? ` | 错误: ${group.error}` : ""}
          </p>
        </div>
        ${group.numbers.length > 0 ? `
        <details>
          <summary>查看号码列表（${group.numbers.length} 个）</summary>
          <div class="num-list">${group.numbers.map(n => `<div>${n} (${查询号码归属地(n)})</div>`).join("")}</div>
        </details>` : ""}
      </div>`).join("")}
    </div>
  </div>
</div>

<script>
  function showTab(id, tab) {
    document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".tab").forEach(el => el.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    tab.classList.add("active");
  }
  function filterTable(tableId, q) {
    const rows = document.getElementById(tableId).rows;
    const s = q.toLowerCase();
    for (let i = 1; i < rows.length; i++) {
      const text = rows[i].cells[1]?.textContent.toLowerCase() + ' ' + rows[i].cells[2]?.textContent.toLowerCase();
      rows[i].style.display = text.includes(s) ? "" : "none";
    }
  }
  function filterGroups(q) {
    const s = q.toLowerCase();
    document.querySelectorAll(".group-card").forEach(card => {
      card.style.display = card.dataset.name.toLowerCase().includes(s) ? "" : "none";
    });
  }
</script>
</body>
</html>`;
}

/**
 * 采集群组号码并生成报告（主函数）
 */
async function 采集群组号码并生成报告() {
    console.log("=".repeat(60));
    console.log("📞 WhatsApp未归档群组成员号码采集器");
    console.log("=".repeat(60));
    console.log("⏰ 整个过程可能需要几分钟，请耐心等待...");

    const results = await 采集群组号码((p) => {
        console.log(`进度: ${p.current}/${p.total} - ${p.groupName}`);
    });

    const analysis = 分析号码重复(results);
    
    if (analysis.uniqueNumbers && analysis.uniqueNumbers.length > 0) {
        try {
            const customersWithGroupInfo = analysis.uniqueNumbers.map(item => ({
                号码: item.号码,
                所在群组: item.所在群组 || [],
                采集时间: new Date().toISOString(),
                标记状态: CONFIG.MARKER.BADGE_TEXT
            }));
            
            const saveResult = await saveCustomerDataToFile(customersWithGroupInfo);
            
            if (saveResult.success) {
                console.log(`📦 已将 ${analysis.uniqueNumbers.length} 个独立号码保存到 ${CONFIG.CUSTOMER_DATA_FILE}`);
                if (saveResult.path) {
                    console.log(`📁 保存路径: ${saveResult.path}`);
                }
                
                window.__客户号码列表 = new Set(analysis.uniqueNumbers.map(item => item.号码));
            } else {
                console.error("❌ 保存到本地文件失败:", saveResult.error);
            }
        } catch (error) {
            console.error("❌ 保存到本地文件失败:", error);
        }
    } else {
        console.log("⚠️ 没有找到独立号码，不保存文件");
    }
    
    const html = 生成报告(results, analysis);
    
    // 保存HTML报表
    try {
        const dateStr = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const htmlFilename = `whatsapp_report_${dateStr}.html`;
        
        const htmlData = {
            metadata: {
                type: "html_report",
                generatedAt: new Date().toISOString(),
                filename: htmlFilename,
                stats: {
                    totalGroups: results.length,
                    totalNumbers: analysis.allNumbers.length,
                    uniqueNumbers: analysis.uniqueNumbers.length,
                    duplicateNumbers: analysis.duplicateNumbers.length
                }
            },
            content: html
        };
        
        const apiReady = await waitForCSharpApi();
        if (apiReady) {
            const htmlSaveResult = await window.saveFile(htmlFilename, htmlData);
            if (htmlSaveResult && htmlSaveResult.success) {
                console.log(`📊 HTML报表已保存到: ${htmlSaveResult.path}`);
            } else {
                throw new Error("保存失败");
            }
        } else {
            throw new Error("API未就绪");
        }
    } catch (error) {
        console.log("⚠️ 使用浏览器下载HTML报表");
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `whatsapp_report_${Date.now()}.html`;
        a.click();
        URL.revokeObjectURL(url);
    }

    const newWindow = window.open();
    if (newWindow) {
        newWindow.document.write(html);
        newWindow.document.title = `whatsapp_群组号码报告_${new Date().toISOString().slice(0, 10)}`;
        console.log("✅ 报告已在新窗口打开");
    } else {
        console.log("⚠️ 新窗口被拦截，请在控制台查看HTML");
    }

    console.log(`\n✅ 报告已生成`);
    console.log(`📊 群组: ${results.length} | 成功: ${results.filter(r => r.status === "success").length} | 号码: ${analysis.allNumbers.length}`);

    return { results, analysis };
}

// ==================== 消息发送系统 ====================

/**
 * 点击聊天列表
 */
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
        
        // 通过title属性查找
        const titleElements = document.querySelectorAll('span[dir="auto"][title], div[title], span[title]');
        for (let el of titleElements) {
            const title = el.getAttribute("title") || "";
            if (normalizeString(title) === normalizeString(chatName)) {
                const clickable = findClickableElement(el);
                if (clickable) {
                    console.log(`✅ 找到聊天: "${chatName}"`);
                    await 模拟真实点击(clickable);
                    return true;
                }
            }
        }
        
        // 通过文本内容查找
        const chatItems = document.querySelectorAll('[role="row"], [role="listitem"], .chat, [data-testid="chat-list-item"], ._ak8q');
        for (let item of chatItems) {
            const textContent = item.textContent || "";
            if (normalizeString(textContent).includes(normalizeString(chatName))) {
                console.log(`✅ 找到聊天: "${chatName}"`);
                await 模拟真实点击(item);
                return true;
            }
        }
        
        console.error(`❌ 未找到聊天: "${chatName}"`);
        return false;
    } catch (error) {
        console.error(`❌ 点击聊天失败:`, error);
        return false;
    }
}

/**
 * 粘贴图片到输入框
 */
async function pasteImageToInput(imgBase64, options = {}) {
    const { timeout = 5000, checkPreview = true } = options;
    const inputDom = getInputDom();
    if (!inputDom) throw new Error("找不到输入框");
    
    const mimeType = getMimeType(imgBase64);
    const extension = getExtension(mimeType);
    const blob = base64ToBlob(imgBase64, mimeType);
    const file = new File([blob], `image.${extension}`, { type: mimeType });
    
    const clipboardData = new DataTransfer();
    clipboardData.items.add(file);
    
    const pasteEvent = new ClipboardEvent("paste", {
        clipboardData: clipboardData,
        bubbles: true,
        cancelable: true
    });
    
    inputDom.dispatchEvent(pasteEvent);
    
    if (!checkPreview) return true;
    
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        await new Promise(r => setTimeout(r, 100));
        const previewImg = document.querySelector('img[src*="blob:"], canvas');
        if (previewImg) {
            console.log(`✅ 图片预览已出现`);
            return true;
        }
    }
    
    console.warn(`⚠️ 图片预览超时`);
    return false;
}

/**
 * 发送图片内容
 */
async function 发送图片内容(groupName, imgBase64) {
    try {
        console.log(`📷 发送图片到 "${groupName}"`);
        const clicked = await 点击聊天列表(groupName);
        if (!clicked) throw new Error(`无法打开聊天: ${groupName}`);
        await new Promise(r => setTimeout(r, 1000));

        const inputDom = getInputDom();
        if (!inputDom) throw new Error("找不到输入框");

        const fileSizeKB = estimateBase64Size(imgBase64);
        console.log(`📊 图片大小: ${fileSizeKB.toFixed(2)}KB`);

        inputDom.focus();
        inputDom.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));

        const pasteTimeout = Math.min(5000 + Math.floor(fileSizeKB * 10), 15000);
        const pasteSuccess = await pasteImageToInput(imgBase64, { timeout: pasteTimeout });
        if (!pasteSuccess) throw new Error("图片粘贴失败");

        const processDelay = Math.min(1000 + Math.floor(fileSizeKB * 5), 5000);
        await new Promise(r => setTimeout(r, processDelay));

        const sendButton = getSendButton();
        if (!sendButton) throw new Error("找不到发送按钮");

        sendButton.click();
        console.log(`✅ 图片发送成功: ${groupName}`);
        await new Promise(r => setTimeout(r, 1000));
        return true;
    } catch (error) {
        console.error(`❌ 图片发送失败: ${groupName}`, error.message);
        return false;
    }
}

/**
 * 发送文本内容
 */
async function 发送文本内容(groupName, content) {
    try {
        console.log(`📨 发送到 "${groupName}": "${content.substring(0, 30)}..."`);
        const clicked = await 点击聊天列表(groupName);
        if (!clicked) throw new Error(`无法打开聊天: ${groupName}`);
        await new Promise(r => setTimeout(r, 800));

        const inputDom = getInputDom();
        if (!inputDom) throw new Error("无法获取输入框");

        inputDom.focus();

        const lines = content.split("\n");
        if (lines.length === 1) {
            document.execCommand("insertText", false, content);
        } else {
            for (let i = 0; i < lines.length; i++) {
                document.execCommand("insertText", false, lines[i]);
                if (i < lines.length - 1) {
                    inputDom.dispatchEvent(
                        new KeyboardEvent("keydown", {
                            key: "Enter",
                            shiftKey: true,
                            bubbles: true
                        })
                    );
                    await new Promise(r => setTimeout(r, 50));
                }
            }
        }

        inputDom.dispatchEvent(new Event("input", { bubbles: true }));
        await new Promise(r => setTimeout(r, 200));

        const sendButton = getSendButton();
        if (!sendButton) throw new Error("无法获取发送按钮");

        await 模拟真实点击(sendButton);
        console.log(`✅ 发送成功: ${groupName}`);
        await new Promise(r => setTimeout(r, 200));
        return true;
    } catch (error) {
        console.error(`❌ 发送失败: ${groupName}`, error.message);
        return false;
    }
}

/**
 * 发送图文同条
 */
async function 发送图文同条(groupName, imgBase64, caption) {
    try {
        console.log(`📷📝 发送图文同条到 "${groupName}"`);
        const clicked = await 点击聊天列表(groupName);
        if (!clicked) throw new Error(`无法打开聊天: ${groupName}`);
        await new Promise(r => setTimeout(r, 1000));

        if (caption && caption.trim()) {
            console.log(`  ⏳ 输入文字...`);
            const inputDom = getInputDom();
            if (!inputDom) throw new Error("无法获取输入框");

            inputDom.focus();
            document.execCommand("insertText", false, caption);
            inputDom.dispatchEvent(new Event("input", { bubbles: true }));
            await new Promise(r => setTimeout(r, 500));
        }

        console.log(`  ⏳ 粘贴图片...`);
        const pasteSuccess = await pasteImageToInput(imgBase64, { timeout: 8000 });
        if (!pasteSuccess) throw new Error("图片预览未生成");

        await new Promise(r => setTimeout(r, 1000));

        const sendButton = getSendButton();
        if (!sendButton) throw new Error("找不到发送按钮");

        sendButton.click();
        console.log(`✅ 图文同条发送成功: ${groupName}`);
        await new Promise(r => setTimeout(r, 1000));
        return true;
    } catch (error) {
        console.error(`❌ 图文同条发送失败: ${groupName}`, error.message);
        return false;
    }
}

/**
 * 发送图文内容（先图后文）
 */
async function 发送图文内容(groupName, imgBase64, text, textDelay = 1500) {
    try {
        const imageResult = await 发送图片内容(groupName, imgBase64);
        if (!imageResult) throw new Error("图片发送失败");

        console.log(`  ⏳ 等待 ${textDelay}ms 后发送文字...`);
        await new Promise(r => setTimeout(r, textDelay));

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
        const textResult = await 发送文本内容(groupName, text);
        if (!textResult) throw new Error("文字发送失败");

        console.log(`  ⏳ 等待 ${imageDelay}ms 后发送图片...`);
        await new Promise(r => setTimeout(r, imageDelay));

        const imageResult = await 发送图片内容(groupName, imgBase64);
        if (!imageResult) throw new Error("图片发送失败");

        console.log(`✅ 文本+图片发送成功: ${groupName}`);
        return true;
    } catch (error) {
        console.error(`❌ 文本+图片发送失败: ${groupName}`, error.message);
        return false;
    }
}

// ==================== 初始化 ====================

// 自动等待C# API并挂载方法
(async function init() {
    console.log("🚀 WhatsApp助手启动中...");
    await waitForCSharpApi();
    console.log("✅ C# API初始化完成，程序目录:", appDirectory);
})();

// 导出全局函数
window.标记客户 = 标记客户;
window.手动保存客户数据 = 手动保存客户数据;
window.手动刷新客户数据 = 手动刷新客户数据;
window.查看客户文件信息 = 查看客户文件信息;
window.采集群组号码并生成报告 = 采集群组号码并生成报告;
window.发送文本内容 = 发送文本内容;
window.发送图片内容 = 发送图片内容;
window.发送图文同条 = 发送图文同条;
window.获取未归档群组 = 获取未归档群组;

console.log("📁 客户数据文件:", CONFIG.CUSTOMER_DATA_FILE);
console.log("💡 使用 window.标记客户(true) 开启客户标记");
console.log("💡 使用 window.采集群组号码并生成报告() 开始采集");
