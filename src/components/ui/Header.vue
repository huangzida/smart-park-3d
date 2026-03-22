<template>
  <header class="header">
    <h1>智慧园区3D展示系统</h1>
    <div class="header-actions">
      <button class="nav-btn" @click="goToBuildingViewer">
        <span>模型查看器</span>
      </button>
      <div class="status">实时渲染 | WebGL加速</div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToBuildingViewer() {
  router.push('/building-viewer')
}
</script>

<style scoped>
.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(90deg, rgba(0, 150, 136, 0.9), rgba(1, 87, 155, 0.9));
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  box-shadow: var(--shadow-sm);
  z-index: 100;
}

.header h1 {
  color: #fff;
  font-size: 24px;
  font-weight: 500;
  letter-spacing: 2px;
}

.header .header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header .nav-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.header .nav-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.header .nav-btn span {
  font-weight: 500;
}

.header .status {
  color: var(--color-accent);
  font-size: 14px;
}
</style>
