import { useTourStore } from '@/stores/tour'
import type { CameraManager } from '@/components/scene/CameraManager'

/**
 * 游览功能 Composable
 */
export function useTour(cameraManager: CameraManager) {
  const tourStore = useTourStore()

  let tourTimeout: ReturnType<typeof setTimeout> | null = null

  /**
   * 开始游览
   */
  async function startTour(): Promise<void> {
    tourStore.startTour()
    await nextTourPoint()
  }

  /**
   * 停止游览
   */
  function stopTour(): void {
    tourStore.stopTour()
    if (tourTimeout) {
      clearTimeout(tourTimeout)
      tourTimeout = null
    }
    cameraManager.enableControls()
  }

  /**
   * 切换游览状态
   */
  async function toggleTour(): Promise<void> {
    if (tourStore.isTouring) {
      stopTour()
    } else {
      await startTour()
    }
  }

  /**
   * 下一个游览点
   */
  async function nextTourPoint(): Promise<void> {
    if (!tourStore.isTouring) return

    const point = tourStore.currentPoint
    if (!point) return

    // 执行相机动画
    await cameraManager.animateCamera(point.position, point.target, point.duration)

    // 更新进度
    tourStore.nextPoint()

    // 继续下一个点
    if (tourStore.isTouring) {
      tourTimeout = setTimeout(() => {
        nextTourPoint()
      }, point.duration + 1000)
    }
  }

  return {
    isTouring: () => tourStore.isTouring,
    progress: () => tourStore.progress,
    currentIndex: () => tourStore.currentIndex,
    totalCount: () => tourStore.tourPoints.length,
    toggleTour,
    startTour,
    stopTour
  }
}
