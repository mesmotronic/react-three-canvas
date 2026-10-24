import { PureComponent } from "react";
import { WebGPURendererParameters } from "three/src/renderers/webgpu/WebGPURenderer.js";
import { ThreeCanvas, ThreeCanvasCallbackProps } from "./ThreeCanvas";

export class ThreeCanvasComponent<TProps = any, TState = any, TUserData extends object = Record<string, any>> extends PureComponent<TProps, TState> {
  public rendererParameters: WebGPURendererParameters = {};
  public canvasDidMount = (props: ThreeCanvasCallbackProps): (void | (() => void)) => { };
  public canvasWillAnimate = (props: ThreeCanvasCallbackProps): boolean | void => { };
  public canvasDidResize = (props: ThreeCanvasCallbackProps): void => { };
  public canvasWillUnmount = (props: ThreeCanvasCallbackProps): void => { };

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