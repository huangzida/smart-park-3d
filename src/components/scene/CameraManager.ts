import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import type { Camera, Object3D } from 'three'

/**
 * 相机管理器
 * 负责管理相机和 OrbitControls，解决动画期间的冲突问题
 */
export class CameraManager {
  public readonly camera: Camera
  private controls: OrbitControls
  private animationLock: boolean = false
  private currentAnimation: {
    startTime: number
    duration: number
    startPosition: THREE.Vector3
    endPosition: THREE.Vector3
    startTarget: THREE.Vector3
    endTarget: THREE.Vector3
    resolve: () => void
  } | null = null

  constructor(camera: Camera, domElement: HTMLCanvasElement) {
    this.camera = camera

    // 创建 OrbitControls
    this.controls = new OrbitControls(camera, domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.maxPolarAngle = Math.PI / 2.1
    this.controls.minDistance = 10
    this.controls.maxDistance = 100
    this.controls.target.set(0, 0, 0)
  }

  /**
   * 相机飞行动画
   * 动画期间锁定 OrbitControls，避免冲突
   */
  async animateCamera(
    targetPos: THREE.Vector3,
    targetLookAt: THREE.Vector3,
    duration: number
  ): Promise<void> {
    if (this.animationLock) return

    this.animationLock = true
    this.controls.enabled = false

    const startPosition = this.camera.position.clone()
    const startTarget = this.controls.target.clone()
    const endTarget = targetLookAt.clone()

    // 使用 Promise 包装动画
    return new Promise<void>((resolve) => {
      this.currentAnimation = {
        startTime: performance.now(),
        duration,
        startPosition,
        endPosition: targetPos,
        startTarget,
        endTarget,
        resolve: () => {
          // 动画完成，恢复状态
          this.controls.target.copy(endTarget)
          this.controls.enabled = true
          this.animationLock = false
          this.currentAnimation = null
          resolve()
        }
      }
    })
  }

  /**
   * 聚焦到特定对象
   * 自动计算合适的观察位置
   */
  async focusOnObject(
    object: Object3D,
    duration: number = 1500,
    offset: THREE.Vector3 = new THREE.Vector3(15, 10, 15)
  ): Promise<void> {
    // 获取对象的世界位置
    const targetPosition = new THREE.Vector3()
    object.getWorldPosition(targetPosition)

    // 计算相机目标位置
    const cameraPosition = targetPosition.clone().add(offset)

    // 执行动画
    await this.animateCamera(cameraPosition, targetPosition, duration)
  }

  /**
   * 重置相机到默认视图
   */
  async resetCamera(duration: number = 1500): Promise<void> {
    const defaultPosition = new THREE.Vector3(40, 30, 40)
    const defaultTarget = new THREE.Vector3(0, 0, 0)
    await this.animateCamera(defaultPosition, defaultTarget, duration)
  }

  /**
   * 设置自动旋转速度
   */
  setAutoRotateSpeed(speed: number): void {
    this.controls.autoRotate = speed > 0
    this.controls.autoRotateSpeed = speed
  }

  /**
   * 更新动画（在渲染循环中调用）
   */
  updateAnimation(currentTime: number): void {
    if (!this.currentAnimation) return

    const anim = this.currentAnimation
    const elapsed = currentTime - anim.startTime
    const progress = Math.min(elapsed / anim.duration, 1)

    // 使用缓动函数 (easeInOutCubic)
    const eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2

    // 更新相机位置
    this.camera.position.lerpVectors(anim.startPosition, anim.endPosition, eased)

    // 更新相机目标
    const currentTarget = new THREE.Vector3().lerpVectors(anim.startTarget, anim.endTarget, eased)
    this.camera.lookAt(currentTarget)

    // 检查动画是否完成
    if (progress >= 1) {
      anim.resolve()
    }
  }

  /**
   * 应用自动旋转
   */
  applyAutoRotate(time: number, radius: number) {
    if (!this.animationLock) {
      this.controls.enabled = false
      this.camera.position.x = Math.cos(time * 0.0001) * radius
      this.camera.position.z = Math.sin(time * 0.0001) * radius
      this.camera.lookAt(0, 0, 0)
    }
  }

  /**
   * 恢复用户控制
   */
  enableControls() {
    if (!this.animationLock) {
      this.controls.enabled = true
    }
  }

  /**
   * 每帧更新
   */
  update() {
    // 更新动画
    if (this.currentAnimation) {
      this.updateAnimation(performance.now())
    }

    // 只有在非锁定状态才更新 controls
    if (!this.animationLock) {
      this.controls.update()
    }
  }

  /**
   * 处理窗口大小调整
   */
  handleResize(width: number, height: number) {
    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
    }
  }

  /**
   * 获取是否正在动画
   */
  isAnimating(): boolean {
    return this.animationLock
  }

  /**
   * 获取 controls 实例
   */
  getControls(): OrbitControls {
    return this.controls
  }

  /**
   * 销毁
   */
  dispose() {
    this.controls.dispose()
  }
}
