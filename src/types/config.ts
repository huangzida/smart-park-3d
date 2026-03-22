import type { TourPoint, CameraPosition } from './camera'

export interface SceneConfig {
  colors: {
    ground: number
    building: number[]
    buildingHighlight: number
    road: number
    tree: number
    water: number
  }
  fog: {
    color: number
    near: number
    far: number
  }
}

export interface CameraConfig {
  positions: Record<string, CameraPosition>
  controls: {
    enableDamping: boolean
    dampingFactor: number
    maxPolarAngle: number
    minDistance: number
    maxDistance: number
  }
  autoRotate: {
    radius: number
    speed: number
  }
}

// 重新导出 TourPoint
export type { TourPoint, CameraPosition }
