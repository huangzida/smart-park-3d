import * as THREE from 'three'

/**
 * 树木构建器
 * 创建多层圆锥体组成的自然树木
 */

export class TreeBuilder {
  private group: THREE.Group
  private meshes: THREE.Mesh[] = []

  constructor() {
    this.group = new THREE.Group()
  }

  /**
   * 创建单棵树
   */
  createTree(scale = 1): THREE.Group {
    this.group = new THREE.Group()
    this.meshes = []

    // 树干
    this.createTrunk(scale)

    // 树冠（多层）
    this.createFoliage(scale)

    return this.group
  }

  /**
   * 创建树干
   */
  private createTrunk(scale: number): void {
    const trunkHeight = 2 * scale
    const trunkRadius = 0.3 * scale

    const trunkGeometry = new THREE.CylinderGeometry(
      trunkRadius * 0.8,
      trunkRadius,
      trunkHeight,
      12
    )
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x5d4037,
      roughness: 0.9,
      metalness: 0.0
    })
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial)
    trunk.position.y = trunkHeight / 2
    trunk.castShadow = true
    trunk.receiveShadow = true
    this.group.add(trunk)
    this.meshes.push(trunk)

    // 添加树枝细节
    this.createBranches(scale, trunkHeight)
  }

  /**
   * 创建树枝
   */
  private createBranches(scale: number, trunkHeight: number): void {
    const branchCount = 5
    const branchMaterial = new THREE.MeshStandardMaterial({
      color: 0x4e342e,
      roughness: 0.9,
      metalness: 0.0
    })

    for (let i = 0; i < branchCount; i++) {
      const angle = (i / branchCount) * Math.PI * 2
      const branchHeight = 1.2 * scale + Math.random() * 0.3 * scale

      const branchGeometry = new THREE.CylinderGeometry(
        0.03 * scale,
        0.06 * scale,
        branchHeight,
        6
      )
      const branch = new THREE.Mesh(branchGeometry, branchMaterial)

      // 分支从树干中上部伸出
      branch.position.set(
        Math.cos(angle) * 0.2 * scale,
        trunkHeight * 0.6,
        Math.sin(angle) * 0.2 * scale
      )

      // 分支向外倾斜
      branch.rotation.z = Math.PI / 4
      branch.rotation.y = angle

      this.group.add(branch)
      this.meshes.push(branch)
    }
  }

  /**
   * 创建树冠（多层圆锥）
   */
  private createFoliage(scale: number): void {
    const foliageMaterial = new THREE.MeshStandardMaterial({
      color: 0x2e7d32,
      roughness: 0.8,
      metalness: 0.0,
      flatShading: true
    })

    // 下层树冠
    const lowerConeGeometry = new THREE.ConeGeometry(2 * scale, 2.5 * scale, 8)
    const lowerCone = new THREE.Mesh(lowerConeGeometry, foliageMaterial)
    lowerCone.position.y = 3.5 * scale
    lowerCone.castShadow = true
    this.group.add(lowerCone)
    this.meshes.push(lowerCone)

    // 中层树冠
    const middleConeGeometry = new THREE.ConeGeometry(1.5 * scale, 2 * scale, 8)
    const middleCone = new THREE.Mesh(middleConeGeometry, foliageMaterial)
    middleCone.position.y = 5 * scale
    middleCone.castShadow = true
    this.group.add(middleCone)
    this.meshes.push(middleCone)

    // 上层树冠
    const upperConeGeometry = new THREE.ConeGeometry(1 * scale, 1.5 * scale, 8)
    const upperCone = new THREE.Mesh(upperConeGeometry, foliageMaterial)
    upperCone.position.y = 6.25 * scale
    upperCone.castShadow = true
    this.group.add(upperCone)
    this.meshes.push(upperCone)
  }

  /**
   * 创建松树样式
   */
  createPineTree(scale = 1): THREE.Group {
    this.group = new THREE.Group()
    this.meshes = []

    // 直立的树干
    const trunkGeometry = new THREE.CylinderGeometry(0.2 * scale, 0.3 * scale, 3 * scale, 12)
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x3e2723,
      roughness: 0.9,
      metalness: 0.0
    })
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial)
    trunk.position.y = 1.5 * scale
    trunk.castShadow = true
    this.group.add(trunk)
    this.meshes.push(trunk)

    // 松树树冠（更加尖锐）
    const pineMaterial = new THREE.MeshStandardMaterial({
      color: 0x1b5e20,
      roughness: 0.8,
      metalness: 0.0,
      flatShading: true
    })

    // 多层尖锐的圆锥
    const coneCount = 4
    for (let i = 0; i < coneCount; i++) {
      const coneRadius = (2.5 - i * 0.4) * scale
      const coneHeight = (2 - i * 0.2) * scale
      const coneY = 2.5 * scale + i * 1.2 * scale

      const coneGeometry = new THREE.ConeGeometry(coneRadius, coneHeight, 8)
      const cone = new THREE.Mesh(coneGeometry, pineMaterial)
      cone.position.y = coneY
      cone.castShadow = true
      this.group.add(cone)
      this.meshes.push(cone)
    }

    return this.group
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
