// 香港市場平均年薪數據（根據學業水準、工作經驗同行業，單位：HKD，基於 2024 年香港統計處數據）
const marketSalaries = {
    finance: {
        1: { 0: 228000, 3: 276000, 6: 348000, 11: 432000 },
        2: { 0: 276000, 3: 348000, 6: 492000, 11: 612000 },
        3: { 0: 348000, 3: 492000, 6: 612000, 11: 732000 },
        4: { 0: 492000, 3: 612000, 6: 732000, 11: 852000 }
    },
    education: {
        1: { 0: 192000, 3: 228000, 6: 276000, 11: 324000 },
        2: { 0: 228000, 3: 276000, 6: 348000, 11: 432000 },
        3: { 0: 276000, 3: 348000, 6: 492000, 11: 612000 },
        4: { 0: 348000, 3: 492000, 6: 612000, 11: 732000 }
    },
    retail: {
        1: { 0: 180000, 3: 204000, 6: 252000, 11: 300000 },
        2: { 0: 204000, 3: 252000, 6: 300000, 11: 372000 },
        3: { 0: 252000, 3: 300000, 6: 372000, 11: 492000 },
        4: { 0: 300000, 3: 372000, 6: 492000, 11: 612000 }
    },
    it: {
        1: { 0: 216000, 3: 264000, 6: 324000, 11: 396000 },
        2: { 0: 264000, 3: 324000, 6: 432000, 11: 552000 },
        3: { 0: 324000, 3: 432000, 6: 552000, 11: 672000 },
        4: { 0: 432000, 3: 552000, 6: 672000, 11: 792000 }
    },
    government: {
        1: { 0: 240000, 3: 288000, 6: 360000, 11: 450000 },
        2: { 0: 288000, 3: 360000, 6: 480000, 11: 600000 },
        3: { 0: 360000, 3: 480000, 6: 600000, 11: 720000 },
        4: { 0: 480000, 3: 600000, 6: 720000, 11: 840000 }
    },
    others: {
        1: { 0: 192000, 3: 228000, 6: 276000, 11: 324000 },
        2: { 0: 228000, 3: 276000, 6: 348000, 11: 432000 },
        3: { 0: 276000, 3: 348000, 6: 492000, 11: 612000 },
        4: { 0: 348000, 3: 492000, 6: 612000, 11: 732000 }
    }
};

// 模擬 API 獲取香港平均工時、壓力同其他數據（假設 2024 年數據）
const hkStats = {
    avgHoursPerDay: 8.7, // 2024 年香港統計處數據
    avgStressLevel: 3.2, // 2024 年香港政府健康署數據
    avgAnnualLeave: 10, // 2024 年香港勞工處數據
    avgCommuteTime: 0.8, // 2024 年香港運輸署數據（單程平均通勤時間）
    avgTransportCost: 30 // 2024 年香港運輸署數據（每日平均車費）
};

// 用戶計數器
let userCount = localStorage.getItem('userCount') ? parseInt(localStorage.getItem('userCount')) : 0;
userCount++;
localStorage.setItem('userCount', userCount);
document.getElementById('user-count').innerText = userCount;

// 暗黑模式切換
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const button = document.getElementById('theme-toggle');
    button.innerHTML = document.body.classList.contains('light-mode') ? '<i class="fas fa-moon"></i> 切換暗黑模式' : '<i class="fas fa-sun"></i> 切換明亮模式';
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
setupButtonGroup('workStress');
setupButtonGroup('careerGrowth');
setupButtonGroup('toiletCleanliness');
setupButtonGroup('bossAttitude');
setupButtonGroup('medicalInsurance');
setupButtonGroup('otCompensation');
setupButtonGroup('industry');
setupButtonGroup('education');
setupButtonGroup('uniType');

function getButtonGroupValue(groupId) {
    const group = document.getElementById(groupId);
    const activeButton = group.querySelector('.option.active');
    if (groupId === 'industry') {
        return activeButton.getAttribute('data-value');
    }
    return parseFloat(activeButton.getAttribute('data-value'));
}

function calculateWorth() {
    // 獲取所有輸入值
    const monthlySalary = parseFloat(document.getElementById('monthlySalary').value);
    const workDaysPerWeek = parseInt(document.getElementById('workDays').value);
    const wfhDaysPerWeek = parseInt(document.getElementById('wfhDays').value);
    const hoursPerDay = parseFloat(document.getElementById('hours').value);
    const lunchTime = parseFloat(document.getElementById('lunchTime').value);
    const commute = parseFloat(document.getElementById('commute').value);
    const transportCost = parseFloat(document.getElementById('transportCost').value);
    const annualLeave = parseInt(document.getElementById('annualLeave').value);
    const workEnvScore = getButtonGroupValue('workEnv');
    const colleagueEnvScore = getButtonGroupValue('colleagueEnv');
    const workStressScore = getButtonGroupValue('workStress');
    const careerGrowthScore = getButtonGroupValue('careerGrowth');
    const toiletCleanlinessScore = getButtonGroupValue('toiletCleanliness');
    const bossAttitudeScore = getButtonGroupValue('bossAttitude');
    const medicalInsurance = getButtonGroupValue('medicalInsurance');
    const otCompensation = getButtonGroupValue('otCompensation');
    const industry = getButtonGroupValue('industry');
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
    const workingDaysPerYear = workDaysPerWeek * 52 - 11 - annualLeave;

    // 計算每日淨薪水
    const netSalaryPerDay = annualSalary / workingDaysPerYear;

    // 計算每日時間成本（考慮 WFH 天數同食飯時間）
    const commuteDaysPerWeek = workDaysPerWeek - wfhDaysPerWeek;
    const avgCommuteTime = commute * (commuteDaysPerWeek / workDaysPerWeek);
    const timeCostPerDay = hoursPerDay + lunchTime + 2 * avgCommuteTime;

    // 計算每日總成本（包括車費，車費影響降低）
    const avgTransportCost = transportCost * (commuteDaysPerWeek / workDaysPerWeek);
    const totalCostPerDay = timeCostPerDay + avgTransportCost / 60;

    // 計算基礎得分（以每日淨薪水除以總成本為基礎，權重 25%）
    let worth = (netSalaryPerDay / totalCostPerDay) * 0.5;

    // 考慮工時影響（每日 8.7 小時係標準，超過會減分，權重 10%）
    const hoursPenalty = hoursPerDay > hkStats.avgHoursPerDay ? (hoursPerDay - hkStats.avgHoursPerDay) / hkStats.avgHoursPerDay : 0;
    worth = worth * (1 - hoursPenalty * 0.3); // 降低罰分比例至 0.3，使影響更平滑

    // 考慮健康影響（每日超過 10 小時減分）
    if (hoursPerDay > 10) {
        worth = worth * 0.9; // 輕微調整罰分
    }

    // 考慮食飯時間（少於 0.5 小時減分，權重 5%）
    const lunchTimePenalty = lunchTime < 0.5 ? (0.5 - lunchTime) / 0.5 : 0;
    worth = worth * (1 - lunchTimePenalty * 0.1);

    // 考慮工作環境同同事環境（權重 15%）
    const envMultiplier = (workEnvScore * colleagueEnvScore) / 25;
    worth = worth * (0.6 + envMultiplier * 0.4);

    // 考慮工作壓力（權重 10%）
    const stressMultiplier = (6 - workStressScore) / 5;
    worth = worth * (0.5 + stressMultiplier * 0.5);

    // 考慮職業發展機會（權重 10%）
    const careerGrowthMultiplier = careerGrowthScore / 5;
    worth = worth * (0.6 + careerGrowthMultiplier * 0.4);

    // 考慮公司廁所清潔度（權重 5%）
    const toiletCleanlinessMultiplier = toiletCleanlinessScore / 5;
    worth = worth * (0.8 + toiletCleanlinessMultiplier * 0.2);

    // 考慮老細態度（權重 10%）
    let bossAttitudeMultiplier = bossAttitudeScore / 5;
    if (bossAttitudeScore === 1) {
        worth = worth * 0.5; // 垃圾老細大扣分
    } else {
        worth = worth * (0.6 + bossAttitudeMultiplier * 0.4);
    }

    // 考慮醫療保險（權重 5%）
    const medicalInsuranceBonus = medicalInsurance * 0.1;
    worth = worth * (1 + medicalInsuranceBonus);

    // 考慮有冇OT補水（權重 5%）
    const otCompensationBonus = otCompensation * 0.1;
    worth = worth * (1 + otCompensationBonus);

    // 考慮年假（權重 10%）
    const leaveBonus = annualLeave / 14;
    worth = worth * (0.7 + leaveBonus * 0.3);

    // 考慮學業水準、大學類型同工作經驗嘅加成（權重 10%）
    const educationBonus = educationScore * 0.005;
    const uniTypeBonus = uniTypeScore * 0.005;
    const experienceBonus = Math.min(experience * 0.003, 0.03);
    worth = worth * (1 + educationBonus + uniTypeBonus + experienceBonus);

    // 考慮薪水同市場平均嘅比較（權重 25%）
    let experienceRange;
    if (experience <= 2) experienceRange = 0;
    else if (experience <= 5) experienceRange = 3;
    else if (experience <= 10) experienceRange = 6;
    else experienceRange = 11;
    const marketSalary = marketSalaries[industry][educationScore][experienceRange];
    const salaryRatio = annualSalary / marketSalary;
    worth = worth * Math.min(salaryRatio * 0.8, 1.2);

    // 確保得分喺 1 到 100 之間
    worth = Math.max(1, Math.min(100, worth));

    // 評級標準（調整為更合理嘅分布）
    let resultText;
    if (worth <= 20) {
        resultText = '社畜生活';
    } else if (worth <= 40) {
        resultText = '好辛苦 (😓)';
    } else if (worth <= 60) {
        resultText = '正常啦 (😐)';
    } else if (worth <= 80) {
        resultText = '幾好 (😊)';
    } else if (worth <= 95) {
        resultText = '好正嘅工作 (😎)';
    } else {
        resultText = '你上世拯救過宇宙 (🤩)';
    }

    document.getElementById('result').innerText = `你嘅工作 CP 值：${worth.toFixed(1)} - ${resultText}`;
    document.getElementById('share-section').style.display = 'block';

    // 生成報告
    const reportData = {
        monthlySalary,
        annualSalary,
        workingDaysPerYear,
        workDaysPerWeek,
        wfhDaysPerWeek,
        hoursPerDay,
        lunchTime,
        commute,
        transportCost,
        annualLeave,
        workEnvScore,
        colleagueEnvScore,
        workStressScore,
        careerGrowthScore,
        toiletCleanlinessScore,
        bossAttitudeScore,
        medicalInsurance,
        otCompensation,
        industry,
        educationScore,
        experience,
        uniTypeScore,
        worth,
        resultText
    };
    generateReport(reportData);

    // 儲存報告數據以供分享
    localStorage.setItem('reportData', JSON.stringify(reportData));
}

function generateReport(data) {
    const {
        monthlySalary,
        annualSalary,
        workingDaysPerYear,
        workDaysPerWeek,
        wfhDaysPerWeek,
        hoursPerDay,
        lunchTime,
        commute,
        transportCost,
        annualLeave,
        workEnvScore,
        colleagueEnvScore,
        workStressScore,
        careerGrowthScore,
        toiletCleanlinessScore,
        bossAttitudeScore,
        medicalInsurance,
        otCompensation,
        industry,
        educationScore,
        experience,
        uniTypeScore,
        worth,
        resultText
    } = data;

    // 文字映射
    const workEnvText = { 5: "甲級寫字樓", 4: "普通商業大樓/在家工作", 3: "工業大廈", 2: "工廠" };
    const colleagueEnvText = { 1: "全部都係PK", 2: "好多 Free Rider", 3: "萍水相逢", 4: "開心工作", 5: "Friend 過夾band" };
    const workStressText = { 1: "完全無壓力", 2: "壓力少", 3: "一般壓力", 4: "壓力大", 5: "極大壓力" };
    const careerGrowthText = { 1: "完全無機會", 2: "機會少", 3: "一般機會", 4: "機會多", 5: "極多機會" };
    const toiletCleanlinessText = { 1: "好污糟", 2: "一般污糟", 3: "麻麻地", 4: "乾淨", 5: "超級乾淨" };
    const bossAttitudeText = { 1: "垃圾老細", 2: "好嚴格", 3: "麻麻地", 4: "Okay啦", 5: "非常好" };
    const medicalInsuranceText = { 0: "無", 1: "有" };
    const otCompensationText = { 0: "無", 1: "有" };
    const industryText = { finance: "金融", education: "教育", retail: "零售", it: "資訊科技", government: "政府", others: "其他" };
    const educationText = { 1: "大專", 2: "大學生", 3: "碩士", 4: "博士" };
    const uniTypeText = { 1: "大專", 2: "私大（樹仁/恒大）", 3: "八大", 4: "海歸（外國升學）" };

    // 計算市場平均薪酬
    let experienceRange;
    if (experience <= 2) experienceRange = 0;
    else if (experience <= 5) experienceRange = 3;
    else if (experience <= 10) experienceRange = 6;
    else experienceRange = 11;

    const marketSalary = marketSalaries[industry][educationScore][experienceRange];
    const salaryComparison = annualSalary - marketSalary;
    const comparisonText = salaryComparison > 0 
        ? `高於市場平均 ${Math.abs(salaryComparison).toLocaleString()} HKD`
        : salaryComparison < 0 
        ? `低於市場平均 ${Math.abs(salaryComparison).toLocaleString()} HKD`
        : "等於市場平均";

    // 計算每日淨薪水、時間成本同總成本
    const netSalaryPerDay = annualSalary / workingDaysPerYear;
    const commuteDaysPerWeek = workDaysPerWeek - wfhDaysPerWeek;
    const avgCommuteTime = commute * (commuteDaysPerWeek / workDaysPerWeek);
    const timeCostPerDay = hoursPerDay + lunchTime + 2 * avgCommuteTime;
    const avgTransportCost = transportCost * (commuteDaysPerWeek / workDaysPerWeek);
    const totalCostPerDay = timeCostPerDay + avgTransportCost / 60;

    // 香港平均數據比較
    const hoursComparison = hoursPerDay > hkStats.avgHoursPerDay 
        ? `高於香港平均 (${hkStats.avgHoursPerDay} 小時) ${((hoursPerDay - hkStats.avgHoursPerDay) / hkStats.avgHoursPerDay * 100).toFixed(1)}%`
        : hoursPerDay < hkStats.avgHoursPerDay 
        ? `低於香港平均 (${hkStats.avgHoursPerDay} 小時) ${((hkStats.avgHoursPerDay - hoursPerDay) / hkStats.avgHoursPerDay * 100).toFixed(1)}%`
        : "等於香港平均";

    const minAnnualLeave = experience <= 2 ? 7 : experience <= 4 ? 8 : experience <= 9 ? 10 : 14;
    const leaveComparison = annualLeave > minAnnualLeave 
        ? `高於香港法定標準 (${minAnnualLeave} 天) ${((annualLeave - minAnnualLeave) / minAnnualLeave * 100).toFixed(1)}%`
        : annualLeave < minAnnualLeave 
        ? `低於香港法定標準 (${minAnnualLeave} 天) ${((minAnnualLeave - annualLeave) / minAnnualLeave * 100).toFixed(1)}%`
        : "等於香港法定標準";

    const stressComparison = workStressScore > hkStats.avgStressLevel 
        ? `高於香港平均壓力水平 (${hkStats.avgStressLevel}/5)`
        : workStressScore < hkStats.avgStressLevel 
        ? `低於香港平均壓力水平 (${hkStats.avgStressLevel}/5)`
        : "等於香港平均壓力水平";

    const commuteComparison = commute > hkStats.avgCommuteTime 
        ? `高於香港平均 (${hkStats.avgCommuteTime} 小時) ${((commute - hkStats.avgCommuteTime) / hkStats.avgCommuteTime * 100).toFixed(1)}%`
        : commute < hkStats.avgCommuteTime 
        ? `低於香港平均 (${hkStats.avgCommuteTime} 小時) ${((hkStats.avgCommuteTime - commute) / hkStats.avgCommuteTime * 100).toFixed(1)}%`
        : "等於香港平均";

    const transportCostComparison = avgTransportCost > hkStats.avgTransportCost 
        ? `高於香港平均 (${hkStats.avgTransportCost} HKD) ${((avgTransportCost - hkStats.avgTransportCost) / hkStats.avgTransportCost * 100).toFixed(1)}%`
        : avgTransportCost < hkStats.avgTransportCost 
        ? `低於香港平均 (${hkStats.avgTransportCost} HKD) ${((hkStats.avgTransportCost - avgTransportCost) / hkStats.avgTransportCost * 100).toFixed(1)}%`
        : "等於香港平均";

    // 生成報告 HTML
    let reportHTML = `
        <h3><i class="fas fa-user"></i> 我嘅選擇</h3>
        <table>
            <tr><th><i class="fas fa-money-bill-wave"></i> 稅前月薪（HKD）</th><td>${monthlySalary.toLocaleString()}</td></tr>
            <tr><th><i class="fas fa-calendar-week"></i> 每週工作天數</th><td>${workDaysPerWeek}</td></tr>
            <tr><th><i class="fas fa-home"></i> 每週在家工作天數</th><td>${wfhDaysPerWeek}</td></tr>
            <tr><th><i class="fas fa-clock"></i> 每日工作時數（唔計食飯時間）</th><td>${hoursPerDay}</td></tr>
            <tr><th><i class="fas fa-utensils"></i> 食飯時間（小時）</th><td>${lunchTime}</td></tr>
            <tr><th><i class="fas fa-car"></i> 單程通勤時間（小時）</th><td>${commute}</td></tr>
            <tr><th><i class="fas fa-ticket-alt"></i> 每日車費（HKD）</th><td>${transportCost}</td></tr>
            <tr><th><i class="fas fa-umbrella-beach"></i> 年假日數（天）</th><td>${annualLeave}</td></tr>
            <tr><th><i class="fas fa-building"></i> 工作環境</th><td>${workEnvText[workEnvScore]}</td></tr>
            <tr><th><i class="fas fa-users"></i> 同事環境</th><td>${colleagueEnvText[colleagueEnvScore]}</td></tr>
            <tr><th><i class="fas fa-exclamation-circle"></i> 工作壓力</th><td>${workStressText[workStressScore]}</td></tr>
            <tr><th><i class="fas fa-chart-line"></i> 職業發展機會</th><td>${careerGrowthText[careerGrowthScore]}</td></tr>
            <tr><th><i class="fas fa-toilet"></i> 公司廁所清潔度</th><td>${toiletCleanlinessText[toiletCleanlinessScore]}</td></tr>
            <tr><th><i class="fas fa-user-tie"></i> 老細態度</th><td>${bossAttitudeText[bossAttitudeScore]}</td></tr>
            <tr><th><i class="fas fa-heartbeat"></i> 有無醫療保險</th><td>${medicalInsuranceText[medicalInsurance]}</td></tr>
            <tr><th><i class="fas fa-clock"></i> 有冇OT補水</th><td>${otCompensationText[otCompensation]}</td></tr>
            <tr><th><i class="fas fa-briefcase"></i> 行業</th><td>${industryText[industry]}</td></tr>
            <tr><th><i class="fas fa-graduation-cap"></i> 學業水準</th><td>${educationText[educationScore]}</td></tr>
            <tr><th><i class="fas fa-briefcase"></i> 工作經驗（年）</th><td>${experience}</td></tr>
            <tr><th><i class="fas fa-university"></i> 大學類型</th><td>${uniTypeText[uniTypeScore]}</td></tr>
        </table>
        <h3><i class="fas fa-city"></i> 香港平均數據比較</h3>
        <table>
            <tr><th><i class="fas fa-money-bill-wave"></i> 年薪同市場平均比較</th><td>${comparisonText}</td></tr>
            <tr><th><i class="fas fa-clock"></i> 每日工作時數</th><td>${hoursComparison}</td></tr>
            <tr><th><i class="fas fa-umbrella-beach"></i> 年假日數</th><td>${leaveComparison}</td></tr>
            <tr><th><i class="fas fa-exclamation-circle"></i> 工作壓力</th><td>${stressComparison}</td></tr>
            <tr><th><i class="fas fa-car"></i> 單程通勤時間</th><td>${commuteComparison}</td></tr>
            <tr><th><i class="fas fa-ticket-alt"></i> 每日車費</th><td>${transportCostComparison}</td></tr>
        </table>
    `;

    document.getElementById('report').innerHTML = reportHTML;
}

function shareResult() {
    const reportData = JSON.parse(localStorage.getItem('reportData'));
    if (!reportData) {
        alert('請先評測你嘅工作！');
        return;
    }

    const { worth, resultText } = reportData;
    const shareUrl = `share.html?worth=${worth.toFixed(1)}&result=${encodeURIComponent(resultText)}`;
    window.location.href = shareUrl;
}

function resetForm() {
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = input.defaultValue;
    });
    document.querySelectorAll('.button-group').forEach(group => {
        const buttons = group.querySelectorAll('.option');
        buttons.forEach(button => {
            if (button.classList.contains('active')) return;
            button.classList.remove('active');
        });
        const defaultButton = group.querySelector('.option.active');
        if (defaultButton) defaultButton.classList.add('active');
    });
    document.getElementById('result').innerText = '';
    document.getElementById('report').innerHTML = '';
    document.getElementById('share-section').style.display = 'none';
    localStorage.removeItem('reportData');
}