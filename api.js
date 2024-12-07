var topOffset = 0; // 提示框顶部偏移量
// 信息 和 颜色
function showAlert(message,color,time) {
    if(time==null){
        time=6000;
    }
    
    if(color == "" || color == null){
        color= '#00a884';
    }
    var alertBox = createAlert(message,color);
    alertBox.style.display = 'block';
    setTimeout(function() {
        closeAlert(alertBox);
    }, time);
}


showAlert("数据分析插件已经注入了",'#000000',1000);

function createAlert(message,color) {
    var alertBox = document.createElement('div');
    alertBox.className = 'alertBox';
    alertBox.style.position = 'fixed';
    alertBox.style.top = (calculateTopOffset()) + 'px'; // 设置提示框的顶部偏移量
    alertBox.style.right = '50px';
    alertBox.style.width = '200px'; // 固定提示框的宽度为 100px
    alertBox.style.backgroundColor = color; // 设置背景颜色为绿色
    alertBox.style.color = 'white'; // 设置文字颜色为白色
    alertBox.style.border = ('1px solid'+color);
    alertBox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
    alertBox.style.padding = '10px';
    alertBox.style.maxHeight = '80px'; // 设置提示框的最大高度为 100px
    alertBox.style.zIndex = '9999';
    alertBox.style.display = 'none';
    alertBox.style.height = '50px'; // 设置提示框的高度为 100px
    // alertBox.style.lineHeight='50px';
    
    var alertText = document.createElement('p');
    alertText.innerHTML = message; // 设置自定义的提示内容
    alertBox.appendChild(alertText);
    alertBox.style.lineHeight="50px";
    alertBox.style.textAlign="center";
    alertBox.style.overflow="hidden";
    alertBox.style.whiteSpace="nowrap";
    document.body.appendChild(alertBox);
    updateTopOffset();
    return alertBox;
}

function closeAlert(alertBox) {
    alertBox.parentNode.removeChild(alertBox);
    updateTopOffset();
}

function calculateTopOffset() {
    var alertBoxes = document.querySelectorAll('.alertBox');
    var totalHeight = 0;
    for (var i = 0; i < alertBoxes.length; i++) {
        totalHeight += alertBoxes[i].offsetHeight + 4; // 加上顶部和底部边距
    }
    return totalHeight;
}

function updateTopOffset() {
    var alertBoxes = document.querySelectorAll('.alertBox');
    var topOffset = 0;
    for (var i = 0; i < alertBoxes.length; i++) {
        alertBoxes[i].style.top = topOffset + 'px';
        topOffset += alertBoxes[i].offsetHeight + 4; // 每个提示框的高度加上顶部和底部边距
    }
}


// 注入Html标签
function injectCodePromptBox(id) {
    var html = document.createElement('div');
    html.setAttribute('id', id);
    document.getElementsByTagName('body')[0].appendChild(html);

    var codePromptBox = document.getElementById(id);
    codePromptBox.style.cssText = "background-color: #cfd1d145; position: relative; z-index: 9999; margin: 0 auto; color:red;";

    return codePromptBox; // 返回 codePromptBox
}

// 调用函数以注入代码提示框并保存到变量中
var AppLog = injectCodePromptBox('AppLog');

function 获取WA群手机号码() {// 要考虑多方面的因素 当前页面语言  群头像  
    
    //1.创建对象
    var obj = document.getElementById('main');

    //判断当前页面语言
    var 分割符 = "";
    var 人称标识 = "";
    var language = document.documentElement.lang;
    if (language.startsWith("zh")) {
        分割符 = "、";
        人称标识 = '你';
    } else if (language.startsWith("en")) {
        分割符 = ",";
        人称标识 = 'You';
    } else {
        分割符 = ",";
        人称标识 = 'You';
        console.log("当前页面语言未知，使用英文默认对象");
    }

    // 判断有没有群头像
    var groupImg=false;
    // 判断是否存在头像的函数
    function hasGroupAvatar(headerElement) {
        const imgElements = headerElement.getElementsByTagName("img");
        return imgElements.length > 0;
    }
    var htmlData=(((obj.getElementsByTagName("header"))[0].getElementsByTagName("div"))[1]);
    // 判断有没有群头像
    if (hasGroupAvatar(htmlData)) {
        groupImg=true;
    } else {
        groupImg=false;
    }

    //2.取得对象数据
    var 群名 = ((((((obj.getElementsByTagName("header"))[0].getElementsByTagName("div"))[4]).getElementsByTagName("span"))[0]).innerHTML);
    //有头像div是5 没有是6
    var 号码;
    if(groupImg){
        号码=((((((obj.getElementsByTagName("header"))[0].getElementsByTagName("div"))[5]).getElementsByTagName("span"))[0]).innerHTML).replace(/\s+/g, "")
    }else{
        号码=((((((obj.getElementsByTagName("header"))[0].getElementsByTagName("div"))[6]).getElementsByTagName("span"))[0]).innerHTML).replace(/\s+/g, "")
    }

    if (号码.includes('您') || 号码.includes('You')) {
        // 1. 号码数据加工处理 (返回数组)
        号码 = 号码.split(分割符)
        .filter(num => num !== 人称标识)
            .map(num => num.replace(/[\(\)\-\+\s]/g, ''))
            .filter(num => num.startsWith('1') && num.length === 11)
            .map(num => ({
                    "群名": 群名,
                    "手机号码": num,
                    "出现次数": 0,
                    "所在群组": "",
                    "WA链接": "https://wa.me/" + num,
                    "群所属人": ""
                })
            );
        // 2. 赋值
        return [号码, 群名];
    } else {
        console.log('号码还没有获取到');
        return [[], "无法获取数据"];
    }
}

// 数据处理
function WA数据处理(群数据) {
    // 创建一个对象来存储手机号码的出现次数和相关群名
    const phoneNumbers = {};

    // 遍历数据
    群数据.forEach((groupArray, groupIndex) => {
        groupArray.forEach((item) => {
            const phoneNumber = item["手机号码"];
            if (phoneNumber in phoneNumbers) {
                // 如果手机号码已经在对象中存在，增加重复次数和记录群名
                phoneNumbers[phoneNumber]["出现次数"]++;
                //   if (!phoneNumbers[phoneNumber]["重复群"].includes(item["群名"])) {
                //     phoneNumbers[phoneNumber]["重复群"].push(item["群名"]);
                //   }
                phoneNumbers[phoneNumber]["所在群组"].push(item["群名"]);
            } else {
                // 如果手机号码不在对象中，创建一个新的对象并初始化重复群列表
                phoneNumbers[phoneNumber] = {
                    "手机号码":item["手机号码"],
                    "出现次数": 1,
                    "所在群组": [item["群名"]], // 使用数组来存储相关群名
                    "WA链接":item["WA链接"]
                };
            }
        });
    });

    // 将手机号码信息转换为数组
    const phoneNumbersArray = Object.values(phoneNumbers);

    // 输出结果
    // console.log("手机号码出现在哪些群中和重复次数：");
    // console.log(phoneNumbersArray);

    // 分类小号和客户
    const 小号 = [];
    const 客户 = [];

    phoneNumbersArray.forEach((item) => {
        if (item["出现次数"] > 1) {
            // 出现次数大于1的手机号码分类为客服
            小号.push(item);
        } else {
            // 出现次数等于1的手机号码分类为客户
            客户.push(item);
        }
    });

    // 浏览器下载操作
    function downloadText(name, data) {
        const blob = new Blob([data], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        a.click();
        URL.revokeObjectURL(url);
    }

    const 时间戳 = new Date().getTime();
    const 时间字符串 = new Date(时间戳).toLocaleString().replace(/[/:\s]/g, '-');
    const 文件名 = `${时间字符串}数据报表.html`;

    const 表格HTML = `
        <style>
            table {width: 100%; border-collapse: collapse;}        
            table caption {font-size: 2em; font-weight: bold; margin: 1em 0; }
            th,td {border: 1px solid #999; text-align: center; padding: 20px 0; }
            table thead tr {background-color: #008c8c; color: #fff;}        
            table tbody tr:nth-child(odd) { background-color: #eee;}        
            table tbody tr:hover {background-color: #ccc;}        
            /* 第一个元素 */        
            /* table tbody tr td:first-child {color: #f40;} */        
            /* 最后一个元素 */        
            table tbody tr td:last-child { color: rgb(31, 138, 252);}        
            table tfoot tr td {text-align: right; padding-right: 20px;}   
        </style>
        <div style="display: flex;">
            <table style="margin-right: 10px;  flex: 3;">
                <caption>客户数据（<strong style='color:red;'>${客户.length}</strong>）条</caption>
                <thead>
                    <tr>
                        <th>(索引)</th>
                        <th class="SjFz">手机号码<span style='font-size:9px; cursor: pointer;'>（点击复制号码）</span></th>
                        <th>所在群</th>
                    </tr>
                </thead>
                <tbody id="Khdata">
                    <!-- 使用JavaScript插入表格行 -->
                </tbody>
                <tfoot id="KhStats">
                    <tr>
                        <td colspan="3">统计时间---</td>
                    </tr>
                </tfoot>
            </table>

            <table style="margin-right: 10px;  flex: 7;height: 200px;">
                <caption>重复数据（<strong style='color:red;'>${小号.length}</strong>）条</caption>
                <thead>
                    <tr>
                        <th>(索引)</th>
                        <th class="SjFz">手机号码<span style='font-size:9px; cursor: pointer;'>（点击复制号码）</span></th>
                        <th>WA链接</th>
                        <th>出现次数</th>
                        <th>所在群</th>
                    </tr>
                </thead>
                <tbody id="Cfdata">
                    <!-- 使用JavaScript插入表格行 -->
                </tbody>
                <tfoot id="CfStats">
                    <tr>
                        <td colspan="3">统计时间---</td>
                    </tr>
                </tfoot>
            </table>
        </div>
        <div id="Khsjhm" style="white-space: pre-line;"></div>
        <div id="Cfsjhm" style="white-space: pre-line;"></div>
        <script>
            var Khdata = ${JSON.stringify(客户)};
            var Cfdata = ${JSON.stringify(小号)};
        </script>

        

        <script src="https://raw.githubusercontent.com/WaCn-Api/api/refs/heads/main/get_Data.js"></script>
    `;

    downloadText(文件名, 表格HTML);
    
}


//监听按键
var 待处理的群数据 = new Array();
document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case 'F2':
            var data = 获取WA群手机号码();
            if(data[1]=='无法获取数据'){
                showAlert('叼毛 号码还没有获取到！','#ea5455');
            }else{
                待处理的群数据.push(data[0]);
                AppLog.innerHTML = AppLog.innerHTML + "<span>" + data[1] + "</span>";
                console.log('添加项目: ' + data[1]);
                showAlert('添加项目: ' + data[1]);
            }
            
            break;
        case 'F8':
            showAlert('正在处理数据');
            WA数据处理(待处理的群数据);
            // 生成WA群组报表(待处理的群数据);
            // console.log(待处理的群数据);
            break;
        case 'Control':
            if(待处理的群数据.length>0){
                待处理的群数据 = [];
                AppLog.innerHTML = '';
                showAlert('清除数据成功');
                console.log('清除数据成功');
            }
            break;
        default:
            // 如果是其他值，执行这个代码块
            console.log('未定义的标题');
            console.log('未知错误');
    }
    // console.log("按下了" + event.key);
});











