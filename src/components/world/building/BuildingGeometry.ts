import * as THREE from 'three'
import type { BuildingData } from '@/types/building'

/**
 * 建筑几何生成器
 * 使用程序化生成创建多层、细节丰富的建筑结构
 */

export class BuildingGeometry {
  private group: THREE.Group
  private meshes: THREE.Mesh[] = []
  private lineSegments: THREE.LineSegments[] = []

  constructor() {
    this.group = new THREE.Group()
  }

  /**
   * 创建完整建筑
   */
  createBuilding(buildingData: BuildingData, index: number): THREE.Group {
    this.group = new THREE.Group()
    this.group.userData = { ...buildingData, index }
    this.meshes = []

    // 1. 建筑主体
    this.createMainStructure(buildingData, index)

    // 2. 窗户系统
    this.createWindows(buildingData)

    // 3. 入口区域
    this.createEntrance(buildingData)

    // 4. 屋顶装饰
    this.createRoofDetails(buildingData)

    // 5. 建筑轮廓线
    this.createBuildingOutline(buildingData)

    return this.group
  }

  /**
   * 创建建筑轮廓线
   */
  private createBuildingOutline(buildingData: BuildingData): void {
    const { size } = buildingData

    // 创建边缘线
    const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(size.x, size.y, size.z))
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x64ffda,
      transparent: true,
      opacity: 0.3
    })
    const wireframe = new THREE.LineSegments(edges, lineMaterial)
    this.group.add(wireframe)
    this.lineSegments.push(wireframe)
  }

  /**
   * 创建建筑主体结构
   */
  private createMainStructure(buildingData: BuildingData, index: number): void {
    const { size } = buildingData

    // 主体建筑
    const mainGeometry = new THREE.BoxGeometry(size.x, size.y, size.z)
    const mainMaterial = new THREE.MeshStandardMaterial({
      color: this.getBuildingColor(index),
      roughness: 0.8,
      metalness: 0.1
    })
    const mainMesh = new THREE.Mesh(mainGeometry, mainMaterial)
    mainMesh.castShadow = true
    mainMesh.receiveShadow = true
    mainMesh.userData = { isBuilding: true, buildingIndex: index }
    this.group.add(mainMesh)
    this.meshes.push(mainMesh)

    // 建筑底部基座
    const baseHeight = 0.3
    const baseGeometry = new THREE.BoxGeometry(size.x + 0.2, baseHeight, size.z + 0.2)
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x333344,
      roughness: 0.9,
      metalness: 0.0
    })
    const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial)
    baseMesh.position.y = -size.y / 2 - baseHeight / 2
    baseMesh.receiveShadow = true
    this.group.add(baseMesh)
    this.meshes.push(baseMesh)

    // 建筑顶部边框
    const topBorderGeometry = new THREE.BoxGeometry(size.x + 0.1, 0.2, size.z + 0.1)
    const topBorderMaterial = new THREE.MeshStandardMaterial({
      color: 0x888888,
      roughness: 0.5,
      metalness: 0.3
    })
    const topBorderMesh = new THREE.Mesh(topBorderGeometry, topBorderMaterial)
    topBorderMesh.position.y = size.y / 2 + 0.1
    this.group.add(topBorderMesh)
    this.meshes.push(topBorderMesh)
  }

  /**
   * 创建窗户系统
   */
  private createWindows(buildingData: BuildingData): void {
    const { size } = buildingData
    const floors = Math.floor(size.y / 1.5)
    const windowsPerFloor = Math.floor(size.x / 1.5)

    // 窗户材质
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x87ceeb,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.9,
      thickness: 0.5,
      transparent: true,
      opacity: 0.7
    })

    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.3,
      metalness: 0.8
    })

    for (let floor = 0; floor < floors; floor++) {
      const floorY = -size.y / 2 + 1 + floor * 1.5

      for (let w = 0; w < windowsPerFloor; w++) {
        const windowX = -size.x / 2 + 0.8 + w * 1.4

        // 窗户玻璃
        const glassGeometry = new THREE.PlaneGeometry(0.8, 1.0)
        const glass = new THREE.Mesh(glassGeometry, glassMaterial)
        glass.position.set(windowX, floorY, size.z / 2 + 0.02)
        this.group.add(glass)
        this.meshes.push(glass)

        // 窗户框
        const frameThickness = 0.05
        const frameGeometryV = new THREE.BoxGeometry(frameThickness, 1.0, 0.05)
        const frameGeometryH = new THREE.BoxGeometry(0.8, frameThickness, 0.05)

        // 左框
        const leftFrame = new THREE.Mesh(frameGeometryV, frameMaterial)
        leftFrame.position.set(windowX - 0.4, floorY, size.z / 2 + 0.03)
        this.group.add(leftFrame)
        this.meshes.push(leftFrame)

        // 右框
        const rightFrame = new THREE.Mesh(frameGeometryV, frameMaterial)
        rightFrame.position.set(windowX + 0.4, floorY, size.z / 2 + 0.03)
        this.group.add(rightFrame)
        this.meshes.push(rightFrame)

        // 上框
        const topFrame = new THREE.Mesh(frameGeometryH, frameMaterial)
        topFrame.position.set(windowX, floorY + 0.5, size.z / 2 + 0.03)
        this.group.add(topFrame)
        this.meshes.push(topFrame)

        // 下框
        const bottomFrame = new THREE.Mesh(frameGeometryH, frameMaterial)
        bottomFrame.position.set(windowX, floorY - 0.5, size.z / 2 + 0.03)
        this.group.add(bottomFrame)
        this.meshes.push(bottomFrame)

        // 背面窗户（简化）
        const glassBack = glass.clone()
        glassBack.position.z = -size.z / 2 - 0.02
        glassBack.rotation.y = Math.PI
        this.group.add(glassBack)
        this.meshes.push(glassBack)
      }
    }
  }

  /**
   * 创建入口区域
   */
  private createEntrance(buildingData: BuildingData): void {
    const { size } = buildingData

    // 台阶
    const stepCount = 3
    const stepHeight = 0.15
    const stepDepth = 0.5

    for (let i = 0; i < stepCount; i++) {
      const stepGeometry = new THREE.BoxGeometry(3, stepHeight, stepDepth)
      const stepMaterial = new THREE.MeshStandardMaterial({
        color: 0x666666,
        roughness: 0.9
      })
      const step = new THREE.Mesh(stepGeometry, stepMaterial)
      step.position.set(0, -size.y / 2 + i * stepHeight, size.z / 2 + 0.2 + i * stepDepth)
      step.receiveShadow = true
      this.group.add(step)
      this.meshes.push(step)
    }

    // 雨棚
    const canopyWidth = 4
    const canopyDepth = 2
    const canopyGeometry = new THREE.BoxGeometry(canopyWidth, 0.1, canopyDepth)
    const canopyMaterial = new THREE.MeshStandardMaterial({
      color: 0x64ffda,
      roughness: 0.5,
      metalness: 0.3
    })
    const canopy = new THREE.Mesh(canopyGeometry, canopyMaterial)
    canopy.position.set(0, -size.y / 2 + stepCount * stepHeight + 0.8, size.z / 2 + 1.5)
    canopy.castShadow = true
    this.group.add(canopy)
    this.meshes.push(canopy)

    // 雨棚支撑柱
    const pillarGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8)
    const pillarMaterial = new THREE.MeshStandardMaterial({
      color: 0x888888,
      roughness: 0.3,
      metalness: 0.7
    })

    const leftPillar = new THREE.Mesh(pillarGeometry, pillarMaterial)
    leftPillar.position.set(-canopyWidth / 3, -size.y / 2 + stepCount * stepHeight + 0.05, size.z / 2 + 1.5)
    this.group.add(leftPillar)
    this.meshes.push(leftPillar)

    const rightPillar = new THREE.Mesh(pillarGeometry, pillarMaterial)
    rightPillar.position.set(canopyWidth / 3, -size.y / 2 + stepCount * stepHeight + 0.05, size.z / 2 + 1.5)
    this.group.add(rightPillar)
    this.meshes.push(rightPillar)

    // 入口门
    const doorGeometry = new THREE.BoxGeometry(1.5, 2.2, 0.1)
    const doorMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a5568,
      roughness: 0.7,
      metalness: 0.2
    })
    const door = new THREE.Mesh(doorGeometry, doorMaterial)
    door.position.set(0, -size.y / 2 + 1.1, size.z / 2 + 0.05)
    this.group.add(door)
    this.meshes.push(door)
  }

  /**
   * 创建屋顶装饰
   */
  private createRoofDetails(buildingData: BuildingData): void {
    const { size } = buildingData

    // 顶部装饰块
    const detailGeometry = new THREE.BoxGeometry(size.x * 0.3, 1.5, size.z * 0.3)
    const detailMaterial = new THREE.MeshStandardMaterial({
      color: 0x64ffda,
      roughness: 0.5,
      metalness: 0.3,
      emissive: 0x64ffda,
      emissiveIntensity: 0.005 // 降低发光强度，避免太亮
    })
    const detail = new THREE.Mesh(detailGeometry, detailMaterial)
    detail.position.y = size.y / 2 + 0.95
    detail.castShadow = true
    this.group.add(detail)
    this.meshes.push(detail)

    // 天线/避雷针
    const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8)
    const antennaMaterial = new THREE.MeshStandardMaterial({
      color: 0x666666,
      roughness: 0.5,
      metalness: 0.8
    })
    const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial)
    antenna.position.set(0, size.y / 2 + 0.3 + 0.75, 0)
    this.group.add(antenna)
    this.meshes.push(antenna)
  }

  /**
   * 获取建筑颜色
   */
  private getBuildingColor(index: number): number {
    const colors = [0x009688, 0x01579b, 0x6a1b9a, 0xff6f00, 0x43a047]
    return colors[index % colors.length]!
  }

  /**
   * 更新高亮效果
   */
  updateHighlight(isSelected: boolean): void {
    this.meshes.forEach((mesh) => {
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        mesh.material.emissive.setHex(isSelected ? 0x222222 : 0x000000)
      }
    })
  }

  /**
   * 更新悬停效果
   */
  updateHover(isHovered: boolean, isSelected: boolean): void {
    if (isSelected) return

    this.meshes.forEach((mesh) => {
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        mesh.material.emissive.setHex(isHovered ? 0x111111 : 0x000000)
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

    this.lineSegments.forEach((line) => {
      if (line.geometry) line.geometry.dispose()
      if (line.material) {
        const material = line.material
        if (Array.isArray(material)) {
          material.forEach((m) => m.dispose())
        } else {
          material.dispose()
        }
      }
    })
    this.lineSegments = []
  }

  /**
   * 获取主网格
   */
  getMainMesh(): THREE.Mesh | null {
    return this.meshes[0] || null
  }

  /**
   * 获取所有网格
   */
  getAllMeshes(): THREE.Mesh[] {
    return this.meshes
  }
}
