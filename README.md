# Three.js Canvas for React

A lightweight React component for rendering Three.js scenes with built-in post-processing support via `EffectComposer` and compatibility with WebXR for immersive VR/AR experiences. `ThreeCanvas` simplifies the integration of Three.js into React applications, providing a robust foundation for 3D rendering with automatic scene setup, camera configuration, and responsive resizing.

## Features

- **Three.js Integration**: Renders Three.js scenes with a pre-configured `Scene`, `WebGLRenderer`, `PerspectiveCamera`, and `EffectComposer`.
- **Post-Processing Ready**: Includes an automatic `RenderPass` for immediate scene rendering, with the ability to add custom passes (e.g., bloom, anti-aliasing) via the `onMount` callback.
- **WebXR Support**: Compatible with WebXR for VR/AR applications, allowing seamless integration with immersive experiences.
- **Responsive Resizing**: Uses `ResizeObserver` to automatically adjust the renderer, composer, and camera when the container resizes.
- **Flexible Callbacks**: Provides `onMount` and `onAnimationFrame` callbacks with a consistent object-based interface for scene setup and animation updates.
- **DOM Integration**: Supports all `HTMLDivElement` props (e.g., `className`, `id`, `onClick`) for styling and event handling.
- **TypeScript Support**: Fully typed with TypeScript for a robust developer experience.

## Installation

Install the package via npm:

```bash
npm install @mesmotronic/react-three-canvas three
```

The package depends on `three` as a peer dependency, so ensure it’s installed in your project.

## Usage

The `ThreeCanvas` component is designed to be dropped into your React application, providing a container for Three.js scenes with built-in post-processing and WebXR support. Below is an example of how to use it to render a rotating cube.

### Example

```tsx
import React, { useState } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import ThreeCanvas from "@mesmotronic/react-three-canvas";

// Example CSS (could be in a .css file or CSS module)
const styles = `
  .three-canvas-container {
    width: 100%;
    height: 400px;
    border: 2px solid #333;
    border-radius: 8px;
    background-color: #f0f0f0;
  }
`;

// Add styles to the document (for demo; use a CSS file or module in practice)
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

const App: React.FC = () => {
  const [cube, setCube] = useState<THREE.Mesh | null>(null);

  // Handle onMount to add a cube and optionally additional passes
  const mountHandler = ({
    canvas,
    renderer,
    camera,
    composer,
    scene,
  }: {
    canvas: HTMLCanvasElement;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    composer: EffectComposer;
    scene: THREE.Scene;
  }) => {
    console.log("ThreeCanvas mounted:", { canvas, renderer, camera, composer, scene });

    // Optionally customize camera or renderer
    // Example: camera.fov = 45; camera.updateProjectionMatrix();
    // Example: renderer.setClearColor(0x333333);

    // Create a cube and add it to the scene
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const newCube = new THREE.Mesh(geometry, material);
    setCube(newCube);

    // RenderPass is already added by the component
    // Optionally, add more passes (e.g., UnrealBloomPass for glow effects)
    // Example: const bloomPass = new UnrealBloomPass(...); composer.addPass(bloomPass);
  };

  // Handle onUnmount for cleanup
  const unmountHandler = () => {
    console.log("ThreeCanvas unmounted");
    setCube(null); // Clear cube reference
  };

  // Animation loop (updates scene, then composer renders)
  const animationFrameHandler = ({
    scene,
    renderer,
    camera,
    composer,
  }: {
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    composer: EffectComposer;
  }) => {
    if (cube) {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      scene.add(cube); // Ensure cube is in the scene
    }
    // No need to call composer.render() here; it's handled after onAnimationFrame
  };

  // Example click handler for the div
  const clickHandler = () => {
    console.log("ThreeCanvas container clicked!");
  };

  return (
    <div>
      <h1>Three.js Canvas with Post-Processing</h1>
      <ThreeCanvas
        onAnimationFrame={animationFrameHandler}
        onMount={mountHandler}
        onUnmount={unmountHandler}
        className="three-canvas-container"
        id="three-canvas"
        title="Three.js Canvas"
        onClick={clickHandler}
        data-test-id="three-canvas-container"
      />
    </div>
  );
};

export default App;
```

**Note**: The example uses the `eventNameHandler` naming convention (e.g., `mountHandler`, `animationFrameHandler`) for event handlers. You can use any naming convention that suits your project.

### WebXR Integration

`ThreeCanvas` is compatible with WebXR, enabling VR and AR experiences. To use WebXR, enable it on the `renderer` in the `onMount` callback and set up your scene for XR rendering. Here’s a basic example of enabling WebXR:

```tsx
const mountHandler = ({
  canvas,
  renderer,
  camera,
  composer,
  scene,
}: {
  canvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  composer: EffectComposer;
  scene: THREE.Scene;
}) => {
  // Enable WebXR
  renderer.xr.enabled = true;

  // Set up XR session (example with WebXR API)
  navigator.xr?.requestSession("immersive-vr").then((session) => {
    renderer.xr.setSession(session);
  });

  // Continue with scene setup (e.g., add objects, passes)
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
};
```

For advanced WebXR setups, consider using libraries like `@react-three/xr` or Three.js’s `WebXRManager` to manage XR controllers, interactions, and rendering. Ensure your scene is optimized for XR (e.g., adjusting camera position, adding controllers).

## Props

The `ThreeCanvas` component accepts the following props:

- **`onAnimationFrame`**: `(params: ThreeCanvasCallbackProps) => void`
  - Optional callback invoked on each animation frame for scene updates or animations.
  - Receives an object with `canvas`, `renderer`, `camera`, `composer`, and `scene`.
- **`onMount`**: `(params: ThreeCanvasCallbackProps) => void`
  - Optional callback invoked when the component mounts, for initializing the scene or adding post-processing passes.
  - Receives an object with `canvas`, `renderer`, `camera`, `composer`, and `scene`.
- **`onUnmount`**: `() => void`
  - Optional callback invoked when the component unmounts, for cleanup.
- **HTMLDivElement Props**: Supports all standard `div` attributes (e.g., `className`, `id`, `onClick`, `data-*`, `aria-*`) via `React.HTMLAttributes<HTMLDivElement>`.

### `ThreeCanvasCallbackProps`

The object passed to `onAnimationFrame` and `onMount` has the following properties:

- `canvas`: `HTMLCanvasElement` - The renderer’s canvas element.
- `renderer`: `THREE.WebGLRenderer` - The Three.js WebGL renderer.
- `camera`: `THREE.PerspectiveCamera` - The perspective camera (default: `fov=60`, `near=0.1`, `far=5000`, `position=[0,0,5]`).
- `composer`: `EffectComposer` - The post-processing composer with a default `RenderPass`.
- `scene`: `THREE.Scene` - The Three.js scene.

## Styling

The container `<div>` requires size definitions (e.g., `width`, `height`) via CSS applied through `className`. Example:

```css
.three-canvas-container {
  width: 100%;
  height: 400px;
}
```

Use `className` or other `HTMLDivElement` props to style or add interactivity to the container.

## Defaults

- **Camera**: `fov=60`, `near=0.1`, `far=5000`, `position=[0,0,5]`.
- **Renderer**: Clear color set to `0x000000` (black).
- **Post-Processing**: Includes a `RenderPass` by default.

Customize these in `onMount` if needed (e.g., `params.camera.fov = 45; params.camera.updateProjectionMatrix()`).

## Requirements

- **React**: 18+
- **Three.js**: Install `three` as a peer dependency (`npm install three`).
- **TypeScript**: Optional, but the package is fully typed for TypeScript users.
- **Browser**: Modern browsers supporting WebGL and `ResizeObserver`. Use a polyfill like `resize-observer-polyfill` for older browsers.

## Performance

- The component is optimized with efficient `ResizeObserver` and animation loop handling.
- The default `RenderPass` adds minimal overhead. Optimize additional post-processing passes for complex scenes.
- Debounce the `ResizeObserver` callback if frequent resizes occur in dynamic layouts.

## Contributing

Contributions are welcome! Please submit issues or pull requests.

## License

BSD 3-Clause License
