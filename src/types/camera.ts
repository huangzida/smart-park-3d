import { Vector3 } from 'three'

export type ViewType = 'overview' | 'front' | 'aerial' | 'side'

export interface CameraPosition {
  position: Vector3
  target: Vector3
  duration?: number
}

export interface TourPoint extends CameraPosition {
  duration: number
}
