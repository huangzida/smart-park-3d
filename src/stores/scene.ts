import { defineStore } from 'pinia'
import * as THREE from 'three'

export const useSceneStore = defineStore('scene', {
  state: () => ({
    scene: null as THREE.Scene | null,
    isInitialized: false
  }),

  actions: {
    setScene(scene: THREE.Scene) {
      this.scene = scene
      this.isInitialized = true
    }
  }
})
