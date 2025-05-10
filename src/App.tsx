import React, { MutableRefObject, useRef } from 'react';
import * as THREE from 'three';
import { ThreeCanvas, ThreeCanvasCallbackProps } from '../lib/components/ThreeCanvas';

const App: React.FC = () => {
  const cubeRef = useRef<THREE.Mesh | null>(null) as MutableRefObject<THREE.Mesh | null>;

  const mountHandler = ({ scene }: ThreeCanvasCallbackProps) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    cubeRef.current = mesh;
  };

  const unmountHandler = () => {
    cubeRef.current = null;
  };

  const animationFrameHandler = () => {
    const cube = cubeRef.current!;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  };

  return (
    <ThreeCanvas
      onAnimationFrame={animationFrameHandler}
      onMount={mountHandler}
      onUnmount={unmountHandler}
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};

export default App;