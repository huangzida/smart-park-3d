import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

/**
 * 后处理管理器
 * 负责管理场景的后处理效果，包括泛光等
 */

export class PostProcessingManager {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.Camera
  private composer: EffectComposer
  private bloomPass: UnrealBloomPass
  private outputPass: OutputPass

  constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer = renderer
    this.scene = scene
    this.camera = camera
    this.composer = this.createComposer()
    this.bloomPass = this.createBloomPass()
    this.outputPass = this.createOutputPass()
    this.setupPasses()
  }

  /**
   * 创建后期合成器
   */
  private createComposer(): EffectComposer {
    return new EffectComposer(this.renderer)
  }

  /**
   * 创建泛光通道
   */
  private createBloomPass(): UnrealBloomPass {
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.5, // 强度（适度的泛光效果）
      0.3, // 半径（适中的泛光范围）
      2.0 // 阈值（设置为最大值，避免灯牌触发泛光）
    )
    return bloomPass
  }

  /**
   * 创建输出通道
   */
  private createOutputPass(): OutputPass {
    return new OutputPass()
  }

  /**
   * 设置后处理通道
   */
  private setupPasses(): void {
    // 渲染场景
    const renderPass = new RenderPass(this.scene, this.camera)
    this.composer.addPass(renderPass)

    // 添加泛光效果
    this.composer.addPass(this.bloomPass)

    // 添加输出通道
    this.composer.addPass(this.outputPass)
  }

  /**
   * 渲染场景（使用后期合成器）
   */
  render(): void {
    this.composer.render()
  }

  /**
   * 更新泛光参数
   */
  updateBloom(params: { strength?: number; radius?: number; threshold?: number }): void {
    if (params.strength !== undefined) {
      this.bloomPass.strength = params.strength
    }
    if (params.radius !== undefined) {
      this.bloomPass.radius = params.radius
    }
    if (params.threshold !== undefined) {
      this.bloomPass.threshold = params.threshold
    }
  }

  /**
   * 调整大小
   */
  setSize(width: number, height: number): void {
    this.composer.setSize(width, height)
  }

  /**
   * 设置像素比
   */
  setPixelRatio(pixelRatio: number): void {
    this.composer.setPixelRatio(pixelRatio)
  }

  /**
   * 获取合成器
   */
  getComposer(): EffectComposer {
    return this.composer
  }

  /**
   * 清理资源
   */
  dispose(): void {
    this.bloomPass.dispose()
    this.outputPass.dispose()
    this.composer.dispose()
  }
}
