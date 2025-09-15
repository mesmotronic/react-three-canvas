import React, { useCallback } from 'react';
import * as THREE from 'three';
import { ThreeCanvas, ThreeCanvasCallbackProps } from '../../lib/webgpu/ThreeCanvas';

type TUserData = { cube?: THREE.Mesh; };
type TCallbackProps = ThreeCanvasCallbackProps<TUserData>;

const Example: React.FC = () => {
  const mountHandler = useCallback(({ scene, userData }: TCallbackProps) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    userData.cube = mesh;

    return () => {
      console.log('Unmounting 2');
    };
  }, []);

  const unmountHandler = useCallback(({ userData }: TCallbackProps) => {
    console.log('Unmounting 1');
    delete userData.cube;
  }, []);

  const animationFrameHandler = useCallback(({ userData }: TCallbackProps) => {
    const cube = userData.cube!;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Return false to prevent default render, e.g. if you're using custom post-processing
  }, []);

  return (
    <ThreeCanvas<TUserData>
      onAnimationFrame={animationFrameHandler}
      onMount={mountHandler}
      onUnmount={unmountHandler}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default Example;