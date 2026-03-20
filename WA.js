// ==================== 本地数据库管理 ====================

// 数据库名称和版本
const DB_NAME = "WhatsAppCustomerDB";
const DB_VERSION = 1;
const STORE_NAME = "uniqueNumbers";

// 初始化数据库
async function 初始化数据库() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // 创建存储独立号码的对象仓库
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "号码" });
        store.createIndex("群组", "所在群组", { unique: false });
        store.createIndex("采集时间", "采集时间", { unique: false });
      }
    };
  });
}

async function 保存独立号码到数据库(uniqueNumbers) {
  try {
    const db = await 初始化数据库();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    await store.clear();

    const timestamp = new Date().toISOString();
    for (const item of uniqueNumbers) {
      await store.add({
        ...item,
        采集时间: timestamp,
        标记状态: "客户",
      });
    }

    await tx.done;
    console.log(`✅ 已保存 ${uniqueNumbers.length} 个独立号码到IndexedDB`);

    // ✅ 新增：同步写入 C# 文件存储
    if (window.__csharpApiReady && typeof window.saveFile === "function") {
      try {
        const saveResult = await window.saveFile("whatsapp_customers.json", {
          保存时间: timestamp,
          号码列表: uniqueNumbers,
        });
        saveResult?.success
          ? console.log(`✅ 同步写入文件成功: ${saveResult.path}`)
          : console.warn("⚠️ 文件写入失败:", saveResult?.error);
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
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);

    const result = await store.get(phoneNumber);
    return result ? true : false;
  } catch (error) {
    console.error("❌ 查询数据库失败:", error);
    return false;
  }
}

// 获取所有客户号码
async function 获取所有客户号码() {
  try {
    const db = await 初始化数据库();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);

    const allRecords = await store.getAll();
    return allRecords.map((record) => record.号码);
  } catch (error) {
    console.error("❌ 获取客户号码失败:", error);
    return [];
  }
}

// ==================== 群组成员号码采集器 ====================
async function 获取未归档群数据报表() {
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
  async function 采集群组号码并生成报告() {
    console.log("=".repeat(60));
    console.log("📞 WhatsApp未归档群组成员号码采集器");
    console.log("=".repeat(60));
    console.log("⏰ 整个过程可能需要几分钟，请耐心等待...");

    const results = await 采集群组号码((p) => {
      console.log(`进度: ${p.current}/${p.total} - ${p.groupName}`);
    });

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
    a.download = `whatsapp_群组号码报告_${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(a.href);

    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.title = `whatsapp_群组号码报告_${new Date().toISOString().slice(0, 10)}`;
      console.log("✅ 报告已在新窗口打开，可以按 Ctrl+S 保存");
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
  return await 采集群组号码并生成报告();
}

// ==================== 客户标记开关（使用您的滚动监听方法） ====================

let 客户标记监控开启 = false;
let 已标记消息的ID集合 = new Set();
let 标记防抖定时器 = null;
let 滚动监听定时器 = null;
// ✅ 加上这两行
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
      // 1. 从 IndexedDB 加载客户号码
      const indexedDBNumbers = await new Promise((resolve) => {
        const request = indexedDB.open("WhatsAppCustomerDB", 1);
        request.onsuccess = () => {
          const db = request.result;
          const tx = db.transaction("uniqueNumbers", "readonly");
          const store = tx.objectStore("uniqueNumbers");
          const getAll = store.getAll();
          getAll.onsuccess = () =>
            resolve(getAll.result.map((item) => item.号码));
          getAll.onerror = () => resolve([]);
        };
        request.onerror = () => resolve([]);
        request.onupgradeneeded = () => resolve([]);
      });
      console.log(`📦 IndexedDB 客户号码: ${indexedDBNumbers.length} 个`);

      // ✅ 新增：从 C# 文件存储读取号码
      let fileNumbers = [];
      if (window.__csharpApiReady && typeof window.readFile === "function") {
        try {
          const fileData = await window.readFile("whatsapp_customers.json");
          if (fileData && Array.isArray(fileData.号码列表)) {
            fileNumbers = fileData.号码列表
              .map((item) => item.号码)
              .filter(Boolean);
            console.log(`📂 文件存储客户号码: ${fileNumbers.length} 个`);
          }
        } catch (e) {
          console.warn("⚠️ 读取文件存储异常（不影响主流程）:", e);
        }
      } else {
        console.log("ℹ️ C# API 不可用，仅使用 IndexedDB 数据");
      }

      // ✅ 合并去重
      const 客户号码 = [...new Set([...indexedDBNumbers, ...fileNumbers])];
      console.log(`📊 合并后客户号码总计: ${客户号码.length} 个`);

      window.__客户号码列表 = new Set(客户号码);
      console.log(`📚 已加载 ${客户号码.length} 个客户号码`);

      // 2. 启动滚动监听（使用您的代码）
      启动滚动监听();

      // 3. 监听聊天列表点击
      document.addEventListener("click", 监听聊天点击, true);

      客户标记监控开启 = true;
      console.log("✅ 客户标记已开启");

      // 4. 初始标记
      标记聊天列表();
      标记当前聊天窗口();
      标记当前可见消息();
      启动已读面板监听(); // ✅ 新增
      标记已读用户列表(); // ✅ 新增
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

    // ✅ 新增：清理已读面板监听
    if (已读面板监听定时器) {
      clearInterval(已读面板监听定时器);
      已读面板监听定时器 = null;
    }
    已读面板容器引用 = null;

    // 关闭分支里
    if (已读面板容器引用?._observer) {
      已读面板容器引用._observer.disconnect();
    }
    已读面板容器引用 = null;

    if (标记防抖定时器) {
      clearTimeout(标记防抖定时器);
      标记防抖定时器 = null;
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
function 启动滚动监听() {
  const containerClass =
    'div[data-scrolltracepolicy="wa.web.conversation.messages"]';

  // 停止之前的定时器
  if (滚动监听定时器) {
    clearInterval(滚动监听定时器);
  }

  滚动监听定时器 = setInterval(() => {
    const container = document.querySelector(containerClass);
    if (!container) return;

    console.log("✅ 找到消息列表容器，开始监听滚动");

    // 移除可能存在的旧监听器（避免重复）
    container.removeEventListener("scroll", 处理滚动);

    // 添加新的滚动监听
    container.addEventListener("scroll", 处理滚动);

    clearInterval(滚动监听定时器); // 绑定成功后停止轮询
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
      启动已读面板监听(); // ✅ 新增：每次切换聊天后重新监听已读面板
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

// 标记当前聊天窗口
function 标记当前聊天窗口() {
  const header = document.querySelector("header");
  if (!header) return;

  // 移除旧的窗口标记
  header
    .querySelectorAll(".header-customer-badge")
    .forEach((el) => el.remove());

  // 从群组头部获取号码
  const numberSpan = document.querySelector(
    'header span[data-testid="selectable-text"]',
  );
  if (numberSpan) {
    const text = numberSpan.textContent || "";
    const matches = text.match(/\+[\d\s\(\)\-]{9,20}/g);

    if (matches) {
      for (const match of matches) {
        const 号码 = match.replace(/[\s\(\)\-]/g, "");

        if (window.__客户号码列表?.has(号码)) {
          const nameEl = header.querySelector(
            'span[dir="auto"]:not([data-testid])',
          );
          if (nameEl) {
            const badge = document.createElement("span");
            badge.className = "header-customer-badge customer-badge";
            badge.innerHTML = "⭐ 客户";
            badge.style.cssText = `
              background: #25D366;
              color: white;
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

function 标记已读用户列表() {
  // 找 height 最大且含 _ak8i 的 x1y332i5
  const allLists = document.querySelectorAll(".x1y332i5");
  let virtualList = null;
  let maxHeight = 0;
  allLists.forEach((el) => {
    const h = parseInt(el.style.height) || 0;
    if (el.querySelector('[role="listitem"] ._ak8i') && h > maxHeight) {
      maxHeight = h;
      virtualList = el;
    }
  });
  if (!virtualList) return;

  const listItems = virtualList.querySelectorAll('[role="listitem"]');
  let 标记数量 = 0;

  listItems.forEach((item) => {
    const numberEl = item.querySelector("._ak8i span._ao3e");
    if (!numberEl) return;
    if (item.querySelector(".customer-badge")) return;

    const text = numberEl.textContent || "";
    const match = text.match(/\+[\d\s\(\)\-]{9,20}/);
    if (!match) return;

    const 号码 = match[0].replace(/[\s\(\)\-]/g, "");
    if (!window.__客户号码列表?.has(号码)) return;

    const nameEl = item.querySelector("._ak8q span[dir='auto']");
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
      vertical-align: middle;
    `;
    nameEl.parentNode.appendChild(badge);
    标记数量++;
    console.log(`✅ 已读面板标记客户: ${号码}`);
  });

  if (标记数量 > 0) console.log(`📊 已读面板标记完成，共 ${标记数量} 个客户`);
}

function 启动已读面板监听() {
  if (已读面板监听定时器) clearInterval(已读面板监听定时器);

  // 持续轮询，只要客户标记开着就一直检测
  已读面板监听定时器 = setInterval(() => {
    if (!客户标记监控开启) return;

    const allLists = document.querySelectorAll(".x1y332i5");
    let virtualList = null;
    let maxHeight = 0;
    allLists.forEach((el) => {
      const h = parseInt(el.style.height) || 0;
      if (el.querySelector('[role="listitem"] ._ak8i') && h > maxHeight) {
        maxHeight = h;
        virtualList = el;
      }
    });

    if (!virtualList) {
      // 已读面板关闭了，重置引用
      if (已读面板容器引用) {
        已读面板容器引用._observer?.disconnect();
        已读面板容器引用 = null;
      }
      return;
    }

    // 已读面板没变化，不重复绑定
    if (virtualList === 已读面板容器引用?._list) return;

    // 新的已读面板出现，绑定监听
    if (已读面板容器引用) {
      已读面板容器引用._observer?.disconnect();
    }

    console.log("✅ 检测到已读面板，开始监听, height:", maxHeight);

    let 防抖 = null;
    const 触发标记 = () => {
      if (防抖) clearTimeout(防抖);
      防抖 = setTimeout(() => 标记已读用户列表(), 200);
    };

    const observer = new MutationObserver(触发标记);
    observer.observe(virtualList, { childList: true, subtree: false });

    已读面板容器引用 = { _list: virtualList, _observer: observer };

    // 立即标记
    标记已读用户列表();

  }, 800); // 每800ms检查一次
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
        <span>WA-消息群发模块(群组报表) v3.1.7 <span id="userName" style="color: #007bff;"></span></span>
      </div>
      <div class="content-area">
        <div class="control-panel">
          <button id="loadGroupsBtn" style="width: 100%;    font-size: 14px;    background-color: #cc0000;    margin-bottom: 10px;">获取未归档群组报表</button>
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

          <!-- 👇 在这里添加客户标记控制按钮 -->
      <div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 4px;">
        <div style="display: flex; gap: 10px; justify-content: center;">
          <button id="startCustomerMark" style="background-color: #25D366; flex: 1;">⭐ 开启客户标记</button>
          <button id="stopCustomerMark" style="background-color: #f44336; flex: 1;">⏹️ 关闭客户标记</button>
        </div>
      </div>
      <!-- 👆 客户标记控制按钮结束 -->

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

  // 获取群组数据报表（新功能）
  shadowRoot
    .getElementById("loadGroupsBtn")
    .addEventListener("click", async function () {
      const 按钮 = this;

      try {
        按钮.disabled = true;
        按钮.textContent = "采集中...";
        更新状态消息("正在采集群组成员号码，请不要进行任何操作！", "success");

        // 调用采集函数
        const results = await 获取未归档群数据报表();

        if (results && results.results) {
          更新状态消息(
            `采集完成！成功: ${results.results.filter((r) => r.status === "success").length} 个群组`,
            "success",
          );
        } else {
          更新状态消息("采集完成！", "success");
        }
      } catch (error) {
        console.error("采集失败:", error);
        更新状态消息(`采集失败: ${error.message}`, "error");
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

  // 👇 在这里添加客户标记按钮事件
  // 开启客户标记
  shadowRoot
    .getElementById("startCustomerMark")
    .addEventListener("click", () => {
      标记客户(true);
      更新状态消息("⭐ 客户标记已开启", "success");
    });

  // 关闭客户标记
  shadowRoot
    .getElementById("stopCustomerMark")
    .addEventListener("click", () => {
      标记客户(false);
      更新状态消息("⏹️ 客户标记已关闭", "success");
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
