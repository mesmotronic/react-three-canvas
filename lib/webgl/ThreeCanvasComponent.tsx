import { PureComponent } from "react";
import { ThreeCanvas, ThreeCanvasCallbackProps } from "./ThreeCanvas";

export class ThreeCanvasComponent<TProps = any, TState = any, TUserData extends object = Record<string, any>> extends PureComponent<TProps, TState> {
  // @ts-ignore
  public canvasDidMount = (props: ThreeCanvasCallbackProps) => { };
  // @ts-ignore
  public canvasWillAnimate = (props: ThreeCanvasCallbackProps) => { };
  // @ts-ignore
  public canvasDidResize = (props: ThreeCanvasCallbackProps) => { };
  // @ts-ignore
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