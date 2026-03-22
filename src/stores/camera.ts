import { defineStore } from 'pinia'
import { Vector3 } from 'three'
import type { ViewType } from '@/types/camera'

export const useCameraStore = defineStore('camera', {
  state: () => ({
    position: new Vector3(40, 30, 40),
    target: new Vector3(0, 0, 0),
    isAutoRotating: false,
    isAnimating: false,
    currentView: null as ViewType | null
  }),

  actions: {
    setAutoRotate(enabled: boolean) {
      this.isAutoRotating = enabled
    },

    setAnimating(enabled: boolean) {
      this.isAnimating = enabled
    },

    setCurrentView(view: ViewType | null) {
      this.currentView = view
    },

    updatePosition(position: Vector3) {
      this.position.copy(position)
    },

    updateTarget(target: Vector3) {
      this.target.copy(target)
    }
  }
})
