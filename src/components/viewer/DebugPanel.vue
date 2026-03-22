<template>
  <div class="debug-panel">
    <div class="panel-header" @click="togglePanel">
      <h3>调试面板</h3>
      <button @click.stop="togglePanel" class="toggle-btn">
        {{ isExpanded ? '▼' : '▲' }}
      </button>
    </div>

    <div v-show="isExpanded" class="panel-content">
      <!-- 灯光控制 -->
      <div class="section">
        <h4>灯光</h4>

        <div class="control-group">
          <label>环境光强度</label>
          <input type="range" :value="ambientIntensity" min="0" max="2" step="0.1" @input="updateAmbientIntensity" />
          <div class="value">{{ ambientIntensity }}</div>
        </div>

        <div class="control-group">
          <label>主光源强度</label>
          <input type="range" :value="sunIntensity" min="0" max="3" step="0.1" @input="updateSunIntensity" />
          <div class="value">{{ sunIntensity }}</div>
        </div>

        <div class="control-group">
          <label>主光源X位置</label>
          <input type="range" :value="sunPositionX" min="-100" max="100" step="5" @input="updateSunPositionX" />
          <div class="value">{{ sunPositionX }}</div>
        </div>

        <div class="control-group">
          <label>主光源Y位置</label>
          <input type="range" :value="sunPositionY" min="10" max="150" step="5" @input="updateSunPositionY" />
          <div class="value">{{ sunPositionY }}</div>
        </div>

        <div class="control-group">
          <label>阴影</label>
          <button @click="toggleShadows" :class="{ active: shadowsEnabled }">
            {{ shadowsEnabled ? '开启' : '关闭' }}
          </button>
        </div>
      </div>

      <!-- 材质控制 -->
      <div class="section">
        <h4>材质</h4>

        <div class="control-group">
          <label>金属度</label>
          <input type="range" :value="metalness" min="0" max="1" step="0.01" @input="updateMetalness" />
          <div class="value">{{ metalness }}</div>
        </div>

        <div class="control-group">
          <label>粗糙度</label>
          <input type="range" :value="roughness" min="0" max="1" step="0.01" @input="updateRoughness" />
          <div class="value">{{ roughness }}</div>
        </div>
      </div>

      <!-- 显示模式 -->
      <div class="section">
        <h4>显示模式</h4>

        <div class="control-group">
          <label>线框模式</label>
          <button @click="toggleWireframe" :class="{ active: wireframeMode }">
            {{ wireframeMode ? '开启' : '关闭' }}
          </button>
        </div>

        <div class="control-group">
          <label>透明度</label>
          <input type="range" :value="opacity" min="0" max="1" step="0.05" @input="updateOpacity" />
          <div class="value">{{ opacity }}</div>
        </div>
      </div>

      <!-- 环境 -->
      <div class="section">
        <h4>环境</h4>

        <div class="control-group">
          <label>背景颜色</label>
          <input type="color" :value="backgroundColor" @input="updateBackgroundColor" />
        </div>

        <div class="control-group">
          <label>雾效</label>
          <button @click="toggleFog" :class="{ active: fogEnabled }">
            {{ fogEnabled ? '开启' : '关闭' }}
          </button>
        </div>

        <div v-if="fogEnabled" class="control-group">
          <label>雾密度</label>
          <input type="range" :value="fogDensity" min="0" max="0.01" step="0.0005" @input="updateFogDensity" />
          <div class="value">{{ fogDensity }}</div>
        </div>
      </div>

      <!-- 重置 -->
      <div class="section">
        <button @click="resetAll" class="reset-btn">重置所有参数</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Props
defineProps<{
  ambientIntensity: number
  sunIntensity: number
  sunPositionX: number
  sunPositionY: number
  shadowsEnabled: boolean
  metalness: number
  roughness: number
  wireframeMode: boolean
  opacity: number
  backgroundColor: string
  fogEnabled: boolean
  fogDensity: number
}>()

// Emits
const emit = defineEmits<{
  'update:ambientIntensity': [value: number]
  'update:sunIntensity': [value: number]
  'update:sunPositionX': [value: number]
  'update:sunPositionY': [value: number]
  'toggle:shadows': []
  'update:metalness': [value: number]
  'update:roughness': [value: number]
  'toggle:wireframe': []
  'update:opacity': [value: number]
  'update:backgroundColor': [value: string]
  'toggle:fog': []
  'update:fogDensity': [value: number]
  'reset': []
}>()

// State
const isExpanded = ref(true)

// Methods
function togglePanel() {
  isExpanded.value = !isExpanded.value
}

function updateAmbientIntensity(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:ambientIntensity', parseFloat(target.value))
}

function updateSunIntensity(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:sunIntensity', parseFloat(target.value))
}

function updateSunPositionX(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:sunPositionX', parseInt(target.value))
}

function updateSunPositionY(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:sunPositionY', parseInt(target.value))
}

function toggleShadows() {
  emit('toggle:shadows')
}

function updateMetalness(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:metalness', parseFloat(target.value))
}

function updateRoughness(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:roughness', parseFloat(target.value))
}

function toggleWireframe() {
  emit('toggle:wireframe')
}

function updateOpacity(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:opacity', parseFloat(target.value))
}

function updateBackgroundColor(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:backgroundColor', target.value)
}

function toggleFog() {
  emit('toggle:fog')
}

function updateFogDensity(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:fogDensity', parseFloat(target.value))
}

function resetAll() {
  emit('reset')
}
</script>

<style scoped>
.debug-panel {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 300px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  color: white;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px 8px 0 0;
  cursor: pointer;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.toggle-btn {
  background: none;
  border: none;
  color: white;
  font-size: 14px;
  cursor: pointer;
  padding: 4px;
}

.panel-content {
  padding: 16px;
  max-height: 70vh;
  overflow-y: auto;
}

.section {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #87CEEB;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.control-group {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-group label {
  flex: 1;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.control-group input[type="range"] {
  flex: 2;
  cursor: pointer;
}

.control-group input[type="color"] {
  width: 40px;
  height: 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.value {
  width: 40px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  text-align: right;
}

.control-group button {
  flex: 1;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.control-group button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.control-group button.active {
  background: #4a90d9;
  border-color: #4a90d9;
}

.reset-btn {
  width: 100%;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 滚动条样式 */
.panel-content::-webkit-scrollbar {
  width: 6px;
}

.panel-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.panel-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.panel-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
