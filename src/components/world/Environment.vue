<template>
  <div ref="containerRef" class="environment-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { useSceneStore } from '@/stores/scene'
import { TreeBuilder } from './environment/TreeBuilder'
import { WaterBuilder } from './environment/WaterBuilder'
import { PropsBuilder } from './environment/PropsBuilder'

const containerRef = ref<HTMLDivElement>()
const sceneStore = useSceneStore()
void containerRef // 标记为有意使用

let treeBuilder: TreeBuilder | null = null
let waterBuilder: WaterBuilder | null = null
let propsBuilder: PropsBuilder | null = null

let groups: THREE.Group[] = []
let waterMesh: THREE.Group | null = null
let animationId: number | null = null

onMounted(() => {
  if (!sceneStore.scene) return
  createEnvironment(sceneStore.scene)
  startAnimation()
})

onUnmounted(() => {
  cleanup()
})

/**
 * 创建环境元素
 */
function createEnvironment(scene: THREE.Scene): void {
  treeBuilder = new TreeBuilder()
  waterBuilder = new WaterBuilder()
  propsBuilder = new PropsBuilder()

  createTrees(scene)
  createWater(scene)
  createProps(scene)
  createParking(scene)
}

/**
 * 创建树木 - 使用TreeBuilder
 */
function createTrees(scene: THREE.Scene): void {
  if (!treeBuilder) return

  // 普通树的位置
  const treePositions = [
    [-25, 0, 20],
    [-28, 0, 15],
    [-22, 0, 25],
    [25, 0, -20],
    [28, 0, -15],
    [22, 0, -25],
    [-20, 0, -25],
    [-25, 0, -28],
    [20, 0, 25]
  ]

  treePositions.forEach((pos) => {
    const tree = treeBuilder!.createTree()
    tree.position.set(pos[0] ?? 0, pos[1] ?? 0, pos[2] ?? 0)
    // 随机旋转和缩放，增加自然感
    tree.rotation.y = Math.random() * Math.PI * 2
    const scale = 0.8 + Math.random() * 0.4
    tree.scale.set(scale, scale, scale)
    scene.add(tree)
    groups.push(tree)
  })

  // 松树的位置
  const pineTreePositions = [
    [-30, 0, 0],
    [30, 0, 5],
    [-35, 0, -10],
    [32, 0, -8],
    [-32, 0, 12]
  ]

  pineTreePositions.forEach((pos) => {
    const pineTree = treeBuilder!.createPineTree()
    pineTree.position.set(pos[0] ?? 0, pos[1] ?? 0, pos[2] ?? 0)
    pineTree.rotation.y = Math.random() * Math.PI * 2
    const scale = 0.9 + Math.random() * 0.3
    pineTree.scale.set(scale, scale, scale)
    scene.add(pineTree)
    groups.push(pineTree)
  })
}

/**
 * 创建水池 - 使用WaterBuilder
 */
function createWater(scene: THREE.Scene): void {
  if (!waterBuilder) return

  waterMesh = waterBuilder.createPond()
  waterMesh.position.set(-20, 0, -15)
  scene.add(waterMesh)
  groups.push(waterMesh)
}

/**
 * 创建景观小品 - 使用PropsBuilder
 */
function createProps(scene: THREE.Scene): void {
  if (!propsBuilder) return

  // 路灯
  const streetLightPositions = [
    [-15, 0, 15],
    [15, 0, -15],
    [-15, 0, -20],
    [20, 0, 10],
    [25, 0, -5]
  ]

  streetLightPositions.forEach((pos) => {
    const streetLight = propsBuilder!.createStreetLight()
    streetLight.position.set(pos[0] ?? 0, pos[1] ?? 0, pos[2] ?? 0)
    streetLight.rotation.y = Math.random() * Math.PI * 2
    scene.add(streetLight)
    groups.push(streetLight)
  })

  // 长椅
  const benchPositions = [
    [-12, 0, 18],
    [18, 0, -12],
    [-8, 0, -22]
  ]

  benchPositions.forEach((pos) => {
    const bench = propsBuilder!.createBench()
    bench.position.set(pos[0] ?? 0, pos[1] ?? 0, pos[2] ?? 0)
    bench.rotation.y = Math.random() * Math.PI * 2
    scene.add(bench)
    groups.push(bench)
  })

  // 花坛
  const flowerBedPositions = [
    [-18, 0, 22],
    [22, 0, -18],
    [28, 0, -25]
  ]

  flowerBedPositions.forEach((pos) => {
    const flowerBed = propsBuilder!.createFlowerBed()
    flowerBed.position.set(pos[0] ?? 0, pos[1] ?? 0, pos[2] ?? 0)
    flowerBed.rotation.y = Math.random() * Math.PI * 2
    scene.add(flowerBed)
    groups.push(flowerBed)
  })

  // 垃圾桶
  const trashBinPositions = [
    [-14, 0, 12],
    [14, 0, -12],
    [-20, 0, -10],
    [20, 0, 12]
  ]

  trashBinPositions.forEach((pos) => {
    const trashBin = propsBuilder!.createTrashBin()
    trashBin.position.set(pos[0] ?? 0, pos[1] ?? 0, pos[2] ?? 0)
    scene.add(trashBin)
    groups.push(trashBin)
  })
}

/**
 * 创建停车场
 */
function createParking(scene: THREE.Scene): void {
  const parkingGroup = new THREE.Group()

  const parkingGeometry = new THREE.PlaneGeometry(15, 20)
  const parkingMaterial = new THREE.MeshStandardMaterial({
    color: 0x333344,
    roughness: 0.9
  })
  const parking = new THREE.Mesh(parkingGeometry, parkingMaterial)
  parking.rotation.x = -Math.PI / 2
  parking.position.y = 0
  parking.receiveShadow = true
  parkingGroup.add(parking)

  // 停车位线
  const parkingLineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      const line = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 3), parkingLineMaterial)
      line.rotation.x = -Math.PI / 2
      line.position.set(19 + i * 3.5, 0.01, 15 + j * 5)
      parkingGroup.add(line)
    }
  }

  parkingGroup.position.set(25, 0.02, 20)
  scene.add(parkingGroup)
  groups.push(parkingGroup)
}

/**
 * 开始动画循环
 */
function startAnimation(): void {
  let lastTime = 0
  function animate(time: number): void {
    // 计算时间增量
    const deltaTime = (time - lastTime) / 1000
    lastTime = time

    // 更新水体动画
    if (waterBuilder && deltaTime > 0) {
      waterBuilder.update(deltaTime)
    }
    animationId = requestAnimationFrame(animate)
  }
  animationId = requestAnimationFrame(animate)
}

/**
 * 清理资源
 */
function cleanup(): void {
  // 停止动画
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }

  if (!sceneStore.scene) return

  groups.forEach((group) => {
    sceneStore.scene!.remove(group)
    group.traverse((child) => {
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
      } else if (child instanceof THREE.PointLight || child instanceof THREE.SpotLight) {
        child.dispose()
      }
    })
  })
  groups = []
  waterMesh = null
  treeBuilder = null
  waterBuilder = null
  propsBuilder = null
}
</script>

<style scoped>
.environment-container {
  display: none;
}
</style>
