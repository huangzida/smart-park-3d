import * as THREE from 'three'

/**
 * 渲染器管理器
 * 负责创建和管理 WebGL 渲染器
 */
export class RendererManager {
  private renderer: THREE.WebGLRenderer
  private container: HTMLElement

  constructor(container: HTMLElement) {
    this.container = container

    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    })

    // 配置渲染器
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // 添加到容器
    this.container.appendChild(this.renderer.domElement)
  }

  /**
   * 渲染场景
   */
  render(scene: THREE.Scene, camera: THREE.Camera): void {
    this.renderer.render(scene, camera)
  }

  /**
   * 处理窗口大小调整
   */
  handleResize(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  /**
   * 获取渲染器实例
   */
  getRenderer(): THREE.WebGLRenderer {
    return this.renderer
  }

  /**
   * 获取 DOM 元素
   */
  getDomElement(): HTMLCanvasElement {
    return this.renderer.domElement
  }

  /**
   * 销毁渲染器
   */
  dispose(): void {
    this.renderer.dispose()
    this.container.removeChild(this.renderer.domElement)
  }
}
