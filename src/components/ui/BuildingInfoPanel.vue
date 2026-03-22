<template>
  <Transition name="slide">
    <div v-if="building" class="building-info">
      <button class="close-btn" @click="handleClose">&times;</button>
      <h2>{{ building.name }}</h2>
      <div class="info-row">
        <span class="label">建筑类型</span>
        <span class="value">{{ building.type }}</span>
      </div>
      <div class="info-row">
        <span class="label">建筑面积</span>
        <span class="value">{{ building.area }}</span>
      </div>
      <div class="info-row">
        <span class="label">楼层数</span>
        <span class="value">{{ building.floors }}</span>
      </div>
      <div class="info-row">
        <span class="label">使用状态</span>
        <span class="value">{{ building.status }}</span>
      </div>
      <div class="description">{{ building.description }}</div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { BuildingData } from '@/types/building'

interface Props {
  building: BuildingData | null
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

function handleClose() {
  emit('close')
}
</script>

<style scoped>
.building-info {
  position: absolute;
  top: 80px;
  left: 30px;
  width: 320px;
  background: var(--bg-overlay);
  backdrop-filter: blur(15px);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(100, 255, 218, 0.3);
  padding: 20px;
  color: #fff;
  z-index: 100;
}

.building-info h2 {
  color: var(--color-accent);
  font-size: 20px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(100, 255, 218, 0.3);
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.label {
  color: #888;
}

.value {
  color: #fff;
  font-weight: 500;
}

.description {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 13px;
  line-height: 1.6;
  color: #ccc;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  color: var(--color-accent);
  font-size: 20px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.close-btn:hover {
  opacity: 1;
}

/* 滑入动画 */
.slide-enter-active {
  animation: slideIn 0.3s ease;
}

.slide-leave-active {
  animation: slideOut 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-20px);
  }
}
</style>
