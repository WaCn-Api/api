// 后台接口
// await advancedApi.popOutCurrentTab(window.__VbrTabId) 分离当前标签页
// await advancedApi.restorePoppedTab(window.__VbrTabId) 还原当前标签页
// await advancedApi.restorePoppedTab() 依次分离标签页
// await advancedApi.popOutCurrentTab() 依次还原标签页

// // 翻译源
// const text = encodeURIComponent("保存和读取文件");
// const url = `http://elephant.browser.360.cn/?t=translate&i=${text}&type=AUTO&doctype=text&xmlVersion=1.1&keyfrom=360se&m=youdao`;

// const users = await httpGetJson(url);
// if (users.success) {
//   console.log("消息:", users.data);
// }

// ✅ 版本号：修改这里即可，无需在代码里逐处查找
const WA_VERSION = "v5.1.4";

// ==================== 本地数据库管理 ====================
// 数据库名称和版本
const DB_NAME = "WhatsAppCustomerDB";
const DB_VERSION = 1;
const STORE_NAME = "uniqueNumbers";

// 初始化数据库
async function 初始化数据库() {
  return new Promise((resolve, reject) => {
    // 先不指定版本，探测当前版本
    const detectRequest = indexedDB.open(DB_NAME);

    detectRequest.onsuccess = () => {
      const db = detectRequest.result;
      const hasStore = db.objectStoreNames.contains(STORE_NAME);
      const currentVersion = db.version;
      db.close();

      if (hasStore) {
        // store 已存在，直接用当前版本打开
        const request = indexedDB.open(DB_NAME, currentVersion);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (event) => {
          const db2 = event.target.result;
          if (!db2.objectStoreNames.contains(STORE_NAME)) {
            const store = db2.createObjectStore(STORE_NAME, {
              keyPath: "号码",
            });
            store.createIndex("群组", "所在群组", { unique: false });
            store.createIndex("采集时间", "采集时间", { unique: false });
          }
        };
      } else {
        // store 不存在，升级版本触发 onupgradeneeded
        const newVersion = currentVersion + 1;
        const request = indexedDB.open(DB_NAME, newVersion);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (event) => {
          const db2 = event.target.result;
          if (!db2.objectStoreNames.contains(STORE_NAME)) {
            const store = db2.createObjectStore(STORE_NAME, {
              keyPath: "号码",
            });
            store.createIndex("群组", "所在群组", { unique: false });
            store.createIndex("采集时间", "采集时间", { unique: false });
          }
        };
      }
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
      store.add({
        ...item,
        采集时间: timestamp,
        标记状态: "客户",
      });
    }

    await txComplete; // ✅ 等待事务完成
    console.log(`✅ 已保存 ${uniqueNumbers.length} 个独立号码到IndexedDB`);

    // ✅ 新增：同步写入 C# 文件存储
    if (window.__csharpApiReady && typeof window.saveFile === "function") {
      try {
        const saveResult = await window.saveFile("whatsapp_customers.json", {
          保存时间: timestamp,
          号码列表: uniqueNumbers,
        });

        const saveResults = await window.saveFile(
          `群组数据\\号码统计\\${((d) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}_${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}-${d.getMilliseconds()}`)(new Date())}.json`,
          {
            保存时间: timestamp,
            号码列表: uniqueNumbers,
          },
        );
        saveResult?.success
          ? console.log(`✅ 同步写入文件成功: ${saveResult.path}`)
          : console.warn("⚠️ 文件写入失败:", saveResult?.error);
        saveResults?.success
          ? console.log(`✅ 同步写入文件成功: ${saveResults.path}`)
          : console.warn("⚠️ 文件写入失败:", saveResults?.error);
      } catch (e) {
        console.warn("⚠️ C# 文件写入异常（不影响主流程）:", e);
      }
    }

    return true;
  } catch (error) {
    console.error("❌ 保存到数据库失败:", error);
    return false;
  }
}

// 查询号码是否在数据库中
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
  // 模拟真实点击
  async function 模拟点击(element) {
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

  // 获取号码文本
  function 获取号码文本() {
    const el = document.querySelector('span[data-testid="selectable-text"]');
    return el ? el.innerText : null;
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

  // 等待号码加载完成 【修复：找到号码立即返回，不再重复打印】
  async function 等待号码加载(timeout = 10000) {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const text = 获取号码文本();

      if (text) {
        const numbers = 提取号码(text);
        if (numbers.length > 0) {
          console.log(`  ✅ 检测到 ${numbers.length} 个号码`);
          return numbers; // 找到即返回，不再继续循环
        }
      }

      const elapsed = Date.now() - startTime;
      console.log(`  ⏳ 等待号码加载中... (${elapsed}ms)`);
      await new Promise((r) => setTimeout(r, 500));
    }

    console.log(`  ⚠️ 等待超时 (${timeout}ms)`);
    return [];
  }

  // 查找群组点击元素
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

    // 方法1：title 属性精确匹配
    for (const el of document.querySelectorAll(
      'span[dir="auto"][title], div[title], span[title]',
    )) {
      if (normalize(el.getAttribute("title")) === normalize(chatName)) {
        const clickable = findClickable(el);
        if (clickable) return clickable;
      }
    }

    // 方法2：文本内容模糊匹配
    for (const item of document.querySelectorAll('[role="row"]')) {
      const textEl = item.querySelector('span[dir="auto"]');
      if (
        textEl &&
        normalize(textEl.textContent).includes(normalize(chatName))
      ) {
        return item;
      }
    }

    return null;
  }

  // 获取未归档群组
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

  // 采集所有群组号码
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
        status: "processing",
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
            error: "找不到可点击元素",
          });
          continue;
        }

        console.log(`  🖱️ 点击打开聊天...`);
        await 模拟点击(clickable);

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
          count: numbers.length,
        });
      } catch (error) {
        console.error(`  处理失败:`, error);
        failCount++;
        results.push({
          ...group,
          numbers: [],
          status: "error",
          error: error.message,
        });
      }

      // 随机延迟 2-4 秒
      const delay = 2000 + Math.floor(Math.random() * 2000);
      console.log(`  ⏱️ 等待 ${delay}ms...\n`);
      await new Promise((r) => setTimeout(r, delay));
    }

    console.log(`\n✅ 采集完成！成功: ${successCount}，失败: ${failCount}`);
    return results;
  }

  // 分析重复号码
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
      .filter((n) => n.重复次数 > 1)
      .sort((a, b) => b.重复次数 - a.重复次数);
    const uniqueNumbers = allNumbers
      .filter((n) => n.重复次数 === 1)
      .sort((a, b) => a.号码.localeCompare(b.号码));

    return { allNumbers, duplicateNumbers, uniqueNumbers };
  }

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

  // 在生成报表函数中修改表格，添加归属地列
  function 生成报告(results, analysis) {
    const { allNumbers, duplicateNumbers, uniqueNumbers } = analysis;
    const successGroups = results.filter((r) => r.status === "success").length;
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
    <div class="tab active"  onclick="showTab('duplicate', this)">🔄 重复号码 (${duplicateNumbers.length})</div>
    <div class="tab"         onclick="showTab('unique', this)">✅ 独立号码 (${uniqueNumbers.length})</div>
    <div class="tab"         onclick="showTab('groups', this)">📋 群组详情 (${results.length})</div>
  </div>

  <div id="duplicate" class="tab-content active">
    <h2>🔄 重复号码（出现在多个群组）</h2>
    <input class="search-box" placeholder="搜索号码..." oninput="filterTable('dupTable', this.value)">
    <table id="dupTable">
      <tr><th>序号</th><th>手机号码</th><th>归属地</th><th>重复次数</th><th>所在群组</th></tr>
      ${duplicateNumbers
        .map(
          (item, i) => `
      <tr class="duplicate-row">
        <td>${i + 1}</td>
        <td><strong>${item.号码}</strong></td>
        <td>${查询号码归属地(item.号码)}</td>
        <td><span class="badge">${item.重复次数}</span></td>
        <td>${item.所在群组.join("、")}</td>
      </tr>`,
        )
        .join("")}
    </table>
  </div>

  <div id="unique" class="tab-content">
    <h2>✅ 独立号码（只在一个群组）</h2>
    <input class="search-box" placeholder="搜索号码..." oninput="filterTable('uniTable', this.value)">
    <table id="uniTable">
      <tr><th>序号</th><th>手机号码</th><th>归属地</th><th>所在群组</th></tr>
      ${uniqueNumbers
        .map(
          (item, i) => `
      <tr><td>${i + 1}</td><td>${item.号码}</td><td>${查询号码归属地(item.号码)}</td><td>${item.所在群组[0]}</td></tr>`,
        )
        .join("")}
    </table>
  </div>

  <div id="groups" class="tab-content">
    <h2>📋 群组详情</h2>
    <input class="search-box" placeholder="搜索群组..." oninput="filterGroups(this.value)">
    <div id="groups-container">
      ${results
        .map(
          (group, i) => `
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
        ${
          group.numbers.length > 0
            ? `
        <details>
          <summary>查看号码列表（${group.numbers.length} 个）</summary>
          <div class="num-list">${group.numbers.map((n) => `<div>${n} (${查询号码归属地(n)})</div>`).join("")}</div>
        </details>`
            : ""
        }
      </div>`,
        )
        .join("")}
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

  // 主函数
  async function 采集群组号码并生成报告(progressCallback) {
    console.log("=".repeat(60));
    console.log("📞 WhatsApp未归档群组成员号码采集器");
    console.log("=".repeat(60));
    console.log("⏰ 整个过程可能需要几分钟，请耐心等待...");

    const results = await 采集群组号码(progressCallback);

    const analysis = 分析号码重复(results);
    // ✅ 在这里添加保存到数据库
    if (analysis.uniqueNumbers && analysis.uniqueNumbers.length > 0) {
      try {
        await 保存独立号码到数据库(analysis.uniqueNumbers);
        console.log(
          `📦 已将 ${analysis.uniqueNumbers.length} 个独立号码存入本地数据库`,
        );
      } catch (error) {
        console.error("❌ 保存到数据库失败:", error);
      }
    }
    const html = 生成报告(results, analysis);

    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    a.download = `whatsapp_群组号码报告_${((d) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}_${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}-${d.getMilliseconds()}`)(new Date())}.html`;
    a.click();
    URL.revokeObjectURL(a.href);

    const newWindow = window.open();
    if (newWindow) {
      // 等待 bridge 对象绑定
      await CefSharp.BindObjectAsync("bridge");

      // 调用 C# 方法
      bridge.openReport(html);

      console.log("✅ 报告已在新窗口打开，可以按 Ctrl+S 保存");

      // 保存任意文本到文件中，文件路径和内容由用户指定。
      const res = await window.saveFile(
        `群组数据\\${((d) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}_${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}-${d.getMilliseconds()}`)(new Date())}_whatsapp_群组号码报告.html`,
        html,
      );
      console.log(res);
    } else {
      // 如果新窗口被拦截，在控制台输出HTML
      console.log("⚠️ 新窗口被拦截，请在控制台复制以下HTML：");
      console.log("=".repeat(100));
      console.log(html);
      console.log("=".repeat(100));
    }

    console.log(`\n✅ 报告已生成并下载`);
    console.log(
      `📊 群组: ${results.length} | 成功: ${results.filter((r) => r.status === "success").length} | 号码: ${analysis.allNumbers.length}`,
    );

    return { results, analysis };
  }

  // 执行并返回结果
  return await 采集群组号码并生成报告(progressCallback);
}

// ==================== 客户标记开关（使用您的滚动监听方法） ====================

let 客户标记监控开启 = false;
let 已标记消息的ID集合 = new Set();
let 标记防抖定时器 = null;
let 滚动监听定时器 = null;
let 已读面板监听定时器 = null;
let 已读面板容器引用 = null;

async function 标记客户(开启 = true) {
  console.log("标记客户被调用，开启:", 开启);

  if (开启) {
    if (客户标记监控开启) {
      console.log("⚠️ 客户标记已经开启");
      return;
    }

    try {
      let 客户号码 = [];

      // 1. 优先从 C# 文件存储读取
      if (window.__csharpApiReady && typeof window.readFile === "function") {
        try {
          const fileData = await window.readFile("whatsapp_customers.json");
          if (
            fileData &&
            Array.isArray(fileData.号码列表) &&
            fileData.号码列表.length > 0
          ) {
            客户号码 = fileData.号码列表
              .map((item) => item.号码)
              .filter(Boolean);
            window.__数据采集时间 = fileData.保存时间;
            console.log(`📁 使用文件存储数据: ${客户号码.length} 个`);
          }
        } catch (e) {
          console.warn("⚠️ 读取文件存储异常:", e);
        }
      } else {
        console.log("ℹ️ C# API 不可用，跳过文件读取");
      }

      // 2. 文件没有数据，降级用 IndexedDB
      if (客户号码.length === 0) {
        console.log("📦 文件无数据，尝试读取 IndexedDB...");
        const indexedDBNumbers = await new Promise((resolve) => {
          const request = indexedDB.open("WhatsAppCustomerDB");
          request.onsuccess = () => {
            const db = request.result;
            const tx = db.transaction("uniqueNumbers", "readonly");
            const store = tx.objectStore("uniqueNumbers");
            const getAll = store.getAll();
            getAll.onsuccess = () => {
              const items = getAll.result;
              if (items.length > 0) {
                window.__数据采集时间 = items[0].采集时间;
              }
              resolve(items.map((item) => item.号码));
            };
            getAll.onerror = () => resolve([]);
          };
          request.onerror = () => resolve([]);
          request.onupgradeneeded = () => resolve([]);
        });

        if (indexedDBNumbers.length > 0) {
          客户号码 = indexedDBNumbers;
          console.log(`📦 降级使用 IndexedDB 数据: ${客户号码.length} 个`);
        }
      }

      // 3. 两个都没有数据，报错退出
      if (客户号码.length === 0) {
        console.error("❌ 开启失败: 没有客户数据");
        alert("❌ 开启失败：没有客户数据，请先采集或导入客户号码");
        return;
      }

      window.__客户号码列表 = new Set(客户号码);
      console.log(`📚 已加载 ${客户号码.length} 个客户号码`);

      // 4. 启动滚动监听
      启动滚动监听();

      // 5. 监听聊天列表点击
      document.addEventListener("click", 监听聊天点击, true);

      客户标记监控开启 = true;
      console.log("✅ 客户标记已开启");

      // 6. 初始标记
      标记聊天列表();
      标记当前可见消息();
      setTimeout(() => {
        标记当前聊天窗口();
        标记当前可见消息();
        启动滚动监听();
      }, 1000);
      启动已读面板监听();
      标记已读用户列表();
    } catch (error) {
      console.error("❌ 开启失败:", error);
    }
  } else {
    // 关闭所有监听
    document.removeEventListener("click", 监听聊天点击, true);

    if (滚动监听定时器) {
      clearInterval(滚动监听定时器);
      滚动监听定时器 = null;
    }

    if (已读面板监听定时器) {
      已读面板监听定时器.disconnect();
      已读面板监听定时器 = null;
    }
    if (已读面板容器引用) {
      已读面板容器引用._observer?.disconnect();
      已读面板容器引用 = null;
    }

    if (标记防抖定时器) {
      clearTimeout(标记防抖定时器);
      标记防抖定时器 = null;
    }

    if (滚动监听容器引用) {
      滚动监听容器引用.removeEventListener("scroll", 处理滚动);
      滚动监听容器引用 = null;
    }

    document
      .querySelectorAll(
        ".customer-badge, .chat-customer-badge, .header-customer-badge",
      )
      .forEach((el) => el.remove());
    已标记消息的ID集合.clear();
    客户标记监控开启 = false;
    window.__客户号码列表 = null;
    console.log("🛑 客户标记已关闭");
  }
}

// 启动滚动监听（使用您的代码）
// ✅ 在全局保存对container的引用，方便关闭时移除
let 滚动监听容器引用 = null;
function 启动滚动监听() {
  const containerClass =
    'div[data-scrolltracepolicy="wa.web.conversation.messages"]';

  if (滚动监听定时器) {
    clearInterval(滚动监听定时器);
  }

  // ✅ 先清理旧的滚动监听
  if (滚动监听容器引用) {
    滚动监听容器引用.removeEventListener("scroll", 处理滚动);
    滚动监听容器引用 = null;
  }

  滚动监听定时器 = setInterval(() => {
    const container = document.querySelector(containerClass);
    if (!container) return;

    console.log("✅ 找到消息列表容器，开始监听滚动");

    // ✅ 先移除旧的，再绑定新的
    container.removeEventListener("scroll", 处理滚动);
    container.addEventListener("scroll", 处理滚动);
    滚动监听容器引用 = container; // ✅ 保存引用

    clearInterval(滚动监听定时器);
    滚动监听定时器 = null;
  }, 200);
}

// 处理滚动事件
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

// 监听聊天点击
function 监听聊天点击(event) {
  const chatItem = event.target.closest(
    '[role="row"], [role="listitem"], ._ak8q, [data-testid="chat-list-item"]',
  );
  if (chatItem) {
    console.log("🖱️ 检测到聊天被点击，准备标记...");

    // 立即标记聊天列表
    标记聊天列表();

    // 延迟等待聊天内容加载
    setTimeout(() => {
      console.log("⏳ 聊天内容加载完成，开始标记...");
      标记当前聊天窗口();
      标记当前可见消息();
      //   启动已读面板监听(); // ✅ 新增：每次切换聊天后重新监听已读面板
      // 重新启动滚动监听（因为切换聊天后容器可能变化）
      启动滚动监听();
      console.log("✅ 聊天标记完成");
    }, 800);
  }
}

// 标记聊天列表
function 标记聊天列表() {
  const chatItems = document.querySelectorAll(
    '[role="row"], [role="listitem"], ._ak8q, [data-testid="chat-list-item"]',
  );
  let 标记数量 = 0;

  chatItems.forEach((item) => {
    // 移除旧的标记
    item.querySelectorAll(".chat-customer-badge").forEach((el) => el.remove());

    // 从聊天项中查找号码
    const numberSpan = item.querySelector(
      'span[data-testid="selectable-text"]',
    );
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
              badge.innerHTML = "⭐";
              badge.title = "客户";
              badge.style.cssText = `
                background: #25D366;
                color: white;
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

function 标记当前聊天窗口(重试次数 = 0) {
  // ✅ 找所有 header 里的 selectable-text，取包含 + 的那个
  const allSpans = document.querySelectorAll(
    'header span[data-testid="selectable-text"]',
  );
  const numberSpan = [...allSpans].find((s) => s.textContent.includes("+"));

  console.log(
    `重试${重试次数}, 找到span数:`,
    allSpans.length,
    "含+的:",
    !!numberSpan,
  );

  if (!numberSpan) {
    if (重试次数 < 8) {
      setTimeout(() => 标记当前聊天窗口(重试次数 + 1), 400);
    }
    return;
  }

  const header = numberSpan.closest("header");
  if (!header) return;

  header
    .querySelectorAll(".header-customer-badge")
    .forEach((el) => el.remove());
  header.querySelectorAll(".header-group-count").forEach((el) => el.remove());

  const text = numberSpan.textContent || "";
  const matches = text.match(/\+[\d\s\(\)\-]{9,20}/g);
  if (!matches) return;

  const nameEl = header.querySelector('span[dir="auto"]:not([data-testid])');
  if (!nameEl) return;

  let 本群客户数 = 0;
  let 本群美国客户数 = 0; // ✅ 新增
  let 已标记 = false;
  for (const match of matches) {
    const 号码 = match.replace(/[\s\(\)\-]/g, "");
    if (window.__客户号码列表?.has(号码)) {
      本群客户数++;
      // ✅ 判断是否美国/加拿大（+1开头）
      if (号码.startsWith("+1")) 本群美国客户数++;
      if (!已标记) {
        已标记 = true;
        const badge = document.createElement("span");
        badge.className = "header-customer-badge customer-badge";
        badge.innerHTML = "⭐ 客户";
        badge.style.cssText = `
          background: #25D366; color: white; padding: 2px 8px;
          border-radius: 12px; font-size: 12px; margin-left: 10px;
          font-weight: bold; display: inline-block; pointer-events: none;
        `;
        nameEl.parentNode.appendChild(badge);
      }
    }
  }

  if (本群客户数 > 0) {
    let 时间显示 = "";
    if (window.__数据采集时间) {
      const d = new Date(window.__数据采集时间);
      时间显示 = ` ${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
    }
    const countBadge = document.createElement("span");
    countBadge.className = "header-group-count";
    // ✅ 加上美国客户数
    const 美国显示 =
      本群美国客户数 > 0 ? ` | 美国客户： ${本群美国客户数} 位` : "";
    countBadge.textContent = `👥 本群有： ${本群客户数} 位客户${美国显示} | 数据采集时间：${时间显示}`;
    countBadge.style.cssText = `
      background: #f39c12; color: white; padding: 2px 8px;
      border-radius: 12px; font-size: 12px; margin-left: 6px;
      font-weight: bold; display: inline-block; pointer-events: none;
    `;
    nameEl.parentNode.appendChild(countBadge);
    console.log(`📊 本群客户数: ${本群客户数} 美国: ${本群美国客户数}`);
    // const cleanNameTab = (      [        ...document.querySelectorAll(          'header span[data-testid="selectable-text"]',        ),      ]        .find((s) => s.textContent.includes("+"))        ?.closest("header")        || ""    )
    // const cleanName = (
    //   [
    //     ...document.querySelectorAll(
    //       'header span[data-testid="selectable-text"]',
    //     ),
    //   ]
    //     .find((s) => s.textContent.includes("+"))
    //     ?.closest("header")
    //     ?.querySelector('span[dir="auto"]:not([data-testid])')?.innerHTML || ""
    // ).replace(/<img[^>]*alt="([^"]*)"[^>]*>/g, "$1");
    // cleanNameTab.addEventListener("click", () => {
    //   navigator.clipboard
    //     .writeText(
    //       cleanName +
    //         "群" +
    //         "\n" +
    //         Array.from(window.__客户号码列表) +
    //         "\n" ,
    //     )
    //     .then(() => {
    //       alert(`✅ 已复制 ${本群客户数}  个客户号码到剪切板`);
    //     })
    //     .catch((e) => {
    //       alert("复制失败:");
    //       console.error("复制失败:", e);
    //     });
    // });
  }
}

// 标记当前可见的消息（处理懒加载）
function 标记当前可见消息() {
  const messages = document.querySelectorAll("div[data-pre-plain-text]");
  let 新标记数量 = 0;

  messages.forEach((msg) => {
    // 检查消息是否在视口中
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
      const senderArea =
        msg.closest("._amk4") || msg.closest('[class*="message"]');
      if (!senderArea) return;

      if (senderArea.querySelector(".customer-badge")) return;

      const nameEl = senderArea.querySelector(
        '._ahxy, span[dir="auto"][aria-label]',
      );
      if (!nameEl) return;

      const badge = document.createElement("span");
      badge.className = "customer-badge";
      badge.innerHTML = "⭐ 客户";
      badge.style.cssText = `
        background: #25D366;
        color: white;
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
    console.log(
      `📊 本次标记 ${新标记数量} 条新客户消息，总计 ${已标记消息的ID集合.size} 条`,
    );
  }
}

// 手动触发标记（用于测试）
function 手动标记测试() {
  console.log("🔧 手动触发标记测试");
  标记聊天列表();
  标记当前聊天窗口();
  标记当前可见消息();
}
// 替换这两个函数

// 统计已读客户数量
var 统计看群数据 = null;
function 注入badge(客户数已读, 客户数已收到, 已读客户列表, 已收到客户列表) {
  const titleEl =
    document.querySelector('div[title="信息详情"] h2') ||
    document.querySelector('div[title="Message info"] h2') ||
    document.querySelector('div[title="Informações da mensagem"] h2');

  if (!titleEl) return;

  document.querySelectorAll(".read-stat-badge-row").forEach((el) => {
    const h = el.closest("header");
    if (h) h.style.height = "";
    el.remove();
  });

  if (客户数已读 === 0 && 客户数已收到 === 0) return;

  function 统计地区(号码列表) {
    let 美加 = 0,
      英国 = 0,
      其他 = 0;
    号码列表.forEach((号码) => {
      const num = 号码.replace("+", "");
      if (num.startsWith("1")) 美加++;
      else if (num.startsWith("44")) 英国++;
      else 其他++;
    });
    const parts = [];
    if (美加 > 0) parts.push(`(美国/加拿大)×${美加}`);
    if (英国 > 0) parts.push(`(英国)×${英国}`);
    if (其他 > 0) parts.push(`(其它)×${其他}`);
    return parts.join("  ");
  }

  // ✅ h2 的父元素就是 div[title="信息详情"]
  const 信息详情Div = titleEl.parentElement;
  const header = 信息详情Div.closest("header");
  if (!header) return;
  header.style.height = "100px";

  const row = document.createElement("div");
  row.className = "read-stat-badge-row";
  row.style.cssText = `
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 4px 16px 6px;
    align-items: center;
    box-sizing: border-box;
  `;

  if (客户数已读 > 0) {
    const b = document.createElement("span");
    b.title = `已读客户: ${已读客户列表.join(", ")}`;
    b.style.cssText = `
      background: rgb(52 183 101); color: white; padding: 3px 10px;
      border-radius: 10px; font-size: 12px; font-weight: bold;
      display: inline-flex; align-items: center; pointer-events: none;
      white-space: nowrap;    padding: 10px;
    `;
    b.textContent = `⭐ 已读${客户数已读}  |  ${统计地区(已读客户列表)}`;
    row.appendChild(b);

    // console.log(已读客户列表);

    const cleanName = (
      [
        ...document.querySelectorAll(
          'header span[data-testid="selectable-text"]',
        ),
      ]
        .find((s) => s.textContent.includes("+"))
        ?.closest("header")
        ?.querySelector('span[dir="auto"]:not([data-testid])')?.innerHTML || ""
    ).replace(/<img[^>]*alt="([^"]*)"[^>]*>/g, "$1");
    统计看群数据 =
      cleanName +
      "群" +
      "\n" +
      统计地区(已读客户列表) +
      "\n" +
      已读客户列表.join("\n");

    header.addEventListener("click", () => {
      navigator.clipboard
        .writeText(
          cleanName +
            "群" +
            "\n" +
            统计地区(已读客户列表) +
            "\n" +
            已读客户列表.join("\n"),
        )
        .then(() => {
          alert(`✅ 已复制 ${已读客户列表.length} 个已读客户号码到剪切板`);
        })
        .catch((e) => {
          alert("复制失败:");
          console.error("复制失败:", e);
        });
    });
  }

  if (客户数已收到 > 0) {
    const b2 = document.createElement("span");
    b2.title = `已收到客户: ${已收到客户列表.join(", ")}`;
    b2.style.cssText = `
      background: #128C7E; color: white; padding: 3px 10px;
      border-radius: 10px; font-size: 12px; font-weight: bold;
      display: inline-flex; align-items: center; pointer-events: none;
      white-space: nowrap;    padding: 10px;
    `;
    b2.textContent = `📩 收到${客户数已收到}  |  ${统计地区(已收到客户列表)} `;
    row.appendChild(b2);
  }

  // ✅ 插到 信息详情Div 后面，而不是 header 末尾
  信息详情Div.insertAdjacentElement("afterend", row);
}

let 统计进行中 = false; // ✅ 全局锁
async function 统计已读客户数() {
  if (统计进行中) return null; // ✅ 防止重入
  统计进行中 = true;

  try {
    const allLists = document.querySelectorAll(".x1y332i5");
    let virtualList = null,
      maxHeight = 0;
    allLists.forEach((el) => {
      const h = parseInt(el.style.height) || 0;
      if (h > maxHeight && el.querySelector('[role="listitem"] ._ak8i')) {
        maxHeight = h;
        virtualList = el;
      }
    });
    if (!virtualList) return null;

    const aig容器 = virtualList.closest("._aig-");
    if (!aig容器) return null;

    const 原始高度 = aig容器.style.height;
    aig容器.style.height = "999999px";
    await new Promise((r) => setTimeout(r, 500));

    const 已读客户 = new Set();
    const 已收到客户 = new Set();
    let 当前区块 = null;

    // ✅ 记录标题条目的DOM引用
    let 已读标题条目 = null;
    let 已收到标题条目 = null;

    const items = virtualList.querySelectorAll('[role="listitem"]');

    items.forEach((item) => {
      const text = item.textContent.trim();

      if (text.includes("已读用户")) {
        当前区块 = "read";
        已读标题条目 = item; // ✅ 保存引用
        return;
      }
      if (text.includes("已接收的用户") || text.includes("已送达")) {
        当前区块 = "received";
        已收到标题条目 = item; // ✅ 保存引用
        return;
      }
      if (text.includes("还剩")) return;
      if (!当前区块) return;

      let 号码 = null;
      const ak8qSpan = item.querySelector("._ak8q span[dir='auto']");
      if (!ak8qSpan) return;

      const ariaLabel = ak8qSpan.getAttribute("aria-label");
      if (ariaLabel) {
        const ak8iSpan = item.querySelector("._ak8i span._ao3e");
        if (!ak8iSpan) return;
        const match = ak8iSpan.textContent.match(/\+[\d\s\(\)\-]{9,20}/);
        if (!match) return;
        号码 = match[0].replace(/[\s\(\)\-]/g, "");
      } else {
        const title = ak8qSpan.getAttribute("title") || "";
        const match = title.match(/\+[\d\s\(\)\-]{9,20}/);
        if (!match) return;
        号码 = match[0].replace(/[\s\(\)\-]/g, "");
      }

      if (!号码 || !window.__客户号码列表?.has(号码)) return;

      if (当前区块 === "read") 已读客户.add(号码);
      else if (当前区块 === "received") 已收到客户.add(号码);
    });

    // ✅ 修复：先构建 result，再使用
    aig容器.style.height = 原始高度;

    const result = {
      已读客户数: 已读客户.size,
      已收到客户数: 已收到客户.size,
      已读客户列表: [...已读客户],
      已收到客户列表: [...已收到客户],
    };

    // ✅ 修改调用
    注入badge(
      result.已读客户数,
      result.已收到客户数,
      result.已读客户列表,
      result.已收到客户列表,
    );

    console.log(
      `⭐ 已读客户: ${result.已读客户数} | 已收到客户: ${result.已收到客户数}`,
    );
    return result;
  } finally {
    统计进行中 = false; // ✅ 无论成功失败都释放锁
  }
}

function 标记已读用户列表() {
  const allLists = document.querySelectorAll(".x1y332i5");
  let virtualList = null,
    maxHeight = 0;
  allLists.forEach((el) => {
    const h = parseInt(el.style.height) || 0;
    if (h > maxHeight && el.querySelector('[role="listitem"] ._ak8i')) {
      maxHeight = h;
      virtualList = el;
    }
  });
  if (!virtualList) return;

  const listItems = virtualList.querySelectorAll('[role="listitem"]');
  let 标记数量 = 0;

  listItems.forEach((item) => {
    if (item.querySelector(".customer-badge")) return;

    // ✅ 兼容两种结构
    // 结构1：号码在 _ak8i > span._ao3e（有昵称的联系人）
    // 结构2：号码直接在 _ak8q > span[title]（无昵称，号码即显示名）
    let 号码 = null;
    let nameEl = null;

    const ak8iSpan = item.querySelector("._ak8i span._ao3e");
    if (ak8iSpan && /\+[\d\s\(\)\-]{9,20}/.test(ak8iSpan.textContent)) {
      // 结构1
      const match = ak8iSpan.textContent.match(/\+[\d\s\(\)\-]{9,20}/);
      if (match) {
        号码 = match[0].replace(/[\s\(\)\-]/g, "");
        nameEl = item.querySelector("._ak8q span[dir='auto']");
      }
    } else {
      // 结构2：_ak8i 为空，号码在 _ak8q 的 span[title]
      const ak8qSpan = item.querySelector("._ak8q span[dir='auto']");
      if (ak8qSpan) {
        const titleText =
          ak8qSpan.getAttribute("title") || ak8qSpan.textContent || "";
        const match = titleText.match(/\+[\d\s\(\)\-]{9,20}/);
        if (match) {
          号码 = match[0].replace(/[\s\(\)\-]/g, "");
          nameEl = ak8qSpan; // 号码本身就是名字元素
        }
      }
    }

    if (!号码 || !nameEl) return;
    if (!window.__客户号码列表?.has(号码)) return;

    const badge = document.createElement("span");
    badge.className = "customer-badge";
    badge.innerHTML = "⭐ 客户";
    badge.style.cssText = `
      background: #25D366; color: white; padding: 2px 6px;
      border-radius: 10px; font-size: 11px; margin-left: 8px;
      font-weight: bold; display: inline-block;
      pointer-events: none; vertical-align: middle;
    `;
    nameEl.parentNode.appendChild(badge);
    标记数量++;
    console.log(`✅ 已读面板标记客户: ${号码}`);
  });

  if (标记数量 > 0) console.log(`📊 已读面板标记完成，共 ${标记数量} 个客户`);
}
// ==================== 已读面板监听（MutationObserver，零轮询） ====================

// 变量说明：已读面板监听定时器 复用存 bodyObserver
function 启动已读面板监听() {
  // 清理旧监听
  if (已读面板监听定时器) {
    已读面板监听定时器.disconnect();
    已读面板监听定时器 = null;
  }
  if (已读面板容器引用) {
    已读面板容器引用._observer?.disconnect();
    已读面板容器引用 = null;
  }

  // 查找已读面板虚拟列表
  function 查找已读面板() {
    const allLists = document.querySelectorAll(".x1y332i5");
    let best = null,
      maxH = 0;
    allLists.forEach((el) => {
      const h = parseInt(el.style.height) || 0;
      if (h > maxH && el.querySelector('[role="listitem"] ._ak8i')) {
        maxH = h;
        best = el;
      }
    });
    return best;
  }

  // 绑定已读面板内部懒加载监听
  let 已统计过 = false; // ✅ 每次面板打开只统计一次

  function 绑定已读面板(virtualList) {
    if (已读面板容器引用?._list === virtualList) return;
    已读面板容器引用?._observer?.disconnect();
    已统计过 = false; // ✅ 新面板重置

    let 防抖 = null;
    const observer = new MutationObserver(() => {
      if (防抖) clearTimeout(防抖);
      防抖 = setTimeout(() => {
        标记已读用户列表();
        // ✅ 只在第一次触发时统计，之后不再重复
        if (!已统计过) {
          已统计过 = true;
          统计已读客户数();
        }
      }, 200);
    });
    observer.observe(virtualList, { childList: true, subtree: false });
    已读面板容器引用 = { _list: virtualList, _observer: observer };

    console.log("✅ 已读面板绑定成功");
    标记已读用户列表();

    // ✅ 面板打开时立即统计一次
    已统计过 = true;
    统计已读客户数();
  }

  // 防抖，避免 body 变化过于频繁
  let bodyDebounce = null;

  const bodyObserver = new MutationObserver((mutations) => {
    if (!客户标记监控开启) return;

    // 快速过滤：只处理涉及 x1y332i5 或 _ak8i 的变化
    const relevant = mutations.some((m) =>
      [...m.addedNodes, ...m.removedNodes].some(
        (n) =>
          n.nodeType === 1 &&
          (n.classList?.contains("x1y332i5") ||
            n.querySelector?.("._ak8i") ||
            n.classList?.contains("_ak8i")),
      ),
    );
    if (!relevant) return;

    if (bodyDebounce) clearTimeout(bodyDebounce);
    bodyDebounce = setTimeout(() => {
      const panel = 查找已读面板();
      if (panel) {
        绑定已读面板(panel);
      } else if (已读面板容器引用) {
        // 面板关闭了，清理
        已读面板容器引用._observer?.disconnect();
        已读面板容器引用 = null;
        console.log("ℹ️ 已读面板已关闭");
      }
    }, 100);
  });

  bodyObserver.observe(document.body, { childList: true, subtree: true });
  已读面板监听定时器 = bodyObserver;

  // 立即检测一次（如果已读面板已经打开）
  const panel = 查找已读面板();
  if (panel) 绑定已读面板(panel);
}

function 标记已读用户列表() {
  const allLists = document.querySelectorAll(".x1y332i5");
  let virtualList = null,
    maxHeight = 0;
  allLists.forEach((el) => {
    const h = parseInt(el.style.height) || 0;
    if (h > maxHeight && el.querySelector('[role="listitem"] ._ak8i')) {
      maxHeight = h;
      virtualList = el;
    }
  });
  if (!virtualList) return;

  const listItems = virtualList.querySelectorAll('[role="listitem"]');
  let 标记数量 = 0;

  listItems.forEach((item) => {
    if (item.querySelector(".customer-badge")) return;

    const ak8qSpan = item.querySelector("._ak8q span[dir='auto']");
    if (!ak8qSpan) return;

    let 号码 = null;

    const ariaLabel = ak8qSpan.getAttribute("aria-label");

    if (ariaLabel) {
      // 结构1：有名字，号码在 _ak8i
      const ak8iSpan = item.querySelector("._ak8i span._ao3e");
      if (!ak8iSpan) return;
      const match = ak8iSpan.textContent.match(/\+[\d\s\(\)\-]{9,20}/);
      if (!match) return;
      号码 = match[0].replace(/[\s\(\)\-]/g, "");
    } else {
      // 结构2：无名字，号码就在 _ak8q span 的 title 属性
      const title = ak8qSpan.getAttribute("title") || "";
      const match = title.match(/\+[\d\s\(\)\-]{9,20}/);
      if (!match) return;
      号码 = match[0].replace(/[\s\(\)\-]/g, "");
    }

    if (!号码 || !window.__客户号码列表?.has(号码)) return;

    const badge = document.createElement("span");
    badge.className = "customer-badge";
    badge.innerHTML = "⭐ 客户";
    badge.style.cssText = `
      background: #25D366; color: white; padding: 2px 6px;
      border-radius: 10px; font-size: 11px; margin-left: 8px;
      font-weight: bold; display: inline-block;
      pointer-events: none; vertical-align: middle;
    `;
    ak8qSpan.parentNode.appendChild(badge);
    标记数量++;
    console.log(`✅ 已读面板标记客户: ${号码}`);
  });

  if (标记数量 > 0) console.log(`📊 已读面板标记完成，共 ${标记数量} 个客户`);
}

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
 * 发送文本内容到指定群组（更健壮的版本）
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

    // 方法1: 尝试使用 insertText 但处理换行
    const lines = content.split("\n");

    if (lines.length === 1) {
      // 单行文本，直接插入
      document.execCommand("insertText", false, content);
    } else {
      // 多行文本，逐行插入并手动添加换行
      for (let i = 0; i < lines.length; i++) {
        document.execCommand("insertText", false, lines[i]);
        if (i < lines.length - 1) {
          // 手动插入换行（使用 Shift+Enter 的组合）
          dom.input.dispatchEvent(
            new KeyboardEvent("keydown", {
              key: "Enter",
              shiftKey: true,
              bubbles: true,
            }),
          );
          await new Promise((r) => setTimeout(r, 50));
        }
      }
    }

    // 触发 input 事件
    dom.input.dispatchEvent(new Event("input", { bubbles: true }));

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

    // ✅ 使用优化后的文本发送函数（已经内置了换行处理）
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

    // ✅ 使用优化后的文本发送函数
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
 * 发送图文同条（图片+描述）- 先输入文字，再粘贴图片
 */
async function 发送图文同条(groupName, imgBase64, caption) {
  try {
    console.log(`📷📝 发送图文同条到 "${groupName}"`);
    const clicked = await 点击聊天列表(groupName);
    if (!clicked) throw new Error(`无法打开聊天: ${groupName}`);
    await new Promise((r) => setTimeout(r, 1000));

    // 1. 先输入文字（使用已修复的文本输入逻辑，但不发送）
    if (caption && caption.trim()) {
      console.log(`  ⏳ 输入文字...`);

      const dom = 单文本发送模式获取DOM();
      if (!dom || !dom.input) throw new Error("无法获取输入框");

      dom.input.focus();

      // 复制发送文本内容的输入逻辑
      const lines = caption.split("\n");

      if (lines.length === 1) {
        document.execCommand("insertText", false, caption);
      } else {
        for (let i = 0; i < lines.length; i++) {
          document.execCommand("insertText", false, lines[i]);
          if (i < lines.length - 1) {
            dom.input.dispatchEvent(
              new KeyboardEvent("keydown", {
                key: "Enter",
                shiftKey: true,
                bubbles: true,
                cancelable: true,
              }),
            );
            await new Promise((r) => setTimeout(r, 50));
          }
        }
      }

      dom.input.dispatchEvent(new Event("input", { bubbles: true }));
      console.log(`  ✅ 文字已输入（保留换行）`);
      await new Promise((r) => setTimeout(r, 500));
    }

    // 2. 再粘贴图片
    console.log(`  ⏳ 粘贴图片...`);
    const fileSizeKB = estimateBase64Size(imgBase64);
    console.log(`  图片大小: ${fileSizeKB.toFixed(2)}KB`);

    const pasteSuccess = await pasteImageToInput(imgBase64, { timeout: 8000 });
    if (!pasteSuccess) throw new Error("图片预览未生成");

    // 3. 等待图片预览加载
    await new Promise((r) => setTimeout(r, 1000));

    // 4. 发送
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

  浮动窗口.innerHTML = `
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
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <div style="font-size:11px;color:#aaa;">选择群组（点赞这些群的消息）</div>
            <div style="display:flex;gap:4px;">
              <button id="reactionSelectAll" style="font-size:10px;padding:2px 6px;border:1px solid #9c27b0;border-radius:3px;background:#fff;color:#9c27b0;cursor:pointer;margin:0;">全选</button>
              <button id="reactionClearAll" style="font-size:10px;padding:2px 6px;border:1px solid #ddd;border-radius:3px;background:#fff;color:#666;cursor:pointer;margin:0;">清空</button>
            </div>
          </div>
          <div id="reactionGroupList" style="max-height:180px;overflow-y:auto;border:1px solid #eee;border-radius:4px;padding:4px;font-size:12px;background:#fafafa;"><div style="text-align:center;color:#aaa;padding:20px;">请先在主面板加载群组列表</div></div>
        </div>

        <!-- 间隔设置 -->
        <div style="padding:10px;border-bottom:1px solid #eee;flex-shrink:0;display:flex;align-items:center;gap:8px;">
          <span style="font-size:12px;color:#666;white-space:nowrap;">每条间隔</span>
          <input id="reactionDelay" type="number" value="3" min="1" style="width:50px;padding:4px 6px;border:1px solid #ddd;border-radius:4px;font-size:12px;">
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
  // 更新状态消息
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

  // 分离/还原当前页面
  let 已分离 = false;

  shadowRoot
    .getElementById("分离当前页面")
    .addEventListener("click", async function () {
      const 按钮 = this;

      try {
        按钮.disabled = true;

        if (已分离) {
          await advancedApi.restorePoppedTab(window.__VbrTabId);
          按钮.textContent = "分离当前页面";
          已分离 = false;
        } else {
          await advancedApi.popOutCurrentTab(window.__VbrTabId);
          按钮.textContent = "还原当前页面";
          已分离 = true;
        }
      } catch (error) {
        console.error("操作失败:", error);
      } finally {
        按钮.disabled = false;
      }
    });

  // 获取群组数据报表（新功能）
  shadowRoot
    .getElementById("loadGroupsBtn")
    .addEventListener("click", async function () {
      const 按钮 = this;

      try {
        按钮.disabled = true;
        按钮.textContent = "采集中...";
        progressContainer.style.display = "block";
        progressBar.style.width = "0%";
        progressText.textContent = "正在初始化...";
        progressPercent.textContent = "0%";
        更新状态消息("正在采集群组成员号码，请不要进行任何操作！", "success");

        // ✅ 传入进度回调，实时更新进度条
        const results = await 获取未归档群数据报表((p) => {
          const percent = Math.floor((p.current / p.total) * 100);
          progressBar.style.width = `${percent}%`;
          progressText.textContent = `采集中 (${p.current}/${p.total}) - ${p.groupName}`;
          progressPercent.textContent = `${percent}%`;
          更新状态消息(`正在采集: ${p.groupName}`, "success");
        });

        progressBar.style.width = "100%";
        progressPercent.textContent = "100%";

        if (results && results.results) {
          const successCount = results.results.filter(
            (r) => r.status === "success",
          ).length;
          const totalCount = results.results.length;
          progressText.textContent = `采集完成！成功 ${successCount}/${totalCount} 个群组`;
          更新状态消息(`✅ 采集完成！成功: ${successCount} 个群组`, "success");
        } else {
          progressText.textContent = "采集完成！";
          更新状态消息("✅ 采集完成！", "success");
        }

        // 重载客户标记
        if (客户标记监控开启) {
          progressText.textContent = "正在更新客户标记数据...";
          await 标记客户(false);
          await 标记客户(true);
          同步客户标记按钮状态();
          更新状态消息("✅ 客户标记已更新为最新数据", "success");
        }
      } catch (error) {
        console.error("采集失败:", error);
        progressText.textContent = `采集失败: ${error.message}`;
        更新状态消息(`❌ 采集失败: ${error.message}`, "error");
      } finally {
        按钮.disabled = false;
        按钮.textContent = "获取未归档群组报表";
      }
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

  // 清除数据
  shadowRoot.getElementById("clearDataBtn").addEventListener("click", () => {
    const btn = shadowRoot.getElementById("clearDataBtn");
    btn.disabled = true;
    btn.textContent = "清除中...";
    更新状态消息("正在清除客户数据，请稍候...", "success");

    const req = indexedDB.deleteDatabase("WhatsAppCustomerDB");
    req.onsuccess = () => {
      btn.textContent = "✅ 已清除，刷新中...";
      更新状态消息("清除成功，即将刷新页面...", "success");
      setTimeout(() => location.reload(), 800); // 留0.8秒让用户看到提示
    };
    req.onerror = () => {
      btn.disabled = false;
      btn.textContent = "清除客户数据";
      更新状态消息("❌ 清除失败，请重试", "error");
    };
  });

  // ✅ 加上这行！
  const toggleBtn = shadowRoot.getElementById("customerMarkToggleBtn");

  // ✅ 新增：统一的按钮状态同步函数
  function 同步客户标记按钮状态() {
    // ← 注意：参数也不需要了，直接用上面的 toggleBtn
    if (!toggleBtn) return;
    if (客户标记监控开启) {
      toggleBtn.style.backgroundColor = "#f44336";
      toggleBtn.textContent = "⏹️ 关闭客户标记";
    } else {
      toggleBtn.style.backgroundColor = "#25D366";
      toggleBtn.textContent = "⭐ 开启客户标记";
    }
  }

  // ✅ click handler 改成这样，catch里也会同步
  toggleBtn.addEventListener("click", async () => {
    if (toggleBtn.disabled) return; // 防止重复点击（已有）
    toggleBtn.disabled = true;
    try {
      await 标记客户(!客户标记监控开启); // ✅ 直接传当前状态的反值，更清晰
    } catch (e) {
      console.error("切换客户标记失败:", e);
    } finally {
      toggleBtn.disabled = false;
      同步客户标记按钮状态();
      更新状态消息(
        客户标记监控开启 ? "⭐ 客户标记已开启" : "⏹️ 客户标记已关闭",
        "success",
      );
    }
  });

  // 自动开启也改成用同步函数
  // ✅ 改成
  Promise.resolve().then(async () => {
    await 标记客户(true);
    同步客户标记按钮状态();
    更新状态消息("⭐ 客户标记已自动开启", "success");
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

  // ==================== 定时发送模块逻辑 ====================
  (function 初始化定时发送模块() {
    const SCHED_DB = "WA_ScheduleDB";
    const SCHED_STORE = "tasks";

    // --- IndexedDB helpers ---
    function openSchedDB() {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(SCHED_DB, 1);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(SCHED_STORE)) {
            db.createObjectStore(SCHED_STORE, { keyPath: "id" });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }
    async function dbGetAll() {
      const db = await openSchedDB();
      return new Promise((resolve, reject) => {
        const req = db
          .transaction(SCHED_STORE, "readonly")
          .objectStore(SCHED_STORE)
          .getAll();
        req.onsuccess = () =>
          resolve((req.result || []).sort((a, b) => a.order - b.order));
        req.onerror = () => reject(req.error);
      });
    }
    async function dbPut(task) {
      const db = await openSchedDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(SCHED_STORE, "readwrite");
        tx.objectStore(SCHED_STORE).put(task);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
    }
    async function dbDelete(id) {
      const db = await openSchedDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(SCHED_STORE, "readwrite");
        tx.objectStore(SCHED_STORE).delete(id);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
    }

    // --- state ---
    let schedTasks = [];
    let schedRunning = false;
    let schedPaused = false;
    let schedCurrentTimer = null;
    let schedCountdownTimer = null;
    let schedEditingId = null;

    // --- DOM refs ---
    const drawer = shadowRoot.getElementById("scheduleDrawer");
    const openBtn = shadowRoot.getElementById("scheduleOpenBtn");
    const closeBtn = shadowRoot.getElementById("schedCloseBtn");
    const addBtn = shadowRoot.getElementById("schedAddBtn");
    const insertBtn = shadowRoot.getElementById("schedInsertBtn");
    const startBtn = shadowRoot.getElementById("schedStartBtn");
    const pauseBtn = shadowRoot.getElementById("schedPauseBtn");
    const stopBtn = shadowRoot.getElementById("schedStopBtn");
    const taskListEl = shadowRoot.getElementById("schedTaskList");
    const emptyTip = shadowRoot.getElementById("schedEmpty");
    const countdownEl = shadowRoot.getElementById("schedCountdown");
    const editModal = shadowRoot.getElementById("schedEditModal");
    const editSaveBtn = shadowRoot.getElementById("editSaveBtn");
    const editCancelBtn = shadowRoot.getElementById("editCancelBtn");
    const minInput = shadowRoot.getElementById("schedDelayMin");
    const secInput = shadowRoot.getElementById("schedDelaySecAdd");
    const textInput = shadowRoot.getElementById("schedText");

    function genId() {
      return Date.now() + "_" + Math.random().toString(36).slice(2, 7);
    }

    function formatDelay(ms) {
      const s = Math.round(ms / 1000);
      const m = Math.floor(s / 60),
        sec = s % 60;
      if (m > 0 && sec > 0) return `${m}分${sec}秒后发`;
      if (m > 0) return `${m}分钟后发`;
      return `${sec}秒后发`;
    }

    // --- render ---
    function renderSched() {
      taskListEl.innerHTML = "";
      const pending = schedTasks.filter((t) => t.status === "pending");
      emptyTip.style.display = pending.length === 0 ? "block" : "none";

      pending.forEach((task, idx) => {
        const card = document.createElement("div");
        card.className =
          "sched-card" + (schedRunning && idx === 0 ? " running" : "");
        const isFirst = idx === 0;
        const isLast = idx === pending.length - 1;
        const isActive = schedRunning && isFirst;
        card.innerHTML = `
          <div class="card-delay">${formatDelay(task.delayMs)}</div>
          <div class="card-text">${task.text.replace(/&/g, "&amp;").replace(/</g, "&lt;").substring(0, 150)}${task.text.length > 150 ? "…" : ""}</div>
          <div class="card-actions">
            <button class="up-btn" data-id="${task.id}" ${isFirst ? "disabled" : ""}>↑</button>
            <button class="down-btn" data-id="${task.id}" ${isLast ? "disabled" : ""}>↓</button>
            <button class="edit-btn" data-id="${task.id}" ${isActive ? "disabled" : ""}>✏️编辑</button>
            <button class="del-btn" data-id="${task.id}" ${isActive ? "disabled" : ""}>🗑删除</button>
          </div>
        `;
        taskListEl.appendChild(card);
      });

      taskListEl
        .querySelectorAll(".up-btn")
        .forEach((btn) =>
          btn.addEventListener("click", () =>
            moveSchedTask(btn.dataset.id, -1),
          ),
        );
      taskListEl
        .querySelectorAll(".down-btn")
        .forEach((btn) =>
          btn.addEventListener("click", () => moveSchedTask(btn.dataset.id, 1)),
        );
      taskListEl
        .querySelectorAll(".edit-btn")
        .forEach((btn) =>
          btn.addEventListener("click", () => openEditSched(btn.dataset.id)),
        );
      taskListEl
        .querySelectorAll(".del-btn")
        .forEach((btn) =>
          btn.addEventListener("click", () => deleteSchedTask(btn.dataset.id)),
        );

      startBtn.style.display = !schedRunning ? "inline-block" : "none";
      pauseBtn.style.display = schedRunning ? "inline-block" : "none";
      stopBtn.style.display = schedRunning ? "inline-block" : "none";
      startBtn.disabled = pending.length === 0;
    }

    async function loadSched() {
      schedTasks = await dbGetAll();
      renderSched();
    }

    // --- add task ---
    async function addSchedTask(toFront) {
      const min = parseInt(minInput.value) || 0;
      const sec = parseInt(secInput.value) || 0;
      const delayMs = (min * 60 + sec) * 1000;
      const text = textInput.value.trim();
      if (!text) {
        更新状态消息("请输入定时发送的文本内容", "error");
        return;
      }
      if (delayMs <= 0) {
        更新状态消息("发送时间必须大于0秒", "error");
        return;
      }

      const pending = schedTasks.filter((t) => t.status === "pending");
      const orders = pending.map((t) => t.order);
      const maxOrder = orders.length ? Math.max(...orders) : 0;
      const minOrder = orders.length ? Math.min(...orders) : 0;

      let order;
      if (toFront) {
        if (schedRunning && pending.length > 1) {
          // 插在第1位之后（不打断正在倒计时的那条）
          order = (pending[0].order + pending[1].order) / 2;
          更新状态消息("⬆ 已插入到当前任务完成后（第2位）", "success");
        } else {
          order = minOrder - 1;
          更新状态消息("⬆ 已插入到队首", "success");
        }
      } else {
        order = maxOrder + 1;
        更新状态消息("✅ 已添加定时任务到队尾", "success");
      }

      const task = {
        id: genId(),
        delayMs,
        text,
        status: "pending",
        order,
        createdAt: Date.now(),
      };
      await dbPut(task);
      schedTasks = await dbGetAll();
      renderSched();
      minInput.value = "";
      secInput.value = "";
      textInput.value = "";
    }

    // --- delete ---
    async function deleteSchedTask(id) {
      const pending = schedTasks.filter((t) => t.status === "pending");
      if (schedRunning && pending[0]?.id === id) {
        更新状态消息("正在发送中，请先停止后再删除", "error");
        return;
      }
      await dbDelete(id);
      schedTasks = await dbGetAll();
      renderSched();
      更新状态消息("已删除任务", "success");
    }

    // --- move ---
    async function moveSchedTask(id, dir) {
      const pending = schedTasks.filter((t) => t.status === "pending");
      const idx = pending.findIndex((t) => t.id === id);
      const swapIdx = idx + dir;
      if (swapIdx < 0 || swapIdx >= pending.length) return;
      const tmp = pending[idx].order;
      pending[idx].order = pending[swapIdx].order;
      pending[swapIdx].order = tmp;
      await dbPut(pending[idx]);
      await dbPut(pending[swapIdx]);
      schedTasks = await dbGetAll();
      renderSched();
    }

    // --- edit ---
    function openEditSched(id) {
      schedEditingId = id;
      const task = schedTasks.find((t) => t.id === id);
      if (!task) return;
      const s = Math.round(task.delayMs / 1000);
      shadowRoot.getElementById("editDelayMin").value = Math.floor(s / 60);
      shadowRoot.getElementById("editDelaySec").value = s % 60;
      shadowRoot.getElementById("editText").value = task.text;
      editModal.style.display = "flex";
    }
    editSaveBtn.addEventListener("click", async () => {
      if (!schedEditingId) return;
      const min =
        parseInt(shadowRoot.getElementById("editDelayMin").value) || 0;
      const sec =
        parseInt(shadowRoot.getElementById("editDelaySec").value) || 0;
      const delayMs = (min * 60 + sec) * 1000;
      const text = shadowRoot.getElementById("editText").value.trim();
      if (!text || delayMs <= 0) {
        更新状态消息("请填写完整信息", "error");
        return;
      }
      const task = schedTasks.find((t) => t.id === schedEditingId);
      if (task) {
        task.delayMs = delayMs;
        task.text = text;
        await dbPut(task);
      }
      schedTasks = await dbGetAll();
      renderSched();
      editModal.style.display = "none";
      schedEditingId = null;
      更新状态消息("✅ 编辑已保存", "success");
    });
    editCancelBtn.addEventListener("click", () => {
      editModal.style.display = "none";
      schedEditingId = null;
    });

    // --- countdown ---
    function startSchedCountdown(ms, text) {
      if (schedCountdownTimer) clearInterval(schedCountdownTimer);
      countdownEl.style.display = "block";
      let rem = ms;
      const update = () => {
        const s = Math.ceil(rem / 1000);
        const m = Math.floor(s / 60),
          sec = s % 60;
        const t = m > 0 ? `${m}分${sec}秒` : `${sec}秒`;
        countdownEl.textContent = `⏳ 「${text.substring(0, 14)}${text.length > 14 ? "…" : ""}」${t}后发送`;
      };
      update();
      schedCountdownTimer = setInterval(() => {
        if (schedPaused) {
          countdownEl.textContent = "⏸ 已暂停...";
          return;
        }
        rem -= 300;
        if (rem <= 0) {
          clearInterval(schedCountdownTimer);
          countdownEl.textContent = "📤 发送中...";
        } else update();
      }, 300);
    }
    function stopSchedCountdown() {
      if (schedCountdownTimer) clearInterval(schedCountdownTimer);
      countdownEl.style.display = "none";
    }

    // --- wait helper ---
    function waitWithControl(ms) {
      return new Promise((resolve) => {
        let elapsed = 0;
        const TICK = 200;
        const timer = setInterval(() => {
          if (!schedRunning) {
            clearInterval(timer);
            resolve(false);
            return;
          }
          if (!schedPaused) {
            elapsed += TICK;
            if (elapsed >= ms) {
              clearInterval(timer);
              resolve(true);
            }
          }
        }, TICK);
        schedCurrentTimer = timer;
      });
    }

    // --- run queue ---
    async function runSchedQueue() {
      const pending = schedTasks.filter((t) => t.status === "pending");
      if (pending.length === 0) {
        schedRunning = false;
        schedPaused = false;
        stopSchedCountdown();
        renderSched();
        更新状态消息("✅ 所有定时任务已发送完毕！", "success");
        return;
      }
      const task = pending[0];
      renderSched();
      startSchedCountdown(task.delayMs, task.text);

      const ok = await waitWithControl(task.delayMs);
      if (!ok) return; // 被停止

      stopSchedCountdown();
      更新状态消息(`📤 正在定时发送...`, "success");

      // 发送给当前已选群组
      const selectedContacts = Array.from(当前选中联系人);
      if (selectedContacts.length === 0) {
        更新状态消息("⚠️ 没有选中群组，跳过此任务", "error");
      } else {
        for (const contactId of selectedContacts) {
          if (!schedRunning) break;
          const group = 联系人数据.find((g) => g.id === contactId);
          const groupName = group?.name || contactId;
          try {
            await 发送文本内容(groupName, task.text);
            await new Promise((r) =>
              setTimeout(r, 200 + Math.floor(Math.random() * 200)),
            );
          } catch (e) {
            console.error("定时发送失败:", e);
          }
        }
      }

      // 发完删除
      await dbDelete(task.id);
      schedTasks = await dbGetAll();
      const remainCount = schedTasks.filter(
        (t) => t.status === "pending",
      ).length;
      更新状态消息(`✅ 定时任务已发送，还剩 ${remainCount} 条`, "success");

      if (schedRunning) setTimeout(() => runSchedQueue(), 500);
    }

    // --- button events ---
    openBtn.addEventListener("click", () => {
      const isOpen = drawer.style.display === "flex";
      drawer.style.display = isOpen ? "none" : "flex";
      if (!isOpen) loadSched();
    });
    closeBtn.addEventListener("click", () => {
      drawer.style.display = "none";
    });
    addBtn.addEventListener("click", () => addSchedTask(false));
    insertBtn.addEventListener("click", () => addSchedTask(true));

    startBtn.addEventListener("click", async () => {
      if (当前选中联系人.size === 0) {
        更新状态消息("⚠️ 请先在主面板勾选要发送的群组", "error");
        return;
      }
      schedRunning = true;
      schedPaused = false;
      schedTasks = await dbGetAll();
      renderSched();
      更新状态消息("⏰ 定时发送队列已启动", "success");
      runSchedQueue();
    });

    pauseBtn.addEventListener("click", () => {
      schedPaused = !schedPaused;
      pauseBtn.textContent = schedPaused ? "▶ 继续" : "⏸ 暂停";
      更新状态消息(
        schedPaused ? "⏸ 已暂停，点「继续」恢复" : "▶ 已继续",
        "success",
      );
    });

    stopBtn.addEventListener("click", async () => {
      schedRunning = false;
      schedPaused = false;
      if (schedCurrentTimer) clearInterval(schedCurrentTimer);
      stopSchedCountdown();
      schedTasks = await dbGetAll();
      renderSched();
      pauseBtn.textContent = "⏸ 暂停";
      更新状态消息("⏹ 定时发送已停止，未发任务已保留", "success");
    });

    // 初始加载
    loadSched();
  })();
  // ==================== 定时发送模块结束 ====================

  // ==================== 共享工具 ====================

  // 判断一个元素是否在引用块（回复块）内部
  // 引用块结构特征：role="button" + aria-label 含"引用"/"quoted"，或 class 含 quoted-mention
  function isInsideQuotedBlock(el) {
    if (!el) return false;
    if (el.classList?.contains("quoted-mention")) return true;
    let node = el.parentElement;
    while (node && !node.hasAttribute("data-id")) {
      const role = node.getAttribute("role");
      const label = node.getAttribute("aria-label") || "";
      if (
        role === "button" &&
        (label.includes("引用") || label.includes("quoted"))
      )
        return true;
      node = node.parentElement;
    }
    return false;
  }

  // 从任意元素向上找到 [data-id] 行节点
  function getMsgRow(el) {
    return el ? el.closest("[data-id]") : null;
  }

  // 从 [data-id] 行节点提取消息纯文本（排除引用块、时间戳，emoji转文字）
  // 把粗体多段、普通文本全部合并成一整段
  function extractMsgText(row) {
    if (!row) return "";
    const sts = row.querySelectorAll('[data-testid="selectable-text"]');
    const parts = [];
    for (const st of sts) {
      if (isInsideQuotedBlock(st)) continue;
      const clone = st.cloneNode(true);
      clone.querySelectorAll('[aria-hidden="true"]').forEach((e) => e.remove());
      clone.querySelectorAll("img[data-plain-text]").forEach((img) => {
        img.replaceWith(
          document.createTextNode(img.getAttribute("data-plain-text")),
        );
      });
      const t = (clone.innerText || clone.textContent || "").trim();
      if (t) parts.push(t);
    }
    return parts.join("\n").trim();
  }

  // ==================== 点赞模块（完整版） ====================
  (() => {
    let reactionRunning = false;
    let reactionStopRequested = false;
    let selectedEmoji = "👍";
    let totalScrollAttempts = 0;
    let translateWasEnabled = false; // ✅ 新增这一行

    const reactionDrawer = shadowRoot.getElementById("reactionDrawer");
    const reactionOpenBtn = shadowRoot.getElementById("reactionPanelToggleBtn");
    const reactionCloseBtn = shadowRoot.getElementById("reactionCloseBtn");
    const reactionStartBtn = shadowRoot.getElementById("reactionStartBtn");
    const reactionStopBtn = shadowRoot.getElementById("reactionStopBtn");
    const reactionStatus = shadowRoot.getElementById("reactionStatus");
    const reactionGroupList = shadowRoot.getElementById("reactionGroupList");
    const selectedEmojiDisplay = shadowRoot.getElementById(
      "selectedEmojiDisplay",
    );
    const reactionKeyword = shadowRoot.getElementById("reactionKeyword");
    const reactionIndexRow = shadowRoot.getElementById("reactionIndexRow");

    // 打开/关闭面板
    reactionOpenBtn.addEventListener("click", () => {
      const isOpen = reactionDrawer.style.display === "flex";
      reactionDrawer.style.display = isOpen ? "none" : "flex";
      if (!isOpen) syncReactionGroupList();
    });

    reactionCloseBtn.addEventListener("click", () => {
      reactionDrawer.style.display = "none";
    });

    // 同步群组列表
    function syncReactionGroupList() {
      if (!联系人数据 || 联系人数据.length === 0) {
        reactionGroupList.innerHTML =
          '<div style="text-align:center;color:#aaa;padding:20px;">请先在主面板加载群组列表</div>';
        return;
      }
      reactionGroupList.innerHTML = 联系人数据
        .map((g) => {
          const checked = 当前选中联系人.has(g.id) ? "checked" : "";
          return `<label style="display:flex;align-items:center;gap:6px;padding:4px;border-radius:3px;cursor:pointer;">
                <input type="checkbox" class="reaction-group-cb" value="${g.id}" ${checked} style="accent-color:#9c27b0;">
                <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${g.name} (${g.participantCount || 0}人)</span>
            </label>`;
        })
        .join("");
    }

    // 全选/清空
    shadowRoot
      .getElementById("reactionSelectAll")
      ?.addEventListener("click", () => {
        shadowRoot
          .querySelectorAll(".reaction-group-cb")
          .forEach((cb) => (cb.checked = true));
      });
    shadowRoot
      .getElementById("reactionClearAll")
      ?.addEventListener("click", () => {
        shadowRoot
          .querySelectorAll(".reaction-group-cb")
          .forEach((cb) => (cb.checked = false));
      });

    // ==================== 自定义表情功能（直接使用输入框原始值） ====================

    const customEmojiInput = shadowRoot.getElementById("customEmojiInput");
    const customEmojiPreview = shadowRoot.getElementById("customEmojiPreview");
    const clearCustomEmojiBtn = shadowRoot.getElementById(
      "clearCustomEmojiBtn",
    );

    // 设置自定义表情（直接使用输入框的值）
    function setCustomEmoji() {
      const rawValue = customEmojiInput?.value.trim();
      if (rawValue && rawValue.length > 0) {
        selectedEmoji = rawValue;
        if (customEmojiPreview) customEmojiPreview.textContent = selectedEmoji;
        if (selectedEmojiDisplay)
          selectedEmojiDisplay.textContent = selectedEmoji;

        // 取消其他表情的高亮
        shadowRoot.querySelectorAll(".reaction-emoji-btn").forEach((b) => {
          b.style.borderColor = "#eee";
        });

        setStatus(`✅ 已选择: ${selectedEmoji}`);
      }
    }

    // 输入时实时更新
    if (customEmojiInput) {
      customEmojiInput.addEventListener("input", () => {
        const val = customEmojiInput.value;
        if (customEmojiPreview) customEmojiPreview.textContent = val || "?";
        if (val && val.trim()) {
          setCustomEmoji();
        }
      });

      customEmojiInput.addEventListener("change", () => {
        if (customEmojiInput.value && customEmojiInput.value.trim()) {
          setCustomEmoji();
        }
      });
    }

    // 清空按钮
    if (clearCustomEmojiBtn) {
      clearCustomEmojiBtn.addEventListener("click", () => {
        if (customEmojiInput) customEmojiInput.value = "";
        if (customEmojiPreview) customEmojiPreview.textContent = "?";
        setStatus("📝 已清空");
      });
    }

    // 快捷表情点击
    shadowRoot.querySelectorAll(".quick-custom-emoji").forEach((el) => {
      el.addEventListener("click", () => {
        const emoji = el.getAttribute("data-emoji");
        if (emoji && customEmojiInput) {
          customEmojiInput.value = emoji;
          if (customEmojiPreview) customEmojiPreview.textContent = emoji;
          selectedEmoji = emoji;
          if (selectedEmojiDisplay) selectedEmojiDisplay.textContent = emoji;

          shadowRoot.querySelectorAll(".reaction-emoji-btn").forEach((b) => {
            b.style.borderColor = "#eee";
          });

          setStatus(`✅ 已选择: ${selectedEmoji}`);
        }
      });
    });

    // Emoji 快捷按钮（原有的）
    shadowRoot.querySelectorAll(".reaction-emoji-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        shadowRoot
          .querySelectorAll(".reaction-emoji-btn")
          .forEach((b) => (b.style.borderColor = "#eee"));
        btn.style.borderColor = "#9c27b0";
        selectedEmoji = btn.dataset.emoji;
        if (selectedEmojiDisplay)
          selectedEmojiDisplay.textContent = selectedEmoji;
        // 同步到自定义输入框预览
        if (customEmojiPreview) customEmojiPreview.textContent = selectedEmoji;
        setStatus(`✅ 已选择: ${selectedEmoji}`);
      });
    });

    const firstEmojiBtn = shadowRoot.querySelector(".reaction-emoji-btn");
    if (firstEmojiBtn) firstEmojiBtn.style.borderColor = "#9c27b0";

    // 切换目标选项显示
    shadowRoot
      .querySelectorAll('input[name="reactionTarget"]')
      .forEach((radio) => {
        radio.addEventListener("change", () => {
          if (reactionKeyword)
            reactionKeyword.style.display =
              radio.value === "keyword" ? "block" : "none";
          if (reactionIndexRow)
            reactionIndexRow.style.display =
              radio.value === "index" ? "flex" : "none";
        });
      });

    // ==================== 工具函数 ====================
    function sleep(ms) {
      return new Promise((r) => setTimeout(r, ms));
    }

    // 智能等待：每 pollMs 检查一次 condFn()，最多等 maxMs，条件满足立即返回
    async function waitFor(condFn, maxMs = 2000, pollMs = 60) {
      const deadline = Date.now() + maxMs;
      while (Date.now() < deadline) {
        const result = condFn();
        if (result) return result;
        await sleep(pollMs);
      }
      return null;
    }

    function setStatus(msg) {
      if (reactionStatus) {
        reactionStatus.textContent = msg;
      }
      console.log("[点赞]", msg);
    }

    // ==================== 消息滚动和查找 ====================
    function getMessageScroller() {
      // 结构特征：包含消息元素 data-pre-plain-text 的可滚动容器
      // 优先用 data-testid（稳定语义属性）
      const byTestId = document.querySelector(
        '[data-testid="conversation-panel-messages"]',
      );
      if (byTestId && byTestId.scrollHeight > byTestId.clientHeight)
        return byTestId;

      // 次选：#main 下 role="region" 的可滚动区
      const byRole = document.querySelector('#main [role="region"]');
      if (byRole && byRole.scrollHeight > byRole.clientHeight) return byRole;

      // 兜底：找包含消息的最近可滚动祖先
      const firstMsg = document.querySelector("[data-id]");
      if (firstMsg) {
        let el = firstMsg.parentElement;
        while (el && el !== document.body) {
          if (el.scrollHeight > el.clientHeight + 10) return el;
          el = el.parentElement;
        }
      }
      return null;
    }

    function getAllMessageElements() {
      // ✅ 以 [data-id] 行为单位，只取已渲染的（有 selectable-text 的）
      const rows = Array.from(document.querySelectorAll("[data-id]")).filter(
        (row) => row.querySelector('[data-testid="selectable-text"]') !== null,
      );
      if (rows.length > 0) {
        console.log(`✅ 找到 ${rows.length} 条已渲染消息`);
      } else {
        console.warn("⚠️ 未找到任何已渲染消息");
      }
      return rows;
    }

    async function scrollToBottom(scroller) {
      if (!scroller) return;
      let lastScrollTop = -1;
      let attempts = 0;
      while (attempts < 10) {
        scroller.scrollTop = scroller.scrollHeight;
        await sleep(400);
        if (scroller.scrollTop === lastScrollTop) break;
        lastScrollTop = scroller.scrollTop;
        attempts++;
      }
    }

    async function scrollUpToLoadMessages(scroller, maxScrolls = 50) {
      if (!scroller) return;
      let scrollCount = 0;
      let noChangeCount = 0;
      while (scrollCount < maxScrolls && !reactionStopRequested) {
        const currentCount = document.querySelectorAll("[data-id]").length;
        scroller.scrollTop = Math.max(0, scroller.scrollTop - 200);
        await sleep(400);
        const newCount = document.querySelectorAll("[data-id]").length;
        if (newCount === currentCount) {
          noChangeCount++;
          if (noChangeCount >= 5) break;
        } else {
          noChangeCount = 0;
        }
        scrollCount++;
      }
    }

    function findTargetMessages(targetType, keyword, index) {
      // ✅ 以 [data-id] 行为单位——每行对应一条消息
      // data-virtualized="false" 的才是实际渲染的（虚拟滚动中可见的）
      const allRows = Array.from(document.querySelectorAll("[data-id]")).filter(
        (row) => {
          // 只要已经渲染的（不是 virtualized 占位）
          return row.querySelector('[data-testid="selectable-text"]') !== null;
        },
      );

      if (allRows.length === 0) {
        console.log("[调试] 未找到任何已渲染消息行");
        return [];
      }

      // 过滤掉系统消息（无文字内容）
      const messagesArray = allRows.filter((row) => {
        const text = extractMsgText(row);
        return text.length > 0 && !text.includes("已将该群组的设置更改为");
      });

      console.log(`[调试] 总共找到 ${messagesArray.length} 条有效消息`);
      if (messagesArray.length === 0) return [];

      switch (targetType) {
        case "last":
          console.log("[调试] 返回最后一条消息");
          return [messagesArray[messagesArray.length - 1]];

        case "all":
          console.log(`[调试] 返回所有 ${messagesArray.length} 条消息`);
          return messagesArray;

        case "keyword": {
          console.log(`[调试] 搜索关键词: "${keyword}"`);
          const matched = [];
          const normKw = keyword.toLowerCase().replace(/[''']/g, "'");
          for (let i = 0; i < messagesArray.length; i++) {
            const text = extractMsgText(messagesArray[i]);
            const normText = text.toLowerCase().replace(/[''']/g, "'");
            console.log(
              `[消息 ${i + 1}] 前120: ${JSON.stringify(text.substring(0, 120))}`,
            );
            if (normText.includes(normKw)) {
              matched.push(messagesArray[i]);
              console.log(`[调试] ✅ 匹配 [${i + 1}]`);
            }
          }
          console.log(`[调试] 匹配到 ${matched.length} 条消息`);
          return matched;
        }

        case "index": {
          const absN = Math.abs(index);
          const idx = messagesArray.length - absN;
          if (idx >= 0 && idx < messagesArray.length) {
            console.log(`[调试] 返回倒数第 ${absN} 条 (index: ${idx})`);
            return [messagesArray[idx]];
          }
          console.log(
            `[调试] 索引 ${index} 超出范围（共 ${messagesArray.length} 条）`,
          );
          return [];
        }

        default:
          return [];
      }
    }

    // ==================== 表情面板操作 ====================
    function getEmojiPanelScroller() {
      const emojiSpan = document.querySelector("[data-emoji]");
      if (emojiSpan) {
        let parent = emojiSpan.parentElement;
        while (parent) {
          if (parent.scrollHeight > parent.clientHeight) return parent;
          parent = parent.parentElement;
        }
      }
      const virtualList = document.querySelector(
        '[style*="height"][style*="transform"]',
      );
      if (virtualList) {
        let parent = virtualList.parentElement;
        while (parent) {
          const style = window.getComputedStyle(parent);
          if (style.overflowY === "auto" || style.overflowY === "scroll")
            return parent;
          parent = parent.parentElement;
        }
      }
      const containers = document.querySelectorAll('div[style*="overflow"]');
      for (const el of containers) {
        if (
          el.scrollHeight > el.clientHeight &&
          el.querySelector("[data-emoji]")
        )
          return el;
      }
      return null;
    }

    function getAllCategoryButtons() {
      // 结构特征：表情面板的分类按钮都是 role="tab" 或带已知分类名的 button
      // role="tab" 是最稳定的，其次是 aria-label/title 含分类关键词
      const byTab = document.querySelectorAll(
        '[role="tablist"] [role="tab"], [role="tab"][aria-label], [role="tab"][title]',
      );
      if (byTab.length > 0) return byTab;

      // 次选：button 带 aria-label 含已知分类名（多语言）
      return document.querySelectorAll(
        'button[aria-label*="表情"], button[aria-label*="人物"], button[aria-label*="动物"],' +
          'button[aria-label*="食物"], button[aria-label*="活动"], button[aria-label*="旅行"],' +
          'button[aria-label*="物件"], button[aria-label*="符号"], button[aria-label*="旗帜"],' +
          'button[aria-label*="Smileys"], button[aria-label*="People"], button[aria-label*="Animals"],' +
          'button[title*="表情"], button[title*="人物"], button[title*="动物"]',
      );
    }

    function findEmojiInCurrentView(targetEmoji) {
      const allEmojis = document.querySelectorAll("[data-emoji]");
      for (const span of allEmojis) {
        if (span.getAttribute("data-emoji") !== targetEmoji) continue;
        if (!span.offsetParent) continue;
        const rect = span.getBoundingClientRect();
        if (rect.top > 0 && rect.bottom < window.innerHeight) return span;
      }
      return null;
    }

    async function scrollAndFindInCurrentCategory(
      targetEmoji,
      categoryName = "",
    ) {
      const scroller = getEmojiPanelScroller();
      if (!scroller) return null;
      let found = findEmojiInCurrentView(targetEmoji);
      if (found) return found;
      let scrollCount = 0;
      let lastScrollTop = -1;
      let noChangeCount = 0;
      const maxScrolls = 200;
      const scrollStep = 120;
      while (scrollCount < maxScrolls && !reactionStopRequested) {
        scroller.scrollTop += scrollStep;
        await sleep(100);
        if (Math.abs(scroller.scrollTop - lastScrollTop) < 5) {
          noChangeCount++;
          if (noChangeCount >= 5) break;
        } else {
          noChangeCount = 0;
        }
        lastScrollTop = scroller.scrollTop;
        found = findEmojiInCurrentView(targetEmoji);
        if (found) {
          totalScrollAttempts += scrollCount;
          found.scrollIntoView({ block: "center", behavior: "auto" });
          await sleep(200);
          return found;
        }
        scrollCount++;
      }
      totalScrollAttempts += scrollCount;
      return null;
    }

    async function findEmojiAcrossAllCategories(targetEmoji) {
      const categoryButtons = getAllCategoryButtons();
      const triedCategories = new Set();

      // 先尝试在当前分类查找
      let found = await scrollAndFindInCurrentCategory(targetEmoji, "当前");
      if (found) return found;

      for (let i = 0; i < categoryButtons.length; i++) {
        if (reactionStopRequested) return null;
        const btn = categoryButtons[i];
        const label =
          btn.getAttribute("aria-label") ||
          btn.getAttribute("title") ||
          btn.textContent?.trim() ||
          `分类${i + 1}`;
        if (triedCategories.has(label)) continue;
        triedCategories.add(label);
        if (label.includes("肤色") || label.includes("skin")) continue;
        btn.click();
        await sleep(600);
        found = await scrollAndFindInCurrentCategory(targetEmoji, label);
        if (found) return found;
      }

      // 如果没找到，滚动到顶部再试一次
      const scroller = getEmojiPanelScroller();
      if (scroller) {
        scroller.scrollTop = 0;
        await sleep(300);
        for (let i = 0; i < categoryButtons.length; i++) {
          if (reactionStopRequested) return null;
          const btn = categoryButtons[i];
          const label = btn.getAttribute("aria-label") || "";
          if (label.includes("肤色")) continue;
          btn.click();
          await sleep(500);
          found = await scrollAndFindInCurrentCategory(
            targetEmoji,
            `${label}(2)`,
          );
          if (found) return found;
        }
      }
      return null;
    }

    // ==================== 肤色选择器处理 ====================

    // 找到当前可见的肤色弹出面板
    // 结构特征：role="application" 的浮层，直接包含 li[role="button"] + img[alt]，
    // 且第一项 img alt 就是基础表情（无肤色），后5项含肤色修饰符
    function getSkinTonePopup() {
      for (const el of document.querySelectorAll('[role="application"]')) {
        if (!el.offsetParent) continue;
        const items = el.querySelectorAll('li[role="button"]');
        if (items.length >= 2) {
          // 确认是肤色面板：至少有一项 img alt 含肤色修饰符
          for (const li of items) {
            const alt = li.querySelector("img")?.getAttribute("alt") || "";
            if (/[\u{1F3FB}-\u{1F3FF}]/u.test(alt)) return el;
          }
        }
      }
      return null;
    }

    function hasSkinTonePicker() {
      return !!getSkinTonePopup();
    }

    // 肤色修饰符 → 列表索引（第0项是无肤色原版，第1-5是带肤色）
    const SKIN_TONE_MAP = { "🏻": 1, "🏼": 2, "🏽": 3, "🏾": 4, "🏿": 5 };

    function clickSkinToneInPopup(popup, targetEmoji) {
      const items = popup.querySelectorAll('li[role="button"]');
      if (!items.length) return false;

      // 解析目标肤色修饰符
      const skinMatch = targetEmoji.match(/[\u{1F3FB}-\u{1F3FF}]/u);
      const skinToneIndex = skinMatch ? (SKIN_TONE_MAP[skinMatch[0]] ?? 0) : 0;

      if (skinToneIndex > 0 && items[skinToneIndex]) {
        // 点击对应肤色
        console.log(`🎨 选择肤色 index=${skinToneIndex}`);
        items[skinToneIndex].click();
        return true;
      }

      // 无肤色需求 → 点第一项（原版，alt 不含肤色修饰）
      items[0].click();
      console.log(`🎨 选择默认肤色（无）`);
      return true;
    }

    async function smartClickEmoji(emojiElement, targetEmoji) {
      const emoji = emojiElement.getAttribute("data-emoji");
      console.log(`🖱️ 点击表情: ${emoji}`);

      emojiElement.click();
      await sleep(150); // 给浏览器渲染时间

      // 先检查：肤色面板是否已经出现
      const skinPopup = getSkinTonePopup();
      if (skinPopup) {
        console.log("🎨 检测到肤色面板，准备选择...");
        await sleep(100);
        clickSkinToneInPopup(skinPopup, targetEmoji);
        // 等肤色面板消失（最多等 1.5s）
        await waitFor(() => !getSkinTonePopup(), 1500, 40);
        return true;
      }

      // 没有肤色面板 → 等一会再检查一次（有时面板出现有延迟）
      await sleep(300);
      const skinPopup2 = getSkinTonePopup();
      if (skinPopup2) {
        console.log("🎨 延迟后检测到肤色面板，准备选择...");
        clickSkinToneInPopup(skinPopup2, targetEmoji);
        await waitFor(() => !getSkinTonePopup(), 1500, 40);
        return true;
      }

      // 没有肤色面板 → 直接当成成功（WhatsApp 自动选了默认肤色）
      return true;
    }

    async function reactToOneMessage(msgElement, targetEmoji) {
      try {
        // 找到真正需要 hover 的行元素（.focusable-list-item 或 data-id 容器）
        const dataId =
          msgElement.closest("[data-id]")?.getAttribute("data-id") || null;

        const hoverTarget =
          msgElement.closest(".focusable-list-item") ||
          msgElement.closest("[data-id]") ||
          msgElement;

        hoverTarget.scrollIntoView({ behavior: "auto", block: "center" });

        // ✅ 智能等待：DOM 稳定后重新查找元素（防虚拟列表回收旧引用点错消息）
        let liveTarget = hoverTarget;
        if (dataId) {
          // 等元素稳定出现在 DOM 里（最多等 800ms，出现即停）
          const fresh = await waitFor(
            () => document.querySelector(`[data-id="${CSS.escape(dataId)}"]`),
            800,
            30,
          );
          if (fresh) {
            liveTarget = fresh;
            // 如果重建后不在视口，再滚一次，等它出现
            const rect = fresh.getBoundingClientRect();
            if (rect.top < 0 || rect.bottom > window.innerHeight) {
              fresh.scrollIntoView({ behavior: "auto", block: "center" });
              await waitFor(
                () => {
                  const r = fresh.getBoundingClientRect();
                  return r.top >= 0 && r.bottom <= window.innerHeight
                    ? true
                    : null;
                },
                600,
                30,
              );
            }
          }
        }

        // 触发 hover，让 WhatsApp 显示操作按钮
        const triggerHover = () => {
          liveTarget.dispatchEvent(
            new MouseEvent("mouseover", { bubbles: true }),
          );
          liveTarget.dispatchEvent(
            new MouseEvent("mouseenter", { bubbles: true }),
          );
          liveTarget.dispatchEvent(
            new MouseEvent("mousemove", { bubbles: true }),
          );
        };
        triggerHover();

        // ✅ 智能等待心情按钮，出现即操作；等不到就再 hover 一次再等
        const MOOD_SEL =
          '[aria-label="留下心情"], [aria-label="React to message"]';
        let moodBtn = await waitFor(
          () => document.querySelector(MOOD_SEL),
          1200,
          40,
        );
        if (!moodBtn) {
          triggerHover();
          moodBtn = await waitFor(
            () => document.querySelector(MOOD_SEL),
            800,
            40,
          );
        }
        if (!moodBtn) return false;

        moodBtn.click();

        // ✅ 等快捷表情面板，出现即操作
        await waitFor(() => document.querySelector("[data-emoji]"), 1000, 40);

        // 🔥 直接查找完整的带肤色表情
        const quickEmojis = document.querySelectorAll("[data-emoji]");
        for (let i = 0; i < quickEmojis.length; i++) {
          const emoji = quickEmojis[i].getAttribute("data-emoji");
          // 直接匹配完整表情（包括肤色）
          if (emoji === targetEmoji) {
            if (quickEmojis[i].offsetParent) {
              return await smartClickEmoji(quickEmojis[i], targetEmoji);
            }
          }
        }

        // 如果没找到完整匹配，再尝试基础表情匹配（用于没有肤色的情况）
        const baseEmoji = targetEmoji.replace(/[\u{1F3FB}-\u{1F3FF}]/u, "");
        if (baseEmoji !== targetEmoji) {
          for (let i = 0; i < quickEmojis.length; i++) {
            const emoji = quickEmojis[i].getAttribute("data-emoji");
            if (emoji === baseEmoji) {
              if (quickEmojis[i].offsetParent) {
                return await smartClickEmoji(quickEmojis[i], targetEmoji);
              }
            }
          }
        }

        const moreBtn = document.querySelector(
          '[aria-label="更多回应"], [aria-label="更多心情"]',
        );
        if (!moreBtn) {
          // 在完整面板中查找带肤色的表情
          const found = await findEmojiAcrossAllCategories(targetEmoji);
          if (found) return await smartClickEmoji(found, targetEmoji);
          // 如果没找到，再找基础表情
          if (baseEmoji !== targetEmoji) {
            const foundBase = await findEmojiAcrossAllCategories(baseEmoji);
            if (foundBase) return await smartClickEmoji(foundBase, targetEmoji);
          }
          document.body.click();
          return false;
        }

        moreBtn.click();
        // 智能等待完整表情面板
        await waitFor(() => document.querySelector('[role="tab"]'), 1500, 80);

        // 优先查找完整的带肤色表情
        let foundEmoji = await findEmojiAcrossAllCategories(targetEmoji);
        if (!foundEmoji && baseEmoji !== targetEmoji) {
          foundEmoji = await findEmojiAcrossAllCategories(baseEmoji);
        }

        if (foundEmoji) return await smartClickEmoji(foundEmoji, targetEmoji);

        document.body.click();
        return false;
      } catch (error) {
        console.error("点赞出错:", error);
        return false;
      }
    }

    // ==================== 群组点赞主流程 ====================
    async function runReactionForGroup(
      groupName,
      emoji,
      target,
      keyword,
      index,
      delayMs,
    ) {
      setStatus(`${groupName}: 正在打开聊天...`);
      const clicked = await 点击聊天列表(groupName);
      if (!clicked) return;

      // ✅ 智能等待聊天内容加载（等消息出现，而不是固定等 3 秒）
      await waitFor(() => document.querySelector("[data-id]"), 4000, 80);

      const scroller = getMessageScroller();
      if (!scroller) return;

      await scrollToBottom(scroller);
      // ✅ 等滚动完成后消息容器稳定
      await waitFor(() => document.querySelector("[data-id]"), 1000, 40);

      // 如果是关键词模式，边滚动边查找，找到即停
      if (target === "keyword" && keyword) {
        setStatus(`${groupName}: 正在搜索关键词 "${keyword}"...`);

        let foundMessages = null;
        // 先在当前已加载的消息里找一次（最新消息往往就在视口内）
        const quickCheck = findTargetMessages(target, keyword, index);
        if (quickCheck.length > 0) {
          foundMessages = quickCheck;
          setStatus(`${groupName}: 找到 ${foundMessages.length} 条匹配消息`);
        }

        if (!foundMessages) {
          // 向上滚动加载历史消息，智能等待懒加载完成
          const SCROLL_STEP = 1200; // ✅ 加大每次滚动距离，更快加载历史
          const MAX_SCROLLS = 400; // ✅ 加大最大滚动次数，支持更长历史
          const LOAD_WAIT = 1500; // 懒加载最长等待时间（ms）
          const STABLE_THRESHOLD = 4; // 消息数连续N次不增加 → 到顶了

          let scrollCount = 0;
          let stableCount = 0;
          let lastMsgCount = document.querySelectorAll("[data-id]").length;

          while (
            scrollCount < MAX_SCROLLS &&
            !reactionStopRequested &&
            !foundMessages
          ) {
            const prevTop = scroller.scrollTop;
            scroller.scrollTop = Math.max(0, scroller.scrollTop - SCROLL_STEP);

            // 已经到顶了
            if (scroller.scrollTop === 0 && prevTop === 0) break;

            // 等待懒加载：轮询消息数，稳定后再匹配（最多等 LOAD_WAIT ms）
            await waitFor(
              () => {
                const cur = document.querySelectorAll("[data-id]").length;
                return cur > lastMsgCount ? cur : null;
              },
              LOAD_WAIT,
              80,
            );

            const newMsgCount = document.querySelectorAll("[data-id]").length;
            if (newMsgCount === lastMsgCount) {
              stableCount++;
              if (stableCount >= STABLE_THRESHOLD) break; // 连续无新消息 → 到顶
            } else {
              stableCount = 0;
              lastMsgCount = newMsgCount;
            }

            setStatus(
              `${groupName}: 搜索中... 已加载 ${newMsgCount} 条 (第${scrollCount + 1}屏)`,
            );
            const currentMessages = findTargetMessages(target, keyword, index);
            if (currentMessages.length > 0) {
              foundMessages = currentMessages;
              setStatus(
                `${groupName}: 找到 ${foundMessages.length} 条匹配消息`,
              );
              break;
            }

            scrollCount++;
          }
        }

        if (!foundMessages || foundMessages.length === 0) {
          setStatus(`${groupName}: 未找到包含 "${keyword}" 的消息`);
          return;
        }

        // 点赞操作
        for (let i = 0; i < foundMessages.length; i++) {
          if (reactionStopRequested) break;
          setStatus(`${groupName}: 点赞 ${i + 1}/${foundMessages.length}`);
          await reactToOneMessage(foundMessages[i], emoji);
          if (i < foundMessages.length - 1) await sleep(delayMs);
        }
        return;
      }

      // 其他模式保持原逻辑
      // all 模式需要加载所有历史消息；last/index 模式只需最新消息，scrollToBottom 已够
      if (target === "all") {
        await scrollUpToLoadMessages(scroller, 40);
      }

      const targetMessages = findTargetMessages(target, keyword, index);
      if (targetMessages.length === 0) {
        setStatus(`${groupName}: 未找到目标消息`);
        return;
      }

      setStatus(`${groupName}: 找到 ${targetMessages.length} 条消息`);
      for (let i = 0; i < targetMessages.length; i++) {
        if (reactionStopRequested) break;
        setStatus(`${groupName}: 点赞 ${i + 1}/${targetMessages.length}`);
        await reactToOneMessage(targetMessages[i], emoji);
        if (i < targetMessages.length - 1) await sleep(delayMs);
      }
    }

    // ==================== 开始/停止 ====================
    reactionStartBtn.addEventListener("click", async () => {
      // ✅ 如果自动翻译开启，先关闭并记录状态
      const translateBtn = shadowRoot.getElementById("translateToggleBtn");
      console.log("[调试] translateBtn 元素:", translateBtn);
      if (translateBtn) {
        console.log(
          "[调试] translateBtn 背景色:",
          translateBtn.style.background,
        );
      }
      translateWasEnabled =
        translateBtn && translateBtn.style.background === "rgb(217, 48, 37)";
      console.log("[调试] translateWasEnabled:", translateWasEnabled);
      if (translateWasEnabled) {
        translateBtn.click();
        console.log("[点赞] 已关闭自动翻译");
      }

      const selectedGroups = [
        ...shadowRoot.querySelectorAll(".reaction-group-cb:checked"),
      ].map((cb) => cb.value);
      if (selectedGroups.length === 0) {
        setStatus("❌ 请先选择群组");
        return;
      }
      const targetType =
        shadowRoot.querySelector('input[name="reactionTarget"]:checked')
          ?.value || "last";
      const keyword =
        shadowRoot.getElementById("reactionKeyword")?.value.trim() || "";
      const index =
        parseInt(shadowRoot.getElementById("reactionIndex")?.value) || 1;
      const delayMs =
        (parseInt(shadowRoot.getElementById("reactionDelay")?.value) || 3) *
        1000;
      if (targetType === "keyword" && !keyword) {
        setStatus("❌ 请输入关键词");
        return;
      }
      reactionRunning = true;
      reactionStopRequested = false;
      reactionStartBtn.style.display = "none";
      reactionStopBtn.style.display = "block";
      totalScrollAttempts = 0;
      let totalGroups = 0;
      for (let i = 0; i < selectedGroups.length; i++) {
        if (reactionStopRequested) break;
        const groupId = selectedGroups[i];
        const group = 联系人数据.find((g) => g.id === groupId);
        const groupName = group?.name || groupId;
        setStatus(`[${i + 1}/${selectedGroups.length}] ${groupName}`);
        await runReactionForGroup(
          groupName,
          selectedEmoji,
          targetType,
          keyword,
          index,
          delayMs,
        );
        totalGroups++;
        if (i < selectedGroups.length - 1 && !reactionStopRequested) {
          await sleep(2000);
        }
      }
      reactionRunning = false;
      reactionStartBtn.style.display = "block";
      reactionStopBtn.style.display = "none";

      // ✅ 恢复翻译
      if (translateWasEnabled) {
        const translateBtn = shadowRoot.getElementById("translateToggleBtn");
        if (
          translateBtn &&
          translateBtn.style.background !== "rgb(217, 48, 37)"
        ) {
          translateBtn.click();
          console.log("[点赞] 已恢复自动翻译");
        }
        translateWasEnabled = false;
      }
      if (reactionStopRequested) {
        setStatus(`⏹ 已停止。完成 ${totalGroups} 个群组`);
      } else {
        setStatus(`🎉 完成！共 ${totalGroups} 个群组`);
      }
    });

    reactionStopBtn.addEventListener("click", () => {
      reactionStopRequested = true;
      setStatus("⏹ 正在停止...");

      // ✅ 恢复翻译（因为点赞即将结束）
      if (translateWasEnabled) {
        const translateBtn = shadowRoot.getElementById("translateToggleBtn");
        if (
          translateBtn &&
          translateBtn.style.background !== "rgb(217, 48, 37)"
        ) {
          translateBtn.click();
          console.log("[点赞] 已恢复自动翻译");
        }
        translateWasEnabled = false;
      }
    });
  })();

  // ==================== 自动翻译模块 ====================
  (() => {
    const TRANSLATE_CLASS = "wa-translate-result";
    const TARGET_LANG = "zh-CN";
    const CONCURRENCY = 3;
    const DELAY = 100;

    // ─── 持久化翻译缓存 ───────────────────────────────────────────────────
    const CACHE_FILE = "wa_translate_cache.json";
    const CACHE_MAX_SIZE = 2000;
    const CACHE_TRIM_TO = 1500;
    const CACHE_FLUSH_INTERVAL = 8000;

    const memCache = new Map(); // key=textHash → {translated, ts}
    let cacheLoaded = false;
    let cacheDirty = false;
    let cacheFlushTimer = null;

    function hashText(str) {
      let h = 0;
      for (let i = 0; i < str.length; i++)
        h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
      return (h >>> 0).toString(36);
    }

    async function loadCacheFromFile() {
      if (cacheLoaded) return;
      cacheLoaded = true;
      if (!window.__csharpApiReady || typeof window.readFile !== "function")
        return;
      try {
        const data = await window.readFile(CACHE_FILE);
        if (data && Array.isArray(data.entries)) {
          for (const [k, v] of data.entries) {
            if (typeof v === "object" && v.translated && v.source) {
              memCache.set(k, v);
            } else if (typeof v === "object" && v.translated) {
              // 旧缓存，source未知
              memCache.set(k, {
                translated: v.translated,
                source: "Unknown",
                ts: v.ts,
              });
            } else {
              // 更旧的，v是string
              memCache.set(k, {
                translated: v,
                source: "Unknown",
                ts: Date.now(),
              });
            }
          }
          console.log(`[wa-translate] 加载本地缓存 ${memCache.size} 条`);
          if (memCache.size > CACHE_MAX_SIZE) trimCache();
        }
      } catch (e) {
        /* 文件不存在忽略 */
      }
    }

    function trimCache() {
      if (memCache.size <= CACHE_TRIM_TO) return;
      const iter = memCache.keys();
      while (memCache.size > CACHE_TRIM_TO) memCache.delete(iter.next().value);
      console.log(`[wa-translate] 缓存已裁剪至 ${memCache.size} 条`);
    }

    function scheduleCacheFlush() {
      if (cacheFlushTimer) return;
      cacheFlushTimer = setTimeout(async () => {
        cacheFlushTimer = null;
        if (!cacheDirty) return;
        cacheDirty = false;
        if (!window.__csharpApiReady || typeof window.saveFile !== "function")
          return;
        try {
          const entries = Array.from(memCache.entries());
          await window.saveFile(CACHE_FILE, { entries });
          console.log(`[wa-translate] 缓存已写入 ${entries.length} 条`);
        } catch (e) {
          console.warn("[wa-translate] 缓存写入失败:", e);
        }
      }, CACHE_FLUSH_INTERVAL);
    }

    function getCached(text) {
      const k = hashText(text);
      const entry = memCache.get(k);
      if (!entry) return null;
      memCache.delete(k);
      entry.ts = Date.now();
      memCache.set(k, entry);
      return { translated: entry.translated, source: entry.source };
    }

    function setCached(text, translated, source) {
      const k = hashText(text);
      memCache.set(k, { translated, source, ts: Date.now() });
      if (memCache.size > CACHE_MAX_SIZE) trimCache();
      cacheDirty = true;
      scheduleCacheFlush();
    }

    const translatePending = new Set(); // key=dataId，防重复
    let translateQueue = [];
    let translateWorkers = 0;
    let translateEnabled = false;
    let translateChatSwitchDebounce = null;
    let translateLastChatId = null;

    const translateBtn = shadowRoot.getElementById("translateToggleBtn");

    // ─── 智能翻译调度层（替换原 apiCounter 轮询机制）─────────────────────

    // ── Provider 注册表 ──────────────────────────────────────────────────
    const translationProviders = [
      {
        name: "Google",
        fn: async (text) => {
          const url =
            "https://translate.googleapis.com/translate_a/single" +
            "?client=gtx&sl=auto&tl=" +
            TARGET_LANG +
            "&dt=t&q=" +
            encodeURIComponent(text);
          const res = await httpGetJson(url);
          if (!res.success) throw new Error("Google network error");
          try {
            const p =
              typeof res.data === "string" ? JSON.parse(res.data) : res.data;
            const r = p[0]
              .map((i) => i[0])
              .filter(Boolean)
              .join("");
            if (!r) throw new Error("Google parse error");
            return { translated: r, source: "Google" };
          } catch {
            throw new Error("Google parse error");
          }
        },
        success: 0,
        fail: 0,
        avgTime: 600,
        disabledUntil: 0,
      },
      {
        name: "360",
        fn: async (text) => {
          const url = `http://elephant.browser.360.cn/?t=translate&i=${encodeURIComponent(text)}&type=AUTO&doctype=text&xmlVersion=1.1&keyfrom=360se&m=youdao`;
          const res = await httpGetJson(url);
          if (!res.success) throw new Error("360 network error");
          const data = typeof res.data === "string" ? res.data : "";
          const lines = data.split("\n");
          let errorCode = null,
            result = null;
          for (const line of lines) {
            if (line.startsWith("errorCode=")) errorCode = line.split("=")[1];
            else if (line.startsWith("result=")) result = line.split("=")[1];
          }
          if (errorCode === "0" && result)
            return { translated: result, source: "360" };
          throw new Error("360 parse error");
        },
        success: 0,
        fail: 0,
        avgTime: 700,
        disabledUntil: 0,
      },
      {
        name: "Lingva",
        fn: async (text) => {
          const url = `https://lingva.ml/api/v1/auto/zh/${encodeURIComponent(text)}`;
          const res = await httpGetJson(url);
          const d = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
          if (!res.success || !d?.translation) throw new Error("Lingva error");
          return { translated: d.translation, source: "Lingva" };
        },
        success: 0,
        fail: 0,
        avgTime: 900,
        disabledUntil: 0,
      },
      {
        name: "Simply",
        fn: async (text) => {
          const url = `https://simplytranslate.org/api/translate?engine=google&from=auto&to=${TARGET_LANG}&text=${encodeURIComponent(text)}`;
          const res = await httpGetJson(url);
          const d = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
          if (!res.success || !d?.translated_text) throw new Error("Simply error");
          return { translated: d.translated_text, source: "Simply" };
        },
        success: 0,
        fail: 0,
        avgTime: 1000,
        disabledUntil: 0,
      },
      {
        name: "Mozhi",
        fn: async (text) => {
          const url = `https://mozhi.aryak.me/api/translate?engine=google&from=auto&to=${TARGET_LANG}&text=${encodeURIComponent(text)}`;
          const res = await httpGetJson(url);
          const d = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
          if (!res.success || !d?.["translated-text"]) throw new Error("Mozhi error");
          return { translated: d["translated-text"], source: "Mozhi" };
        },
        success: 0,
        fail: 0,
        avgTime: 950,
        disabledUntil: 0,
      },
      {
        name: "MyMemory",
        fn: async (text) => {
          const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|zh-CN`;
          const res = await httpGetJson(url);
          const d = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
          if (!res.success || !d?.responseData?.translatedText) throw new Error("MyMemory error");
          return { translated: d.responseData.translatedText, source: "MyMemory" };
        },
        success: 0,
        fail: 0,
        avgTime: 1100,
        disabledUntil: 0,
      },
    ];

    // ── 熔断常量 ─────────────────────────────────────────────────────────
    const CIRCUIT_FAIL_THRESHOLD = 3; // 连续失败多少次触发熔断
    const CIRCUIT_COOLDOWN_MS = 60_000; // 熔断冷却时间（60 秒）

    // ── 评分算法：score 越高越优先 ──────────────────────────────────────
    function scoreProvider(p) {
      const total = p.success + p.fail;
      const successRate = total === 0 ? 0.5 : p.success / total; // 冷启动给0.5
      // avgTime 归一化：以 2000ms 为上限，越快分越高
      const speedScore = Math.max(0, 1 - p.avgTime / 2000);
      return successRate * 0.7 + speedScore * 0.3;
    }

    // ── 获取可用 provider（已排序，剔除熔断中的）────────────────────────
    function getAvailableProviders() {
      const now = Date.now();
      return translationProviders
        .filter((p) => p.disabledUntil <= now)
        .sort((a, b) => scoreProvider(b) - scoreProvider(a));
    }

    // ── 加权随机选取：按 score 分配概率，避免 Google 独占 ───────────────
    function pickWeightedRandom(providers) {
      // score 最低保底 0.05，避免某个 provider 永远得不到机会
      const weights = providers.map((p) => Math.max(scoreProvider(p), 0.05));
      const total = weights.reduce((s, w) => s + w, 0);
      let rand = Math.random() * total;
      for (let i = 0; i < providers.length; i++) {
        rand -= weights[i];
        if (rand <= 0) return providers[i];
      }
      return providers[providers.length - 1];
    }

    // ── 核心调度：加权随机选主力，失败后 fallback 剩余 ──────────────────
    async function fetchTranslation(text) {
      const providers = getAvailableProviders();
      if (providers.length === 0) {
        // 所有 provider 都在熔断中，强制重置最早恢复的那个
        translationProviders.sort((a, b) => a.disabledUntil - b.disabledUntil);
        translationProviders[0].disabledUntil = 0;
        return fetchTranslation(text);
      }

      // 加权随机选出首选，剩余的按 score 排序作为 fallback 队列
      const primary = pickWeightedRandom(providers);
      const fallbacks = providers.filter((p) => p !== primary);
      const ordered = [primary, ...fallbacks];

      let lastErr;
      for (const provider of ordered) {
        // jitter 延迟，防止固定节奏被封
        await new Promise((r) => setTimeout(r, DELAY + Math.random() * 200));

        const t0 = Date.now();
        try {
          const result = await provider.fn(text);
          const elapsed = Date.now() - t0;

          // 更新指标：指数移动平均 avgTime，平滑窗口 α=0.3
          provider.avgTime = Math.round(provider.avgTime * 0.7 + elapsed * 0.3);
          provider.success++;

          console.log(`[wa-translate] ✅ ${provider.name} (${elapsed}ms)`);
          return result;
        } catch (err) {
          provider.fail++;
          lastErr = err;

          // 熔断判断：最近 (success+fail) 次中，fail 占比过高 OR 连续失败达阈值
          const recentFails = provider.fail;
          const recentTotal = provider.success + provider.fail;
          const failRate = recentTotal > 0 ? recentFails / recentTotal : 0;

          if (
            recentFails >= CIRCUIT_FAIL_THRESHOLD &&
            (failRate > 0.6 || recentFails >= CIRCUIT_FAIL_THRESHOLD * 2)
          ) {
            provider.disabledUntil = Date.now() + CIRCUIT_COOLDOWN_MS;
            console.warn(
              `[wa-translate] ⚡ ${provider.name} 熔断 ${CIRCUIT_COOLDOWN_MS / 1000}s（失败 ${recentFails}/${recentTotal}）`,
            );
          } else {
            console.warn(
              `[wa-translate] ⚠️ ${provider.name} 失败，尝试下一个:`,
              err.message,
            );
          }
        }
      }

      throw lastErr || new Error("All providers failed");
    }

    // ─── 并发队列（保持不变）──────────────────────────────────────────────
    async function runTranslateWorker() {
      while (translateQueue.length > 0) {
        const task = translateQueue.shift();
        try {
          await task();
        } catch (e) {
          /* 忽略单条失败 */
        }
        await new Promise((r) => setTimeout(r, DELAY));
      }
      translateWorkers--;
    }

    function enqueueTranslate(task) {
      translateQueue.push(task);
      if (translateWorkers < CONCURRENCY) {
        translateWorkers++;
        runTranslateWorker();
      }
    }

    // ─── DOM 工具 ─────────────────────────────────────────────────────────
    //
    // 正确的消息 DOM 结构：
    //
    //   [data-id]  ← 消息行，唯一稳定 ID
    //     └── [data-pre-plain-text]  ← copyable-text（含引用块 + 正文）
    //           ├── [role="button"][aria-label*="引用"]  ← 引用块（可能无）
    //           └── _akbu                                ← 正文容器
    //                 ├── span.x1lliihq > strong[data-testid="selectable-text"]  ← 粗体第1段
    //                 ├── span.x1lliihq > strong[data-testid="selectable-text"]  ← 粗体第2段
    //                 └── span[data-testid="selectable-text"]                    ← 普通文本
    //
    // ✅ 关键洞察：一条消息可能有 N 个 selectable-text（粗体每段一个）
    //    bubble = 整个 _akbu 层（data-pre-plain-text 的直接子节点，包含所有正文 span）
    //    正确做法：从任意 selectable-text 向上找到 [data-pre-plain-text]，
    //    然后找其中不在引用块里的第一个直接子容器，即 _akbu

    // 从一个正文 selectable-text 向上找到整个气泡容器（_akbu 层）
    // _akbu = data-pre-plain-text 的直接子节点中包含该 selectable-text 的那个
    function getBubbleContainer(st) {
      const copyable = st.closest("[data-pre-plain-text]");
      if (!copyable) return null;
      // 找 copyable 的直接子节点中包含 st 的那个（就是 _akbu）
      for (const child of copyable.children) {
        if (child.contains(st) && !isInsideQuotedBlock(child)) return child;
      }
      return null;
    }

    // 从 [data-id] 行找到正文气泡容器（_akbu），排除引用块
    //
    // 场景覆盖：
    //  1. 纯文字：[data-pre-plain-text] → _akbu → selectable-text
    //  2. 带引用：[data-pre-plain-text] → _ahy0 → {_aju3(引用块), _akbu}
    //  3. 图片+文字：[data-id] → .message-in/out → _amk6 → _amlo → 多个子块
    //     其中文字在 [data-pre-plain-text] → _akbu → selectable-text
    //
    // 策略：找第一个不在引用块内的 selectable-text，向上爬到包含它的最小容器
    // 该容器需满足：不是引用块、是 [data-pre-plain-text] 的后代（或就是其直接子/孙）
    function getBubbleFromRow(row) {
      // 优先查 data-pre-plain-text（普通文字消息）
      const copyable = row.querySelector("[data-pre-plain-text]");
      if (copyable) {
        const sts = copyable.querySelectorAll(
          '[data-testid="selectable-text"]',
        );
        for (const st of sts) {
          if (isInsideQuotedBlock(st)) continue;
          // 向上找：_akbu 是 data-pre-plain-text 的1-2级子孙
          let node = st.parentElement;
          while (node && node !== copyable) {
            const p = node.parentElement;
            if (!p) break;
            // node 的父是 copyable 本身，或者父的父是 copyable → node = _akbu
            if (p === copyable || p.parentElement === copyable) {
              if (!isInsideQuotedBlock(node)) return node;
              break;
            }
            node = p;
          }
        }
      }
      // 降级：消息内任意非引用块的 selectable-text 的父元素
      const fallbackSts = row.querySelectorAll(
        '[data-testid="selectable-text"]',
      );
      for (const st of fallbackSts) {
        if (isInsideQuotedBlock(st)) continue;
        return st.parentElement;
      }
      return null;
    }

    // 从气泡容器提取全部正文，合并多段粗体，去重嵌套
    // 只取最内层叶子 selectable-text（跳过内部还有 selectable-text 子孙的外层容器）
    // 从气泡容器提取全部正文，合并多段粗体，去重嵌套
    function extractBubbleText(bubble) {
      if (!bubble) return "";
      const sts = bubble.querySelectorAll('[data-testid="selectable-text"]');
      const parts = [];
      for (const st of sts) {
        if (isInsideQuotedBlock(st)) continue;

        // 跳过被其他 selectable-text 包含的元素（只处理最内层叶子节点）
        // 检查方式：是否有祖先（除了自己）也是 selectable-text
        let parent = st.parentElement;
        let hasSelectableAncestor = false;
        while (parent && parent !== bubble) {
          if (
            parent.hasAttribute &&
            parent.hasAttribute("data-testid") &&
            parent.getAttribute("data-testid") === "selectable-text"
          ) {
            hasSelectableAncestor = true;
            break;
          }
          parent = parent.parentElement;
        }
        if (hasSelectableAncestor) continue;

        // 特殊处理：表情 img 标签
        if (st.tagName === "IMG" && st.hasAttribute("data-plain-text")) {
          const plainText = st.getAttribute("data-plain-text");
          if (plainText) {
            parts.push(plainText);
          }
          continue;
        }

        // 普通文本 span：提取 innerText
        const clone = st.cloneNode(true);
        clone
          .querySelectorAll('[aria-hidden="true"]')
          .forEach((e) => e.remove());
        clone.querySelectorAll("img[data-plain-text]").forEach((img) => {
          const plain = img.getAttribute("data-plain-text") || "";
          img.replaceWith(document.createTextNode(plain));
        });
        const t = (clone.innerText || clone.textContent || "").trim();
        if (t) parts.push(t);
      }
      return parts.join("\n").trim();
    }

    // ─── 进度圈 ───────────────────────────────────────────────────────────
    const SPINNER_CLASS = "wa-translate-spinner";
    const SPINNER_CSS = `
      .${SPINNER_CLASS} {
        display: inline-block;
        width: 14px; height: 14px;
        border: 2px solid rgba(26,115,232,0.25);
        border-top-color: #1a73e8;
        border-radius: 50%;
        animation: wa-spin 0.7s linear infinite;
        vertical-align: middle;
        margin: 3px 4px 0 0;
        flex-shrink: 0;
      }
      @keyframes wa-spin { to { transform: rotate(360deg); } }
      .${TRANSLATE_CLASS}-wrap {
        display: flex;
        align-items: flex-start;
        margin: 4px 0 2px 0;
        padding: 4px 8px;
        border-left: 3px solid #1a73e8;
        background: rgba(26,115,232,0.07);
        border-radius: 0 4px 4px 0;
        min-height: 22px;
      }
      .${TRANSLATE_CLASS}-wrap .${TRANSLATE_CLASS} {
        margin: 0; padding: 0; border: none; background: none; border-radius: 0;
        font-size: 14px; line-height: 1.5; color: #ff00a5;
        white-space: pre-wrap; word-break: break-word;
      }
    `;

    // 注入 spinner CSS（只注入一次）
    if (!document.getElementById("wa-translate-style")) {
      const styleEl = document.createElement("style");
      styleEl.id = "wa-translate-style";
      styleEl.textContent = SPINNER_CSS;
      document.head.appendChild(styleEl);
    }

    function insertSpinner(bubble) {
      if (!bubble) return null;
      if (bubble.querySelector("." + SPINNER_CLASS)) return null; // 已有 spinner
      if (bubble.querySelector("." + TRANSLATE_CLASS)) return null; // 已有译文
      const wrap = document.createElement("div");
      wrap.className = TRANSLATE_CLASS + "-wrap";
      const spinner = document.createElement("span");
      spinner.className = SPINNER_CLASS;
      const textEl = document.createElement("span");
      textEl.className = TRANSLATE_CLASS;
      textEl.textContent = "";
      wrap.appendChild(spinner);
      wrap.appendChild(textEl);
      bubble.appendChild(wrap);
      return wrap;
    }

    function fillTranslation(bubble, translated) {
      if (!bubble) return;
      // 找已有的 wrap（spinner 模式）
      let wrap = bubble.querySelector("." + TRANSLATE_CLASS + "-wrap");
      if (wrap) {
        const spinner = wrap.querySelector("." + SPINNER_CLASS);
        if (spinner) spinner.remove();
        const textEl = wrap.querySelector("." + TRANSLATE_CLASS);
        if (textEl) {
          textEl.textContent = translated;
          return;
        }
        wrap.textContent = translated;
        return;
      }
      // 兜底：直接插普通 div（回调时 bubble 可能已重建）
      if (bubble.querySelector("." + TRANSLATE_CLASS)) return;
      const div = document.createElement("div");
      div.className = TRANSLATE_CLASS + "-wrap";
      div.style.cssText =
        "margin:4px 0 2px 0;padding:4px 8px;border-left:3px solid #1a73e8;background:rgba(26,115,232,0.07);border-radius:0 4px 4px 0;font-size:14px;line-height:1.5;color:#ff00a5;white-space:pre-wrap;word-break:break-word;";
      div.textContent = translated;
      bubble.appendChild(div);
    }

    function removeSpinner(bubble) {
      if (!bubble) return;
      const wrap = bubble.querySelector("." + TRANSLATE_CLASS + "-wrap");
      if (wrap) {
        const spinner = wrap.querySelector("." + SPINNER_CLASS);
        if (spinner) spinner.remove();
        // 如果 wrap 是空的（没有文字），整个移除
        const textEl = wrap.querySelector("." + TRANSLATE_CLASS);
        if (!textEl || !textEl.textContent) wrap.remove();
      }
    }

    function insertTranslation(bubble, translated) {
      fillTranslation(bubble, translated);
    }

    // ─── 处理单个 [data-id] 行 ────────────────────────────────────────────
    function handleRow(row) {
      if (!translateEnabled) return;
      const dataId = row.getAttribute("data-id");
      if (!dataId) return;

      const bubble = getBubbleFromRow(row);
      if (!bubble) return;

      // 已有译文或正在翻译（spinner）则跳过
      if (bubble.querySelector("." + TRANSLATE_CLASS + "-wrap")) return;
      if (bubble.querySelector("." + TRANSLATE_CLASS)) return;

      const text = extractBubbleText(bubble);
      if (!text || text.length < 2) return;

      // 先查文本缓存（同内容直接插入，不发网络请求）
      const cached = getCached(text);
      if (cached) {
        const result =
          cached.translated && cached.translated !== text
            ? `[${cached.source}] ${cached.translated}`
            : "";
        if (result) {
          insertTranslation(bubble, result);
          return;
        }
      }

      // 同一消息行已在请求中，跳过
      if (translatePending.has(dataId)) return;
      translatePending.add(dataId);

      // ✅ 立即插入 spinner，让用户看到正在翻译
      insertSpinner(bubble);

      enqueueTranslate(async () => {
        try {
          const { translated, source } = await fetchTranslation(text);
          const result =
            translated && translated !== text
              ? `[${source}] ${translated}`
              : "";
          if (result) {
            setCached(text, translated, source); // 缓存原文和来源
            // 重新从 DOM 找（虚拟滚动可能重建了节点）
            const liveRow = document.querySelector(
              `[data-id="${CSS.escape(dataId)}"]`,
            );
            if (liveRow) {
              const liveBubble = getBubbleFromRow(liveRow);
              if (liveBubble) fillTranslation(liveBubble, result);
            }
          } else {
            // 翻译结果为空（同语言等），移除 spinner
            const liveRow = document.querySelector(
              `[data-id="${CSS.escape(dataId)}"]`,
            );
            if (liveRow) removeSpinner(getBubbleFromRow(liveRow));
          }
        } catch (e) {
          console.warn("[wa-translate] 失败:", dataId, e);
          // 移除 spinner，避免永久转圈
          const liveRow = document.querySelector(
            `[data-id="${CSS.escape(dataId)}"]`,
          );
          if (liveRow) removeSpinner(getBubbleFromRow(liveRow));
        } finally {
          translatePending.delete(dataId);
        }
      });
    }

    // ─── 扫描所有已渲染消息 ───────────────────────────────────────────────
    function scanExisting() {
      // 找所有已渲染的 [data-id] 行（有 selectable-text 的）
      const rows = document.querySelectorAll("[data-id]");
      for (const row of rows) {
        // 虚拟列表中 data-virtualized="true" 的是占位，跳过
        if (!row.querySelector('[data-testid="selectable-text"]')) continue;
        handleRow(row);
      }
    }

    function clearAllTranslations() {
      document
        .querySelectorAll("." + TRANSLATE_CLASS + "-wrap, ." + TRANSLATE_CLASS)
        .forEach((el) => el.remove());
    }

    // ─── MutationObserver：监听消息插入（虚拟滚动）───────────────────────
    // 虚拟列表在滚动时会把 data-virtualized="true" 的占位节点替换成真实内容
    // 监听 [data-id] 节点的子节点变化，检测到 selectable-text 出现时翻译
    const translateMsgObserver = new MutationObserver((mutations) => {
      if (!translateEnabled) return;
      const seenRows = new Set();
      for (const mutation of mutations) {
        // 检查 addedNodes（新增节点）
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          // 直接就是 [data-id] 行
          if (node.hasAttribute("data-id")) {
            if (
              !seenRows.has(node) &&
              node.querySelector('[data-testid="selectable-text"]')
            ) {
              seenRows.add(node);
              handleRow(node);
            }
            continue;
          }
          // 新增节点内含 [data-id]
          const rows = node.querySelectorAll
            ? node.querySelectorAll("[data-id]")
            : [];
          for (const row of rows) {
            if (
              !seenRows.has(row) &&
              row.querySelector('[data-testid="selectable-text"]')
            ) {
              seenRows.add(row);
              handleRow(row);
            }
          }
          // 也检查 selectable-text 直接插入（虚拟列表内容填充）
          const sts = node.querySelectorAll
            ? node.querySelectorAll('[data-testid="selectable-text"]')
            : [];
          for (const st of sts) {
            if (isInsideQuotedBlock(st)) continue;
            const row = st.closest("[data-id]");
            if (row && !seenRows.has(row)) {
              seenRows.add(row);
              handleRow(row);
            }
          }
        }

        // 检查 target 自身（[data-id] 行的内容被替换时，target = [data-id]）
        const target = mutation.target;
        if (
          target.hasAttribute &&
          target.hasAttribute("data-id") &&
          !seenRows.has(target)
        ) {
          if (target.querySelector('[data-testid="selectable-text"]')) {
            seenRows.add(target);
            handleRow(target);
          }
        }
      }
    });

    // ─── 聊天切换检测 ─────────────────────────────────────────────────────
    function getCurrentChatTitle() {
      const header = document.querySelector('#main header span[dir="auto"]');
      return header ? header.textContent.trim() : null;
    }

    function onChatSwitched() {
      if (!translateEnabled) return;
      if (translateChatSwitchDebounce)
        clearTimeout(translateChatSwitchDebounce);
      translateChatSwitchDebounce = setTimeout(() => {
        console.log("[wa-translate] 切换聊天，重新扫描...");
        // 清除 pending（新聊天的 dataId 不同，旧 pending 无意义）
        translatePending.clear();
        scanExisting();
        translateChatSwitchDebounce = null;
      }, 900);
    }

    // body 级监听：检测消息容器整体替换
    const translateChatObserver = new MutationObserver((mutations) => {
      if (!translateEnabled) return;
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          if (
            node.getAttribute?.("data-scrolltracepolicy") ===
              "wa.web.conversation.messages" ||
            node.querySelector?.(
              '[data-scrolltracepolicy="wa.web.conversation.messages"]',
            )
          ) {
            onChatSwitched();
            return;
          }
          // 大量新 data-id 节点 = 切换了聊天
          if (node.querySelectorAll) {
            const msgs = node.querySelectorAll("[data-id]");
            if (msgs.length >= 5) {
              onChatSwitched();
              return;
            }
          }
        }
      }
    });

    // 聊天列表点击监听（双保险）
    document.addEventListener(
      "click",
      (e) => {
        if (!translateEnabled) return;
        const chatItem = e.target.closest(
          '[role="row"], [role="listitem"], [data-testid="chat-list-item"]',
        );
        if (!chatItem) return;
        setTimeout(() => {
          const currentTitle = getCurrentChatTitle();
          if (currentTitle !== translateLastChatId) {
            translateLastChatId = currentTitle;
            console.log("[wa-translate] 点击切换聊天:", currentTitle);
            translatePending.clear();
            scanExisting();
          }
        }, 1000);
      },
      true,
    );

    // ─── 滚动到底部按钮监听（新消息提醒）────────────────────────────────
    let scrollBtnObserver = null;
    let scrollBtnDebounce = null;

    function startScrollBtnObserver() {
      if (scrollBtnObserver) return;
      scrollBtnObserver = new MutationObserver(() => {
        if (!translateEnabled) return;
        const btn = document.querySelector(
          'button[aria-label="滚动到底部"], button[data-tab="7"]',
        );
        if (btn && btn.offsetParent) {
          if (scrollBtnDebounce) clearTimeout(scrollBtnDebounce);
          scrollBtnDebounce = setTimeout(() => scanExisting(), 300);
        }
      });
      scrollBtnObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class"],
      });
    }

    function stopScrollBtnObserver() {
      if (scrollBtnObserver) {
        scrollBtnObserver.disconnect();
        scrollBtnObserver = null;
      }
    }

    // ─── 开启 / 暂停 ──────────────────────────────────────────────────────
    function startTranslate() {
      translateEnabled = true;
      translateBtn.style.background = "#d93025";
      translateBtn.textContent = "⏸ 暂停自动翻译";

      loadCacheFromFile().then(() => {
        if (translateEnabled) scanExisting();
      });

      // observe 整个 #main，捕获虚拟列表内容替换
      const root = document.querySelector("#main") || document.body;
      translateMsgObserver.observe(root, { childList: true, subtree: true });
      translateChatObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });

      translateLastChatId = getCurrentChatTitle();
      scanExisting();
      startScrollBtnObserver();
      console.log("[wa-translate] 已开启");
    }

    function pauseTranslate() {
      translateEnabled = false;
      translateBtn.style.background = "#1a73e8";
      translateBtn.textContent = "🌐 开启自动翻译";

      translateMsgObserver.disconnect();
      translateChatObserver.disconnect();
      stopScrollBtnObserver();
      clearAllTranslations();

      if (
        cacheDirty &&
        window.__csharpApiReady &&
        typeof window.saveFile === "function"
      ) {
        if (cacheFlushTimer) {
          clearTimeout(cacheFlushTimer);
          cacheFlushTimer = null;
        }
        const entries = Array.from(memCache.entries());
        window.saveFile(CACHE_FILE, { entries }).catch(() => {});
        cacheDirty = false;
        console.log(`[wa-translate] 暂停，缓存已写入 ${entries.length} 条`);
      }

      translateQueue = [];
      translatePending.clear();
      console.log("[wa-translate] 已暂停");
    }

    translateBtn.addEventListener("click", () => {
      if (translateEnabled) pauseTranslate();
      else startTranslate();
    });
  })();
  // ==================== 自动翻译模块结束 ====================
}

if (window.location.hostname.includes("web.whatsapp.com")) {
  console.log("当前在 WhatsApp Web");
  // 调用函数注入浮动窗口
  注入浮动窗口();
}
