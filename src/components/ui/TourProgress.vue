<template>
  <Transition name="fade">
    <div v-if="show" class="tour-progress">
      <span class="tour-progress-text">游览中</span>
      <div class="tour-progress-bar">
        <div class="tour-progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <span class="tour-progress-text">{{ currentIndex }}/{{ totalCount }}</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  progress: number
  currentIndex: number
  totalCount: number
}

defineProps<Props>()
</script>

<style scoped>
.tour-progress {
  position: absolute;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 100;
}

.tour-progress-bar {
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.tour-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent), var(--color-primary));
  transition: width 0.3s;
}

.tour-progress-text {
  color: var(--color-accent);
  font-size: 12px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
