import type { Element as ReactElement } from "react"

declare module "react-motion" {
  declare function Motion (props: Object): ReactElement;
  declare function TransitionMotion (props: Object): ReactElement;
  declare function spring (value: number, config: ?{stiffness?: number, damping?: number, precision?: number}): any;
  declare var presets: { [key: string]: {stiffness?: number, damping?: number, precision?: number } };
}
