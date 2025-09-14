# ThreeCanvas component for React

Whether you're intending an existing project, or just prefer working directly with Three.js, embedding vanilla Three.js into a React app can be a real pain, so here's a component that does all the integrating for you, providing a canvas, renderer, camera, scene and EffectComposer (WebGL only), and even supports WebXR.

This component provides a `WebGLRenderer` by default, but you can switch to `WebGPURenderer` simply by importing from `@mesmotronic/react-three-canvas/webgpu` instead of `@mesmotronic/react-three-canvas`.

## Installation

Install the package and peer dependencies:

```bash
npm install @mesmotronic/react-three-canvas three react react-dom
```

## Usage

The `ThreeCanvas` component provides a canvas with a Three.js renderer attached, plus callbacks for animation, mounting, unmounting, and resizing.

### Example: Class component

The lifecycle of a class component typically makes it a better choice for integrating Three.js into your React app, so to keep things as simple as possible, `ThreeCanvasComponent` provides an easily extendible class component that creates a `ThreeCanvas` for you that automatically fills its parent, with easily overridable lifecycle methods that make it as simple as possible to get up and running:

```jsx
import * as THREE from 'three';
import { ThreeCanvasComponent } from '@mesmotronic/react-three-canvas';

class App extends ThreeCanvasComponent {
  public override canvasDidMount = ({ scene }) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    this.cube = mesh;
  };

  public override canvasWillAnimate = () => {
    const { cube } = this;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  };

  public override canvasDidResize = () => {
    console.log('Resized');
  };

  public override canvasWillUnmount = () => {
    console.log('Unmounting');
  };
};

export default App;
```

### Example: Functional component

If you prefer to stick with functional components, `ThreeCanvas` works perfectly with those too, although you have to take a little more careful with your props and hooks to ensure you maintain a single canvas instance:

```jsx
import React from "react";
import { ThreeCanvas } from "@mesmotronic/react-three-canvas";
import * as THREE from "three";

const App = () => {
  const mountHandler = ({ scene, camera, userData }) => {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;
    userData.cube = cube;
  };

  const animationFrameHandler = ({ userData }) => {
    const { cube } = userData;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  };

  return (
    <ThreeCanvas
      style={{ width: "100%", height: "100%" }}
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

`onMount`, `onAnimationFrame`, `onResize` and `onUnmount`, as well as the equivalent lifecycle methods shown above, receive `{ canvas: HTMLCanvasElement, renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, composer: EffectComposer, scene: THREE.Scene, size: THREE.Vector2, userData: Record<string,any> }`.

## Features

- Automatic canvas resizing with `ResizeObserver`
- Integrated `EffectComposer` for post-processing effects (WebGL only)
- WebXR support via `renderer.xr.enabled`
- Clean resource disposal on unmount

## Peer Dependencies

- `three`: Three.js library for 3D rendering
- `react`: React for component rendering

## License

BSD 3-Clause License
