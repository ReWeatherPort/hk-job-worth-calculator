# 社畜的自我評價 v1.3 - 工作 CP 值計算器

## 簡介

呢個係一個工作 CP 值計算器，專為香港嘅社畜設計，幫你評估你嘅工作「性價比」（Cost-Performance Ratio，簡稱 CP 值）。透過輸入你嘅工作資料（例如月薪、工作時數、通勤時間等），計算器會畀你一個分數，幫你了解你嘅工作值唔值得做。

呢個工具用 HTML、CSS 同 JavaScript 開發，界面設計參考咗加密貨幣網站嘅風格，採用深色主題同動態按鈕效果，專業又現代化。

## 功能

- **輸入工作資料**：包括月薪、工作時數、通勤時間、福利、工作環境等。
- **計算 CP 值**：根據你嘅輸入，計算一個 CP 值分數（0-100 分）。
- **我嘅選擇**：展示你嘅所有輸入資料，分為「工作時間」、「福利」、「工作環境」、「個人背景」四個類別，用 Accordion 設計，方便瀏覽。
- **分享結果**：可以將你嘅 CP 值同結果分享畀朋友。

## 使用方法

1. 喺 `index.html` 入面輸入你嘅工作資料，例如：
   - 稅前月薪（HKD）
   - 每週工作天數
   - 每日工作時數
   - 通勤時間同車費
   - 工作環境、壓力、福利等
2. 點擊「計算 CP 值」按鈕，系統會即刻計算你嘅 CP 值，並顯示喺一個圓形分數圈入面。
3. 喺「我嘅選擇」部分，你可以展開同收起你嘅輸入資料，檢查你嘅選擇。
4. 點擊「分享你嘅結果」按鈕，將你嘅 CP 值同結果分享畀朋友。

## 計算公式

以下係工作 CP 值嘅計算公式同邏輯：

### 1. 基本變數計算

- **年薪（Annual Salary）**：
  \[
  \text{年薪} = \text{稅前月薪} \times 12
  \]

- **每年工作日數（Working Days Per Year）**：
  \[
  \text{每年工作日數} = \text{每週工作天數} \times 52
  \]

- **每日淨薪水（Net Salary Per Day）**：
  \[
  \text{每日淨薪水} = \frac{\text{年薪}}{\text{每年工作日數}}
  \]

- **平均通勤時間（Average Commute Time）**：
  \[
  \text{通勤日數每週} = \text{每週工作天數} - \text{每週在家工作天數}
  \]
  \[
  \text{平均通勤時間} = \text{單程通勤時間} \times \left(\frac{\text{通勤日數每週}}{\text{每週工作天數}}\right)
  \]

- **每日時間成本（Time Cost Per Day）**：
  \[
  \text{每日時間成本} = \text{每日工作時數} + \text{食飯時間} + 2 \times \text{平均通勤時間}
  \]

- **平均每日車費（Average Transport Cost）**：
  \[
  \text{平均每日車費} = \text{每日車費} \times \left(\frac{\text{通勤日數每週}}{\text{每週工作天數}}\right)
  \]

- **每日總成本（Total Cost Per Day）**：
  \[
  \text{每日總成本} = \text{每日時間成本} + \frac{\text{平均每日車費}}{60}
  \]
  （假設 1 小時嘅時間成本等於 60 HKD 嘅車費）

### 2. 基本 CP 值（Base Score）

- **基本分數（Base Score）**：
  \[
  \text{基本分數} = \left(\frac{\text{每日淨薪水}}{\text{每日總成本}}\right) \times 0.5
  \]

### 3. 調整因子（Adjustment Factors）

喺基本分數基礎上，會根據唔同嘅因素調整 CP 值：

- **工作時數因子（Hours Factor）**：
  - 如果每日工作時數 > 8 小時，會扣分：
    \[
    \text{工作時數因子} = 1 - \left(\frac{\text{每日工作時數} - 8}{8}\right) \times 0.1
    \]
  - 否則，工作時數因子 = 1。

- **工作環境因子（Environment Factor）**：
  - 根據工作環境分數（1-5）：
    \[
    \text{工作環境因子} = 1 + \left(\frac{\text{工作環境分數} - 3}{10}\right)
    \]

- **同事環境因子（Colleague Factor）**：
  - 根據同事環境分數（1-5）：
    \[
    \text{同事環境因子} = 1 + \left(\frac{\text{同事環境分數} - 3}{10}\right)
    \]

- **壓力因子（Stress Factor）**：
  - 根據工作壓力分數（1-5）：
    \[
    \text{壓力因子} = 1 - \left(\frac{\text{工作壓力分數} - 3}{10}\right)
    \]

- **職業發展因子（Career Growth Factor）**：
  - 根據職業發展機會分數（1-5）：
    \[
    \text{職業發展因子} = 1 + \left(\frac{\text{職業發展分數} - 3}{10}\right)
    \]

- **廁所清潔度因子（Toilet Cleanliness Factor）**：
  - 根據公司廁所清潔度分數（1-5）：
    \[
    \text{廁所清潔度因子} = 1 + \left(\frac{\text{廁所清潔度分數} - 3}{20}\right)
    \]

- **老細態度因子（Boss Attitude Factor）**：
  - 根據老細態度分數（1-5）：
    \[
    \text{老細態度因子} = 1 + \left(\frac{\text{老細態度分數} - 3}{10}\right)
    \]

- **醫療保險因子（Medical Insurance Factor）**：
  - 如果有醫療保險，分數加 5%：
    \[
    \text{醫療保險因子} = \text{有醫療保險} ? 1.05 : 1
    \]

- **OT 補水因子（OT Compensation Factor）**：
  - 如果有 OT 補水，分數加 5%：
    \[
    \text{OT 補水因子} = \text{有 OT 補水} ? 1.05 : 1
    \]

- **年假因子（Annual Leave Factor）**：
  - 根據年假日數同工作經驗比較：
    \[
    \text{年假基準} = \begin{cases} 
    7 & \text{如果工作經驗} \leq 2 \text{年} \\
    8 & \text{如果工作經驗} \leq 4 \text{年} \\
    10 & \text{如果工作經驗} \leq 9 \text{年} \\
    14 & \text{如果工作經驗} > 9 \text{年}
    \end{cases}
    \]
    \[
    \text{年假因子} = 1 + \left(\frac{\text{年假日數} - \text{年假基準}}{100}\right)
    \]

### 4. 最終 CP 值（Final Worth）

- **最終 CP 值**：
  \[
  \text{最終 CP 值} = \text{基本分數} \times \text{工作時數因子} \times \text{工作環境因子} \times \text{同事環境因子} \times \text{壓力因子} \times \text{職業發展因子} \times \text{廁所清潔度因子} \times \text{老細態度因子} \times \text{醫療保險因子} \times \text{OT 補水因子} \times \text{年假因子}
  \]

- **分數範圍調整**：
  - 如果最終 CP 值 < 0，設為 0。
  - 如果最終 CP 值 > 100，設為 100。
  - 最終四捨五入到整數。

## 安裝同運行

1. 將倉庫 clone 到你嘅本地：
   ```bash
   git clone https://github.com/你嘅用戶名/你嘅倉庫名.git
