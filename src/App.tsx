import React, { useCallback } from 'react';
import * as THREE from 'three';
import { ThreeCanvas, ThreeCanvasCallbackProps } from '../lib/components/ThreeCanvas';

const App: React.FC = () => {
  const mountHandler = useCallback(({ scene, userData }: ThreeCanvasCallbackProps) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    userData.cube = mesh;

    return () => {
      console.log('Unmounting');
    };
  }, []);

  const unmountHandler = useCallback(({ userData }: ThreeCanvasCallbackProps) => {
    delete userData.cube;
  }, []);

  const animationFrameHandler = useCallback(({ userData }: ThreeCanvasCallbackProps) => {
    const { cube } = userData;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }, []);

  return (
    <ThreeCanvas
      onAnimationFrame={animationFrameHandler}
      onMount={mountHandler}
      onUnmount={unmountHandler}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default App;