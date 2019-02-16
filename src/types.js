export type AnimationDirection = 'left' | 'right';

export type Breakpoint = [number, number]

export type Dimensions = {|
  widths: Array<number>,
  sizes: Array<number>
|};

export type ParasolProps = {|
  breakpoints: Array<Breakpoint>,
  children: Array<React.Node>,
  resizeDebounceDelay: number,
  sensitivity: number,
  onScroll: ?Function,
  onMouseEnter?: Function,
  onMouseLeave?: Function,
  onMouseMove?: Function,
  onMouseOut?: Function,
  onMouseOver?: Function,
  previousLabel?: string,
  prevTabIndex?: number,
  nextLabel?: string,
  nextTabIndex?: number,
  itemTabIndex?: number
|};

export type ParasolState = {|
  animating: boolean,
  animationComplete: boolean,
  animationDirection: ?AnimationDirection,
  page: number,
  pageSize: number,
  touchXStart: number
|};