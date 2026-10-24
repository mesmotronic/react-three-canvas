import React from 'react';
import { WebGPURendererParameters } from 'three/src/renderers/webgpu/WebGPURenderer.js';
import { WebGPURenderer } from 'three/webgpu';
import { ThreeCanvasCallbacks, ThreeCanvasCoreCallback, ThreeCanvasCoreCallbackProps, useThreeCanvas } from '../core/useThreeCanvas';

export type ThreeCanvasCallback<TUserData extends object = Record<string, any>, TResult = void> =
  ThreeCanvasCoreCallback<ThreeCanvasCallbackProps<TUserData>, TResult>;

export type ThreeCanvasCallbackProps<TUserData extends object = Record<string, any>> =
  ThreeCanvasCoreCallbackProps<WebGPURenderer, TUserData>;

export interface ThreeCanvasProps<TUserData extends object = Record<string, any>>
  extends React.CanvasHTMLAttributes<HTMLCanvasElement>, ThreeCanvasCallbacks<ThreeCanvasCallbackProps<TUserData>> {
  rendererParameters?: WebGPURendererParameters;
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
  const canvasRef = useThreeCanvas<WebGPURenderer, object, TUserData>(
    { onAnimationLoop, onMount, onUnmount, onResize },
    (canvas) => new WebGPURenderer({ antialias: true, ...rendererParameters, canvas }),
    (renderer, scene, camera) => ({
      props: {},
      setSize: () => { },
      render: () => renderer.render(scene, camera),
      dispose: () => { },
    }),
  );

  return <canvas ref={canvasRef} {...props} />;
};

export default ThreeCanvas;
