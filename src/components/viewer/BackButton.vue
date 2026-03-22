<template>
  <div class="back-button">
    <button @click="goBack">← 返回首页</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.push('/')
}
</script>

<style scoped>
@import '../../views/BuildingViewer.css';
</style>
