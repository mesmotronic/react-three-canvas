import React, { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';

export interface ThreeCanvasCallbackProps {
  scene: THREE.Scene;
  canvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  composer: EffectComposer;
}

export interface ThreeCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  onAnimationFrame?: (params: ThreeCanvasCallbackProps) => void;
  onMount?: (params: ThreeCanvasCallbackProps) => void;
  onUnmount?: () => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  onAnimationFrame = () => { },
  onMount = () => { },
  onUnmount = () => { },
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000); // Default clear color
    const canvas = renderer.domElement;
    containerRef.current.appendChild(canvas);

    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      5000
    );
    camera.position.set(0, 0, 5);

    const composer = new EffectComposer(renderer);
    composer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    onMount?.({ scene, canvas, renderer, camera, composer });

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      renderer.setSize(width, height);
      composer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });
    resizeObserver.observe(containerRef.current);

    renderer.setAnimationLoop(() => {
      onAnimationFrame?.({ scene, canvas, renderer, camera, composer });
      composer.render();
    });

    return () => {
      resizeObserver.disconnect();
      renderer.setAnimationLoop(null);
      canvas.remove();
      renderer.dispose();
      onUnmount?.();
    };
  }, [onAnimationFrame, onMount, onUnmount]);

  return <div ref={containerRef} {...props} />;
};

export default ThreeCanvas;