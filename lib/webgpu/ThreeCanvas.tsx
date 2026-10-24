import React, { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { WebGPURendererParameters } from 'three/src/renderers/webgpu/WebGPURenderer.js';
import { WebGPURenderer } from 'three/webgpu';

export type ThreeCanvasCallback<TUserData extends object = Record<string, any>, TResult = void> = (
  props: ThreeCanvasCallbackProps<TUserData>,
) => TResult;

export interface ThreeCanvasCallbackProps<TUserData extends object = Record<string, any>> {
  canvas: HTMLCanvasElement;
  renderer: WebGPURenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  size: THREE.Vector2;
  timer: THREE.Timer;
  userData: Partial<TUserData>;
}

export interface ThreeCanvasProps<TUserData extends object = Record<string, any>> extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  rendererParameters?: WebGPURendererParameters;
  onAnimationLoop?: ThreeCanvasCallback<TUserData, boolean | void>;
  onMount?: ThreeCanvasCallback<TUserData, void | (() => void)>;
  onUnmount?: ThreeCanvasCallback<TUserData>;
  onResize?: ThreeCanvasCallback<TUserData>;
}

/**
 * ThreeCanvas for WebGPU
 */
export function ThreeCanvas<TUserData extends object = Record<string, any>>({
  rendererParameters,
  onAnimationLoop,
  onMount,
  onUnmount,
  onResize,
  ...props
}: ThreeCanvasProps<TUserData>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userDataRef = useRef<Partial<TUserData>>({});
  const unmountRef = useRef<void | (() => void)>();
  const rendererRef = useRef<WebGPURenderer>();
  const disposeTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useLayoutEffect(() => {
    if (!canvasRef.current) return;

    clearTimeout(disposeTimeoutRef.current);

    if (!rendererRef.current) {
      rendererRef.current = new WebGPURenderer({
        antialias: true,
        ...rendererParameters,
        canvas: canvasRef.current
      });
      rendererRef.current.outputColorSpace = THREE.SRGBColorSpace;
      rendererRef.current.setClearColor(0x000000);
    }

    const renderer = rendererRef.current;
    const timer = new THREE.Timer();
    const size = new THREE.Vector2(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    const scene = new THREE.Scene();

    renderer.setSize(size.width, size.height, false);

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
      timer,
      userData: userDataRef.current
    };

    unmountRef.current = onMount?.(callbackProps);

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      size.set(width, height);
      resizePending = true;
    });
    resizeObserver.observe(canvasRef.current);

    renderer.setAnimationLoop((timestamp: number) => {
      timer.update(timestamp);

      if (resizePending) {
        renderer.setSize(size.width, size.height, false);
        camera.aspect = size.width / size.height;
        camera.updateProjectionMatrix();
        onResize?.(callbackProps);
        resizePending = false;
      }

      if (false !== onAnimationLoop?.(callbackProps)) {
        renderer.render(scene, camera);
      }
    });

    return () => {
      resizeObserver.disconnect();
      renderer.setAnimationLoop(null);
      unmountRef.current?.();
      unmountRef.current = undefined;
      onUnmount?.(callbackProps);

      disposeTimeoutRef.current = setTimeout(() => {
        renderer.dispose();
        rendererRef.current = undefined;
      });
    };
  }, [onAnimationLoop, onMount, onUnmount, onResize]);

  return <canvas ref={canvasRef} {...props} />;
};

export default ThreeCanvas;
