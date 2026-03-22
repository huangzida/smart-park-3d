<template>
  <div class="controls">
    <div class="panel-header" @click="togglePanel">
      <h3>模型控制</h3>
      <button @click.stop="togglePanel" class="toggle-btn">
        {{ isExpanded ? '▼' : '▲' }}
      </button>
    </div>

    <div v-show="isExpanded" class="panel-content">
      <!-- 变换控制 -->
      <div class="section">
        <h4>变换</h4>

        <div class="control-group">
          <label>缩放</label>
          <input
            type="range"
            :value="modelScale"
            min="0.1"
            max="5"
            step="0.1"
            @input="updateScale"
          />
          <div class="value">{{ modelScale.toFixed(1) }}</div>
        </div>

        <div class="control-group">
          <label>旋转 X</label>
          <input
            type="range"
            :value="modelRotationX"
            min="-180"
            max="180"
            step="1"
            @input="updateRotationX"
          />
          <div class="value">{{ modelRotationX }}°</div>
        </div>

        <div class="control-group">
          <label>旋转 Y</label>
          <input
            type="range"
            :value="modelRotationY"
            min="-180"
            max="180"
            step="1"
            @input="updateRotationY"
          />
          <div class="value">{{ modelRotationY }}°</div>
        </div>

        <div class="control-group">
          <label>旋转 Z</label>
          <input
            type="range"
            :value="modelRotationZ"
            min="-180"
            max="180"
            step="1"
            @input="updateRotationZ"
          />
          <div class="value">{{ modelRotationZ }}°</div>
        </div>

        <div class="control-group">
          <label>高度</label>
          <input
            type="range"
            :value="modelHeight"
            min="-50"
            max="100"
            step="0.5"
            @input="updateHeight"
          />
          <div class="value">{{ modelHeight.toFixed(1) }}</div>
        </div>
      </div>

      <!-- 相机控制 -->
      <div class="section">
        <h4>相机</h4>

        <div class="control-group">
          <label>相机距离</label>
          <input
            type="range"
            :value="cameraDistance"
            min="5"
            max="100"
            step="1"
            @input="updateCameraDistance"
          />
          <div class="value">{{ cameraDistance }}</div>
        </div>

        <div class="control-group">
          <label>相机高度</label>
          <input
            type="range"
            :value="cameraHeight"
            min="5"
            max="80"
            step="1"
            @input="updateCameraHeight"
          />
          <div class="value">{{ cameraHeight }}</div>
        </div>
      </div>

      <!-- 视图控制 -->
      <div class="section">
        <h4>视图</h4>

        <div class="button-group">
          <button @click="emit('set-view', 'front')">前视图</button>
          <button @click="emit('set-view', 'top')">顶视图</button>
          <button @click="emit('set-view', 'side')">侧视图</button>
          <button @click="emit('set-view', 'isometric')">等轴视图</button>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="control-buttons">
        <button @click="emit('reset')" class="reset-btn">
          重置视图
        </button>
        <button @click="emit('toggle-auto-rotate')" class="rotate-btn">
          {{ autoRotate ? '⏸ 停止旋转' : '▶ 自动旋转' }}
        </button>
      </div>

      <!-- 快捷键提示 -->
      <!-- <div class="shortcuts">
        <div class="shortcut-item">
          <span class="key">R</span> 重置视图
        </div>
        <div class="shortcut-item">
          <span class="key">Space</span> 自动旋转
        </div>
        <div class="shortcut-item">
          <span class="key">鼠标左键</span> 旋转
        </div>
        <div class="shortcut-item">
          <span class="key">鼠标右键</span> 平移
        </div>
        <div class="shortcut-item">
          <span class="key">滚轮</span> 缩放
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  modelScale: number
  modelRotationX: number
  modelRotationY: number
  modelRotationZ: number
  modelHeight: number
  autoRotate: boolean
  cameraDistance?: number
  cameraHeight?: number
}>()

const emit = defineEmits<{
  'update:scale': [value: number]
  'update:rotationX': [value: number]
  'update:rotationY': [value: number]
  'update:rotationZ': [value: number]
  'update:height': [value: number]
  'update:cameraDistance': [value: number]
  'update:cameraHeight': [value: number]
  reset: []
  'toggle-auto-rotate': []
  'set-view': [view: string]
}>()

// State
const isExpanded = ref(true)

// Methods
function togglePanel() {
  isExpanded.value = !isExpanded.value
}

function updateScale(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:scale', parseFloat(target.value))
}

function updateRotationX(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:rotationX', parseInt(target.value))
}

function updateRotationY(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:rotationY', parseInt(target.value))
}

function updateRotationZ(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:rotationZ', parseInt(target.value))
}

function updateHeight(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:height', parseFloat(target.value))
}

function updateCameraDistance(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:cameraDistance', parseInt(target.value))
}

function updateCameraHeight(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:cameraHeight', parseInt(target.value))
}
</script>

<style scoped>
@import '../../views/BuildingViewer.css';
</style>
