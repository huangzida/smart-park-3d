<template>
  <div ref="containerRef" class="ground-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { SCENE_CONFIG } from '@/config/scene.config'
import { useSceneStore } from '@/stores/scene'

const containerRef = ref<HTMLDivElement>()
const sceneStore = useSceneStore()
void containerRef // 标记为有意使用

let meshes: (THREE.Mesh | THREE.LineSegments)[] = []

onMounted(() => {
  if (!sceneStore.scene) return
  createGround(sceneStore.scene)
})

onUnmounted(() => {
  cleanup()
})

/**
 * 创建地面
 */
function createGround(scene: THREE.Scene): void {
  // 主地面
  const groundGeometry = new THREE.PlaneGeometry(120, 120)
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: SCENE_CONFIG.colors.ground,
    roughness: 0.9,
    metalness: 0.1
  })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)
  meshes.push(ground)

  // 道路网格
  const roadMaterial = new THREE.MeshStandardMaterial({
    color: SCENE_CONFIG.colors.road,
    roughness: 0.8
  })

  // 主干道
  const mainRoad = new THREE.Mesh(new THREE.PlaneGeometry(8, 80), roadMaterial)
  mainRoad.rotation.x = -Math.PI / 2
  mainRoad.position.y = 0.01
  scene.add(mainRoad)
  meshes.push(mainRoad)

  // 横向道路
  const crossRoad = new THREE.Mesh(new THREE.PlaneGeometry(80, 6), roadMaterial)
  crossRoad.rotation.x = -Math.PI / 2
  crossRoad.position.y = 0.01
  scene.add(crossRoad)
  meshes.push(crossRoad)

  // 道路标线
  const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x64ffda })
  for (let i = -35; i <= 35; i += 5) {
    const line = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 2), lineMaterial)
    line.rotation.x = -Math.PI / 2
    line.position.set(0, 0.02, i)
    scene.add(line)
    meshes.push(line)
  }

  // 园区边界
  const boundaryGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(110, 2, 110))
  const boundaryMaterial = new THREE.LineBasicMaterial({
    color: 0x64ffda,
    transparent: true,
    opacity: 0.5
  })
  const boundary = new THREE.LineSegments(boundaryGeometry, boundaryMaterial)
  boundary.position.y = 1
  scene.add(boundary)
  meshes.push(boundary)
}

/**
 * 清理资源
 */
function cleanup(): void {
  if (!sceneStore.scene) return

  meshes.forEach((mesh) => {
    sceneStore.scene!.remove(mesh)
    if (mesh.geometry) mesh.geometry.dispose()
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => m.dispose())
      } else {
        mesh.material.dispose()
      }
    }
  })
  meshes = []
}
</script>

<style scoped>
.ground-container {
  display: none;
}
</style>
