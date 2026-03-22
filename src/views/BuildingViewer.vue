<template>
  <div class="building-viewer">
    <!-- 3D 场景 -->
    <Scene3D
      ref="sceneRef"
      @model-loaded="handleModelLoaded"
      @load-progress="handleLoadProgress"
    />

    <!-- 文件选择 -->
    <FileInput @file-selected="handleFileSelected" />

    <!-- 加载提示 -->
    <LoadingIndicator :is-loading="isLoading" :progress="loadingProgress" />

    <!-- 控制面板 -->
    <ControlPanel
      :model-scale="modelScale"
      :model-rotation-x="modelRotationX"
      :model-rotation-y="modelRotationY"
      :model-rotation-z="modelRotationZ"
      :model-height="modelHeight"
      :auto-rotate="autoRotate"
      :camera-distance="cameraDistance"
      :camera-height="cameraHeight"
      @update:scale="modelScale = $event"
      @update:rotationX="modelRotationX = $event"
      @update:rotationY="modelRotationY = $event"
      @update:rotationZ="modelRotationZ = $event"
      @update:height="modelHeight = $event"
      @update:cameraDistance="handleCameraDistance"
      @update:cameraHeight="handleCameraHeight"
      @reset="handleReset"
      @toggle-auto-rotate="handleToggleAutoRotate"
      @set-view="handleSetView"
    />

    <!-- 调试面板 -->
    <DebugPanel
      :ambient-intensity="debugState.ambientIntensity"
      :sun-intensity="debugState.sunIntensity"
      :sun-position-x="debugState.sunPositionX"
      :sun-position-y="debugState.sunPositionY"
      :shadows-enabled="debugState.shadowsEnabled"
      :metalness="debugState.metalness"
      :roughness="debugState.roughness"
      :wireframe-mode="debugState.wireframeMode"
      :opacity="debugState.opacity"
      :background-color="debugState.backgroundColor"
      :fog-enabled="debugState.fogEnabled"
      :fog-density="debugState.fogDensity"
      @update:ambientIntensity="handleDebugUpdate('ambientIntensity', $event)"
      @update:sunIntensity="handleDebugUpdate('sunIntensity', $event)"
      @update:sunPositionX="handleDebugUpdate('sunPositionX', $event)"
      @update:sunPositionY="handleDebugUpdate('sunPositionY', $event)"
      @toggle:shadows="handleToggleShadows"
      @update:metalness="handleDebugUpdate('metalness', $event)"
      @update:roughness="handleDebugUpdate('roughness', $event)"
      @toggle:wireframe="handleToggleWireframe"
      @update:opacity="handleDebugUpdate('opacity', $event)"
      @update:backgroundColor="handleDebugUpdate('backgroundColor', $event)"
      @toggle:fog="handleToggleFog"
      @update:fogDensity="handleDebugUpdate('fogDensity', $event)"
      @reset="handleDebugReset"
    />

    <!-- 操作说明 -->
    <InfoPanel />

    <!-- 返回按钮 -->
    <BackButton />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import FileInput from '../components/viewer/FileInput.vue'
import LoadingIndicator from '../components/viewer/LoadingIndicator.vue'
import ControlPanel from '../components/viewer/ControlPanel.vue'
import InfoPanel from '../components/viewer/InfoPanel.vue'
import BackButton from '../components/viewer/BackButton.vue'
import Scene3D from '../components/viewer/Scene3D.vue'
import DebugPanel from '../components/viewer/DebugPanel.vue'

const sceneRef = ref<InstanceType<typeof Scene3D>>()

// 状态
const isLoading = ref(false)
const loadingProgress = ref(0)
const autoRotate = ref(false)
const modelScale = ref(1)
const modelRotationX = ref(0)
const modelRotationY = ref(0)
const modelRotationZ = ref(0)
const modelHeight = ref(0)
const cameraDistance = ref(40)
const cameraHeight = ref(20)

// 调试状态
const debugState = ref({
  ambientIntensity: 0.8,
  sunIntensity: 2.0,
  sunPositionX: 80,
  sunPositionY: 100,
  shadowsEnabled: true,
  metalness: 0.5,
  roughness: 0.5,
  wireframeMode: false,
  opacity: 1,
  backgroundColor: '#87CEEB',
  fogEnabled: true,
  fogDensity: 0.002
})

// 默认调试状态（用于重置）
const defaultDebugState = { ...debugState.value }

onMounted(() => {
  // 设置键盘监听
  sceneRef.value?.setupKeyboardListeners(handleReset, handleToggleAutoRotate)
})

/**
 * 处理文件选择
 */
function handleFileSelected(file: File) {
  const url = URL.createObjectURL(file)
  const extension = file.name.split('.').pop()?.toLowerCase()
  
  isLoading.value = true
  loadingProgress.value = 0

  if (extension === 'glb' || extension === 'gltf') {
    sceneRef.value?.loadGLTFModel(url)
  } else if (extension === 'fbx') {
    sceneRef.value?.loadFBXModel(url)
  }
}

/**
 * 处理模型加载完成
 */
function handleModelLoaded() {
  isLoading.value = false
  // 重置控制值
  modelScale.value = 1
  modelRotationX.value = 0
  modelRotationY.value = 0
  modelRotationZ.value = 0
  modelHeight.value = 0
}

/**
 * 处理加载进度
 */
function handleLoadProgress(progress: number) {
  loadingProgress.value = progress
}

/**
 * 处理重置
 */
function handleReset() {
  sceneRef.value?.resetView()
  modelScale.value = 1
  modelRotationX.value = 0
  modelRotationY.value = 0
  modelRotationZ.value = 0
  modelHeight.value = 0
}

/**
 * 处理切换自动旋转
 */
function handleToggleAutoRotate() {
  autoRotate.value = !autoRotate.value
  sceneRef.value?.toggleAutoRotate(autoRotate.value)
}

/**
 * 处理相机距离变化
 */
function handleCameraDistance(distance: number) {
  cameraDistance.value = distance
  sceneRef.value?.setCameraDistance(distance)
}

/**
 * 处理相机高度变化
 */
function handleCameraHeight(height: number) {
  cameraHeight.value = height
  sceneRef.value?.setCameraHeight(height)
}

/**
 * 处理设置预设视图
 */
function handleSetView(view: string) {
  sceneRef.value?.setView(view)
}

/**
 * 处理调试参数更新
 */
function handleDebugUpdate(key: keyof typeof debugState.value, value: number | string | boolean) {
  (debugState.value[key] as any) = value

  // 调用相应的3D场景方法
  switch (key) {
    case 'ambientIntensity':
      sceneRef.value?.updateAmbientLightIntensity(value as number)
      break
    case 'sunIntensity':
      sceneRef.value?.updateSunLightIntensity(value as number)
      break
    case 'sunPositionX':
    case 'sunPositionY':
      sceneRef.value?.updateSunLightPosition(
        debugState.value.sunPositionX,
        debugState.value.sunPositionY
      )
      break
    case 'metalness':
      sceneRef.value?.updateMaterialMetalness(value as number)
      break
    case 'roughness':
      sceneRef.value?.updateMaterialRoughness(value as number)
      break
    case 'opacity':
      sceneRef.value?.updateMaterialOpacity(value as number)
      break
    case 'backgroundColor':
      sceneRef.value?.updateBackgroundColor(value as string)
      break
    case 'fogDensity':
      sceneRef.value?.updateFogDensity(value as number)
      break
  }
}

/**
 * 处理切换阴影
 */
function handleToggleShadows() {
  debugState.value.shadowsEnabled = !debugState.value.shadowsEnabled
  sceneRef.value?.toggleShadows(debugState.value.shadowsEnabled)
}

/**
 * 处理切换线框模式
 */
function handleToggleWireframe() {
  debugState.value.wireframeMode = !debugState.value.wireframeMode
  sceneRef.value?.toggleWireframe(debugState.value.wireframeMode)
}

/**
 * 处理切换雾效
 */
function handleToggleFog() {
  debugState.value.fogEnabled = !debugState.value.fogEnabled
  sceneRef.value?.toggleFog(debugState.value.fogEnabled)
}

/**
 * 处理重置调试参数
 */
function handleDebugReset() {
  debugState.value = { ...defaultDebugState }

  // 应用默认值到场景
  sceneRef.value?.updateAmbientLightIntensity(debugState.value.ambientIntensity)
  sceneRef.value?.updateSunLightIntensity(debugState.value.sunIntensity)
  sceneRef.value?.updateSunLightPosition(
    debugState.value.sunPositionX,
    debugState.value.sunPositionY
  )
  sceneRef.value?.toggleShadows(debugState.value.shadowsEnabled)
  sceneRef.value?.updateMaterialMetalness(debugState.value.metalness)
  sceneRef.value?.updateMaterialRoughness(debugState.value.roughness)
  sceneRef.value?.toggleWireframe(debugState.value.wireframeMode)
  sceneRef.value?.updateMaterialOpacity(debugState.value.opacity)
  sceneRef.value?.updateBackgroundColor(debugState.value.backgroundColor)
  sceneRef.value?.toggleFog(debugState.value.fogEnabled)
  sceneRef.value?.updateFogDensity(debugState.value.fogDensity)
}

// 监听模型变换变化
watch(
  [modelScale, modelRotationX, modelRotationY, modelRotationZ, modelHeight],
  () => {
    sceneRef.value?.updateModelTransform(
      modelScale.value,
      modelRotationX.value,
      modelRotationY.value,
      modelRotationZ.value,
      modelHeight.value
    )
  }
)
</script>

<style scoped>
@import './BuildingViewer.css';
</style>
