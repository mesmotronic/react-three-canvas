import { PureComponent } from "react";
import { ThreeCanvas, ThreeCanvasCallbackProps } from "./ThreeCanvas";

export class ThreeCanvasComponent<TProps = any, TState = any, TUserData extends object = Record<string, any>> extends PureComponent<TProps, TState> {
  public canvasDidMount = (props: ThreeCanvasCallbackProps) => { };
  public canvasWillAnimate = (props: ThreeCanvasCallbackProps) => { };
  public canvasDidResize = (props: ThreeCanvasCallbackProps) => { };
  public canvasWillUnmount = (props: ThreeCanvasCallbackProps) => { };

  public override render() {
    return (
      <ThreeCanvas<TUserData>
        style={{ width: "100%", height: "100%" }}
        onMount={this.canvasDidMount}
        onAnimationFrame={this.canvasWillAnimate}
        onResize={this.canvasDidResize}
        onUnmount={this.canvasWillUnmount}
      />
    );
  }
}