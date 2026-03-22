<template>
  <div id="app">
    <!-- 顶部标题栏 -->
    <Header />

    <!-- 3D 场景容器 -->
    <SceneContainer ref="sceneContainerRef" />

    <!-- 3D 世界元素 -->
    <Ground />
    <Building
      v-for="(buildingData, index) in buildings"
      :key="buildingData.id"
      :building-data="buildingData"
      :index="index"
    />
    <Environment />
    <ModelDisplay />

    <!-- UI 组件 -->
    <ViewButtons
      :is-animating="cameraStore.isAnimating"
      :is-touring="tourStore.isTouring"
      :current-view="cameraStore.currentView"
      @view-change="handleViewChange"
    />

    <ControlPanel
      :is-touring="tourStore.isTouring"
      :is-auto-rotating="cameraStore.isAutoRotating"
      :is-animating="cameraStore.isAnimating"
      @tour="handleTour"
      @reset="handleReset"
      @auto-rotate="handleAutoRotate"
    />

    <BuildingInfoPanel
      :building="buildingStore.selectedBuilding"
      @close="handleCloseBuildingInfo"
    />

    <TourProgress
      :show="tourStore.isTouring"
      :progress="tourStore.progress"
      :current-index="tourStore.currentIndex"
      :total-count="tourStore.tourPoints.length"
    />

    <Minimap />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Header from '@/components/ui/Header.vue'
import SceneContainer from '@/components/scene/SceneContainer.vue'
import Ground from '@/components/world/Ground.vue'
import Building from '@/components/world/Building.vue'
import Environment from '@/components/world/Environment.vue'
import ModelDisplay from '@/components/world/ModelDisplay.vue'
import ViewButtons from '@/components/ui/ViewButtons.vue'
import ControlPanel from '@/components/ui/ControlPanel.vue'
import BuildingInfoPanel from '@/components/ui/BuildingInfoPanel.vue'
import TourProgress from '@/components/ui/TourProgress.vue'
import Minimap from '@/components/ui/Minimap.vue'
import { useCameraStore } from '@/stores/camera'
import { useBuildingStore } from '@/stores/building'
import { useTourStore } from '@/stores/tour'
import { BUILDINGS_DATA } from '@/config/buildings.data'
import type { ViewType } from '@/types/camera'
import { useCameraControls } from '@/composables/useCameraControls'
import { useTour } from '@/composables/useTour'
import { useBuildingInteraction } from '@/composables/useBuildingInteraction'

const sceneContainerRef = ref<InstanceType<typeof SceneContainer>>()
const cameraStore = useCameraStore()
const buildingStore = useBuildingStore()
const tourStore = useTourStore()

const buildings = computed(() => BUILDINGS_DATA)

let cameraControls: ReturnType<typeof useCameraControls> | null = null
let tour: ReturnType<typeof useTour> | null = null
let buildingInteraction: ReturnType<typeof useBuildingInteraction> | null = null

onMounted(() => {
  // 等待场景初始化
  setTimeout(() => {
    const container = sceneContainerRef.value
    if (!container) return

    const scene = container.scene()
    const camera = container.camera()
    const cameraManager = container.cameraManager()

    if (!scene || !camera || !cameraManager) return

    // 初始化 composables
    cameraControls = useCameraControls(cameraManager)
    tour = useTour(cameraManager)
    buildingInteraction = useBuildingInteraction(scene, camera)

    // 绑定建筑交互事件 - 获取 canvas 元素
    const canvas = document.querySelector('canvas')
    if (canvas) {
      canvas.addEventListener('click', buildingInteraction.handleClick)
      canvas.addEventListener('mousemove', buildingInteraction.handleMouseMove)
    }
  }, 100)
})

/**
 * 视角切换
 */
async function handleViewChange(view: ViewType) {
  if (!cameraControls) return
  await cameraControls.switchView(view)
}

/**
 * 游览控制
 */
async function handleTour() {
  if (!tour) return
  await tour.toggleTour()
}

/**
 * 重置视角
 */
async function handleReset() {
  if (!cameraControls) return
  await cameraControls.reset()
}

/**
 * 自动旋转
 */
function handleAutoRotate() {
  if (!cameraControls) return
  cameraControls.toggleAutoRotate()
}

/**
 * 关闭建筑信息面板
 */
function handleCloseBuildingInfo() {
  buildingStore.clearSelection()
}
</script>

<style>
@import '@/assets/styles/variables.css';
@import '@/assets/styles/global.css';
</style>
