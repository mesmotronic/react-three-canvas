# ThreeCanvas component for React

Want to use vanilla Three.js in React without the hassle? This component does the heavy lifting for you: no frameworks, no fuss.

Whether you're embedding an existing project or just want to avoid extra frameworks, adding Three.js to React can be a pain. This component gives you a ready-to-go canvas, renderer, camera, scene, and EffectComposer (WebGL only), with WebXR support built in.

By default, you get a `WebGLRenderer`, but you can switch to `WebGPURenderer` just by importing from `@mesmotronic/react-three-canvas/webgpu` instead of `@mesmotronic/react-three-canvas`.

## Installation

Install the package (and peer dependencies if you don't already have them):

```bash
npm install @mesmotronic/react-three-canvas

# If you don't already have them:
npm install three react react-dom
```

## Usage

The `ThreeCanvas` component gives you a canvas with a Three.js renderer attached, plus callbacks for animation, mounting, unmounting, and resizing, and an EffectComposer for postprocessing (WebGL only).

### Example: Class component

Class components are a great fit for integrating Three.js, so `ThreeCanvasComponent` gives you an extendible class with a `ThreeCanvas` that fills its parent. You can override any of the lifecycle methods below (they're all optional):

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

Prefer functional components? `ThreeCanvas` works great there too! Just be sure to manage your props and hooks so you keep a single canvas instance.

Tip: Use `useRef` or `useCallback` if you need to persist data between renders.

```jsx
import * as THREE from "three";
import { ThreeCanvas } from "@mesmotronic/react-three-canvas";

const App = () => {
  const mountHandler = useCallback(({ scene, camera, userData }) => {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;
    userData.cube = cube;
  }, []);

  const animationFrameHandler = useCallback(({ userData }) => {
    const { cube } = userData;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }, []);

  const resizeHandler = useCallback(() => console.log("Resized"), []);
  const unmountHandler = useCallback(() => console.log("Unmounting"), []);

  return (
    <ThreeCanvas
      style={{ width: "100%", height: "100%" }}
      onMount={mountHandler}
      onAnimationFrame={animationFrameHandler}
      onResize={resizeHandler}
      onUnmount={unmountHandler}
    />
  );
};

export default App;
```

## Props and lifecycle methods

| Prop               | Lifecycle method    | Type       | Description                        |
| ------------------ | ------------------- | ---------- | ---------------------------------- |
| `onMount`          | `canvasDidMount`    | `function` | Called when the component mounts   |
| `onAnimationFrame` | `canvasWillAnimate` | `function` | Called on each animation frame     |
| `onResize`         | `canvasDidResize`   | `function` | Called when the canvas resizes     |
| `onUnmount`        | `canvasWillUnmount` | `function` | Called when the component unmounts |

All other props (like `style`, `className`, etc.) are passed directly to the `<canvas>` element.

### Callback props

All callback props (`onMount`, `onAnimationFrame`, `onResize`, `onUnmount`) and their equivalent lifecycle methods receive a single argument of type `ThreeCanvasCallbackProps`:

| Property   | Type                                      | Description                                        |
| ---------- | ----------------------------------------- | -------------------------------------------------- |
| `canvas`   | `HTMLCanvasElement`                       | The canvas element being rendered to               |
| `renderer` | `THREE.WebGLRenderer` or `WebGPURenderer` | The Three.js renderer instance                     |
| `camera`   | `THREE.PerspectiveCamera`                 | The camera used for rendering                      |
| `composer` | `EffectComposer`                          | The EffectComposer for postprocessing (WebGL only) |
| `scene`    | `THREE.Scene`                             | The Three.js scene                                 |
| `size`     | `THREE.Vector2`                           | The current size of the canvas                     |
| `userData` | `Record<string, any>`                     | A persistent object for your own data              |

TypeScript:

```ts
type ThreeCanvasCallbackProps = {
  canvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  composer: EffectComposer;
  scene: THREE.Scene;
  size: THREE.Vector2;
  userData: Record<string, any>;
};
```

## Features

- Automatic canvas resizing with `ResizeObserver`
- Integrated `EffectComposer` for post-processing effects (WebGL only)
- WebXR support via `renderer.xr.enabled`
- Clean resource disposal on unmount

## Peer Dependencies

- `three`: Three.js library for 3D rendering
- `react`: React for component rendering

## License

BSD 2-Clause License
