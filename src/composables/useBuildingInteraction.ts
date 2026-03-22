import * as THREE from 'three'
import { useBuildingStore } from '@/stores/building'
import { useCameraStore } from '@/stores/camera'

/**
 * 建筑交互 Composable
 * 处理建筑的点击和悬停事件
 */
export function useBuildingInteraction(
  scene: THREE.Scene,
  camera: THREE.Camera
) {
  const buildingStore = useBuildingStore()
  const cameraStore = useCameraStore()

  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  /**
   * 处理鼠标点击
   */
  function handleClick(event: MouseEvent): void {
    // 如果正在动画或游览，忽略点击
    if (cameraStore.isAnimating) return

    const { intersects } = castRay(event)

    const buildingHit = intersects.find(
      (hit) => hit.object.userData.isBuilding
    )

    if (buildingHit) {
      const index = buildingHit.object.userData.buildingIndex as number
      const building = buildingStore.buildings[index]
      if (building) {
        buildingStore.selectBuilding(building.id)
      }
    } else {
      buildingStore.clearSelection()
    }
  }

  /**
   * 处理鼠标移动
   */
  function handleMouseMove(event: MouseEvent): void {
    const { intersects } = castRay(event)

    const buildingHit = intersects.find(
      (hit) => hit.object.userData.isBuilding
    )

    if (buildingHit) {
      const index = buildingHit.object.userData.buildingIndex as number
      const building = buildingStore.buildings[index]
      if (building) {
        buildingStore.setHovered(building.id)
      }
      document.body.style.cursor = 'pointer'
    } else {
      buildingStore.setHovered(null)
      document.body.style.cursor = 'default'
    }
  }

  /**
   * 射线检测
   */
  function castRay(event: MouseEvent) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(scene.children, true)

    return { intersects }
  }

  return {
    handleClick,
    handleMouseMove
  }
}
