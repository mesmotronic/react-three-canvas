import { PureComponent } from "react";
import * as THREE from "three";
import { ThreeCanvas, ThreeCanvasCallbackProps } from "./ThreeCanvas";

export class ThreeCanvasComponent<TProps = any, TState = any, TUserData extends object = Record<string, any>> extends PureComponent<TProps, TState> {
  public rendererParameters: THREE.WebGLRendererParameters = {};
  public canvasDidMount = (props: ThreeCanvasCallbackProps) => { };
  public canvasWillAnimate = (props: ThreeCanvasCallbackProps) => { };
  public canvasDidResize = (props: ThreeCanvasCallbackProps) => { };
  public canvasWillUnmount = (props: ThreeCanvasCallbackProps) => { };

  public override render() {
    return (
      <ThreeCanvas<TUserData>
        style={{ width: "100%", height: "100%" }}
        rendererParameters={this.rendererParameters}
        onMount={this.canvasDidMount}
        onAnimationLoop={this.canvasWillAnimate}
        onResize={this.canvasDidResize}
        onUnmount={this.canvasWillUnmount}
      />
    );
  }
}