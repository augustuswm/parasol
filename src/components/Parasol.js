// @flow

import * as React from 'react';
import memoize from 'memoize-one';
let debounce = fn => fn;

import { gcd, noop } from "../helpers";
import './parasol.css';

type AnimationDirection = 'left' | 'right';

type Breakpoint = [number, number]

type Dimensions = {|
  widths: Array < number >,
    sizes: Array < number >
|};

type ParasolProps = {|
  breakpoints: Array < Breakpoint >,
    children: Array < React.Node >,
      resizeDebounceDelay: number,
        sensitivity: number,
          onScroll: ?Function,
            onMouseEnter ?: Function,
            onMouseLeave ?: Function,
            onMouseMove ?: Function,
            onMouseOut ?: Function,
            onMouseOver ?: Function,
            previousLabel ?: String,
            prevTabIndex ?: number,
            nextLabel ?: String,
            nextTabIndex ?: number,
            itemTabIndex ?: number
              |};

type ParasolState = {|
  animating: boolean,
    animationDirection: ?AnimationDirection,
      page: number,
        pageSize: number,
          touchXStart: number
            |};

export class Parasol extends React.Component<ParasolProps, ParasolState> {
  static defaultProps: ParasolProps;

  constructor(props: *) {
    super(props);
    this.state = {
      animating: false,
      animationDirection: null,
      page: 1,
      pageSize: this.computePageSize(),
      touchXStart: 0
    };

    this.firstElement = React.createRef();

    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.pages = memoize(this.pages);
    this.resizeHandler = debounce(this.pageSizeHandler.bind(this), this.props.resizeDebounceDelay);
    this.splitBreakpoints = memoize(this.splitBreakpoints);
    this.startTouch = this.startTouch.bind(this);
    this.touchDrag = this.touchDrag.bind(this);
    this.wheelHandler = this.wheelHandler.bind(this);
  }

  resizeHandler: () => void;

  componentDidMount() { // !

    // Once mounted, bind the window resize handler
    window.addEventListener('resize', this.resizeHandler);

    // Bind a handler to prevent screen shaking on mac. Chrome will start making
    // wheel event handlers passive by default. This defeats the purpose of trying
    // to prevent shaking from a horizontal trackpad swipe.
    document && document.body && document.body.addEventListener('wheel', Parasol.shakeHandler, { passive: false });

    // Run the resize handler a single time on mount
    this.resizeHandler();
  }

  componentWillUnmount() { // !

    // On unmount, unbind the window resize handler
    window.removeEventListener('resize', this.resizeHandler);

    // Unbind the screen shake handler
    document && document.body && document.body.removeEventListener('wheel', Parasol.shakeHandler, { passive: false });
  }

  splitBreakpoints: Array<Breakpoint> => Dimensions;
  splitBreakpoints(breakpoints: Array<Breakpoint>): Dimensions { // !
    let base = { widths: [], sizes: [] };

    return breakpoints.reduce(function (dimensions: Dimensions, breakpoint: Breakpoint) {
      dimensions.widths.push(breakpoint[0]);
      dimensions.sizes.push(breakpoint[1]);
      return dimensions;
    }, base);
  }

  static shakeHandler(event: WheelEvent) { // !
    Math.abs(event.deltaX) >= Math.abs(event.deltaY) && event.preventDefault();
  }

  pages: (number, number) => number;
  pages(elementsCount: number, pageSize: number): number { // !
    return elementsCount / gcd(pageSize, elementsCount);
  }

  moveLeft: () => void;
  moveLeft() { // !
    this.setState(() => {
      if (this.props.onScroll && typeof this.props.onScroll === 'function') {
        this.props.onScroll();
      }

      return {
        animating: true,
        animationDirection: 'left'
      }
    });
  }

  moveRight: () => void;
  moveRight() { // !
    this.setState(() => {
      if (this.props.onScroll && typeof this.props.onScroll === 'function') {
        this.props.onScroll();
      }

      return {
        animating: true,
        animationDirection: 'right'
      }
    });
  }

  wheelHandler: WheelEvent => void;
  wheelHandler(event: WheelEvent): void { // !
    event.deltaX < -this.props.sensitivity && this.moveLeft() ||
      event.deltaX > this.props.sensitivity && this.moveRight();
  }

  computePageSize() { // !

    // Make sure the window is available
    if (window) {

      // Split breakpoints into their individual parts
      let dims = this.splitBreakpoints(this.props.breakpoints);

      // Determine the possible window sizes by testing them as media queries
      let sKeys = dims.widths.filter(w => {
        return window.matchMedia(`(min-width: ${w}px)`).matches;
      });

      // Select the largest and get the associated page size
      return dims.sizes[dims.widths.length - sKeys.length];
    }

    return 0;
  }

  pageSizeHandler() { // !

    let newPageSize = this.computePageSize();

    // If the new page size is different than the existing size then update
    if (this.state.pageSize !== newPageSize) {
      this.setState(() => {
        return {
          pageSize: newPageSize
        }
      });
    }
  }

  paginationEndHandler: number => (SyntheticTransitionEvent <*> => void);
paginationEndHandler(page: number): SyntheticTransitionEvent <*> => void { // !
  return function (event: SyntheticTransitionEvent<*>) {

    // Check to make sure that any bubbling events are ignored
    if (event.target === event.currentTarget) {
      this.setState(() => {
        setTimeout(() => {
          if (this.firstElement && this.firstElement.current && typeof this.firstElement.current.focus === 'function') {
            this.firstElement.current.focus();
          }
        }, 0);

        return { animating: false, animationDirection: null, page: page };
      });
    }
  }.bind(this);
}

startTouch: SyntheticTouchEvent <*> => void;
startTouch(event: SyntheticTouchEvent <*>) {

  // If there are no touch events, fail out
  if (!event.touches || event.touches.length < 1) {
    return;
  }

  let startX = event.touches.item(0).clientX;

  this.setState(() => {
    return { touchXStart: startX };
  });
}

touchDrag: SyntheticTouchEvent <*> => void;
touchDrag(event: SyntheticTouchEvent <*>) {

  // If there are no touch events, fail out
  if (!event.touches || event.touches.length < 1) {
    return;
  }

  // If there is no starting x coordinate, fail out
  if (this.state.touchXStart === null) {
    return;
  }

  // Listen for any point in a touch drag that should trigger the action
  if ((event.touches.item(0).clientX - this.state.touchXStart) > this.props.sensitivity) {
    this.moveLeft();
  } else if ((event.touches.item(0).clientX - this.state.touchXStart) < -this.props.sensitivity) {
    this.moveRight();
  }
}

  static computeElementList(elements: Array < React.Node >, page: number, pageSize: number): Array < React.Node > {

  // Determine the start location of the focus
  let focusStart = (page - 1) * pageSize % elements.length;
  let focusEnd = focusStart + pageSize;

  // Compute the area of the clips that will be visible on the current page
  let focus = elements.slice(focusStart, focusStart + pageSize);

  // For clip lengths that do not align with the pages size, additional
  // clips may be needed to pad out the focus area
  let focusPadding = Math.max(0, pageSize - focus.length);

  // If the focus needs to be extended, add additional clips
  if(focusPadding > 0) {
  focus = focus.concat(elements.slice(0, focusPadding));

  // If the focus area wrapped, then adjust the ending point
  focusEnd = focusPadding;
}

// Compute the list that follows the focus
let tail = elements.slice(focusEnd, focusEnd + pageSize);

// If the tail is too short, pad from the start of the list
if (tail.length < pageSize) {
  tail = tail.concat(elements.slice(0, pageSize - tail.length));
}

// Compute the list that precedes the focus
let head = elements.slice(Math.max(0, focusStart - pageSize), focusStart);

// If the head is too short, add clips from the end of the list
if (head.length < pageSize) {
  head = elements.slice(-1 * (pageSize - head.length)).concat(head);
}

// Finally combine the lists to create the displayable clip list
return head.concat(focus).concat(tail);
  }

containerClass(): string {
  let { animating, animationDirection, page, pageSize } = this.state;
  let hasOverflow = this.props.children.length > pageSize;

  let containerClass = `parasol-container page-size-${pageSize}`;

  if (hasOverflow) {
    containerClass += ' overflow';
  }

  if (animating && animationDirection) {
    containerClass += ' animating';
    containerClass += ` animating-${animationDirection}`;
  }

  return containerClass;
}

render() {
  let { animating, animationDirection, page, pageSize } = this.state;
  let elements = this.props.children;

  let pages = this.pages(elements.length, pageSize);
  let hasOverflow = elements.length > pageSize;
  let prevHandler = !animating ? this.moveLeft : noop;
  let nextHandler = !animating ? this.moveRight : noop;
  let touchStartHandler = !animating && hasOverflow ? this.startTouch : noop;
  let touchMoveHandler = !animating && hasOverflow ? this.touchDrag : noop;
  let wheelHandler = !animating && hasOverflow ? this.wheelHandler : noop;
  let containerHandler = noop;

  // If there are more elements than a page size, then pagination is needed.
  // To ensure there are enough elements for pagination, generate a list with
  // three full pages
  if (hasOverflow) {
    elements = Parasol.computeElementList(elements, page, pageSize);
  }

  // If the bar is in an animating state, then handle adding the animation
  // styling, and post animation updates
  if (animating && animationDirection) {

    // Compute the next page that should be shown
    let newPage = animationDirection === 'right' ? page + 1 : page - 1;

    // Perform bounds checks to make sure the next page is valid. If it is
    // not then the new page value should wrap
    if (newPage > pages) {
      newPage = 1;
    } else if (newPage < 1) {
      newPage = pages;
    }

    // Create the transition end handler based on the page that is being
    // animating to
    containerHandler = this.paginationEndHandler(newPage);
  }

  return (
    <div
      className={`parasol parasol-carousel`}
      onMouseEnter={this.props.onMouseEnter}
      onMouseLeave={this.props.onMouseLeave}
      onMouseMove={this.props.onMouseMove}
      onMouseOut={this.props.onMouseOut}
      onMouseOver={this.props.onMouseOver}
    >
      <button
        className={`parasol-cap parasol-cap-left ${hasOverflow && 'parasol-control' || ''}`}
        onClick={prevHandler}
        tabIndex={this.props.prevTabIndex || 0}
        aria-label={this.props.previousLabel || 'Previous Items'} />
      <div className="parasol-window">
        <div
          className={this.containerClass()}
          onTouchStart={touchStartHandler}
          onTouchMove={touchMoveHandler}
          onWheel={wheelHandler}
          onTransitionEnd={containerHandler}>
          {
            elements.map((el, i) => {
              let viewPosition;

              if (hasOverflow) {
                viewPosition = i - pageSize >= 0 && i + pageSize < elements.length ? i - pageSize : null;
              } else {
                viewPosition = i;
              }

              let baseKey = typeof el.key === 'string' ? el.key : '';

              let elementProps = {
                key: `${baseKey}-${i}`,
                animating: animating,
                position: i,
                viewPosition: viewPosition,
                pageSize: pageSize,
                page: page,
                // DEPRECATED
                innerRef: viewPosition === 0 ? this.firstElement : undefined,
                getRefProp: _ => {
                  return {
                    ref: viewPosition === 0 ? this.firstElement : null
                  };
                },
                getTabIndex: _ => {
                  return {
                    tabIndex: viewPosition !== null ? this.props.itemTabIndex : -1
                  };
                }
              };

              return React.cloneElement(el, elementProps);
            })
          }
        </div>
      </div>
      <button
        className={`parasol-cap parasol-cap-right ${hasOverflow && 'parasol-control' || ''}`}
        onClick={nextHandler}
        tabIndex={this.props.nextTabIndex || 0}
        aria-label={this.props.nextLabel || 'Next Items'} />
    </div>
  );
}
}

Parasol.defaultProps = {
  breakpoints: [[0, 3]],
  children: [],
  resizeDebounceDelay: 250,
  sensitivity: 40,
  onScroll: noop
};