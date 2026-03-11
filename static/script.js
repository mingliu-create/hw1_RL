/**
 * HW1: Grid Map & Policy Evaluation (Streamlit Optimized)
 * Client-side Logic (Calculation moved to JS for Streamlit compatibility)
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const gridContainer = document.getElementById('grid-container');
    const generateBtn = document.getElementById('generate-btn');
    const evaluateBtn = document.getElementById('evaluate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const dimensionInput = document.getElementById('dimension-n');
    const instructionText = document.getElementById('instruction-text');

    // --- State ---
    let n = 0;
    let startSet = false;
    let endSet = false;
    let obstaclesCount = 0;
    let maxObstacles = 0;
    let cellPolicies = {};
    let startIndex = -1;
    let endIndex = -1;

    const messages = {
        init: "🟢 第一步：選擇 [起始點] (綠色)",
        start: "🔴 第二步：選擇 [終點] (紅色)",
        end: (count) => `⚪ 第三步：設定 ${count} 個 [障礙物] (灰色)`,
        obstacle: (count) => `還需要設定 ${count} 個障礙物...`,
        ready: "✨ 配置完成！請點擊「Evaluate Policy」進行計算。",
        calculating: "⏳ 正在計算 Bellman 方程式 (JS 引擎)...",
        done: "配置完成。按 Reset 重置地圖。"
    };

    const arrows = { 'up': '↑', 'down': '↓', 'left': '←', 'right': '→' };

    function updateInstructions(msg) {
        instructionText.textContent = msg;
        instructionText.style.animation = 'none';
        instructionText.offsetHeight;
        instructionText.style.animation = 'fadeIn 0.5s ease-out';
    }

    function createGrid() {
        n = parseInt(dimensionInput.value);
        if (isNaN(n) || n < 5 || n > 9) {
            alert("請輸入 5 到 9 之間的維度。");
            return;
        }

        startSet = false; endSet = false; obstaclesCount = 0;
        maxObstacles = n - 2; cellPolicies = {}; startIndex = -1; endIndex = -1;

        gridContainer.innerHTML = '';
        gridContainer.style.gridTemplateColumns = `repeat(${n}, 1fr)`;

        const actions = ['up', 'down', 'left', 'right'];

        for (let i = 0; i < n * n; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;

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

    function handleCellClick(cell) {
        const index = parseInt(cell.dataset.index);
        if (cell.className.includes('start') || cell.className.includes('end') || cell.className.includes('obstacle')) return;

        if (!startSet) {
            cell.classList.add('start'); startSet = true; startIndex = index;
            updateInstructions(messages.start);
        } else if (!endSet) {
            cell.classList.add('end'); endSet = true; endIndex = index;
            maxObstacles > 0 ? updateInstructions(messages.end(maxObstacles)) : updateInstructions(messages.ready);
        } else if (obstaclesCount < maxObstacles) {
            cell.classList.add('obstacle'); obstaclesCount++;
            obstaclesCount < maxObstacles ? updateInstructions(messages.obstacle(maxObstacles - obstaclesCount)) : updateInstructions(messages.ready);
        }
    }

    /**
     * Bellman 策略評估 (核心算法移植至 JS)
     */
    function runPolicyEvaluation() {
        if (!startSet || !endSet || obstaclesCount < maxObstacles) {
            alert("請先完成地圖配置。");
            return;
        }

        updateInstructions(messages.calculating);

        const obstacleIndices = new Set(Array.from(document.querySelectorAll('.cell.obstacle')).map(c => parseInt(c.dataset.index)));
        const gamma = 0.9;
        const threshold = 1e-4;
        const actions = { 'up': [-1, 0], 'down': [1, 0], 'left': [0, -1], 'right': [0, 1] };

        let V = new Array(n * n).fill(0);

        for (let iter = 0; iter < 1000; iter++) {
            let delta = 0;
            let newV = [...V];

            for (let s = 0; s < n * n; s++) {
                if (s === endIndex || obstacleIndices.has(s)) continue;

                const action = cellPolicies[s];
                const [dr, dc] = actions[action];
                const r = Math.floor(s / n), c = s % n;
                const nr = r + dr, nc = c + dc;

                let nextS = s;
                if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
                    const candidateS = nr * n + nc;
                    if (!obstacleIndices.has(candidateS)) nextS = candidateS;
                }

                const reward = (nextS === endIndex) ? 100 : -1;
                const vNew = reward + gamma * V[nextS];
                newV[s] = vNew;
                delta = Math.max(delta, Math.abs(vNew - V[s]));
            }
            V = newV;
            if (delta < threshold) break;
        }
        updateUI(V);
    }

    function updateUI(values) {
        document.querySelectorAll('.cell').forEach((cell, i) => {
            const valLabel = cell.querySelector('.value-label');
            const arrow = cell.querySelector('.policy-arrow');
            if (cell.classList.contains('obstacle')) {
                valLabel.textContent = "-"; if (arrow) arrow.style.opacity = "0";
            } else if (cell.classList.contains('end')) {
                valLabel.textContent = "Goal"; if (arrow) arrow.style.opacity = "0";
            } else {
                valLabel.textContent = values[i].toFixed(1);
                const maxVal = Math.max(...values);
                const minVal = -10.0;
                let norm = (values[i] - minVal) / (maxVal - minVal + 1);
                if (arrow) {
                    arrow.style.opacity = Math.max(0.3, norm);
                    if (values[i] > maxVal * 0.8 && maxVal > 0) {
                        arrow.style.color = "#fbbf24";
                        arrow.style.textShadow = "0 0 10px rgba(251, 191, 36, 0.8)";
                    } else {
                        arrow.style.color = "rgba(255, 255, 255, 0.7)";
                    }
                }
            }
        });
        updateInstructions("✅ 評估完成！(JS 運算成功)");
    }

    generateBtn.addEventListener('click', createGrid);
    evaluateBtn.addEventListener('click', runPolicyEvaluation);
    resetBtn.addEventListener('click', createGrid);
    createGrid();
});
