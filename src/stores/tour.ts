import { defineStore } from 'pinia'
import { TOUR_POINTS } from '@/config/camera.config'

export const useTourStore = defineStore('tour', {
  state: () => ({
    isTouring: false,
    currentIndex: 0,
    tourPoints: TOUR_POINTS
  }),

  getters: {
    progress: (state) =>
      state.tourPoints.length > 0
        ? ((state.currentIndex + 1) / state.tourPoints.length) * 100
        : 0,

    currentPoint: (state) => state.tourPoints[state.currentIndex] || null
  },

  actions: {
    startTour() {
      this.isTouring = true
      this.currentIndex = 0
    },

    stopTour() {
      this.isTouring = false
      this.currentIndex = 0
    },

    nextPoint() {
      this.currentIndex = (this.currentIndex + 1) % this.tourPoints.length
    },

    reset() {
      this.currentIndex = 0
    }
  }
})
