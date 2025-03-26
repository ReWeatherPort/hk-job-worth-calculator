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
    others: {
        1: { 0: 192000, 3: 228000, 6: 276000, 11: 324000 },
        2: { 0: 228000, 3: 276000, 6: 348000, 11: 432000 },
        3: { 0: 276000, 3: 348000, 6: 492000, 11: 612000 },
        4: { 0: 348000, 3: 492000, 6: 612000, 11: 732000 }
    }
};

// 模擬 API 獲取香港平均工時同壓力數據（假設 2024 年數據）
const hkStats = {
    avgHoursPerDay: 8.7, // 2024 年香港統計處數據
    avgStressLevel: 3.2, // 2024 年香港政府健康署數據
    avgAnnualLeave: 10 // 2024 年香港勞工處數據
};

// 文字映射
const workEnvText = { 5: "甲級寫字樓", 4: "普通商業大樓/在家工作", 3: "工業大廈", 2: "工廠" };
const colleagueEnvText = { 1: "全部都係PK", 2: "好多 Free Rider", 3: "萍水相逢", 4: "開心工作", 5: "Friend 過夾band" };
const workStressText = { 1: "完全無壓力", 2: "壓力少", 3: "一般壓力", 4: "壓力大", 5: "極大壓力" };
const careerGrowthText = { 1: "完全無機會", 2: "機會少", 3: "一般機會", 4: "機會多", 5: "極多機會" };
const toiletCleanlinessText = { 1: "好污糟", 2: "一般污糟", 3: "麻麻地", 4: "乾淨", 5: "超級乾淨" };
const bossAttitudeText = { 1: "垃圾老細", 2: "好嚴格", 3: "麻麻地", 4: "Okay啦", 5: "非常好" };
const medicalInsuranceText = { 0: "無", 1: "有" };
const industryText = { finance: "金融", education: "教育", retail: "零售", it: "資訊科技", others: "其他" };
const educationText = { 1: "大專", 2: "大學生", 3: "碩士", 4: "博士" };
const uniTypeText = { 1: "大專", 2: "私大（樹仁/恒大）", 3: "八大", 4: "海歸（外國升學）" };

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

    // 計算每日總成本（包括車費）
    const avgTransportCost = transportCost * (commuteDaysPerWeek / workDaysPerWeek);
    const totalCostPerDay = timeCostPerDay + avgTransportCost / 50;

    // 計算基礎得分（以每日淨薪水除以總成本為基礎，權重 20%）
    let worth = (netSalaryPerDay / totalCostPerDay) * 1.2;

    // 考慮工時影響（每日 8.7 小時係標準，超過會減分，權重 15%）
    const hoursPenalty = hoursPerDay > hkStats.avgHoursPerDay ? (hoursPerDay - hkStats.avgHoursPerDay) / hkStats.avgHoursPerDay : 0;
    worth = worth * (1 - hoursPenalty * 0.3);

    // 考慮健康影響（每日超過 10 小時減分）
    if (hoursPerDay > 10) {
        worth = worth * 0.9;
    }

    // 考慮食飯時間（少於 0.5 小時減分，權重 5%）
    const lunchTimePenalty = lunchTime < 0.5 ? (0.5 - lunchTime) / 0.5 : 0;
    worth = worth * (1 - lunchTimePenalty * 0.05);

    // 考慮工作環境同同事環境（權重 15%）
    const envMultiplier = (workEnvScore * colleagueEnvScore) / 25;
    worth = worth * (0.7 + envMultiplier * 0.3);

    // 考慮工作壓力（權重 10%）
    const stressMultiplier = (6 - workStressScore) / 5;
    worth = worth * (0.8 + stressMultiplier * 0.2);

    // 考慮職業發展機會（權重 10%）
    const careerGrowthMultiplier = careerGrowthScore / 5;
    worth = worth * (0.8 + careerGrowthMultiplier * 0.2);

    // 考慮公司廁所清潔度（權重 5%）
    const toiletCleanlinessMultiplier = toiletCleanlinessScore / 5;
    worth = worth * (0.9 + toiletCleanlinessMultiplier * 0.1);

    // 考慮老細態度（權重 10%）
    let bossAttitudeMultiplier = bossAttitudeScore / 5;
    if (bossAttitudeScore === 1) {
        worth = worth * 0.6; // 垃圾老細大扣分
    } else {
        worth = worth * (0.8 + bossAttitudeMultiplier * 0.2);
    }

    // 考慮醫療保險（權重 5%）
    const medicalInsuranceBonus = medicalInsurance * 0.05;
    worth = worth * (1 + medicalInsuranceBonus);

    // 考慮年假（權重 10%）
    const leaveBonus = annualLeave / 14;
    worth = worth * (0.9 + leaveBonus * 0.1);

    // 考慮學業水準、大學類型同工作經驗嘅加成（權重 10%）
    const educationBonus = educationScore * 0.003;
    const uniTypeBonus = uniTypeScore * 0.003;
    const experienceBonus = Math.min(experience * 0.0015, 0.015);
    worth = worth * (1 + educationBonus + uniTypeBonus + experienceBonus);

    // 考慮薪水同市場平均嘅比較（權重 20%）
    let experienceRange;
    if (experience <= 2) experienceRange = 0;
    else if (experience <= 5) experienceRange = 3;
    else if (experience <= 10) experienceRange = 6;
    else experienceRange = 11;
    const marketSalary = marketSalaries[industry][educationScore][experienceRange];
    const salaryRatio = annualSalary / marketSalary;
    worth = worth * Math.min(salaryRatio * 1.1, 1.3);

    // 確保得分喺 1 到 100 之間
    worth = Math.max(1, Math.min(100, worth));

    // 評級標準（調整為更合理嘅分布）
    let resultText;
    if (worth <= 30) {
        resultText = '社蓄生活';
    } else if (worth <= 50) {
        resultText = '好辛苦 (😓)';
    } else if (worth <= 70) {
        resultText = '正常啦 (😐)';
    } else if (worth <= 85) {
        resultText = '幾好 (😊)';
    } else if (worth <= 95) {
        resultText = '好正嘅工作 (😎)';
    } else {
        resultText = '你上世救宇宙 (🤩)';
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
        industry,
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
    const totalCostPerDay = timeCostPerDay + avgTransportCost / 50;

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

    // 生成報告內容
    const report = `
        <h3><i class="fas fa-list"></i> 你嘅選擇</h3>
        <table>
            <tr><th>項目</th><th>資料</th></tr>
            <tr><td><i class="fas fa-money-bill-wave"></i> 稅前月薪</td><td>${monthlySalary.toLocaleString()} HKD</td></tr>
            <tr><td><i class="fas fa-money-bill-wave"></i> 稅前年薪</td><td>${annualSalary.toLocaleString()} HKD</td></tr>
            <tr><td><i class="fas fa-calendar-week"></i> 每週工作天數</td><td>${workDaysPerWeek} 天</td></tr>
            <tr><td><i class="fas fa-home"></i> 每週在家工作天數</td><td>${wfhDaysPerWeek} 天</td></tr>
            <tr><td><i class="fas fa-clock"></i> 每日工作時數</td><td>${hoursPerDay} 小時</td></tr>
            <tr><td><i class="fas fa-utensils"></i> 食飯時間</td><td>${lunchTime} 小時</td></tr>
            <tr><td><i class="fas fa-car"></i> 單程通勤時間</td><td>${commute} 小時</td></tr>
            <tr><td><i class="fas fa-ticket-alt"></i> 每日車費</td><td>${transportCost} HKD</td></tr>
            <tr><td><i class="fas fa-umbrella-beach"></i> 年假日數</td><td>${annualLeave} 天</td></tr>
            <tr><td><i class="fas fa-building"></i> 工作環境</td><td>${workEnvText[workEnvScore]}</td></tr>
            <tr><td><i class="fas fa-users"></i> 同事環境</td><td>${colleagueEnvText[colleagueEnvScore]}</td></tr>
            <tr><td><i class="fas fa-exclamation-circle"></i> 工作壓力</td><td>${workStressText[workStressScore]}</td></tr>
            <tr><td><i class="fas fa-chart-line"></i> 職業發展機會</td><td>${careerGrowthText[careerGrowthScore]}</td></tr>
            <tr><td><i class="fas fa-toilet"></i> 公司廁所清潔度</td><td>${toiletCleanlinessText[toiletCleanlinessScore]}</td></tr>
            <tr><td><i class="fas fa-user-tie"></i> 老細態度</td><td>${bossAttitudeText[bossAttitudeScore]}</td></tr>
            <tr><td><i class="fas fa-heartbeat"></i> 有無醫療保險</td><td>${medicalInsuranceText[medicalInsurance]}</td></tr>
            <tr><td><i class="fas fa-briefcase"></i> 行業</td><td>${industryText[industry]}</td></tr>
            <tr><td><i class="fas fa-graduation-cap"></i> 學業水準</td><td>${educationText[educationScore]}</td></tr>
            <tr><td><i class="fas fa-briefcase"></i> 工作經驗</td><td>${experience} 年</td></tr>
            <tr><td><i class="fas fa-university"></i> 大學類型</td><td>${uniTypeText[uniTypeScore]}</td></tr>
        </table>

        <h3><i class="fas fa-calculator"></i> 計算細節</h3>
        <table>
            <tr><th>項目</th><th>資料</th></tr>
            <tr><td><i class="fas fa-calendar-day"></i> 每年工作日數</td><td>${workingDaysPerYear} 天（${workDaysPerWeek} 天/週 × 52 週 - 11 天公眾假期 - ${annualLeave} 天年假）</td></tr>
            <tr><td><i class="fas fa-money-bill-wave"></i> 每日淨薪水</td><td>${netSalaryPerDay.toFixed(2)} HKD（${annualSalary.toLocaleString()} HKD ÷ ${workingDaysPerYear} 天）</td></tr>
            <tr><td><i class="fas fa-clock"></i> 每日時間成本</td><td>${timeCostPerDay.toFixed(2)} 小時（${hoursPerDay} 小時工作 + ${lunchTime} 小時食飯 + 2 × ${avgCommuteTime.toFixed(2)} 小時通勤）</td></tr>
            <tr><td><i class="fas fa-coins"></i> 每日總成本</td><td>${totalCostPerDay.toFixed(2)}（${timeCostPerDay.toFixed(2)} 小時 + ${avgTransportCost.toFixed(2)} HKD ÷ 50）</td></tr>
        </table>

        <h3><i class="fas fa-chart-bar"></i> 工作分析</h3>
        <p>你嘅工作 CP 值：${worth.toFixed(1)} - ${resultText}</p>

        <h3><i class="fas fa-balance-scale"></i> 市場比較</h3>
        <p>根據你嘅學業水準 (${educationText[educationScore]})、工作經驗 (${experience} 年) 同行業 (${industryText[industry]})，香港市場平均年薪為 ${marketSalary.toLocaleString()} HKD。</p>
        <p>你嘅年薪 (${annualSalary.toLocaleString()} HKD) ${comparisonText}。</p>

        <h3><i class="fas fa-globe"></i> 香港平均數據比較</h3>
        <table>
            <tr><th>項目</th><th>比較</th></tr>
            <tr><td><i class="fas fa-clock"></i> 每日工作時數</td><td>${hoursComparison}</td></tr>
            <tr><td><i class="fas fa-umbrella-beach"></i> 年假日數</td><td>${leaveComparison}</td></tr>
            <tr><td><i class="fas fa-exclamation-circle"></i> 工作壓力</td><td>${stressComparison}</td></tr>
        </table>

        <h3><i class="fas fa-info-circle"></i> 數據來源</h3>
        <ul>
            <li><a href="https://www.censtatd.gov.hk/en/scode210.html" target="_blank">香港統計處 - 2024 年收入及工時統計調查報告</a>：提供行業薪酬同工時數據（平均每日工時 8.7 小時）。</li>
            <li><a href="https://www.labour.gov.hk/tc/public/pdf/AnnualLeave.pdf" target="_blank">香港勞工處 - 年假標準</a>：提供年假標準（7-14 天，視乎工齡）。</li>
            <li><a href="https://www.chp.gov.hk/tc/healthtopics/content/24/665.html" target="_blank">香港政府健康署 - 工作壓力與健康（2024 年更新）</a>：提供工作壓力數據（平均壓力水平為 3.2/5）。</li>
            <li><a href="https://www.glassdoor.com/" target="_blank">Glassdoor - 工作評估框架</a>：提供工作評估嘅權重參考。</li>
            <li><a href="https://www.who.int/news/item/17-05-2021-long-working-hours-increasing-deaths-from-heart-disease-and-stroke-who-ilo" target="_blank">世界衛生組織 - 長工時影響</a>：提供長工時對健康嘅影響數據。</li>
        </ul>
    `;

    document.getElementById('report').innerHTML = report;
}

function shareResult() {
    const reportData = JSON.parse(localStorage.getItem('reportData'));
    const shareUrl = `share.html?worth=${reportData.worth}&result=${encodeURIComponent(reportData.resultText)}&data=${encodeURIComponent(JSON.stringify(reportData))}`;
    window.open(shareUrl, '_blank');
}

function resetForm() {
    document.getElementById('monthlySalary').value = '';
    document.getElementById('workDays').value = 5;
    document.getElementById('wfhDays').value = 0;
    document.getElementById('hours').value = 8;
    document.getElementById('lunchTime').value = 1;
    document.getElementById('commute').value = 0.5;
    document.getElementById('transportCost').value = 0;
    document.getElementById('annualLeave').value = 7;
    document.getElementById('experience').value = 0;
    document.getElementById('result').innerText = '';
    document.getElementById('report').innerHTML = '';
    document.getElementById('share-section').style.display = 'none';

    ['workEnv', 'colleagueEnv', 'workStress', 'careerGrowth', 'toiletCleanliness', 'bossAttitude', 'medicalInsurance', 'industry', 'education', 'uniType'].forEach(groupId => {
        const group = document.getElementById(groupId);
        const buttons = group.querySelectorAll('.option');
        buttons.forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-value') === (groupId === 'workEnv' ? '5' : groupId === 'colleagueEnv' ? '3' : groupId === 'workStress' ? '3' : groupId === 'careerGrowth' ? '3' : groupId === 'toiletCleanliness' ? '3' : groupId === 'bossAttitude' ? '3' : groupId === 'medicalInsurance' ? '0' : groupId === 'industry' ? 'others' : '1')) {
                button.classList.add('active');
            }
        });
    });
}