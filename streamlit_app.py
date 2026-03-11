import streamlit as st
import streamlit.components.v1 as components
import os

# 設定網頁標題與圖示
st.set_page_config(page_title="Grid Map Pro - HW1", layout="wide")

def load_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

# 讀取資源
html_content = load_file('templates/index.html')
css_content = load_file('static/style.css')
js_content = load_file('static/script.js')

# 由於 Streamlit 的 iframe 無法直接引用靜態路徑，我們將 CSS 與 JS 注入 HTML
# 替換掉原有的外部引用鏈接
html_content = html_content.replace(
    '<link rel="stylesheet" href="{{ url_for(\'static\', filename=\'style.css\') }}">',
    f'<style>{css_content}</style>'
)
html_content = html_content.replace(
    '<script src="{{ url_for(\'static\', filename=\'script.js\') }}"></script>',
    f'<script>{js_content}</script>'
)

# 渲染應用程式
st.markdown("""
    <style>
    .stApp { background: #0f172a; }
    iframe { border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    </style>
""", unsafe_allow_html=True)

st.title("RL Homework: Grid Map & Policy Evaluation")
st.caption("Developed for Streamlit Cloud deployment")

# 使用 components.html 嵌入完整的互動網格
components.html(html_content, height=1000, scrolling=True)
