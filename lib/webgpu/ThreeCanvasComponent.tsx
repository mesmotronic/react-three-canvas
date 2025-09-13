import { PureComponent } from "react";
import { ThreeCanvas, ThreeCanvasCallbackProps } from "./ThreeCanvas";

export class ThreeCanvasComponent<TProps = any, TState = any> extends PureComponent<TProps, TState> {
  public canvasDidMount = (_props: ThreeCanvasCallbackProps) => { };
  public canvasWillAnimate = (_props: ThreeCanvasCallbackProps) => { };
  public canvasDidResize = (_props: ThreeCanvasCallbackProps) => { };
  public canvasWillUnmount = (_props: ThreeCanvasCallbackProps) => { };

  public override render() {
    return (
      <ThreeCanvas
        style={{ width: "100%", height: "100%" }}
        onMount={this.canvasDidMount}
        onAnimationFrame={this.canvasWillAnimate}
        onResize={this.canvasDidResize}
        onUnmount={this.canvasWillUnmount}
      />
    );
  }
}