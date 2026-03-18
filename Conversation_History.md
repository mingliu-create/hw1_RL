# 📝 HW1 開發對話全紀錄 (Conversation History)

**日期**: 2026-03-05 ~ 2026-03-11  
**參與者**: 使用者 (USER) & AI 助手 (Antigravity)

---

### 🟢 第一階段：HW1-1 網格地圖開發

**[USER]**: HW1-1: 網格地圖開發。目標：開發大小為 nxn 的網格地圖 (5-9)，可以使用 Flask。功能：設定起始點（綠）、結束點（紅）、n-2 個障礙物（灰）。

**[Antigravity]**: 開始建立 Flask 專案架構。
- 建立 `app.py` 處理後端。
- 建立 `templates/index.html` 與 `static/style.css` 打造 Glassmorphism UI。
- 撰寫 `script.js` 處理 5x5 到 9x9 的網格邏輯。
- *執行驗證*：確認網格生成、點擊順序與障礙物上限功能正常。

---

### 🟢 第二階段：HW1-2 策略顯示與價值評估

**[USER]**: HW1-2: 策略顯示與價值評估。顯示隨機生成行動箭頭，並計算狀態價值 V(s)。

**[Antigravity]**: 
- **後端**: 在 `app.py` 加入 Bellman 疊代算法 ($V(s) = R + \gamma V(s')$)。
- **前端**: 更新 `script.js` 顯示隨機箭頭，並加入「Evaluate Policy」按鈕呼叫 API。
- **優化**: 增加「黃金路徑高亮」視覺效果，價值最高的箭頭會變為金色。

**[USER]**: Values 都是 -10.0 是對的嗎？

**[Antigravity]**: 是正確的。這代表在隨機策略下，該位置會不斷累積 -1 的懲罰且無法到達終點。根據公式 $V(s) = -1 + 0.9 V(s)$，解得 -10.0。

---

### 🔴 第三階段：雲端部署與問題修復

**[USER]**: 想要把東西 push 到 github。網址: https://github.com/mingliu-create/hw1_RL.git

**[Antigravity]**: 協助建立 `.gitignore` 並執行 Git 指令推送成功。

**[USER]**: 在 Streamlit 部署遇到 `ModuleNotFoundError: No module named 'flask'`。

**[Antigravity]**: 診斷為缺少環境設定。建立並推送 `requirements.txt` (包含 Flask, numpy)。

**[USER]**: 接著遇到 `signal.signal` 報錯與「轉圈圈」載不出來。

**[Antigravity]**: 
- **診斷**: Flask 的 Debug 模式與 Streamlit Cloud 的 Linux 環境訊號衝突。
- **調整**: 修改 `app.py` 關閉 `debug=True` 並設定 `host='0.0.0.0'`。
- **結論**: 發現 Streamlit Cloud 原生不支援 Flask 協議運行。

---

### 🔵 第四階段：Streamlit 兼容化架構重組

**[USER]**: 但是這項專案要求在 Streamlit 上使用。

**[Antigravity]**: 
- **重大重構**: 將 RL 算法 (Bellman 方程式) 從 Python 移植到 **前端 JavaScript**。
- **優點**: 解決後端通訊問題，實現「零延遲」運算，且完美適配 Streamlit iframe。
- **新的啟動檔**: 建立 `streamlit_app.py` 作為入口。
- **成果**: 專案在 [Streamlit 直播網址](https://sqqxhfujt9fjdhekqdzwqy.streamlit.app/) 成功運行。

---

### ⚪ 第五階段：文檔與 GitHub 更新

**[USER]**: 更新 README 附上網址並幫我更新 markdown。

**[Antigravity]**: 
- 更新 `README.md` 加入直播連結。
- 更新 `Full_Project_Report.md` 技術總結。
- 解決 Git 推送衝突，確保遠端與本地端檔案同步。

---
**[報告結束]**
