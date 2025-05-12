# ThreeCanvas component for React

A React component for integrating Three.js with WebGL rendering and EffectComposer, supporting WebXR for immersive experiences.

## Installation

Install the package and peer dependencies:

```bash
npm install @mesmotronic/react-three-canvas three react
```

## Usage

The `ThreeCanvas` component provides a canvas for Three.js rendering with callbacks for animation, mounting, unmounting, and resizing.

### Basic Example

```jsx
import React from 'react';
import { ThreeCanvas } from '@mesmotronic/react-three-canvas';
import * as THREE from 'three';

const App = () => {
  const mountHandler = ({ scene, camera }) => {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;
  };

  const animationFrameHandler = ({ scene }) => {
    scene.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        child.rotation.x += 0.01;
        child.rotation.y += 0.01;
      }
    });
  };

  return (
    <ThreeCanvas
      style={{ width: '100vw', height: '100vh' }}
      onMount={mountHandler}
      onAnimationFrame={animationFrameHandler}
    />
  );
};

export default App;
```

## Props

- `onMount`: Callback on component mount
- `onAnimationFrame`: Callback for each animation frame
- `onResize`: Callback on canvas resize
- `onUnmount`: Callback on component unmount
- Other HTML canvas attributes (e.g., `style`, `className`) are passed to the canvas element

### Callback props

`onMount`, `onAnimationFrame`, and `onResize` receive `{ canvas: HTMLCanvasElement, renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, composer: EffectComposer, scene: THREE.Scene, size: THREE.Vector2 }`.

## Features

- Automatic canvas resizing with `ResizeObserver`
- Integrated `EffectComposer` for post-processing effects
- WebXR support via `renderer.xr.enabled`
- Clean resource disposal on unmount

## Peer Dependencies

- `three`: Three.js library for 3D rendering
- `react`: React for component rendering

## License

BSD 3-Clause License