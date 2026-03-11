# 🏆 強化學習作業 (HW1) 開發全紀錄報告 (Streamlit 版)

## 📅 最後更新日期: 2026-03-11
- **項目名稱**: 動態網格地圖與策略價值評估系統
- **部署連結**: [https://sqqxhfujt9fjdhekqdzwqy.streamlit.app/](https://sqqxhfujt9fjdhekqdzwqy.streamlit.app/)
- **GitHub 倉庫**: [https://github.com/mingliu-create/hw1_RL.git](https://github.com/mingliu-create/hw1_RL.git)

---

## 🛠️ 技術架構升級說明 (Streamlit 兼容化)

為了解決 Streamlit Cloud 在處理 Flask 後端 AJAX 請求時的連線瓶頸與訊號衝突，本專案進行了重大的架構優化：
1. **算法前置 (Client-side Calculation)**: 將原先位於 `app.py` 的 Bellman 策略評估邏輯完全移植到 `static/script.js` 中。這消除了對 Flask API 的依賴，大幅提升了在雲端環境的執行效率與稳定性。
2. **Streamlit 組件化**: 使用 `streamlit.components.v1` 將完整的 HTML/CSS/JS 互動應用封裝進 Streamlit 入口點檔案 `streamlit_app.py`。

---

## 🎯 HW1 核心需求達成狀況

### 1. 網格地圖開發 (HW1-1)
- **維度自定義**: 5x5 到 9x9 實時切換。
- **操作流完整性**: 起點 -> 終點 -> $n-2$ 個障礙物的嚴格設定邏輯。
- **視覺美化**: 採用 Premium Glassmorphism 設計，適配 Streamlit 介面。

### 2. 策略顯示與價值評估 (HW1-2)
- **隨機策略**: 每格初始化即生成隨機箭頭 $\pi(s)$。
- **價值計算**: 實現了 $V(s) = R + \gamma V(s')$ 疊代算法。
- **黃金路徑高亮**: 透過 JavaScript 實時渲染，$V(s)$ 最高的動作會觸發金色發光特效。

---

## 🏗️ 最終專案結構
- **`streamlit_app.py`**: 作為雲端啟動檔案。
- **`static/script.js`**: 包含 RL 計算邏輯與 UI 互動。
- **`static/style.css`**: 毛玻璃視覺外觀。
- **`requirements.txt`**: 已更新，包含 `streamlit` 以確保雲端正確安裝。

---
**本報告由 Antigravity AI 協助整理，確認所有功能均已於 Streamlit Cloud 測試運作正常。**
