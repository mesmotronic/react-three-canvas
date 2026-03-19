import * as THREE from 'three';
import { ThreeCanvasCallbackProps, ThreeCanvasComponent } from '../../lib/webgpu';

class Example extends ThreeCanvasComponent {
  protected cube?: THREE.Mesh;

  public override canvasDidMount = ({ scene }: ThreeCanvasCallbackProps) => {
    const geometry = new THREE.TorusKnotGeometry(0.6, 0.2, 128, 32);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    this.cube = mesh;

    return () => {
      // Alternative to canvasWillUnmount
      console.log('Unmounting 2');
    };
  };

  public override canvasWillAnimate = ({ }: ThreeCanvasCallbackProps) => {
    const cube = this.cube!;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Return false to prevent default render, e.g. if you're using custom post-processing
  };

  public override canvasDidResize = ({ }: ThreeCanvasCallbackProps) => {
    console.log('Resized');
  };

  public override canvasWillUnmount = ({ }: ThreeCanvasCallbackProps) => {
    console.log('Unmounting 1');
    delete this.cube;
  };

};

export default Example;