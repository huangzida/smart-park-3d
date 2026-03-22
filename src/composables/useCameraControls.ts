import { ref, computed } from 'vue'
import type { Vector3 } from 'three'
import type { ViewType } from '@/types/camera'
import { useCameraStore } from '@/stores/camera'
import { CAMERA_CONFIG } from '@/config/camera.config'
import type { CameraManager } from '@/components/scene/CameraManager'

/**
 * 相机控制 Composable
 * 提供相机操作的统一接口
 */
export function useCameraControls(cameraManager: CameraManager) {
  const cameraStore = useCameraStore()
  const isAnimating = ref(false)

  /**
   * 飞到指定位置
   */
  async function flyTo(
    targetPosition: Vector3,
    lookAtTarget: Vector3,
    duration = 2000
  ): Promise<void> {
    if (isAnimating.value) return

    isAnimating.value = true
    cameraStore.setAnimating(true)

    try {
      await cameraManager.animateCamera(targetPosition, lookAtTarget, duration)
      cameraStore.updatePosition(targetPosition)
      cameraStore.updateTarget(lookAtTarget)
    } finally {
      isAnimating.value = false
      cameraStore.setAnimating(false)
    }
  }

  /**
   * 切换到预设视角
   */
  async function switchView(viewType: ViewType): Promise<void> {
    const config = CAMERA_CONFIG.positions[viewType]
    if (!config) return

    await flyTo(config.position, config.target)
    cameraStore.setCurrentView(viewType)
  }

  /**
   * 重置视角
   */
  async function reset(): Promise<void> {
    cameraStore.setAutoRotate(false)
    cameraManager.enableControls()
    await switchView('overview')
  }

  /**
   * 切换自动旋转
   */
  function toggleAutoRotate(): void {
    const newState = !cameraStore.isAutoRotating
    cameraStore.setAutoRotate(newState)

    if (!newState) {
      // 停止自动旋转时，恢复用户控制
      cameraManager.enableControls()
    }
  }

  return {
    isAnimating: computed(() => isAnimating.value || cameraStore.isAnimating),
    flyTo,
    switchView,
    reset,
    toggleAutoRotate
  }
}
