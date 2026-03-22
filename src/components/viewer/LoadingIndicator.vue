<template>
  <div v-if="isLoading" class="loading-overlay">
    <div class="loading-content">
      <!-- 动画进度条 -->
      <div class="progress-container">
        <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
      </div>

      <!-- 加载状态文本 -->
      <div class="loading-text">
        <div class="spinner"></div>
        <span>{{ getLoadingText() }}</span>
      </div>

      <!-- 加载百分比 -->
      <div class="progress-value">{{ progress.toFixed(1) }}%</div>

      <!-- 加载详情 -->
      <div class="loading-details">
        <div v-if="progress < 30" class="detail-item">📦 解析模型文件...</div>
        <div v-else-if="progress < 60" class="detail-item">🎨 加载材质和贴图...</div>
        <div v-else-if="progress < 90" class="detail-item">⚙️ 应用模型变换...</div>
        <div v-else class="detail-item">✨ 准备渲染...</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isLoading: boolean
  progress: number
}>()

function getLoadingText() {
  if (props.progress < 10) return '开始加载...'
  if (props.progress < 30) return '解析模型结构...'
  if (props.progress < 60) return '加载资源...'
  if (props.progress < 90) return '处理模型...'
  return '即将完成...'
}
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  background: rgba(30, 30, 40, 0.95);
  border-radius: 16px;
  padding: 40px 50px;
  min-width: 400px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.progress-container {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 24px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4a90d9, #87CEEB);
  border-radius: 4px;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(74, 144, 217, 0.5);
}

.loading-text {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  color: white;
  font-size: 18px;
  font-weight: 500;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #4a90d9;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.progress-value {
  font-size: 48px;
  font-weight: 700;
  color: #4a90d9;
  margin-bottom: 24px;
  font-family: 'SF Mono', Monaco, monospace;
  text-shadow: 0 0 20px rgba(74, 144, 217, 0.3);
}

.loading-details {
  text-align: left;
}

.detail-item {
  padding: 8px 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-item:first-child {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
