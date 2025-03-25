function calculateWorth() {
    const salary = parseFloat(document.getElementById('salary').value);
    const workDaysPerWeek = parseInt(document.getElementById('workDays').value);
    const hoursPerDay = parseFloat(document.getElementById('hours').value);
    const commute = parseFloat(document.getElementById('commute').value);
    const envScore = parseFloat(document.getElementById('env').value);
    const colleagueScore = parseFloat(document.getElementById('colleague').value);

    const workingDaysPerYear = workDaysPerWeek * 52 - 11; // 11 public holidays in HK
    const netSalary = salary / workingDaysPerYear;
    const timeCostPerDay = hoursPerDay + 2 * commute; // Round trip commute
    const worth = (netSalary / timeCostPerDay) * envScore * colleagueScore / 10; // Normalize

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