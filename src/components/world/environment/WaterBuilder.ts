import * as THREE from 'three'

/**
 * 水体构建器
 * 创建带有动态波纹效果的池塘
 */

export class WaterBuilder {
  private group: THREE.Group
  private meshes: THREE.Mesh[] = []
  private time = 0

  constructor() {
    this.group = new THREE.Group()
  }

  /**
   * 创建池塘
   */
  createPond(radius = 6, x = -20, z = -15): THREE.Group {
    this.group = new THREE.Group()
    this.meshes = []

    // 水体
    const waterGeometry = new THREE.CircleGeometry(radius, 64)
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x0288d1,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    })
    const water = new THREE.Mesh(waterGeometry, waterMaterial)
    water.rotation.x = -Math.PI / 2
    water.position.y = 0.1
    water.userData = { isWater: true }
    this.group.add(water)
    this.meshes.push(water)

    // 水池边缘
    this.createPondEdge(radius)

    // 水面波纹装饰
    this.createRippleDecorations(radius)

    this.group.position.set(x, 0, z)
    return this.group
  }

  /**
   * 创建水池边缘
   */
  private createPondEdge(radius: number): void {
    const edgeGeometry = new THREE.TorusGeometry(radius, 0.3, 8, 64)
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: 0x666666,
      roughness: 0.7,
      metalness: 0.2
    })
    const edge = new THREE.Mesh(edgeGeometry, edgeMaterial)
    edge.rotation.x = -Math.PI / 2
    edge.position.y = 0.3
    this.group.add(edge)
    this.meshes.push(edge)

    // 内圈装饰
    const innerRadius = radius - 0.8
    const innerEdgeGeometry = new THREE.TorusGeometry(innerRadius, 0.15, 8, 64)
    const innerEdge = new THREE.Mesh(innerEdgeGeometry, edgeMaterial)
    innerEdge.rotation.x = -Math.PI / 2
    innerEdge.position.y = 0.15
    this.group.add(innerEdge)
    this.meshes.push(innerEdge)

    // 石头装饰
    this.createStoneDecorations(radius)
  }

  /**
   * 创建石头装饰
   */
  private createStoneDecorations(radius: number): void {
    const stonePositions = [
      { x: radius + 0.5, z: 0 },
      { x: radius + 0.3, z: 0.5 },
      { x: -radius - 0.5, z: 0 },
      { x: 0, z: radius + 0.5 },
      { x: 0, z: -radius - 0.5 }
    ]

    const stoneMaterial = new THREE.MeshStandardMaterial({
      color: 0x888888,
      roughness: 0.9,
      metalness: 0.0
    })

    stonePositions.forEach((pos) => {
      const stoneSize = 0.3 + Math.random() * 0.3
      const stoneGeometry = new THREE.DodecahedronGeometry(stoneSize, 0)
      const stone = new THREE.Mesh(stoneGeometry, stoneMaterial)
      stone.position.set(pos.x, 0.15, pos.z)
      stone.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )
      this.group.add(stone)
      this.meshes.push(stone)
    })
  }

  /**
   * 创建波纹装饰（静态，用于视觉层次）
   */
  private createRippleDecorations(radius: number): void {
    const rippleMaterial = new THREE.MeshBasicMaterial({
      color: 0x64b5f6,
      transparent: true,
      opacity: 0.3
    })

    for (let i = 0; i < 3; i++) {
      const rippleRadius = radius * (0.3 + i * 0.2)
      const rippleGeometry = new THREE.RingGeometry(
        rippleRadius - 0.05,
        rippleRadius,
        32
      )
      const ripple = new THREE.Mesh(rippleGeometry, rippleMaterial)
      ripple.rotation.x = -Math.PI / 2
      ripple.position.y = 0.12
      this.group.add(ripple)
      this.meshes.push(ripple)
    }
  }

  /**
   * 更新水面动画
   */
  update(deltaTime: number): void {
    this.time += deltaTime

    this.meshes.forEach((mesh) => {
      if (mesh.userData.isWater) {
        // 简单的波浪效果（通过调整透明度）
        const opacity = 0.6 + Math.sin(this.time * 2) * 0.1
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.opacity = opacity
        }
      }
    })
  }

  /**
   * 清理资源
   */
  dispose(): void {
    this.meshes.forEach((mesh) => {
      if (mesh.geometry) mesh.geometry.dispose()
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose())
        } else {
          mesh.material.dispose()
        }
      }
    })
    this.meshes = []
  }

  /**
   * 获取所有网格
   */
  getAllMeshes(): THREE.Mesh[] {
    return this.meshes
  }
}
