// @flow

import * as React from 'react';
import { useReducer, useEffect, useRef, useMemo, useCallback } from 'react';
import memoize from 'memoize-one';
import { gcd, noop } from "../helpers";
import type { Breakpoint, Dimensions, ParasolProps, ParasolState } from "../types";

function useShakeDisable() {
  function shakeHandler(event: WheelEvent) {
    Math.abs(event.deltaX) >= Math.abs(event.deltaY) && event.preventDefault();
  }

  useEffect(_ => {
    let canBind = typeof document !== 'undefined' &&
      document.body &&
      typeof document.body.addEventListener === 'function';

    // Bind a handler to prevent screen shaking on mac. Chrome will start making
    // wheel event handlers passive by default. This defeats the purpose of trying
    // to prevent shaking from a horizontal trackpad swipe.
    if (canBind) {
      let body = document.body;
      body.addEventListener('wheel', shakeHandler, { passive: false });

      return _ => {
        body.removeEventListener('wheel', shakeHandler, { passive: false });
      }
    }
  }, []);
}

// Splits apart a (width, page size) array in to two arrays, widths and sizes,
// containing the individual values respectively.
const splitBreakpoints = memoize((breakpoints: Array<Breakpoint>): Dimensions => {
  let base = { widths: [], sizes: [] };

  return breakpoints.reduce(function(dimensions: Dimensions, breakpoint: Breakpoint) {
    dimensions.widths.push(breakpoint[0]);
    dimensions.sizes.push(breakpoint[1]);
    return dimensions;
  }, base);
});

function computeName(breakpoints: Array<Breakpoint>): string {
  return 'p-' + breakpoints.map((breakpoint: Breakpoint): string => {
    return breakpoint.join('');
  }).join('');
}

function computePageSizeCSS(breakpoints: Array<Breakpoint>): string {
  let name = computeName(breakpoints);

  return breakpoints.map((breakpoint: Breakpoint): string => {
    return `
      @media(min-width: ${breakpoint[0]}px) {
        .${name} .parasol-container > * {
          width: ${100 / breakpoint[1]}%;
          display: inline-block;
        }
      }
    `;
  }).reverse().join('\n');
}

// Given an array of breakpoints, selects the appropriate breakpoint for the
// current screen size. If the screen happens to not be available, the first
// option is selected.
function computePageSize(breakpoints: Array<Breakpoint>): number {

  // Make sure the document is available
  if (typeof document !== 'undefined' && document.documentElement) {

    // Split breakpoints into their individual parts
    let dims = splitBreakpoints(breakpoints);

    // Get the window width
    let width = document.documentElement.clientWidth;

    // Determine the possible window sizes
    let sKeys = dims.widths.filter(w => width > w);

    // Select the largest and get the associated page size
    return dims.sizes[dims.widths.length - sKeys.length];
  }

  // If the document is not available, then default to the largest page size
  return breakpoints.reduce(function(size: number, breakpoint: Breakpoint) {
    return breakpoint[1] > size ? breakpoint[1] : size;
  }, 0);
}

// Given a number of elements and a desired number of elements per page,
// computes how many elements should be on each page
function pages(elementsCount: number, pageSize: number): number {
  return elementsCount / gcd(pageSize, elementsCount);
}

// Takes a raw list of elements (ie. the child nodes of Parasol), a number of
// elements to display per page, and the page to display. A new list of elements
// is then computed such that the appropriate elements are shown, and enough
// elements are attached before and after the visible page so that there are
// enough elements to cover changing pages
function computeElementList(elements: Array<React.Node>, page: number, pageSize: number): Array<React.Node> {

  // Determine the start location of the focus (in-view elements)
  let focusStart = (page - 1) * pageSize % elements.length;
  let focusEnd = focusStart + pageSize;

  // Compute the area of the elements that will be visible on the current page
  let focus = elements.slice(focusStart, focusStart + pageSize);

  // For element lengths that do not align with the pages size, additional
  // elements may be needed to pad out the focus area
  let focusPadding = Math.max(0, pageSize - focus.length);

  // If the focus needs to be extended, add additional elements
  if (focusPadding > 0) {
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

  // If the head is too short, add elements from the end of the list
  if (head.length < pageSize) {
    head = elements.slice(-1 * (pageSize - head.length)).concat(head);
  }

  // Finally combine the lists to create the displayable element list
  return head.concat(focus).concat(tail);
}

const Parasol2 = function Parasol2({
  breakpoints = [[0, 3]],
  children = [],
  resizeDebounceDelay = 250,
  sensitivity = 40,
  onScroll,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onMouseOut,
  onMouseOver,
  previousLabel = 'Previous Items',
  prevTabIndex = 0,
  nextLabel = 'Next Items',
  nextTabIndex = 0,
  itemTabIndex = 0
}: ParasolProps) {
  useShakeDisable();

  const firstElement = useRef(null);
  const [state, setState]: [ParasolState, Function] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      animating: false,
      animationComplete: false,
      animationDirection: null,
      page: 1,
      pageSize: computePageSize(breakpoints),
      touchXStart: 0
    }
  );

  let { animating, animationComplete, animationDirection, page, pageSize, touchXStart } = state;
  let pageCount: number = pages(children.length, pageSize);
  let hasOverflow: bool = children.length > pageSize;

  useEffect(_ => {
    console.log('page size effect');
    function pageSizeHandler(): void {
      let newPageSize = computePageSize(breakpoints);

      // If the new page size is different than the existing size then update
      if (pageSize !== newPageSize) {
        console.log('Old page size', pageSize);
        console.log('New page size', newPageSize);
        setState({ pageSize: newPageSize });
      }
    }

    // Once mounted, bind the window resize handler
    typeof window !== 'undefined' &&
    typeof window.addEventListener === 'function' &&
    window.addEventListener('resize', pageSizeHandler);

    // Run the resize handler a single time on mount
    pageSizeHandler();

    return _ => {
      typeof window !== 'undefined' &&
      typeof window.removeEventListener === 'function' &&
      window.removeEventListener('resize', pageSizeHandler);
    }
  }, [pageSize, breakpoints]);

  useEffect(_ => {
    if (animationComplete && firstElement && firstElement.current && typeof firstElement.current.focus === 'function') {
      firstElement.current.focus();
    }
  }, [animationComplete]);

  const moveLeft: (void => void) = useCallback((): void => {
      onScroll && typeof onScroll === 'function' && onScroll();
      setState({ animating: true, animationComplete: false, animationDirection: 'left' });
    },
    [onScroll]
  );

  const moveRight: (void => void) = useCallback((): void => {
      onScroll && typeof onScroll === 'function' && onScroll();
      setState({ animating: true, animationComplete: false, animationDirection: 'right' });
    },
    [onScroll]
  );

  const wheelHandler: ((event: WheelEvent) => void) = useCallback(
    (event: WheelEvent): void => {
      if (!animating && hasOverflow) {
        event.deltaX < -sensitivity && moveLeft() ||
        event.deltaX > sensitivity && moveRight();
      }
    },
    [sensitivity, moveLeft, moveRight, animating, hasOverflow]
  );

  const paginationEndHandler: (number => (SyntheticTransitionEvent<*> => void)) = useCallback(
    (page: number): (SyntheticTransitionEvent<*> => void) => {
      return function(event: SyntheticTransitionEvent<*>): void {
        if (event.target === event.currentTarget) {
          setState({ animating: false, animationComplete: true, animationDirection: null, page: page });
        }
      };
    },
    []
  );

  let touchStartHandler: (SyntheticTouchEvent<*> => void) = useCallback(
    (event: SyntheticTouchEvent<*>): void => {
      if (!animating && hasOverflow) {

        // If there are no touch events, fail out
        if (!event.touches || event.touches.length < 1) {
          return;
        }

        let startX = event.touches.item(0).clientX;

        setState({touchXStart: startX});
      }
    },
    [animating, hasOverflow]
  );

  let touchMoveHandler: (SyntheticTouchEvent<*> => void) = useCallback(
    (event: SyntheticTouchEvent<*>): void => {
      if (!animating && hasOverflow) {

        // If there are no touch events, fail out
        if (!event.touches || event.touches.length < 1) {
          return;
        }

        // If there is no starting x coordinate, fail out
        if (state.touchXStart === null) {
          return;
        }

        // Listen for any point in a touch drag that should trigger the action
        if ((event.touches.item(0).clientX - state.touchXStart) > sensitivity) {
          moveLeft();
        } else if ((event.touches.item(0).clientX - state.touchXStart) < -sensitivity) {
          moveRight();
        }
      }
    },
    [animating, hasOverflow, touchXStart, sensitivity]
  );

  let name: string = useMemo(
    _ => {
       return computeName(breakpoints);
    },
    [breakpoints]
  )

  let containerCSS: string = useMemo(
    _ => {
      return computePageSizeCSS(breakpoints);
    },
    [breakpoints]
  );

  let containerClass: string = useMemo(
    _ => {
      let { animating, animationDirection, pageSize } = state;
      let hasOverflow = children.length > pageSize;

      let containerClass = `parasol-container`;

      if (hasOverflow) {
        containerClass += ' overflow';
      }

      if (animating && animationDirection) {
        containerClass += ' animating';
        containerClass += ` animating-${animationDirection}`;
      }

      return containerClass;
    },
    [animating, animationDirection, pageSize]
  );

  let prevHandler = useCallback(
    _ => !animating && moveLeft(),
    [animating]
  );
  let nextHandler = useCallback(
    _ => !animating && moveRight(),
    [animating]
  );

  // If there are more elements than a page size, then pagination is needed.
  // To ensure there are enough elements for pagination, generate a list with
  // three full pages
  let elements = useMemo(
    _ => hasOverflow ? computeElementList(children, page, pageSize) : children,
    [hasOverflow, children, page, pageSize]
  );

  let containerHandler = useCallback(
    e => {

      // If the bar is in an animating state, then handle adding the animation
      // styling, and post animation updates
      if (animating && animationDirection) {

        // Compute the next page that should be shown
        let newPage = animationDirection === 'right' ? page + 1 : page - 1;

        // Perform bounds checks to make sure the next page is valid. If it is
        // not then the new page value should wrap
        if (newPage > pageCount) {
          newPage = 1;
        } else if (newPage < 1) {
          newPage = pageCount;
        }

        // Create the transition end handler based on the page that is being
        // animating to
        return paginationEndHandler(newPage)(e);
      }
    },
    [animating, animationDirection, pageCount]
  );

  return <React.Fragment>
    <style dangerouslySetInnerHTML={{__html: containerCSS}} />
    <div
      className={`parasol parasol-carousel ${name}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onMouseOut={onMouseOut}
      onMouseOver={onMouseOver}
    >
      <button
        className={`parasol-cap parasol-cap-left ${hasOverflow && 'parasol-control' || ''}`}
        onClick={prevHandler}
        tabIndex={prevTabIndex}
        aria-label={previousLabel} />
      <div className="parasol-window">
        <div
          className={containerClass}
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
                innerRef: viewPosition === 0 ? firstElement : undefined,
                getRefProp: _ => {
                  return {
                    ref: viewPosition === 0 ? firstElement : null
                  };
                },
                getTabIndex: _ => {
                  return {
                    tabIndex: viewPosition !== null ? itemTabIndex: -1
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
        tabIndex={nextTabIndex}
        aria-label={nextLabel} />
    </div>
  </React.Fragment>;
};

export { Parasol2 }