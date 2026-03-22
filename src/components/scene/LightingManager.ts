import * as THREE from 'three'

/**
 * 灯光管理器
 * 负责创建和管理场景中的所有灯光，包括天空盒
 */
export class LightingManager {
  private scene: THREE.Scene
  private lights: THREE.Light[] = []
  private skyboxMesh: THREE.Mesh | null = null

  constructor(scene: THREE.Scene) {
    this.scene = scene
  }

  /**
   * 设置所有灯光
   */
  setupLights(): void {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    this.scene.add(ambientLight)
    this.lights.push(ambientLight)

    // 主光源（太阳光）
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.0)
    mainLight.position.set(50, 80, 50)
    mainLight.castShadow = true
    mainLight.shadow.mapSize.width = 2048
    mainLight.shadow.mapSize.height = 2048
    mainLight.shadow.camera.near = 0.5
    mainLight.shadow.camera.far = 200
    mainLight.shadow.camera.left = -80
    mainLight.shadow.camera.right = 80
    mainLight.shadow.camera.top = 80
    mainLight.shadow.camera.bottom = -80
    this.scene.add(mainLight)
    this.lights.push(mainLight)

    // 填充光（青色）
    const fillLight = new THREE.DirectionalLight(0x64ffda, 0.3)
    fillLight.position.set(-30, 30, -30)
    this.scene.add(fillLight)
    this.lights.push(fillLight)

    // 轮廓光（蓝色）
    const rimLight = new THREE.DirectionalLight(0x01579b, 0.25)
    rimLight.position.set(0, 20, -50)
    this.scene.add(rimLight)
    this.lights.push(rimLight)

    // 半球光（天空和地面颜色）
    const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x8b7355, 0.4)
    this.scene.add(hemisphereLight)
    this.lights.push(hemisphereLight)
  }

  /**
   * 创建天空盒
   */
  createSkybox(): void {
    // 创建球体天空盒
    const geometry = new THREE.SphereGeometry(500, 32, 32)
    
    // 创建渐变材质
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    // 天空渐变
    const gradient = ctx.createLinearGradient(0, 0, 0, 512)
    gradient.addColorStop(0, '#4A90D9') // 深蓝色顶部
    gradient.addColorStop(0.3, '#87CEEB') // 天蓝色
    gradient.addColorStop(0.6, '#B0E0E6') // 浅蓝色
    gradient.addColorStop(0.8, '#FFE4B5') // 浅杏色地平线
    gradient.addColorStop(1, '#F5DEB3') // 小麦色底部

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 512)

    // 添加一些云朵
    this.drawClouds(ctx)

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide
    })

    this.skyboxMesh = new THREE.Mesh(geometry, material)
    this.scene.add(this.skyboxMesh)
  }

  /**
   * 绘制云朵
   */
  private drawClouds(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    
    const cloudPositions = [
      { x: 80, y: 70, size: 50 },
      { x: 180, y: 55, size: 70 },
      { x: 320, y: 80, size: 60 },
      { x: 60, y: 100, size: 45 },
      { x: 260, y: 95, size: 55 },
      { x: 380, y: 65, size: 50 }
    ]

    cloudPositions.forEach((cloud) => {
      // 绘制多个圆形成云
      for (let i = 0; i < 5; i++) {
        const offsetX = (Math.random() - 0.5) * cloud.size * 1.5
        const offsetY = (Math.random() - 0.5) * cloud.size * 0.5
        const radius = cloud.size * (0.3 + Math.random() * 0.3)
        
        ctx.beginPath()
        ctx.arc(cloud.x + offsetX, cloud.y + offsetY, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    })
  }

  /**
   * 获取主光源（用于阴影配置）
   */
  getMainLight(): THREE.DirectionalLight | null {
    for (const light of this.lights) {
      if (light instanceof THREE.DirectionalLight && light.intensity >= 1.0) {
        return light
      }
    }
    return null
  }

  /**
   * 更新光照强度（用于时间变化效果）
   */
  updateLighting(intensity: number = 1): void {
    this.lights.forEach((light) => {
      if (light instanceof THREE.AmbientLight) {
        light.intensity = 0.5 * intensity
      } else if (light instanceof THREE.DirectionalLight) {
        const mainLight = this.getMainLight()
        if (light === mainLight) {
          light.intensity = 1.0 * intensity
        } else {
          light.intensity *= intensity
        }
      } else if (light instanceof THREE.HemisphereLight) {
        light.intensity = 0.4 * intensity
      }
    })
  }

  /**
   * 清理所有灯光
   */
  dispose(): void {
    this.lights.forEach((light) => {
      this.scene.remove(light)
      if (light instanceof THREE.DirectionalLight) {
        light.dispose()
        light.shadow?.map?.dispose()
      } else if (light instanceof THREE.AmbientLight || light instanceof THREE.HemisphereLight) {
        light.dispose()
      }
    })
    this.lights = []

    // 清理天空盒
    if (this.skyboxMesh) {
      if (this.skyboxMesh.geometry) this.skyboxMesh.geometry.dispose()
      if (this.skyboxMesh.material instanceof THREE.Material) {
        this.skyboxMesh.material.dispose()
      }
      this.scene.remove(this.skyboxMesh)
      this.skyboxMesh = null
    }
  }
}
