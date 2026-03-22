import { defineStore } from 'pinia'
import { BUILDINGS_DATA } from '@/config/buildings.data'

export const useBuildingStore = defineStore('building', {
  state: () => ({
    selectedId: null as string | null,
    hoveredId: null as string | null,
    buildings: BUILDINGS_DATA
  }),

  getters: {
    selectedBuilding: (state) =>
      state.buildings.find((b) => b.id === state.selectedId) || null,

    selectedBuildingIndex: (state) =>
      state.buildings.findIndex((b) => b.id === state.selectedId),

    hoveredBuildingIndex: (state) =>
      state.buildings.findIndex((b) => b.id === state.hoveredId)
  },

  actions: {
    selectBuilding(id: string) {
      this.selectedId = id
    },

    clearSelection() {
      this.selectedId = null
    },

    setHovered(id: string | null) {
      this.hoveredId = id
    }
  }
})
