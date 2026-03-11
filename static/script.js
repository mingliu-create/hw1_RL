/**
 * HW1: Grid Map & Policy Evaluation
 * Frontend Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 元素獲取 ---
    const gridContainer = document.getElementById('grid-container');
    const generateBtn = document.getElementById('generate-btn');
    const evaluateBtn = document.getElementById('evaluate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const dimensionInput = document.getElementById('dimension-n');
    const instructionText = document.getElementById('instruction-text');

    // --- 全域狀態 ---
    let n = 0;                  // 網格維度
    let startSet = false;       // 是否已設定起點
    let endSet = false;         // 是否已設定終點
    let obstaclesCount = 0;     // 已放置的障礙物數量
    let maxObstacles = 0;       // 障礙物上限 (n-2)
    let cellPolicies = {};      // 儲存每個單元格的隨機策略 {index: actionName}
    let startIndex = -1;        // 起點索引
    let endIndex = -1;          // 終點索引

    // --- 提示訊息配置 ---
    const messages = {
        init: "🟢 第一步：選擇 [起始點] (綠色)",
        start: "🔴 第二步：選擇 [終點] (紅色)",
        end: (count) => `⚪ 第三步：設定 ${count} 個 [障礙物] (灰色)`,
        obstacle: (count) => `還需要設定 ${count} 個障礙物...`,
        ready: "✨ 配置完成！請點擊「Evaluate Policy」進行計算。",
        calculating: "⏳ 正在計算 Bellman 方程式...",
        done: "配置完成。按 Reset 重置地圖。"
    };

    // --- 箭頭符號定義 ---
    const arrows = {
        'up': '↑',
        'down': '↓',
        'left': '←',
        'right': '→'
    };

    /**
     * 更新狀態提示
     */
    function updateInstructions(msg) {
        instructionText.style.animation = 'none';
        instructionText.offsetHeight;
        instructionText.textContent = msg;
        instructionText.style.animation = 'fadeIn 0.5s ease-out';
    }

    /**
     * 初始化網格與隨機策略
     */
    function createGrid() {
        n = parseInt(dimensionInput.value);
        if (isNaN(n) || n < 5 || n > 9) {
            alert("請輸入 5 到 9 之間的維度。");
            return;
        }

        // 重置狀態
        startSet = false;
        endSet = false;
        obstaclesCount = 0;
        maxObstacles = n - 2;
        cellPolicies = {};
        startIndex = -1;
        endIndex = -1;

        gridContainer.innerHTML = '';
        gridContainer.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
        gridContainer.style.gridTemplateRows = `repeat(${n}, 1fr)`;

        const actions = ['up', 'down', 'left', 'right'];

        for (let i = 0; i < n * n; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;

            // 隨機策略
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            cellPolicies[i] = randomAction;

            const arrowSpan = document.createElement('span');
            arrowSpan.classList.add('policy-arrow');
            arrowSpan.textContent = arrows[randomAction];
            cell.appendChild(arrowSpan);

            const valueSpan = document.createElement('span');
            valueSpan.classList.add('value-label');
            cell.appendChild(valueSpan);

            cell.addEventListener('click', () => handleCellClick(cell));
            gridContainer.appendChild(cell);
        }
        updateInstructions(messages.init);
    }

    /**
     * 單元格點擊處理
     */
    function handleCellClick(cell) {
        const index = parseInt(cell.dataset.index);

        if (cell.classList.contains('start') || cell.classList.contains('end') || cell.classList.contains('obstacle')) {
            return;
        }

        if (!startSet) {
            cell.classList.add('start');
            startSet = true;
            startIndex = index;
            updateInstructions(messages.start);
        } else if (!endSet) {
            cell.classList.add('end');
            endSet = true;
            endIndex = index;
            if (maxObstacles > 0) {
                updateInstructions(messages.end(maxObstacles));
            } else {
                updateInstructions(messages.ready);
            }
        } else if (obstaclesCount < maxObstacles) {
            cell.classList.add('obstacle');
            obstaclesCount++;
            if (obstaclesCount < maxObstacles) {
                updateInstructions(messages.obstacle(maxObstacles - obstaclesCount));
            } else {
                updateInstructions(messages.ready);
            }
        }
    }

    /**
     * 策略價值評估 API 串接與視覺化
     */
    async function evaluatePolicy() {
        if (!startSet || !endSet || obstaclesCount < maxObstacles) {
            alert(`請先完成地圖配置：需選取起點、終點以及 ${maxObstacles} 個障礙物。`);
            return;
        }

        updateInstructions(messages.calculating);

        try {
            const obstacleIndices = Array.from(document.querySelectorAll('.cell.obstacle'))
                .map(c => parseInt(c.dataset.index));

            const response = await fetch('/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    n: n,
                    start: startIndex,
                    end: endIndex,
                    obstacles: obstacleIndices,
                    policy: cellPolicies
                })
            });

            const data = await response.json();
            const values = data.values;

            // 更新 UI 與結果強化
            document.querySelectorAll('.cell').forEach((cell, i) => {
                const valLabel = cell.querySelector('.value-label');
                const arrow = cell.querySelector('.policy-arrow');

                if (cell.classList.contains('obstacle')) {
                    valLabel.textContent = "-";
                    if (arrow) arrow.style.opacity = "0";
                } else if (cell.classList.contains('end')) {
                    valLabel.textContent = "Goal";
                    if (arrow) arrow.style.opacity = "0";
                } else {
                    valLabel.textContent = values[i].toFixed(1);

                    const maxVal = Math.max(...values);
                    const minVal = -10.0;

                    let normalized = (values[i] - minVal) / (maxVal - minVal + 1);
                    if (normalized > 1) normalized = 1;

                    if (arrow) {
                        arrow.style.opacity = Math.max(0.3, normalized);
                        // 強化高價值路徑的箭頭顏色 (Golden Color)
                        if (values[i] > maxVal * 0.8 && maxVal > 0) {
                            arrow.style.color = "#fbbf24";
                            arrow.style.textShadow = "0 0 10px rgba(251, 191, 36, 0.8)";
                        } else {
                            arrow.style.color = "rgba(255, 255, 255, 0.7)";
                            arrow.style.textShadow = "none";
                        }
                    }
                }
            });

            updateInstructions("✅ 策略評估完成。數值反映了從該點出發的預期累積報酬。");
        } catch (error) {
            console.error(error);
            updateInstructions("❌ 發生系統錯誤。");
        }
    }

    generateBtn.addEventListener('click', createGrid);
    evaluateBtn.addEventListener('click', evaluatePolicy);
    resetBtn.addEventListener('click', createGrid);
    createGrid();
});
