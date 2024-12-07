
const 客户数据 = document.getElementById('Khdata');
const KhStats = document.getElementById('KhStats');
const 重复数据 = document.getElementById('Cfdata');
const CfStats = document.getElementById('CfStats');

//客户号码待复制选区
const Khsjhm = document.getElementById('Khsjhm');
Khsjhm.style.cssText = "position: absolute; left: -9999px; white-space: pre-line;";

const Cfsjhm = document.getElementById('Cfsjhm');
Cfsjhm.style.cssText = "position: absolute; left: -9999px; white-space: pre-line;";

//复制提示按钮
const copyKhButton = document.querySelectorAll(".SjFz")[0];
const copyCfButton = document.querySelectorAll(".SjFz")[1];


//客户数据处理
const AnalysisRows = [];
let 客户手机号码 = '';
for (let i = 0; i < Khdata.length; i++) {
    AnalysisRows.push(`<tr><td>${i}</td><td>${Khdata[i].手机号码}</td><td>${Khdata[i].所在群组}</td></tr>`);
    客户手机号码 += Khdata[i].手机号码 + "\n";
};
客户数据.innerHTML = AnalysisRows.join('');
Khsjhm.textContent = 客户手机号码;
KhStats.innerHTML = `<tr><td colspan='5'>共计 <strong style='color:red;'>${Khdata.length}</strong> 条数据</td></tr>`;

// 重复数据处理
const AnalysisRowss = [];
let 重复手机号码 = '';
for (let i = 0; i < Cfdata.length; i++) {
    AnalysisRowss.push(`<tr style="height:100px;"><td>${i}</td><td>${Cfdata[i].手机号码}</td><td>${Cfdata[i].WA链接}</td><td style="color: #f40;">${Cfdata[i].出现次数}</td><td>${Cfdata[i].所在群组}</td></tr>`);
    重复手机号码 += Cfdata[i].手机号码 + "\n";
};
重复数据.innerHTML = AnalysisRowss.join('');
Cfsjhm.textContent = 重复手机号码;
CfStats.innerHTML = `<tr><td colspan='5'>共计 <strong style='color:red;'>${Cfdata.length}</strong> 条数据</td></tr>`;


copyKhButton.addEventListener("click", function () {
    // 创建一个新的范围并选择<div>元素
    const range = document.createRange();
    range.selectNode(Khsjhm);

    // 创建一个空的选区
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    // 尝试复制选中的内容
    try {
        document.execCommand('copy');
        console.log("内容已复制到剪贴板");
        alert("号码已复制到剪贴板");
    } catch (err) {
        console.error("复制失败:", err);
        alert("复制失败");
    }

    // 清除选区
    selection.removeAllRanges();
});


copyCfButton.addEventListener("click", function () {
    // 创建一个新的范围并选择<div>元素
    const range = document.createRange();
    range.selectNode(Cfsjhm);

    // 创建一个空的选区
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    // 尝试复制选中的内容
    try {
        document.execCommand('copy');
        console.log("内容已复制到剪贴板");
        alert("号码已复制到剪贴板");
    } catch (err) {
        console.error("复制失败:", err);
        alert("复制失败");
    }

    // 清除选区
    selection.removeAllRanges();
});





// WA客户数据获取 读取单个群数据

// 注入Html标签
function injectCodePromptBox(id) {
    var html = document.createElement('div');
    html.setAttribute('id', id);
    document.getElementsByTagName('body')[0].appendChild(html);

    var codePromptBox = document.getElementById(id);
    codePromptBox.style.cssText = "  background-color: #FFFFFF;    position: fixed;    z-index: 9999;         top: 0px;    width:100%";

    return codePromptBox; // 返回 codePromptBox
}

// 调用函数以注入代码提示框并保存到变量中
var AppLog = injectCodePromptBox('AppLog');

AppLog.innerHTML=`<div style="width: 100%;">
    <div style="background-color: #008c8c;  color: #8fff00; height: 40px;    line-height: 40px; "><strong style="color:white; margin-left: 10px;">筛选单独群客户数据</strong>（ 按住Ctrl 然后鼠标点击 可多选） <button style="    height: 30px;    font-size: 15px;    font-weight: 700;" onclick="getSelectedGroups()">筛选数据</button></div>
    <span>
        <select id="groupDropdown" multiple></select>
    </span>
</div>`;

const allGroups = Khdata.reduce((groups, item) => {
    item["所在群组"].forEach(group => {
        if (!groups.includes(group)) {
            groups.push(group);
        }
    });
    return groups;
}, []);


const dropdownMenu = document.getElementById("groupDropdown");
dropdownMenu.style.cssText = "width: 100%;   height: "+(((allGroups.length)*30)+10)+"px;";

allGroups.forEach(group => {
    const option = document.createElement("option");
    option.text = group;
    option.style.height = "30px";
    dropdownMenu.add(option);
});

//调整原始界面
var DivObj=document.querySelectorAll("div")[0];
DivObj.style.cssText = "    display: flex;    position: relative;    top: "+(((allGroups.length)*30)+50)+"px;";
document.querySelectorAll("table")[1].style.cssText = "  flex: 7; height: 200px;";
document.querySelectorAll("body")[0].style.cssText = "margin: 0;";

function getSelectedGroups() {
    const selectedOptions = Array.from(dropdownMenu.selectedOptions).map(option => option.text);
    console.log("所选群组:", selectedOptions);
    // 在这里可以进行进一步的操作，比如发送数据到服务器或执行其他逻辑
    // 定义要查找的群组
    const targetGroups = selectedOptions;

    // 过滤数据
    const filteredData = Khdata.filter(item => {
        return targetGroups.some(group => item["所在群组"].includes(group));
    });

    // 输出过滤后的数据
    console.log(filteredData);

    //客户数据处理
    var Khdatas = filteredData;
    const AnalysisRows = [];
    let 客户手机号码 = '';
    for (let i = 0; i < Khdatas.length; i++) {
        AnalysisRows.push(`<tr><td>${i}</td><td>${Khdatas[i].手机号码}</td><td>${Khdatas[i].所在群组}</td></tr>`);
        客户手机号码 += Khdatas[i].手机号码 + "\n";
    };
    客户数据.innerHTML = AnalysisRows.join('');
    Khsjhm.textContent = 客户手机号码;
    KhStats.innerHTML = `<tr><td colspan='5'>共计 <strong style='color:red;'>${Khdatas.length}</strong> 条数据</td></tr>`;
    document.querySelectorAll("caption")[0].innerHTML=`客户数据（<strong style="color:red;">${Khdatas.length}</strong>）条`;
}






