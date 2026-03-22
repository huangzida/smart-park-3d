<template>
  <div class="minimap">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { BUILDINGS_DATA } from '@/config/buildings.data'
import { SCENE_CONFIG } from '@/config/scene.config'
import { useBuildingStore } from '@/stores/building'
import { useCameraStore } from '@/stores/camera'

const canvasRef = ref<HTMLCanvasElement>()
const buildingStore = useBuildingStore()
const cameraStore = useCameraStore()

let ctx: CanvasRenderingContext2D | null = null
let animationFrameId: number

onMounted(() => {
  if (!canvasRef.value) return
  initMinimap()
  update()
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})

// 监听选中状态变化，立即重绘
watch(
  () => buildingStore.selectedId,
  () => {
    // 触发立即重绘
    if (ctx) drawFrame()
  }
)

/**
 * 初始化小地图
 */
function initMinimap(): void {
  const canvas = canvasRef.value!
  canvas.width = 180
  canvas.height = 180
  ctx = canvas.getContext('2d')
}

/**
 * 开始更新循环
 */
function update(): void {
  if (!ctx) return
  drawFrame()
  animationFrameId = requestAnimationFrame(update)
}

/**
 * 绘制一帧
 */
function drawFrame(): void {
  if (!ctx) return

  // 清除画布
  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(0, 0, 180, 180)

  // 绘制建筑
  drawBuildings()

  // 绘制相机
  drawCamera()
}

/**
 * 绘制建筑
 */
function drawBuildings(): void {
  if (!ctx) return

  BUILDINGS_DATA.forEach((building, index) => {
    const x = 90 + building.position.x * 1.5
    const y = 90 + building.position.z * 1.5
    const w = building.size.x * 1.5
    const h = building.size.z * 1.5

    // 建筑颜色
    const buildingColors = SCENE_CONFIG.colors.building
    const color = buildingColors[index % buildingColors.length]
    if (color) {
      ctx!.fillStyle = '#' + color.toString(16).padStart(6, '0')
      ctx!.fillRect(x - w / 2, y - h / 2, w, h)
    }

    // 选中高亮
    if (building.id === buildingStore.selectedId) {
      ctx!.strokeStyle = '#64ffda'
      ctx!.lineWidth = 2
      ctx!.strokeRect(x - w / 2, y - h / 2, w, h)
    }
  })
}

/**
 * 绘制相机
 */
function drawCamera(): void {
  if (!ctx) return

  const camera = cameraStore
  const camX = 90 + camera.position.x * 1.5
  const camY = 90 + camera.position.z * 1.5

  // 相机点
  ctx.fillStyle = '#ff0000'
  ctx.beginPath()
  ctx.arc(camX, camY, 4, 0, Math.PI * 2)
  ctx.fill()

  // 相机方向（简化）
  // 注意：这里需要从相机对象获取方向，暂时用占位
  ctx.strokeStyle = '#ff0000'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(camX, camY)
  ctx.lineTo(camX + 10, camY) // 简化处理
  ctx.stroke()
}
</script>

<style scoped>
.minimap {
  position: absolute;
  bottom: 30px;
  right: 30px;
  width: 180px;
  height: 180px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  border: 2px solid rgba(100, 255, 218, 0.3);
  overflow: hidden;
  z-index: 100;
}

canvas {
  width: 100%;
  height: 100%;
}
</style>
