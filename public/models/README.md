# 模型文件存放说明

请将您的 .glb 格式模型文件放置在此目录下。

## 当前配置

项目已配置为加载以下模型文件：
- `model1.glb` - 第一个展示模型
- `model2.glb` - 第二个展示模型

## 如何添加或修改模型

1. 将您的 .glb 模型文件复制到 `/smart-park-3d/public/models/` 目录
2. 根据需要重命名模型文件或修改配置

## 修改模型配置

在 `src/components/world/ModelDisplay.vue` 文件中找到 `modelConfigs` 数组，根据需要修改模型配置：

```typescript
const modelConfigs = [
  {
    name: 'model1',           // 模型名称（唯一标识）
    path: '/models/model1.glb', // 模型文件路径
    position: { x: -3, y: 1, z: 0 }, // 模型位置
    scale: { x: 1, y: 1, z: 1 }       // 模型缩放
  },
  {
    name: 'model2',
    path: '/models/model2.glb',
    position: { x: 3, y: 1, z: 0 },
    scale: { x: 1, y: 1, z: 1 }
  }
]
```

## 参数说明

- **name**: 模型的唯一标识符，用于日志和调试
- **path**: 模型文件的相对路径（以 `/models/` 开头）
- **position**: 模型在场景中的坐标（x, y, z）
  - x: 水平位置（正值向右，负值向左）
  - y: 垂直高度（正值向上）
  - z: 深度位置（正值向前，负值向后）
- **scale**: 模型的缩放比例（x, y, z）

## 模型格式建议

推荐使用 **.glb** 格式，原因：
- 文件体积小
- 包含所有资源（几何体、材质、纹理、动画）
- Three.js 最佳支持
- Web 性能优异

如果您的模型是其他格式（.fbx, .obj 等），建议先转换为 .glb 格式：
- 使用 Blender 导出为 .glb
- 或使用在线转换工具

## 展示区域说明

模型展示区位于场景中心（0, 0, 0），包含：
- 圆形展示基台
- 两个聚光灯照明
- 环境光补充
- 可同时展示多个模型

## 调试

打开浏览器控制台（F12）可以看到：
- 模型加载进度
- 加载成功/失败信息
- 如果加载失败，会显示红色占位立方体
