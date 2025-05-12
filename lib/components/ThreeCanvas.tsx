import React, { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';

export interface ThreeCanvasCallbackProps {
  canvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  composer: EffectComposer;
  scene: THREE.Scene;
}

export interface ThreeCanvasProps extends React.HTMLAttributes<HTMLCanvasElement> {
  onAnimationFrame?: (params: ThreeCanvasCallbackProps) => void;
  onMount?: (params: ThreeCanvasCallbackProps) => void;
  onUnmount?: () => void;
}

/**
 * Create a Three.js canvas with a renderer, camera and scene
 */
export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  onAnimationFrame = () => { },
  onMount = () => { },
  onUnmount = () => { },
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvasRef.current
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setClearColor(0x000000);

    const camera = new THREE.PerspectiveCamera(
      60,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      5000
    );
    camera.position.set(0, 0, 5);

    const composer = new EffectComposer(renderer);
    composer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    onMount({ canvas: canvasRef.current, renderer, camera, composer, scene });

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      renderer.setSize(width, height);
      composer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });
    resizeObserver.observe(canvasRef.current);

    renderer.setAnimationLoop(() => {
      onAnimationFrame({ canvas: canvasRef.current!, renderer, camera, composer, scene });
      composer.render();
    });

    return () => {
      resizeObserver.disconnect();
      renderer.setAnimationLoop(null);
      renderer.dispose();
      onUnmount();
    };
  }, [onAnimationFrame, onMount, onUnmount]);

  return <canvas ref={canvasRef} {...props} />;
};

export default ThreeCanvas;