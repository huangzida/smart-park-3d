<template>
  <button
    :class="['base-button', { active: isActive }]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  isActive?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  isActive: false,
  disabled: false
})

const emit = defineEmits<{
  click: []
}>()

function handleClick() {
  emit('click')
}
</script>

<style scoped>
.base-button {
  padding: 12px 24px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
  box-shadow: var(--shadow-md);
}

.base-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.base-button:active:not(:disabled) {
  transform: translateY(0);
}

.base-button.active {
  background: linear-gradient(135deg, var(--color-danger), #ee5a6f);
}

.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
