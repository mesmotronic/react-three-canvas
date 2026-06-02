import React, { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';

type AnimationLoopCallback = (params: ThreeCanvasCallbackProps) => boolean | void;

export interface ThreeCanvasCallbackProps<TUserData extends object = Record<string, any>> {
  canvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  composer: EffectComposer;
  scene: THREE.Scene;
  size: THREE.Vector2;
  timer: THREE.Timer;
  userData: Partial<TUserData>;
  setAnimationLoop?: (callback: AnimationLoopCallback) => void;
}

export interface ThreeCanvasProps extends React.HTMLAttributes<HTMLCanvasElement> {
  rendererParameters?: THREE.WebGLRendererParameters;
  onAnimationLoop?: AnimationLoopCallback;
  onMount?: (params: ThreeCanvasCallbackProps) => void | (() => void);
  onUnmount?: (params: ThreeCanvasCallbackProps) => void;
  onResize?: (params: ThreeCanvasCallbackProps) => void;
}

/**
 * ThreeCanvas for WebGL
 */
export function ThreeCanvas<TUserData extends object = Record<string, any>>({
  rendererParameters,
  onAnimationLoop,
  onMount,
  onUnmount,
  onResize,
  ...props
}: ThreeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userDataRef = useRef<Partial<TUserData>>({});
  const unmountRef = useRef<void | (() => void)>();
  const animationLoopRef = useRef<void | AnimationLoopCallback>();

  useLayoutEffect(() => {
    if (!canvasRef.current) return;

    const timer = new THREE.Timer();
    const size = new THREE.Vector2(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      ...rendererParameters,
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

    const composer = new EffectComposer(renderer);
    composer.setSize(size.width, size.height);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    let resizePending = false;

    const callbackProps: ThreeCanvasCallbackProps<TUserData> = {
      canvas: canvasRef.current!,
      renderer,
      camera,
      composer,
      scene,
      size,
      timer,
      userData: userDataRef.current,
      setAnimationLoop: (callback) => animationLoopRef.current = callback
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
        composer.setSize(size.width, size.height);
        camera.aspect = size.width / size.height;
        camera.updateProjectionMatrix();
        onResize?.(callbackProps);
        resizePending = false;
      }

      if (false !== onAnimationLoop?.(callbackProps)) {
        // Three.js does not currently support post-processing in WebXR using EffectComposer
        if (renderer.xr.isPresenting) {
          renderer.render(scene, camera);
        } else {
          composer.render();
        }
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
  }, [onAnimationLoop, onMount, onUnmount, onResize]);

  return <canvas ref={canvasRef} {...props} />;
};

export default ThreeCanvas;
