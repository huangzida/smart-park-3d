<template>
  <div class="file-input">
    <button @click="triggerFileInput">选择建筑模型文件</button>
    <input
      ref="fileInputRef"
      type="file"
      accept=".glb,.gltf,.fbx"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  fileSelected: [file: File]
}>()

const fileInputRef = ref<HTMLInputElement>()

function triggerFileInput() {
  fileInputRef.value?.click()
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emit('fileSelected', file)
  }
}
</script>

<style scoped>
@import '../../views/BuildingViewer.css';
</style>
