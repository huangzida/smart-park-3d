import { Vector3 } from 'three'
import type { CameraConfig, TourPoint } from '@/types/config'

export const CAMERA_CONFIG: CameraConfig = {
  positions: {
    overview: {
      position: new Vector3(40, 30, 40),
      target: new Vector3(0, 0, 0)
    },
    front: {
      position: new Vector3(0, 8, 35),
      target: new Vector3(0, 3, 0)
    },
    aerial: {
      position: new Vector3(0, 60, 0.1),
      target: new Vector3(0, 0, 0)
    },
    side: {
      position: new Vector3(45, 15, 0),
      target: new Vector3(0, 5, 0)
    }
  },
  controls: {
    enableDamping: true,
    dampingFactor: 0.05,
    maxPolarAngle: Math.PI / 2.1,
    minDistance: 10,
    maxDistance: 100
  },
  autoRotate: {
    radius: 50,
    speed: 0.0001
  }
}

export const TOUR_POINTS: TourPoint[] = [
  { position: new Vector3(30, 15, 30), target: new Vector3(0, 0, 0), duration: 3000 },
  { position: new Vector3(0, 8, 35), target: new Vector3(0, 3, 0), duration: 3000 },
  { position: new Vector3(-30, 12, 20), target: new Vector3(-10, 0, 0), duration: 3000 },
  { position: new Vector3(20, 10, -25), target: new Vector3(10, 0, 0), duration: 3000 },
  { position: new Vector3(0, 40, 0.1), target: new Vector3(0, 0, 0), duration: 3000 }
]
