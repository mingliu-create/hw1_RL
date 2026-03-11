# ============================================================
# HW1-2: Policy Evaluation Service
# ============================================================
from flask import Flask, render_template, request, jsonify
import numpy as np

app = Flask(__name__)

class GridWorldEvaluator:
    """
    負責處理策略評估算法的邏輯類別
    """
    def __init__(self, n, start, end, obstacles, policy):
        self.n = n
        self.start = start
        self.end = end
        self.obstacles = set(obstacles)
        self.policy = policy
        self.gamma = 0.9
        self.threshold = 1e-4
        self.max_iter = 1000
        
        # 行動偏移量定義
        self.actions = {
            'up': (-1, 0),
            'down': (1, 0),
            'left': (0, -1),
            'right': (0, 1)
        }

    def run_evaluation(self):
        # 初始化所有狀態價值為 0
        V = np.zeros(self.n * self.n)
        
        for _ in range(self.max_iter):
            delta = 0
            new_V = np.copy(V)
            
            for s in range(self.n * self.n):
                # 排除終點與障礙物 (非狀態或終止狀態)
                if s == self.end or s in self.obstacles:
                    continue
                
                # 取得目前策略指定的行動
                action_name = self.policy.get(str(s))
                if not action_name: continue
                
                dr, dc = self.actions[action_name]
                r, c = s // self.n, s % self.n
                nr, nc = r + dr, c + dc
                
                # 環境動力學 (Dynamics): 邊界與障礙物判定
                if 0 <= nr < self.n and 0 <= nc < self.n:
                    next_s = nr * self.n + nc
                    if next_s in self.obstacles:
                        next_s = s  # 撞障礙物留在原地
                else:
                    next_s = s      # 撞牆留在原地
                
                # 獎勵函式 (Reward Function): 抵達終點 +100，其餘步數 -1
                reward = 100 if next_s == self.end else -1
                
                # Bellman 更新公式: V(s) = E[R + gamma * V(s')]
                # 由於是確定性策略 (Deterministic Policy)，無須求和
                v_new = reward + self.gamma * V[next_s]
                
                new_V[s] = v_new
                delta = max(delta, abs(v_new - V[s]))
            
            V = new_V
            if delta < self.threshold:
                break
                
        return V.tolist()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/evaluate', methods=['POST'])
def evaluate():
    data = request.json
    
    # 建立評估器實例
    evaluator = GridWorldEvaluator(
        n=data['n'],
        start=data['start'],
        end=data['end'],
        obstacles=data['obstacles'],
        policy=data['policy']
    )
    
    # 計算結果
    v_values = evaluator.run_evaluation()
    
    return jsonify(values=v_values)

if __name__ == '__main__':
    # 適應雲端平台分配的 Port (如 Render, Railway, etc.)
    import os
    port = int(os.environ.get("PORT", 10000)) # 許多平台預設使用 10000 或由系統分配
    app.run(host='0.0.0.0', port=port)
