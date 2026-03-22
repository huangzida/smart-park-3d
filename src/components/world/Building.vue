<template>
  <div ref="containerRef" class="building-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import type { BuildingData } from '@/types/building'
import { useSceneStore } from '@/stores/scene'
import { useBuildingStore } from '@/stores/building'
import { BuildingGeometry } from './building/BuildingGeometry'

interface Props {
  buildingData: BuildingData
  index: number
}

const props = defineProps<Props>()
const containerRef = ref<HTMLDivElement>()
const sceneStore = useSceneStore()
void containerRef // 标记为有意使用
const buildingStore = useBuildingStore()

let buildingGeometry: BuildingGeometry | null = null
let buildingGroup: THREE.Group | null = null

onMounted(() => {
  if (!sceneStore.scene) return
  createBuilding(sceneStore.scene)
})

onUnmounted(() => {
  cleanup()
})

// 监听选中状态变化
watch(
  () => buildingStore.selectedId,
  (newId) => {
    if (!buildingGeometry) return
    const isSelected = newId === props.buildingData.id
    buildingGeometry.updateHighlight(isSelected)
  }
)

// 监听悬停状态变化
watch(
  () => buildingStore.hoveredId,
  (newId) => {
    if (!buildingGeometry) return
    const isHovered = newId === props.buildingData.id
    const isSelected = buildingStore.selectedId === props.buildingData.id
    buildingGeometry.updateHover(isHovered, isSelected)
  }
)

/**
 * 创建建筑
 */
function createBuilding(scene: THREE.Scene): void {
  buildingGeometry = new BuildingGeometry()
  buildingGroup = buildingGeometry.createBuilding(props.buildingData, props.index)

  // 设置位置
  buildingGroup.position.copy(props.buildingData.position)

  scene.add(buildingGroup)

  // 创建建筑标签
  createLabel(buildingGroup)
}

/**
 * 创建标签
 */
function createLabel(group: THREE.Group): void {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!
  canvas.width = 256
  canvas.height = 64

  context.fillStyle = 'rgba(0, 150, 136, 0.8)'
  context.fillRect(0, 0, 256, 64)
  context.font = 'bold 24px Microsoft YaHei'
  context.fillStyle = '#ffffff'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(props.buildingData.name, 128, 32)

  const labelTexture = new THREE.CanvasTexture(canvas)
  const labelMaterial = new THREE.SpriteMaterial({
    map: labelTexture,
    transparent: true
  })
  const label = new THREE.Sprite(labelMaterial)
  label.position.y = props.buildingData.size.y + 2
  label.scale.set(8, 2, 1)
  group.add(label)
}

/**
 * 清理资源
 */
function cleanup(): void {
  if (!sceneStore.scene || !buildingGroup) return

  if (buildingGeometry) {
    buildingGeometry.dispose()
  }

  sceneStore.scene.remove(buildingGroup)
  buildingGroup = null
  buildingGeometry = null
}
</script>

<style scoped>
.building-container {
  display: none;
}
</style>
