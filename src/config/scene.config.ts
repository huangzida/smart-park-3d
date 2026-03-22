import type { SceneConfig } from '@/types/config'

export const SCENE_CONFIG: SceneConfig = {
  colors: {
    ground: 0x1a1a2e,
    building: [0x009688, 0x01579b, 0x6a1b9a, 0xff6f00, 0x43a047],
    buildingHighlight: 0x64ffda,
    road: 0x2d2d44,
    tree: 0x2e7d32,
    water: 0x0288d1
  },
  fog: {
    color: 0x0a0a1a,
    near: 50,
    far: 150
  }
}
