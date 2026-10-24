import { CanvasHTMLAttributes, PureComponent } from "react";
import * as THREE from "three";
import { ThreeCanvas, ThreeCanvasCallback } from "./ThreeCanvas";

export class ThreeCanvasComponent<TProps = any, TState = any, TUserData extends object = Record<string, any>> extends PureComponent<TProps, TState> {
  public rendererParameters: THREE.WebGLRendererParameters = {};
  public canvasProps: CanvasHTMLAttributes<HTMLCanvasElement> = {};
  public canvasDidMount: ThreeCanvasCallback<TUserData, void | (() => void)> = () => { };
  public canvasWillAnimate: ThreeCanvasCallback<TUserData, boolean | void> = () => { };
  public canvasDidResize: ThreeCanvasCallback<TUserData> = () => { };
  public canvasWillUnmount: ThreeCanvasCallback<TUserData> = () => { };

  public override render() {
    return (
      <ThreeCanvas<TUserData>
        style={{ width: "100%", height: "100%" }}
        {...this.canvasProps}
        rendererParameters={this.rendererParameters}
        onMount={this.canvasDidMount}
        onAnimationLoop={this.canvasWillAnimate}
        onResize={this.canvasDidResize}
        onUnmount={this.canvasWillUnmount}
      />
    );
  }
}