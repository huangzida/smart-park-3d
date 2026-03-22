import { Vector3, Group } from 'three'

export interface BuildingData {
  id: string
  name: string
  type: string
  area: string
  floors: string
  status: string
  description: string
  position: Vector3
  size: Vector3
}

export interface BuildingMesh extends Group {
  userData: BuildingData & { index: number }
}
