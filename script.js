function calculateWorth() {
    // 獲取所有輸入值
    const monthlySalary = parseFloat(document.getElementById('monthlySalary').value);
    const workDaysPerWeek = parseInt(document.getElementById('workDays').value);
    const wfhDaysPerWeek = parseInt(document.getElementById('wfhDays').value);
    const hoursPerDay = parseFloat(document.getElementById('hours').value);
    const commute = parseFloat(document.getElementById('commute').value);
    const transportCost = parseFloat(document.getElementById('transportCost').value);
    const annualLeave = parseInt(document.getElementById('annualLeave').value);
    const workEnvScore = parseFloat(document.getElementById('workEnv').value);
    const colleagueEnvScore = parseFloat(document.getElementById('colleagueEnv').value);
    const educationScore = parseFloat(document.getElementById('education').value);
    const experience = parseFloat(document.getElementById('experience').value);
    const uniTypeScore = parseFloat(document.getElementById('uniType').value);

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
    const totalCostPerDay = timeCostPerDay + avgTransportCost / 60; // 假設每小時成本 60 HKD

    // 計算基礎得分
    let worth = (netSalaryPerDay / totalCostPerDay) * workEnvScore * colleagueEnvScore / 10;

    // 考慮學業水準、大學類型同工作經驗嘅加成
    const educationBonus = educationScore * 0.1; // 每級加 0.1
    const uniTypeBonus = uniTypeScore * 0.1; // 每級加 0.1
    const experienceBonus = experience * 0.05; // 每一年加 0.05
    worth = worth * (1 + educationBonus + uniTypeBonus + experienceBonus);

    // 顯示結果
    let resultText;
    if (worth < 1.0) {
        resultText = '非常差 (😱)';
    } else if (worth >= 1.0 && worth < 1.8) {
        resultText = '一般 (😐)';
    } else if (worth >= 1.8 && worth < 2.5) {
        resultText = '很好 (😎)';
    } else {
        resultText = '超級好 (🤩)';
    }

    document.getElementById('result').innerText = `你的工作性價比：${worth.toFixed(2)} - ${resultText}`;
}

function resetForm() {
    document.getElementById('monthlySalary').value = '';
    document.getElementById('workDays').value = 5;
    document.getElementById('wfhDays').value = 0;
    document.getElementById('hours').value = 8;
    document.getElementById('commute').value = 0.5;
    document.getElementById('transportCost').value = 0;
    document.getElementById('annualLeave').value = 7;
    document.getElementById('workEnv').value = 5;
    document.getElementById('colleagueEnv').value = 3;
    document.getElementById('education').value = 1;
    document.getElementById('experience').value = 0;
    document.getElementById('uniType').value = 1;
    document.getElementById('result').innerText = '';
}