import React, { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { WebGPURenderer } from 'three/webgpu';

export interface ThreeCanvasCallbackProps<TUserData extends object = Record<string, any>> {
  canvas: HTMLCanvasElement;
  renderer: WebGPURenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  size: THREE.Vector2;
  userData: Partial<TUserData>;
}

export interface ThreeCanvasProps extends React.HTMLAttributes<HTMLCanvasElement> {
  onAnimationFrame?: (params: ThreeCanvasCallbackProps) => boolean | void;
  onMount?: (params: ThreeCanvasCallbackProps) => void | (() => void);
  onUnmount?: (params: ThreeCanvasCallbackProps) => void;
  onResize?: (params: ThreeCanvasCallbackProps) => void;
}

/**
 * ThreeCanvas for WebGPU
 */
export function ThreeCanvas<TUserData extends object = Record<string, any>>({
  onAnimationFrame,
  onMount,
  onUnmount,
  onResize,
  ...props
}: ThreeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userDataRef = useRef<Partial<TUserData>>({});
  const unmountRef = useRef<void | (() => void)>();

  useLayoutEffect(() => {
    if (!canvasRef.current) return;

    const size = new THREE.Vector2(canvasRef.current.clientWidth, canvasRef.current.clientHeight);

    const scene = new THREE.Scene();

    const renderer = new WebGPURenderer({
      antialias: true,
      canvas: canvasRef.current
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(size.width, size.height, false);
    renderer.setClearColor(0x000000);

    const camera = new THREE.PerspectiveCamera(
      60,
      size.width / size.height,
      0.1,
      5000
    );
    camera.position.set(0, 0, 5);

    let resizePending = false;

    const callbackProps: ThreeCanvasCallbackProps<TUserData> = {
      canvas: canvasRef.current!,
      renderer,
      camera,
      scene,
      size,
      userData: userDataRef.current
    };

    unmountRef.current = onMount?.(callbackProps);

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      size.set(width, height);
      resizePending = true;
    });
    resizeObserver.observe(canvasRef.current);

    renderer.setAnimationLoop(() => {
      if (resizePending) {
        renderer.setSize(size.width, size.height, false);
        camera.aspect = size.width / size.height;
        camera.updateProjectionMatrix();
        onResize?.(callbackProps);
        resizePending = false;
      }

      if (false !== onAnimationFrame?.(callbackProps)) {
        renderer.render(scene, camera);
      }
    });

    return () => {
      resizeObserver.disconnect();
      renderer.setAnimationLoop(null);
      renderer.dispose();
      unmountRef.current?.();
      unmountRef.current = undefined;
      onUnmount?.(callbackProps);
    };
  }, [onAnimationFrame, onMount, onUnmount, onResize]);

  return <canvas ref={canvasRef} {...props} />;
};

export default ThreeCanvas;