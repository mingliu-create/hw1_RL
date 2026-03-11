# HW1: Dynamic Grid Map & Policy Evaluation (Streamlit Version)

## 🌐 專案直播網址
[https://sqqxhfujt9fjdhekqdzwqy.streamlit.app/](https://sqqxhfujt9fjdhekqdzwqy.streamlit.app/)

## 🌟 專案簡介
本專案為一個基於 **Streamlit** 開發的互動式網格地圖開發工具，專為強化學習中的策略評估（Policy Evaluation）實驗而設計。支援 $n \times n$ (5-9) 的網格初始化、起點/終點/障礙物設定，並能實時計算每個狀態的價值 $V(s)$。

## 🎯 核心功能
1. **動態網格生成**：支援 5-9 維度自由切換。
2. **互動式設定**：
   - 點擊設定 **綠色起點 (Start)**。
   - 點擊設定 **紅色終點 (End)**。
   - 點擊設定 **$n-2$ 個灰色障礙物 (Obstacles)**。
3. **策略顯示**：自動為每個單元格生成隨機行動策略（箭頭）。
4. **價值評估 (Bellman Equation)**：移植核心算法至 JavaScript，確保在 Streamlit 雲端環境中具備毫秒級的響應速度，無須後端通訊。

## 🛠️ 技術棧
- **架構**: Streamlit (Python Entry Point)
- **引擎**: JavaScript (Client-side RL Calculation)
- **設計**: Glassmorphism, Dark Mode, 現代 UI 動畫

## 🚀 本地端如何執行
1. **安裝環境**：
   ```bash
   pip install streamlit numpy
   ```
2. **啟動應用**：
   ```bash
   streamlit run streamlit_app.py
   ```

## 📁 檔案結構說明
- `streamlit_app.py`: Streamlit 入口點，負責封裝互動組件。
- `static/script.js`: **核心引擎**，包含 Bellman 策略評估算法。
- `static/style.css`: 視覺樣式表。
- `templates/index.html`: UI 佈局模板。
