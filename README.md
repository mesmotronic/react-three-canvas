# ThreeCanvas component for React

Embedding vanilla Three.js into a React app can be a real pain, so here's a component that does all the
integrating for you, providing a canvas, renderer, camera, scene and EffectComposer (WebGL only), and even
supports WebXR.

This component provides a `WebGLRenderer` by default, but you can switch to `WebGPURenderer` simply by importing
from `@mesmotronic/react-three-canvas/webgpu` instead of `@mesmotronic/react-three-canvas`.

It's typically easier to integrate Three.js into your React app using a class component, thanks to the way the lifecycle works, but this component will work happily with functional components too, although you will need to be more careful about how prop updates, etc, are handled.

## Installation

Install the package and peer dependencies:

```bash
npm install @mesmotronic/react-three-canvas three react react-dom
```

## Usage

The `ThreeCanvas` component provides a canvas for Three.js rendering with callbacks for animation, mounting, unmounting, and resizing.

The quickest way to create a new component is to create a class extending `ThreeCanvasComponent`, which creates a `ThreeCanvas` that fills its container and provides overridable methods to easily handle the Three.js lifecycle.

### Example: Class component

```jsx
import * as THREE from 'three';
import { ThreeCanvasCallbackProps, ThreeCanvasComponent } from '@mesmotronic/react-three-canvas';

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

### Example: class component

```jsx
import React, { PureComponent } from "react";
import { ThreeCanvas } from "@mesmotronic/react-three-canvas";
import * as THREE from "three";

class App extends PureComponent {
  mountHandler = ({ scene, camera }) => {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;
    this.cube = cube;
  };

  animationFrameHandler = ({}) => {
    const { cube } = this;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  };

  render() {
    return (
      <ThreeCanvas
        style={{ width: "100%", height: "100%" }}
        onMount={this.mountHandler}
        onAnimationFrame={this.animationFrameHandler}
      />
    );
  }
}

export default App;
```

## Props

- `onMount`: Callback on component mount
- `onAnimationFrame`: Callback for each animation frame
- `onResize`: Callback on canvas resize
- `onUnmount`: Callback on component unmount
- Other HTML canvas attributes (e.g., `style`, `className`) are passed to the canvas element

### Callback props

`onMount`, `onAnimationFrame`, `onResize` and `onUnmount`, as well as the class methods shown above, receive `{ canvas: HTMLCanvasElement, renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, composer: EffectComposer, scene: THREE.Scene, size: THREE.Vector2, userData: Record<string,any> }`.

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
