<template>
  <div ref="containerRef" class="scene-container">
    <!-- Three.js 场景将在这里渲染 -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { CameraManager } from './CameraManager'
import { LightingManager } from './LightingManager'
import { RendererManager } from './RendererManager'
import { PostProcessingManager } from './PostProcessingManager'
import { useSceneStore } from '@/stores/scene'
import { useCameraStore } from '@/stores/camera'
import { SCENE_CONFIG } from '@/config/scene.config'
import { CAMERA_CONFIG } from '@/config/camera.config'

const containerRef = ref<HTMLDivElement>()
const sceneStore = useSceneStore()
const cameraStore = useCameraStore()

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let cameraManager: CameraManager
let lightingManager: LightingManager
let rendererManager: RendererManager
let postProcessingManager: PostProcessingManager | null = null
let animationFrameId: number

onMounted(() => {
  initScene()
  window.addEventListener('resize', handleResize)
  animate(0)
})

onUnmounted(() => {
  cleanup()
})

/**
 * 初始化场景
 */
function initScene(): void {
  if (!containerRef.value) return

  // 创建场景
  scene = new THREE.Scene()
  // 移除场景背景，使用天空盒代替
  scene.fog = new THREE.Fog(
    SCENE_CONFIG.fog.color,
    SCENE_CONFIG.fog.near,
    SCENE_CONFIG.fog.far
  )

  // 创建相机
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(40, 30, 40)

  // 初始化管理器
  rendererManager = new RendererManager(containerRef.value)
  cameraManager = new CameraManager(camera, rendererManager.getDomElement())
  lightingManager = new LightingManager(scene)

  // 设置灯光
  lightingManager.setupLights()
  
  // 创建天空盒
  lightingManager.createSkybox()

  // 初始化后处理效果
  postProcessingManager = new PostProcessingManager(
    rendererManager.getRenderer(),
    scene,
    camera
  )

  // 保存场景到 store
  sceneStore.setScene(scene)

  // 暴露给 window，方便调试
  if (import.meta.env.DEV) {
    ;(window as any).threeScene = { scene, camera, cameraManager, lightingManager, postProcessingManager }
  }
}

/**
 * 渲染循环
 */
function animate(time: number): void {
  animationFrameId = requestAnimationFrame(animate)

  // 更新相机控制器（包含动画更新）
  cameraManager.update()

  // 应用自动旋转
  if (cameraStore.isAutoRotating && !cameraStore.isAnimating) {
    cameraManager.applyAutoRotate(time, CAMERA_CONFIG.autoRotate.radius)
  }

  // 使用后处理渲染
  if (postProcessingManager) {
    postProcessingManager.render()
  } else {
    rendererManager.render(scene, camera)
  }
}

/**
 * 处理窗口大小调整
 */
function handleResize(): void {
  cameraManager.handleResize(window.innerWidth, window.innerHeight)
  rendererManager.handleResize()
  
  if (postProcessingManager) {
    postProcessingManager.setSize(window.innerWidth, window.innerHeight)
  }
}

/**
 * 清理资源
 */
function cleanup(): void {
  cancelAnimationFrame(animationFrameId)
  window.removeEventListener('resize', handleResize)

  if (postProcessingManager) postProcessingManager.dispose()
  if (lightingManager) lightingManager.dispose()
  if (cameraManager) cameraManager.dispose()
  if (rendererManager) rendererManager.dispose()
}

// 暴露给父组件
defineExpose({
  scene: () => scene,
  camera: () => camera,
  cameraManager: () => cameraManager,
  lightingManager: () => lightingManager,
  postProcessingManager: () => postProcessingManager
})
</script>

<style scoped>
.scene-container {
  width: 100%;
  height: 100%;
}
</style>
