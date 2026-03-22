<template>
  <div class="view-buttons">
    <button
      v-for="view in views"
      :key="view.key"
      :class="['view-btn', { active: currentView === view.key }]"
      :disabled="isAnimating || isTouring"
      @click="handleViewChange(view.key)"
    >
      {{ view.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ViewType } from '@/types/camera'

interface Props {
  isAnimating: boolean
  isTouring: boolean
  currentView: ViewType | null
}

defineProps<Props>()

const emit = defineEmits<{
  viewChange: [view: ViewType]
}>()

const views = [
  { key: 'overview' as ViewType, label: '全景视角' },
  { key: 'front' as ViewType, label: '正门视角' },
  { key: 'aerial' as ViewType, label: '鸟瞰视角' },
  { key: 'side' as ViewType, label: '侧面视角' }
]

function handleViewChange(view: ViewType) {
  emit('viewChange', view)
}
</script>

<style scoped>
.view-buttons {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 100;
}

.view-btn {
  padding: 10px 15px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: 1px solid rgba(100, 255, 218, 0.3);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.view-btn:hover:not(:disabled) {
  background: rgba(0, 150, 136, 0.6);
  border-color: var(--color-accent);
}

.view-btn.active {
  background: rgba(0, 150, 136, 0.8);
  border-color: var(--color-accent);
}

.view-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
