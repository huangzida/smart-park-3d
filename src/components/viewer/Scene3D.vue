<template>
  <div ref="containerRef" class="scene-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

const emit = defineEmits<{
  'model-loaded': []
  'load-progress': [progress: number]
}>()

const containerRef = ref<HTMLDivElement>()

// 场景相关
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let controls: OrbitControls | null = null
let loadedModel: THREE.Object3D | null = null
let animationId: number | null = null

// 灯光引用
let ambientLight: THREE.AmbientLight | null = null
let sunLight: THREE.DirectionalLight | null = null
let hemisphereLight: THREE.HemisphereLight | null = null

onMounted(() => {
  initScene()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  cleanup()
  window.removeEventListener('resize', handleResize)
})

/**
 * 初始化场景
 */
function initScene() {
  if (!containerRef.value) return

  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87CEEB)
  scene.fog = new THREE.Fog(0x87CEEB, 100, 300)

  // 创建相机
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(30, 20, 30)

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  renderer.outputColorSpace = THREE.SRGBColorSpace
  containerRef.value.appendChild(renderer.domElement)

  // 创建控制器
  controls = new OrbitControls(camera!, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.minDistance = 5
  controls.maxDistance = 100
  controls.maxPolarAngle = Math.PI / 2

  // 创建地面
  createGround()

  // 创建灯光
  createLights()

  // 创建占位立方体
  createPlaceholder()

  // 开始动画循环
  animate()
}

/**
 * 创建地面
 */
function createGround() {
  if (!scene) return

  const groundGeometry = new THREE.CircleGeometry(50, 64)
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B7355,
    roughness: 0.9,
    metalness: 0.1
  })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  // 网格辅助
  const gridHelper = new THREE.GridHelper(100, 50, 0x555555, 0x777777)
  gridHelper.material.opacity = 0.3
  gridHelper.material.transparent = true
  scene.add(gridHelper)
}

/**
 * 创建灯光
 */
function createLights() {
  if (!scene) return

  // 1. 环境光 - 提供基础照明
  ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(ambientLight)

  // 2. 半球光 - 模拟天空和地面的反光
  hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x8B7355, 0.7)
  hemisphereLight.position.set(0, 100, 0)
  scene.add(hemisphereLight)

  // 3. 太阳光 - 主方向光（暖色，模拟自然阳光）
  sunLight = new THREE.DirectionalLight(0xFFE082, 2.0)
  sunLight.position.set(80, 100, 50)
  sunLight.castShadow = true
  sunLight.shadow.mapSize.width = 4096
  sunLight.shadow.mapSize.height = 4096
  sunLight.shadow.camera.near = 0.5
  sunLight.shadow.camera.far = 500
  sunLight.shadow.camera.left = -100
  sunLight.shadow.camera.right = 100
  sunLight.shadow.camera.top = 100
  sunLight.shadow.camera.bottom = -100
  sunLight.shadow.bias = -0.0001
  sunLight.shadow.radius = 2
  sunLight.shadow.normalBias = 0.05
  scene.add(sunLight)

  // 4. 补光 - 冷色调，来自天空方向
  const fillLight = new THREE.DirectionalLight(0xB0C4DE, 0.6)
  fillLight.position.set(-50, 60, -40)
  scene.add(fillLight)

  // 5. 背光 - 勾勒轮廓
  const backLight = new THREE.DirectionalLight(0xFFA07A, 0.4)
  backLight.position.set(30, 70, -80)
  scene.add(backLight)

  // 6. 侧面光 - 增强立体感
  const sideLight = new THREE.DirectionalLight(0xffffff, 0.5)
  sideLight.position.set(-60, 50, 30)
  scene.add(sideLight)

  // 7. 柔和的环境补光
  const softAmbientLight = new THREE.AmbientLight(0xFFF8DC, 0.3)
  scene.add(softAmbientLight)
}

/**
 * 创建占位立方体
 */
function createPlaceholder() {
  if (!scene) return

  const geometry = new THREE.BoxGeometry(10, 10, 10)
  const material = new THREE.MeshStandardMaterial({
    color: 0x4a90d9,
    roughness: 0.5,
    metalness: 0.5
  })
  const placeholder = new THREE.Mesh(geometry, material)
  placeholder.position.y = 5
  placeholder.castShadow = true
  placeholder.receiveShadow = true
  scene.add(placeholder)
  loadedModel = placeholder

  // 添加线框
  const edges = new THREE.EdgesGeometry(geometry)
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0xffffff })
  )
  placeholder.add(line)
}

/**
 * 加载GLTF/GLB模型
 */
function loadGLTFModel(url: string) {
  if (!scene) return

  // 移除旧模型
  if (loadedModel) {
    scene.remove(loadedModel)
    loadedModel = null
  }

  const loader = new GLTFLoader()
  loader.load(
    url,
    (gltf) => {
      loadedModel = gltf.scene
      adjustModel(loadedModel)
      setupModelShadows(loadedModel)
      fixMaterialsAndTextures(loadedModel)
      scene!.add(loadedModel)
      emit('model-loaded')
    },
    (progress) => {
      const percent = (progress.loaded / progress.total) * 100
      emit('load-progress', parseFloat(percent.toFixed(1)))
    },
    (error) => {
      console.error('模型加载失败:', error)
      createPlaceholder()
    }
  )
}

/**
 * 加载FBX模型
 */
function loadFBXModel(url: string) {
  if (!scene) return

  // 移除旧模型
  if (loadedModel) {
    scene.remove(loadedModel)
    loadedModel = null
  }

  const loader = new FBXLoader()
  loader.load(
    url,
    (fbx) => {
      loadedModel = fbx
      adjustModel(loadedModel)
      setupModelShadows(loadedModel)
      fixMaterialsAndTextures(loadedModel)
      scene?.add(loadedModel)
      emit('model-loaded')
    },
    (progress) => {
      const percent = (progress.loaded / progress.total) * 100
      emit('load-progress', parseFloat(percent.toFixed(1)))
    },
    (error) => {
      console.error('模型加载失败:', error)
      createPlaceholder()
    }
  )
}

/**
 * 调整模型
 */
function adjustModel(model: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(model)
  const size = new THREE.Vector3()
  box.getSize(size)

  const center = new THREE.Vector3()
  box.getCenter(center)

  model.position.sub(center)
  model.position.y = size.y / 2

  const maxSize = Math.max(size.x, size.y, size.z)
  const targetSize = 20
  const scale = targetSize / maxSize
  model.scale.setScalar(scale)
}

/**
 * 设置模型阴影
 */
function setupModelShadows(model: THREE.Object3D) {
  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true
      child.receiveShadow = true
      if (child.material) {
        child.material.needsUpdate = true
      }
    }
  })
}

/**
 * 修复材质和纹理
 */
function fixMaterialsAndTextures(model: THREE.Object3D) {
  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const material = child.material

      if (Array.isArray(material)) {
        material.forEach((mat) => fixMaterial(mat))
      } else {
        fixMaterial(material)
      }
    }
  })
}

/**
 * 修复单个材质
 */
function fixMaterial(material: THREE.Material) {
  // 处理标准材质
  if (material instanceof THREE.MeshStandardMaterial ||
      material instanceof THREE.MeshPhysicalMaterial) {
    // 修复所有纹理的颜色空间
    const textureProperties = ['map', 'normalMap', 'roughnessMap', 'metalnessMap',
                               'emissiveMap', 'aoMap', 'bumpMap', 'displacementMap']

    textureProperties.forEach(prop => {
      const texture = (material as any)[prop]
      if (texture) {
        // 根据纹理类型设置正确的颜色空间
        if (prop === 'normalMap' || prop === 'bumpMap' || prop === 'displacementMap') {
          // 法线贴图等不需要颜色空间转换
          texture.colorSpace = THREE.LinearSRGBColorSpace
        } else {
          // 颜色贴图使用SRGB颜色空间
          texture.colorSpace = THREE.SRGBColorSpace
        }
        texture.needsUpdate = true
      }
    })

    // 设置双面渲染（可选，根据需要）
    material.side = THREE.DoubleSide

    // 更新材质
    material.needsUpdate = true
  }

  // 处理基本材质
  if (material instanceof THREE.MeshBasicMaterial && material.map) {
    material.map.colorSpace = THREE.SRGBColorSpace
    material.map.needsUpdate = true
    material.needsUpdate = true
  }

  // 处理Lambert材质
  if (material instanceof THREE.MeshLambertMaterial && material.map) {
    material.map.colorSpace = THREE.SRGBColorSpace
    material.map.needsUpdate = true
    material.needsUpdate = true
  }
}

/**
 * 更新模型变换
 */
function updateModelTransform(
  scale: number,
  rotationX: number,
  rotationY: number,
  rotationZ: number,
  height: number
) {
  if (!loadedModel) return

  loadedModel.scale.setScalar(scale)
  loadedModel.rotation.x = THREE.MathUtils.degToRad(rotationX)
  loadedModel.rotation.y = THREE.MathUtils.degToRad(rotationY)
  loadedModel.rotation.z = THREE.MathUtils.degToRad(rotationZ)
  loadedModel.position.y = height
}

/**
 * 重置视图
 */
function resetView() {
  if (!camera || !controls) return

  camera.position.set(30, 20, 30)
  controls.target.set(0, 0, 0)
  controls.update()

  if (loadedModel) {
    loadedModel.scale.setScalar(1)
    loadedModel.rotation.set(0, 0, 0)
  }
}

/**
 * 设置相机距离
 */
function setCameraDistance(distance: number) {
  if (!camera || !controls) return

  // 获取当前从target到camera的向量
  const direction = new THREE.Vector3()
  direction.subVectors(camera.position, controls.target)

  // 归一化并设置新距离
  direction.normalize().multiplyScalar(distance)

  // 更新相机位置
  camera.position.copy(controls.target).add(direction)
  controls.update()
}

/**
 * 设置相机高度
 */
function setCameraHeight(height: number) {
  if (!camera) return

  camera.position.y = height
}

/**
 * 设置预设视图
 */
function setView(view: string) {
  if (!camera || !controls) return

  const distance = 40
  let position: THREE.Vector3

  switch (view) {
    case 'front':
      position = new THREE.Vector3(0, 20, distance)
      break
    case 'top':
      position = new THREE.Vector3(0, distance, 0)
      break
    case 'side':
      position = new THREE.Vector3(distance, 20, 0)
      break
    case 'isometric':
      position = new THREE.Vector3(distance * 0.7, distance * 0.7, distance * 0.7)
      break
    default:
      return
  }

  camera.position.copy(position)
  controls.target.set(0, 0, 0)
  controls.update()
}

/**
 * 切换自动旋转
 */
function toggleAutoRotate(enabled: boolean) {
  if (controls) {
    controls.autoRotate = enabled
  }
}

/**
 * 设置键盘监听
 */
function setupKeyboardListeners(
  onReset: () => void,
  onToggleAutoRotate: () => void
) {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
      onReset()
    }
    if (e.key === ' ') {
      e.preventDefault()
      onToggleAutoRotate()
    }
  })
}

/**
 * 调试功能 - 更新环境光强度
 */
function updateAmbientLightIntensity(intensity: number) {
  if (ambientLight) {
    ambientLight.intensity = intensity
  }
}

/**
 * 调试功能 - 更新主光源强度
 */
function updateSunLightIntensity(intensity: number) {
  if (sunLight) {
    sunLight.intensity = intensity
  }
}

/**
 * 调试功能 - 更新主光源位置
 */
function updateSunLightPosition(x: number, y: number) {
  if (sunLight) {
    sunLight.position.x = x
    sunLight.position.y = y
  }
}

/**
 * 调试功能 - 切换阴影
 */
function toggleShadows(enabled: boolean) {
  if (!renderer || !scene) return

  renderer.shadowMap.enabled = enabled

  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = enabled
      child.receiveShadow = enabled
    }
  })
}

/**
 * 调试功能 - 更新材质金属度
 */
function updateMaterialMetalness(metalness: number) {
  if (!loadedModel) return

  loadedModel.traverse((child) => {
    if (child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial) {
      child.material.metalness = metalness
      child.material.needsUpdate = true
    }
  })
}

/**
 * 调试功能 - 更新材质粗糙度
 */
function updateMaterialRoughness(roughness: number) {
  if (!loadedModel) return

  loadedModel.traverse((child) => {
    if (child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial) {
      child.material.roughness = roughness
      child.material.needsUpdate = true
    }
  })
}

/**
 * 调试功能 - 切换线框模式
 */
function toggleWireframe(enabled: boolean) {
  if (!loadedModel) return

  loadedModel.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material.wireframe = enabled
      child.material.needsUpdate = true
    }
  })
}

/**
 * 调试功能 - 更新透明度
 */
function updateMaterialOpacity(opacity: number) {
  if (!loadedModel) return

  loadedModel.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material.transparent = true
      child.material.opacity = opacity
      child.material.needsUpdate = true
    }
  })
}

/**
 * 调试功能 - 更新背景颜色
 */
function updateBackgroundColor(color: string) {
  if (!scene) return

  const bgColor = new THREE.Color(color)
  scene.background = bgColor
}

/**
 * 调试功能 - 切换雾效
 */
function toggleFog(enabled: boolean) {
  if (!scene) return

  if (enabled) {
    const bgColor = scene.background as THREE.Color || new THREE.Color(0x87CEEB)
    scene.fog = new THREE.Fog(bgColor, 100, 300)
  } else {
    scene.fog = null
  }
}

/**
 * 调试功能 - 更新雾密度
 */
function updateFogDensity(density: number) {
  if (!scene || !scene.fog) return

  if (scene.fog instanceof THREE.Fog) {
    scene.fog.near = 100
    scene.fog.far = 100 + (density * 1000)
  }
}

/**
 * 处理窗口大小变化
 */
function handleResize() {
  if (!camera || !renderer) return

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

/**
 * 动画循环
 */
function animate() {
  animationId = requestAnimationFrame(animate)
  if (controls) {
    controls.update()
  }
  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

/**
 * 清理资源
 */
function cleanup() {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }

  if (renderer) {
    renderer.dispose()
  }

  if (scene) {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
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
  }
}

// 暴露方法给父组件
defineExpose({
  loadGLTFModel,
  loadFBXModel,
  updateModelTransform,
  resetView,
  toggleAutoRotate,
  setupKeyboardListeners,
  updateAmbientLightIntensity,
  updateSunLightIntensity,
  updateSunLightPosition,
  toggleShadows,
  updateMaterialMetalness,
  updateMaterialRoughness,
  toggleWireframe,
  updateMaterialOpacity,
  updateBackgroundColor,
  toggleFog,
  updateFogDensity,
  setCameraDistance,
  setCameraHeight,
  setView
})
</script>

<style scoped>
@import '../../views/BuildingViewer.css';
</style>
