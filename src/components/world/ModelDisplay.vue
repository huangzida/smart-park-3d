<template>
  <div ref="containerRef" class="model-display-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useSceneStore } from '@/stores/scene'

const containerRef = ref<HTMLDivElement>()
const sceneStore = useSceneStore()
void containerRef // 标记为有意使用

const loader = new GLTFLoader()
let modelGroup: THREE.Group | null = null
let models: THREE.Object3D[] = []

onMounted(() => {
  if (!sceneStore.scene) return
  createModelDisplay(sceneStore.scene)
})

onUnmounted(() => {
  cleanup()
})

/**
 * 创建模型展示区域
 */
function createModelDisplay(scene: THREE.Scene): void {
  modelGroup = new THREE.Group()
  modelGroup.name = 'ModelDisplayArea'

  // 创建展示基台
  createDisplayPlatform(scene)

  // 加载模型
  loadModels()

  scene.add(modelGroup)
}

/**
 * 创建展示基台
 */
function createDisplayPlatform(scene: THREE.Scene): void {
  if (!modelGroup) return

  // 主展示区基台
  const platformGeometry = new THREE.CylinderGeometry(8, 9, 0.5, 32)
  const platformMaterial = new THREE.MeshStandardMaterial({
    color: 0x3a3a4a,
    roughness: 0.7,
    metalness: 0.3
  })
  const platform = new THREE.Mesh(platformGeometry, platformMaterial)
  platform.position.set(0, 0.25, 0)
  platform.receiveShadow = true
  platform.castShadow = true
  modelGroup.add(platform)

  // 装饰环
  const ringGeometry = new THREE.TorusGeometry(8, 0.15, 16, 64)
  const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0x6a8caf,
    roughness: 0.4,
    metalness: 0.6
  })
  const ring = new THREE.Mesh(ringGeometry, ringMaterial)
  ring.position.set(0, 0.51, 0)
  ring.rotation.x = Math.PI / 2
  modelGroup.add(ring)

  // 添加一些点光源照亮展示区
  const spotLight1 = new THREE.SpotLight(0xffffff, 2)
  spotLight1.position.set(10, 15, 10)
  spotLight1.angle = Math.PI / 6
  spotLight1.penumbra = 0.3
  spotLight1.castShadow = true
  modelGroup.add(spotLight1)

  const spotLight2 = new THREE.SpotLight(0xffffff, 2)
  spotLight2.position.set(-10, 15, -10)
  spotLight2.angle = Math.PI / 6
  spotLight2.penumbra = 0.3
  spotLight2.castShadow = true
  modelGroup.add(spotLight2)

  // 环境光补充
  const ambientLight = new THREE.AmbientLight(0x404060, 0.5)
  modelGroup.add(ambientLight)

  // 定位整个展示区域
  modelGroup.position.set(0, 0, 0)
}

/**
 * 加载模型
 */
function loadModels(): void {
  if (!modelGroup) return

  // 模型配置列表 - 请在这里添加您的模型文件路径
  const modelConfigs = [
    {
      name: 'model1',
      path: '/models/model1.glb',
      position: { x: -3, y: 1, z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    },
    // {
    //   name: 'model2',
    //   path: '/models/model2.glb',
    //   position: { x: 3, y: 1, z: 0 },
    //   scale: { x: 1, y: 1, z: 1 }
    // }
  ]

  // 加载每个模型
  modelConfigs.forEach((config, index) => {
    loader.load(
      config.path,
      (gltf) => {
        const model = gltf.scene
        model.name = config.name

        // 设置位置
        model.position.set(config.position.x, config.position.y, config.position.z)

        // 设置缩放
        model.scale.set(config.scale.x, config.scale.y, config.scale.z)

        // 启用阴影
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })

        // 添加到展示组
        if (modelGroup) {
          modelGroup.add(model)
          models.push(model)
          console.log(`模型 ${config.name} 加载成功`)
        }
      },
      (progress) => {
        // 加载进度
        const percent = (progress.loaded / progress.total) * 100
        console.log(`模型 ${config.name} 加载进度: ${percent.toFixed(2)}%`)
      },
      (error) => {
        console.error(`模型 ${config.name} 加载失败:`, error)
        // 创建一个占位立方体作为后备
        createPlaceholder(config.name, config.position, config.scale)
      }
    )
  })
}

/**
 * 创建占位体（当模型加载失败时）
 */
function createPlaceholder(name: string, position: any, scale: any): void {
  if (!modelGroup) return

  const geometry = new THREE.BoxGeometry(2, 2, 2)
  const material = new THREE.MeshStandardMaterial({
    color: 0xff6b6b,
    roughness: 0.5,
    metalness: 0.5
  })
  const placeholder = new THREE.Mesh(geometry, material)
  placeholder.name = `placeholder_${name}`
  placeholder.position.set(position.x, position.y, position.z)
  placeholder.scale.set(scale.x, scale.y, scale.z)
  placeholder.castShadow = true
  placeholder.receiveShadow = true

  // 添加线框
  const wireframeGeometry = new THREE.EdgesGeometry(geometry)
  const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })
  const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial)
  placeholder.add(wireframe)

  modelGroup.add(placeholder)
  models.push(placeholder)
  console.log(`为 ${name} 创建了占位体`)
}

/**
 * 清理资源
 */
function cleanup(): void {
  if (!sceneStore.scene || !modelGroup) return

  // 移除所有模型
  models.forEach((model) => {
    modelGroup!.remove(model)
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) child.geometry.dispose()
        const material = child.material as THREE.Material
        if (material) {
          if (Array.isArray(material)) {
            material.forEach((m) => m.dispose())
          } else {
            material.dispose()
          }
        }
      }
    })
  })
  models = []

  // 移除整个展示组
  sceneStore.scene.remove(modelGroup)
  modelGroup.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.geometry) child.geometry.dispose()
      const material = child.material as THREE.Material
      if (material) {
        if (Array.isArray(material)) {
          material.forEach((m) => m.dispose())
        } else {
          material.dispose()
        }
      }
    } else if (child instanceof THREE.Light) {
      child.dispose()
    }
  })
  modelGroup = null
}
</script>

<style scoped>
.model-display-container {
  display: none;
}
</style>
