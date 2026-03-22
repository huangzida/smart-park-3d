# Three.js Builder Skill Integration Guide

This document explains how to use the **threejs-builder** skill integrated into this project.

## Overview

The **threejs-builder** skill provides a comprehensive guide for creating Three.js applications with modern best practices. It covers:

- Scene graph mental model
- Primitives and geometries
- Materials and lighting
- Animation and interaction
- Camera controls
- Performance optimization
- Advanced topics (GLTF loading, post-processing, shaders, physics)

## Skill Location

The skill is available at: `.claude/skills/threejs-builder/SKILL.md`

## How to Use

### 1. Access the Skill

When working with AI assistants (like Claude) in this project, the skill is automatically available. Ask questions like:

```
"Create a Three.js scene with a rotating cube"
"How do I add shadows to my 3D model?"
"Show me how to load a GLTF model"
"What's the best way to handle mouse interaction?"
```

### 2. Key Concepts Covered

#### Scene Graph Mental Model
- Everything added to `scene` renders
- Use `Group` for hierarchical transforms
- Parent transformations affect children

#### Modern Three.js Patterns
- ES modules (not CommonJS or globals)
- `setAnimationLoop` instead of `requestAnimationFrame`
- Import controls from `three/addons/controls/OrbitControls.js`
- `Math.min(window.devicePixelRatio, 2)` for performance

#### Material Selection Guide
- `MeshBasicMaterial` - No lighting, flat colors
- `MeshStandardMaterial` - PBR lighting (default for realism)
- `MeshPhysicalMaterial` - Advanced PBR (glass, water, clearcoat)
- `MeshNormalMaterial` - Debug/visualization
- `MeshPhongMaterial` - Legacy, shininess control

## Project Integration

This project already implements many patterns from the skill:

### ✅ Implemented Features

1. **Scene Management**
   - Located in: `src/components/viewer/Scene3D.vue`
   - Uses modern ES module imports
   - Proper cleanup on unmount
   - Responsive resize handling

2. **Lighting System**
   - Multiple light types: Ambient, Directional, Hemisphere
   - Shadow configuration with PCFSoftShadowMap
   - Dynamic light controls via DebugPanel

3. **Material Fixing**
   - Automatic texture color space correction
   - Support for multiple material types
   - Located in `fixMaterialsAndTextures()` function

4. **Camera Controls**
   - OrbitControls with damping
   - Preset views (front, top, side, isometric)
   - Distance and height controls

5. **Model Loading**
   - GLTF/GLB and FBX support
   - Progress tracking
   - Auto-center and scaling

### 🎯 Using Skill Patterns in This Project

When extending this project, follow these principles from the skill:

#### Creating New Scenes

```typescript
// Use the pattern from the skill
import * as THREE from 'three'

// Create scene with proper setup
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ antialias: true })

// Set pixel ratio cap for performance
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Use animation loop
renderer.setAnimationLoop((time) => {
  // Update scene
  renderer.render(scene, camera)
})
```

#### Adding Objects

```typescript
// Create geometry (reuse when possible)
const geometry = new THREE.BoxGeometry(1, 1, 1)

// Create material
const material = new THREE.MeshStandardMaterial({
  color: 0x44aa88,
  roughness: 0.5,
  metalness: 0.5
})

// Create and add mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
```

#### Lighting

```typescript
// Ambient light for base illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambientLight)

// Main directional light
const mainLight = new THREE.DirectionalLight(0xffffff, 1)
mainLight.position.set(5, 10, 7)
mainLight.castShadow = true
scene.add(mainLight)
```

## Advanced Topics (From references/advanced-topics.md)

The skill also includes advanced topics:

### GLTF Model Loading
- Already implemented in `Scene3D.vue`
- Supports progress callbacks
- Auto-centering and scaling

### Post-Processing
- Bloom effects
- Depth of field
- Custom render passes

### Custom Shaders
- GLSL vertex and fragment shaders
- ShaderMaterial usage
- Uniform animations

### Raycasting
- Mouse picking
- Click detection
- 3D interaction

### InstancedMesh
- Efficient rendering of many identical objects
- For 100+ instances

### Physics Integration
- Cannon.js integration
- Physics-based interactions
- Body synchronization

## Performance Best Practices

Follow these patterns from the skill:

### ✅ Do
- Reuse geometries and materials
- Use `InstancedMesh` for many identical objects
- Limit shadow map resolution (1024-2048)
- Cap pixel ratio at 2
- Use `frustum culling` (automatic)
- Merge geometries for static objects
- Use LOD (Level of Detail)

### ❌ Don't
- Create new geometries in animation loop
- Use too many segments on primitives
- Forget to add objects to scene
- Use old `requestAnimationFrame` pattern
- Hardcode all values

## Examples

### Adding a Simple Rotating Object

```typescript
// In your component setup
const geometry = new THREE.IcosahedronGeometry(1, 0)
const material = new THREE.MeshStandardMaterial({
  color: 0xff6600,
  flatShading: true
})
const rotatingMesh = new THREE.Mesh(geometry, material)
scene.add(rotatingMesh)

// In animation loop
function animate(time: number) {
  rotatingMesh.rotation.x = time * 0.001
  rotatingMesh.rotation.y = time * 0.0005
  renderer.render(scene, camera)
}
```

### Adding Interactive Controls

```typescript
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05

// Update controls in animation loop
function animate() {
  controls.update()
  renderer.render(scene, camera)
}
```

### Handling Mouse Interaction

```typescript
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

window.addEventListener('click', (event) => {
  // Normalize mouse coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  // Cast ray
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(scene.children)

  // Handle click
  if (intersects.length > 0) {
    const object = intersects[0].object
    // Do something with clicked object
  }
})
```

## Troubleshooting

### Common Issues

**Textures not showing**
- Check texture color space: `texture.colorSpace = THREE.SRGBColorSpace`
- Ensure texture is loaded before use
- Verify texture URL/path

**Shadows not working**
- Enable shadow map: `renderer.shadowMap.enabled = true`
- Set `castShadow = true` on lights and objects
- Set `receiveShadow = true` on surfaces

**Performance issues**
- Reduce geometry segments
- Lower shadow map resolution
- Use `InstancedMesh` for many objects
- Check pixel ratio cap

## Resources

- **Main Skill**: `.claude/skills/threejs-builder/SKILL.md`
- **Advanced Topics**: `.claude/skills/threejs-builder/references/advanced-topics.md`
- **Three.js Documentation**: https://threejs.org/docs/
- **Three.js Examples**: https://threejs.org/examples/

## Contributing

When adding new Three.js features to this project:

1. Reference the skill for best practices
2. Follow the scene graph mental model
3. Implement proper cleanup
4. Add TypeScript types
5. Test performance
6. Document new features

## Quick Reference

### Color Format
Hex: `0xRRGGBB` (e.g., `0xff0000` for red)

### Import Paths
```typescript
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
```

### Animation Pattern
```typescript
renderer.setAnimationLoop((time) => {
  // Update scene
  renderer.render(scene, camera)
})
```

### Resize Handler
```typescript
window.addEventListener('resize', () => {
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
})
```

---

**Remember**: This skill is a guide, not a limitation. Adapt patterns to your specific use case while maintaining Three.js best practices.
