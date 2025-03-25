// 香港市場平均年薪數據（根據學業水準同工作經驗，單位：HKD）
const marketSalaries = {
    1: { // 大專
        0: 180000, // 0-2 年經驗
        3: 240000, // 3-5 年
        6: 300000, // 6-10 年
        11: 360000  // 11+ 年
    },
    2: { // 大學生
        0: 240000,
        3: 300000,
        6: 420000,
        11: 540000
    },
    3: { // 碩士
        0: 300000,
        3: 420000,
        6: 600000,
        11: 780000
    },
    4: { // 博士
        0: 360000,
        3: 540000,
        6: 780000,
        11: 960000
    }
};

// 工作環境同同事環境嘅文字映射
const workEnvText = {
    5: "甲級寫字樓",
    4: "普通商業大樓/在家工作",
    3: "工業大廈",
    2: "工廠"
};

const colleagueEnvText = {
    1: "全部都係PK",
    2: "好多 Free Rider",
    3: "萍水相逢",
    4: "開心工作",
    5: "Friend 過夾band"
};

const educationText = {
    1: "大專",
    2: "大學生",
    3: "碩士",
    4: "博士"
};

const uniTypeText = {
    1: "大專",
    2: "私大（樹仁/恒大）",
    3: "八大",
    4: "海歸（外國升學）"
};

// 暗黑模式切換
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.querySelector('header').classList.toggle('dark-mode');
    document.querySelector('.form-section').classList.toggle('dark-mode');
    document.querySelector('.result-section').classList.toggle('dark-mode');
    document.querySelector('#result').classList.toggle('dark-mode');
    document.querySelector('#report').classList.toggle('dark-mode');
    document.querySelectorAll('input[type="number"]').forEach(input => input.classList.toggle('dark-mode'));
    const button = document.getElementById('theme-toggle');
    button.textContent = document.body.classList.contains('dark-mode') ? '切換明亮模式' : '切換暗黑模式';
});

// 按鈕選擇邏輯
function setupButtonGroup(groupId) {
    const group = document.getElementById(groupId);
    const buttons = group.querySelectorAll('.option');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

setupButtonGroup('workEnv');
setupButtonGroup('colleagueEnv');
setupButtonGroup('education');
setupButtonGroup('uniType');

function getButtonGroupValue(groupId) {
    const group = document.getElementById(groupId);
    const activeButton = group.querySelector('.option.active');
    return parseFloat(activeButton.getAttribute('data-value'));
}

function calculateWorth() {
    // 獲取所有輸入值
    const monthlySalary = parseFloat(document.getElementById('monthlySalary').value);
    const workDaysPerWeek = parseInt(document.getElementById('workDays').value);
    const wfhDaysPerWeek = parseInt(document.getElementById('wfhDays').value);
    const hoursPerDay = parseFloat(document.getElementById('hours').value);
    const commute = parseFloat(document.getElementById('commute').value);
    const transportCost = parseFloat(document.getElementById('transportCost').value);
    const annualLeave = parseInt(document.getElementById('annualLeave').value);
    const workEnvScore = getButtonGroupValue('workEnv');
    const colleagueEnvScore = getButtonGroupValue('colleagueEnv');
    const educationScore = getButtonGroupValue('education');
    const experience = parseFloat(document.getElementById('experience').value);
    const uniTypeScore = getButtonGroupValue('uniType');

    // 輸入驗證
    if (!monthlySalary || monthlySalary <= 0) {
        document.getElementById('result').innerText = '請輸入有效嘅稅前月薪！';
        return;
    }

    // 計算年薪
    const annualSalary = monthlySalary * 12;

    // 計算每年工作日數（考慮年假同公眾假期）
    const workingDaysPerYear = workDaysPerWeek * 52 - 11 - annualLeave; // 11 係香港公眾假期

    // 計算每日淨薪水
    const netSalaryPerDay = annualSalary / workingDaysPerYear;

    // 計算每日時間成本（考慮 WFH 天數）
    const commuteDaysPerWeek = workDaysPerWeek - wfhDaysPerWeek;
    const avgCommuteTime = commute * (commuteDaysPerWeek / workDaysPerWeek); // 平均通勤時間
    const timeCostPerDay = hoursPerDay + 2 * avgCommuteTime; // 來回通勤

    // 計算每日總成本（包括車費）
    const avgTransportCost = transportCost * (commuteDaysPerWeek / workDaysPerWeek);
    const totalCostPerDay = timeCostPerDay + avgTransportCost / 50; // 假設每小時成本 50 HKD

    // 計算基礎得分（以每日淨薪水除以總成本為基礎）
    let worth = (netSalaryPerDay / totalCostPerDay) * 1; // 乘以 1 作為基礎得分（降低基礎得分影響）

    // 考慮工作環境同同事環境（作為乘數，範圍 0.05 至 1.25）
    const envMultiplier = (workEnvScore * colleagueEnvScore) / 20; // 最大值 5*5=25，範圍 0.05 至 1.25（增加環境影響）
    worth = worth * envMultiplier;

    // 考慮年假（年假越多，得分越高）
    const leaveBonus = annualLeave / 14; // 假設 14 天係標準，範圍 0 至 2（假設最多 28 天）
    worth = worth * (1 + leaveBonus * 0.05); // 年假加成最多 0.1（降低加成影響）

    // 考慮學業水準、大學類型同工作經驗嘅加成（每項最多加 0.03）
    const educationBonus = educationScore * 0.0075; // 每級加 0.0075，最大 0.03
    const uniTypeBonus = uniTypeScore * 0.0075; // 每級加 0.0075，最大 0.03
    const experienceBonus = Math.min(experience * 0.003, 0.03); // 每一年加 0.003，最大 0.03
    worth = worth * (1 + educationBonus + uniTypeBonus + experienceBonus);

    // 考慮薪水同市場平均嘅比較
    let experienceRange;
    if (experience <= 2) experienceRange = 0;
    else if (experience <= 5) experienceRange = 3;
    else if (experience <= 10) experienceRange = 6;
    else experienceRange = 11;
    const marketSalary = marketSalaries[educationScore][experienceRange];
    const salaryRatio = annualSalary / marketSalary;
    worth = worth * Math.min(salaryRatio * 1.2, 1.5); // 薪水比市場平均低會大幅降低得分，高最多加 50%（增加薪水影響）

    // 確保得分喺 1 到 100 之間
    worth = Math.max(1, Math.min(100, worth));

    // 評級標準
    let resultText;
    if (worth <= 20) {
        resultText = '你需要走人 (😱)';
    } else if (worth <= 40) {
        resultText = '好辛苦 (😓)';
    } else if (worth <= 60) {
        resultText = '正常啦 (😐)';
    } else if (worth <= 80) {
        resultText = '幾好 (😊)';
    } else if (worth <= 90) {
        resultText = '好正嘅工作 (😎)';
    } else {
        resultText = '你上世救宇宙 (🤩)';
    }

    document.getElementById('result').innerText = `你的工作性價比：${worth.toFixed(2)} - ${resultText}`;

    // 生成報告
    generateReport({
        monthlySalary,
        annualSalary,
        workingDaysPerYear,
        workDaysPerWeek,
        wfhDaysPerWeek,
        hoursPerDay,
        commute,
        transportCost,
        annualLeave,
        workEnvScore,
        colleagueEnvScore,
        educationScore,
        experience,
        uniTypeScore,
        worth,
        resultText
    });
}

function generateReport(data) {
    const {
        monthlySalary,
        annualSalary,
        workingDaysPerYear,
        workDaysPerWeek,
        wfhDaysPerWeek,
        hoursPerDay,
        commute,
        transportCost,
        annualLeave,
        workEnvScore,
        colleagueEnvScore,
        educationScore,
        experience,
        uniTypeScore,
        worth,
        resultText
    } = data;

    // 計算市場平均薪酬
    let experienceRange;
    if (experience <= 2) experienceRange = 0;
    else if (experience <= 5) experienceRange = 3;
    else if (experience <= 10) experienceRange = 6;
    else experienceRange = 11;

    const marketSalary = marketSalaries[educationScore][experienceRange];
    const salaryComparison = annualSalary - marketSalary;
    const comparisonText = salaryComparison > 0 
        ? `高於市場平均 ${Math.abs(salaryComparison).toLocaleString()} HKD`
        : salaryComparison < 0 
        ? `低於市場平均 ${Math.abs(salaryComparison).toLocaleString()} HKD`
        : "等於市場平均";

    // 生成報告內容
    const report = `
        <h2>你的工作報告</h2>
        <h3>你的選擇</h3>
        <p>稅前月薪：${monthlySalary.toLocaleString()} HKD</p>
        <p>稅前年薪：${annualSalary.toLocaleString()} HKD</p>
        <p>每週工作天數：${workDaysPerWeek} 天</p>
        <p>每週在家工作天數：${wfhDaysPerWeek} 天</p>
        <p>每日工作時數：${hoursPerDay} 小時</p>
        <p>單程通勤時間：${commute} 小時</p>
        <p>每日車費：${transportCost} HKD</p>
        <p>年假日數：${annualLeave} 天</p>
        <p>工作環境：${workEnvText[workEnvScore]}</p>
        <p>同事環境：${colleagueEnvText[colleagueEnvScore]}</p>
        <p>學業水準：${educationText[educationScore]}</p>
        <p>工作經驗：${experience} 年</p>
        <p>大學類型：${uniTypeText[uniTypeScore]}</p>
        <h3>工作分析</h3>
        <p>你的工作性價比：${worth.toFixed(2)} - ${resultText}</p>
        <h3>市場比較</h3>
        <p>根據你的學業水準 (${educationText[educationScore]}) 同工作經驗 (${experience} 年)，香港市場平均年薪為 ${marketSalary.toLocaleString()} HKD。</p>
        <p>你的年薪 (${annualSalary.toLocaleString()} HKD) ${comparisonText}。</p>
    `;

    document.getElementById('report').innerHTML = report;
}

function resetForm() {
    document.getElementById('monthlySalary').value = '';
    document.getElementById('workDays').value = 5;
    document.getElementById('wfhDays').value = 0;
    document.getElementById('hours').value = 8;
    document.getElementById('commute').value = 0.5;
    document.getElementById('transportCost').value = 0;
    document.getElementById('annualLeave').value = 7;
    document.getElementById('experience').value = 0;
    document.getElementById('result').innerText = '';
    document.getElementById('report').innerHTML = '';

    // 重設按鈕選擇
    ['workEnv', 'colleagueEnv', 'education', 'uniType'].forEach(groupId => {
        const group = document.getElementById(groupId);
        const buttons = group.querySelectorAll('.option');
        buttons.forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-value') === (groupId === 'workEnv' ? '5' : groupId === 'colleagueEnv' ? '3' : '1')) {
                button.classList.add('active');
            }
        });
    });
}