<template>
  <div class="control-panel">
    <BaseButton
      :is-active="isTouring"
      :disabled="isAnimating"
      @click="handleTour"
    >
      {{ isTouring ? '停止游览' : '开始游览' }}
    </BaseButton>
    <BaseButton :disabled="isAnimating || isTouring" @click="handleReset">
      重置视角
    </BaseButton>
    <BaseButton
      :is-active="isAutoRotating"
      :disabled="isTouring"
      @click="handleAutoRotate"
    >
      自动旋转
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/common/BaseButton.vue'

interface Props {
  isTouring: boolean
  isAutoRotating: boolean
  isAnimating: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  tour: []
  reset: []
  autoRotate: []
}>()

function handleTour() {
  emit('tour')
}

function handleReset() {
  emit('reset')
}

function handleAutoRotate() {
  emit('autoRotate')
}
</script>

<style scoped>
.control-panel {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
  z-index: 100;
}
</style>
