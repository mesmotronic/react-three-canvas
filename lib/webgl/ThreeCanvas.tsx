import React from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ThreeCanvasCallbacks, ThreeCanvasCoreCallback, ThreeCanvasCoreCallbackProps, useThreeCanvas } from '../core/useThreeCanvas';

export type ThreeCanvasCallback<TUserData extends object = Record<string, any>, TResult = void> =
  ThreeCanvasCoreCallback<ThreeCanvasCallbackProps<TUserData>, TResult>;

export interface ThreeCanvasCallbackProps<TUserData extends object = Record<string, any>>
  extends ThreeCanvasCoreCallbackProps<THREE.WebGLRenderer, TUserData> {
  composer: EffectComposer;
}

export interface ThreeCanvasProps<TUserData extends object = Record<string, any>>
  extends React.CanvasHTMLAttributes<HTMLCanvasElement>, ThreeCanvasCallbacks<ThreeCanvasCallbackProps<TUserData>> {
  rendererParameters?: THREE.WebGLRendererParameters;
}

function createComposer(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  return {
    props: { composer },
    setSize: (width: number, height: number) => composer.setSize(width, height),
    render: () => {
      // Three.js does not currently support post-processing in WebXR using EffectComposer
      if (renderer.xr.isPresenting) {
        renderer.render(scene, camera);
      } else {
        composer.render();
      }
    },
    dispose: () => composer.dispose(),
  };
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
}: ThreeCanvasProps<TUserData>) {
  const canvasRef = useThreeCanvas<THREE.WebGLRenderer, { composer: EffectComposer }, TUserData>(
    { onAnimationLoop, onMount, onUnmount, onResize },
    (canvas) => new THREE.WebGLRenderer({ antialias: true, ...rendererParameters, canvas }),
    createComposer,
  );

  return <canvas ref={canvasRef} {...props} />;
};

export default ThreeCanvas;
