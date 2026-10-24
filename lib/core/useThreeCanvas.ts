import { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';

export type ThreeCanvasRenderer = Pick<THREE.WebGLRenderer, 'outputColorSpace' | 'setClearColor' | 'setSize' | 'render' | 'dispose'> & {
  setAnimationLoop(callback: ((time: number) => void) | null): unknown;
};

export interface ThreeCanvasCoreCallbackProps<TRenderer, TUserData extends object> {
  canvas: HTMLCanvasElement;
  renderer: TRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  size: THREE.Vector2;
  timer: THREE.Timer;
  userData: Partial<TUserData>;
}

export type ThreeCanvasCoreCallback<TProps, TResult = void> = (props: TProps) => TResult;

export interface ThreeCanvasCallbacks<TProps> {
  onAnimationLoop?: ThreeCanvasCoreCallback<TProps, boolean | void>;
  onMount?: ThreeCanvasCoreCallback<TProps, void | (() => void)>;
  onUnmount?: ThreeCanvasCoreCallback<TProps>;
  onResize?: ThreeCanvasCoreCallback<TProps>;
}

export interface ThreeCanvasPipeline<TExtra extends object> {
  props: TExtra;
  setSize(width: number, height: number): void;
  render(): void;
  dispose(): void;
}

export function useThreeCanvas<TRenderer extends ThreeCanvasRenderer, TExtra extends object, TUserData extends object>(
  { onAnimationLoop, onMount, onUnmount, onResize }: ThreeCanvasCallbacks<ThreeCanvasCoreCallbackProps<TRenderer, TUserData> & TExtra>,
  createRenderer: (canvas: HTMLCanvasElement) => TRenderer,
  createPipeline: (renderer: TRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera) => ThreeCanvasPipeline<TExtra>,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userDataRef = useRef<Partial<TUserData>>({});
  const rendererRef = useRef<TRenderer>();
  const disposeTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    clearTimeout(disposeTimeoutRef.current);

    if (!rendererRef.current) {
      rendererRef.current = createRenderer(canvas);
      rendererRef.current.outputColorSpace = THREE.SRGBColorSpace;
      rendererRef.current.setClearColor(0x000000);
    }

    const renderer = rendererRef.current;
    const timer = new THREE.Timer();
    const size = new THREE.Vector2(canvas.clientWidth, canvas.clientHeight);
    const scene = new THREE.Scene();

    renderer.setSize(size.width, size.height, false);

    const camera = new THREE.PerspectiveCamera(
      60,
      size.width / size.height,
      0.1,
      5000
    );
    camera.position.set(0, 0, 5);

    const pipeline = createPipeline(renderer, scene, camera);
    pipeline.setSize(size.width, size.height);

    let resizePending = false;

    const callbackProps = {
      canvas,
      renderer,
      camera,
      scene,
      size,
      timer,
      userData: userDataRef.current,
      ...pipeline.props
    };

    const unmount = onMount?.(callbackProps);

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      size.set(width, height);
      resizePending = true;
    });
    resizeObserver.observe(canvas);

    renderer.setAnimationLoop((timestamp) => {
      timer.update(timestamp);

      if (resizePending) {
        renderer.setSize(size.width, size.height, false);
        pipeline.setSize(size.width, size.height);
        camera.aspect = size.width / size.height;
        camera.updateProjectionMatrix();
        onResize?.(callbackProps);
        resizePending = false;
      }

      if (false !== onAnimationLoop?.(callbackProps)) {
        pipeline.render();
      }
    });

    return () => {
      resizeObserver.disconnect();
      renderer.setAnimationLoop(null);
      unmount?.();
      onUnmount?.(callbackProps);
      pipeline.dispose();

      disposeTimeoutRef.current = setTimeout(() => {
        renderer.dispose();
        rendererRef.current = undefined;
      });
    };
  }, [onAnimationLoop, onMount, onUnmount, onResize]);

  return canvasRef;
}
