# HW1: Dynamic Grid Map & Policy Evaluation

## 🌟 專案簡介
本專案為一個基於 **Flask** 的互動式網格地圖開發工具，專為強化學習中的策略評估（Policy Evaluation）實驗而設計。使用者可以動態調整地圖維度，並自定義起點、終點及障礙物。

## 🎯 核心功能
1. **動態網格生成**：支援 $n \times n$ (5-9) 的網格初始化。
2. **互動式設定**：
   - 點擊設定 **綠色起點 (Start)**。
   - 點擊設定 **紅色終點 (End)**。
   - 點擊設定 **$n-2$ 個灰色障礙物 (Obstacles)**。
3. **策略顯示**：網格初始化時自動為每個單元格生成隨機行動策略（上下左右箭頭）。
4. **價值評估**：透過 Bellman 方程式計算並顯示每個狀態的價值 $V(s)$。

## 🛠️ 技術棧
- **後端**: Python Flask, NumPy (計算處理)
- **前端**: HTML5, CSS3 (Glassmorphism 設計), JavaScript (Vanilla ES6)

## 🚀 如何執行
1. **安裝依賴**：
   ```bash
   pip install flask numpy
   ```
2. **啟動伺服器**：
   ```bash
   python app.py
   ```
3. **訪問網頁**：
   開啟瀏覽器並輸入 `http://127.0.0.1:5000/`

## 📁 檔案結構說明
- `app.py`: 後端主程式，包含 Flask 路由與策略評估算法。
- `templates/index.html`: 前端頁面結構與導引介面。
- `static/style.css`: 視覺設計與動畫特效，採用現代毛玻璃（Glassmorphism）風格。
- `static/script.js`: 前端核心邏輯，處理網格生成、點擊事件及 API 串接。
