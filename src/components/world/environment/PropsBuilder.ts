import * as THREE from 'three'

/**
 * 景观小品构建器
 * 创建路灯、长椅、花坛等环境元素
 */

export class PropsBuilder {
  private group: THREE.Group
  private meshes: THREE.Mesh[] = []

  constructor() {
    this.group = new THREE.Group()
  }

  /**
   * 创建路灯
   */
  createStreetLight(x = 0, z = 0): THREE.Group {
    this.group = new THREE.Group()
    this.meshes = []

    // 灯柱
    const poleHeight = 5
    const poleGeometry = new THREE.CylinderGeometry(0.08, 0.12, poleHeight, 12)
    const poleMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.4,
      metalness: 0.6
    })
    const pole = new THREE.Mesh(poleGeometry, poleMaterial)
    pole.position.y = poleHeight / 2
    pole.castShadow = true
    this.group.add(pole)
    this.meshes.push(pole)

    // 灯座
    const baseGeometry = new THREE.CylinderGeometry(0.3, 0.35, 0.2, 16)
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.6,
      metalness: 0.4
    })
    const base = new THREE.Mesh(baseGeometry, baseMaterial)
    base.position.y = 0.1
    base.castShadow = true
    this.group.add(base)
    this.meshes.push(base)

    // 灯头
    const headGeometry = new THREE.SphereGeometry(0.25, 16, 16)
    const headMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffaa,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0xffffaa,
      emissiveIntensity: 0.5
    })
    const head = new THREE.Mesh(headGeometry, headMaterial)
    head.position.y = poleHeight - 0.2
    this.group.add(head)
    this.meshes.push(head)

    // 灯罩
    const shadeGeometry = new THREE.ConeGeometry(0.35, 0.3, 16, 1, true)
    const shadeMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.6,
      metalness: 0.4,
      side: THREE.DoubleSide
    })
    const shade = new THREE.Mesh(shadeGeometry, shadeMaterial)
    shade.position.y = poleHeight + 0.1
    this.group.add(shade)
    this.meshes.push(shade)

    // 光源
    const light = new THREE.PointLight(0xffffaa, 0.8, 15)
    light.position.set(0, poleHeight - 0.2, 0)
    light.castShadow = true
    light.shadow.mapSize.width = 512
    light.shadow.mapSize.height = 512
    this.group.add(light)

    this.group.position.set(x, 0, z)
    return this.group
  }

  /**
   * 创建长椅
   */
  createBench(x = 0, z = 0, rotation = 0): THREE.Group {
    this.group = new THREE.Group()
    this.meshes = []

    const benchMaterial = new THREE.MeshStandardMaterial({
      color: 0x8d6e63,
      roughness: 0.9,
      metalness: 0.0
    })

    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0x424242,
      roughness: 0.3,
      metalness: 0.7
    })

    // 座位
    const seatGeometry = new THREE.BoxGeometry(2, 0.08, 0.5)
    const seat = new THREE.Mesh(seatGeometry, benchMaterial)
    seat.position.y = 0.5
    seat.castShadow = true
    this.group.add(seat)
    this.meshes.push(seat)

    // 靠背
    const backGeometry = new THREE.BoxGeometry(2, 0.5, 0.08)
    const back = new THREE.Mesh(backGeometry, benchMaterial)
    back.position.set(0, 0.8, -0.21)
    back.castShadow = true
    this.group.add(back)
    this.meshes.push(back)

    // 扶手
    const armGeometry = new THREE.BoxGeometry(0.08, 0.4, 0.4)
    const leftArm = new THREE.Mesh(armGeometry, metalMaterial)
    leftArm.position.set(-0.9, 0.65, 0)
    this.group.add(leftArm)
    this.meshes.push(leftArm)

    const rightArm = new THREE.Mesh(armGeometry, metalMaterial)
    rightArm.position.set(0.9, 0.65, 0)
    this.group.add(rightArm)
    this.meshes.push(rightArm)

    // 腿
    const legGeometry = new THREE.BoxGeometry(0.08, 0.5, 0.4)
    const frontLeftLeg = new THREE.Mesh(legGeometry, metalMaterial)
    frontLeftLeg.position.set(-0.8, 0.25, 0.15)
    this.group.add(frontLeftLeg)
    this.meshes.push(frontLeftLeg)

    const frontRightLeg = new THREE.Mesh(legGeometry, metalMaterial)
    frontRightLeg.position.set(0.8, 0.25, 0.15)
    this.group.add(frontRightLeg)
    this.meshes.push(frontRightLeg)

    const backLeftLeg = new THREE.Mesh(legGeometry, metalMaterial)
    backLeftLeg.position.set(-0.8, 0.25, -0.15)
    this.group.add(backLeftLeg)
    this.meshes.push(backLeftLeg)

    const backRightLeg = new THREE.Mesh(legGeometry, metalMaterial)
    backRightLeg.position.set(0.8, 0.25, -0.15)
    this.group.add(backRightLeg)
    this.meshes.push(backRightLeg)

    this.group.position.set(x, 0, z)
    this.group.rotation.y = rotation
    return this.group
  }

  /**
   * 创建花坛
   */
  createFlowerBed(x = 0, z = 0): THREE.Group {
    this.group = new THREE.Group()
    this.meshes = []

    const bedRadius = 1.5
    const bedHeight = 0.4

    // 花坛主体
    const bedGeometry = new THREE.CylinderGeometry(bedRadius, bedRadius * 0.9, bedHeight, 32)
    const bedMaterial = new THREE.MeshStandardMaterial({
      color: 0x5d4037,
      roughness: 0.9,
      metalness: 0.0
    })
    const bed = new THREE.Mesh(bedGeometry, bedMaterial)
    bed.position.y = bedHeight / 2
    bed.castShadow = true
    bed.receiveShadow = true
    this.group.add(bed)
    this.meshes.push(bed)

    // 花坛边缘
    const rimGeometry = new THREE.TorusGeometry(bedRadius, 0.08, 8, 32)
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0x4e342e,
      roughness: 0.8,
      metalness: 0.0
    })
    const rim = new THREE.Mesh(rimGeometry, rimMaterial)
    rim.rotation.x = -Math.PI / 2
    rim.position.y = bedHeight
    this.group.add(rim)
    this.meshes.push(rim)

    // 植物
    this.createPlants(bedRadius, bedHeight)

    this.group.position.set(x, 0, z)
    return this.group
  }

  /**
   * 创建植物
   */
  private createPlants(bedRadius: number, bedHeight: number): void {
    const plantColors: number[] = [0x4caf50, 0x8bc34a, 0x00bcd4, 0xff9800, 0xe91e63]
    const plantCount = 8

    for (let i = 0; i < plantCount; i++) {
      const angle = (i / plantCount) * Math.PI * 2
      const distance = (bedRadius - 0.3) * Math.random()
      const x = Math.cos(angle) * distance
      const z = Math.sin(angle) * distance

      const plantColor = plantColors[i % plantColors.length]!
      const plantHeight = 0.3 + Math.random() * 0.4

      const plantGeometry = new THREE.SphereGeometry(0.15 + Math.random() * 0.1, 8, 8)
      const plantMaterial = new THREE.MeshStandardMaterial({
        color: plantColor,
        roughness: 0.8,
        metalness: 0.0
      })
      const plant = new THREE.Mesh(plantGeometry, plantMaterial)
      plant.position.set(x, bedHeight + plantHeight / 2, z)
      this.group.add(plant)
      this.meshes.push(plant)
    }
  }

  /**
   * 创建垃圾桶
   */
  createTrashBin(x = 0, z = 0): THREE.Group {
    this.group = new THREE.Group()
    this.meshes = []

    // 垃圾桶主体
    const binHeight = 1.2
    const binRadius = 0.25

    const binGeometry = new THREE.CylinderGeometry(binRadius * 0.9, binRadius, binHeight, 16)
    const binMaterial = new THREE.MeshStandardMaterial({
      color: 0x607d8b,
      roughness: 0.6,
      metalness: 0.4
    })
    const bin = new THREE.Mesh(binGeometry, binMaterial)
    bin.position.y = binHeight / 2
    bin.castShadow = true
    this.group.add(bin)
    this.meshes.push(bin)

    // 垃圾桶盖子
    const lidGeometry = new THREE.CylinderGeometry(binRadius * 1.05, binRadius * 1.05, 0.08, 16)
    const lid = new THREE.Mesh(lidGeometry, binMaterial)
    lid.position.y = binHeight + 0.04
    this.group.add(lid)
    this.meshes.push(lid)

    // 回收标识
    const symbolGeometry = new THREE.TorusGeometry(0.1, 0.02, 8, 16)
    const symbolMaterial = new THREE.MeshBasicMaterial({ color: 0x4caf50 })
    const symbol = new THREE.Mesh(symbolGeometry, symbolMaterial)
    symbol.position.set(0, binHeight * 0.6, binRadius + 0.01)
    this.group.add(symbol)
    this.meshes.push(symbol)

    this.group.position.set(x, 0, z)
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
