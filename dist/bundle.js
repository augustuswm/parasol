import { createRef, createElement, cloneElement, Component } from 'react';
import memoize from 'memoize-one';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

//      
function gcd(a, b) {
  if (!b) {
    return a;
  }

  return gcd(b, a % b);
}
function noop() {}

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".parasol {\n  position: relative;\n  margin: 0 -6px;\n  touch-action: pan-y;\n}\n\n.parasol.parasol-carousel {\n  margin: 0;\n  padding: 0 4%;\n}\n\n.parasol-cap {\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 4%;\n  height: 100%;\n  text-align: center;\n  font-size: 4em;\n  z-index: 2;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: flex-start;\n  padding-top: 25px;\n  text-transform: uppercase;\n  cursor: pointer;\n}\n\n.parasol-cap-left {\n  left: 0;\n}\n\n.parasol-cap-right {\n  right: 0;\n}\n\n.parasol-window {\n  overflow-x: visible;\n}\n\n.parasol-container {\n  white-space: nowrap;\n}\n\n.parasol-carousel .parasol-container.page-size-2 > * {\n  width: 50%;\n  display: inline-block;\n}\n\n.parasol-carousel .parasol-container.page-size-3 > * {\n  width: 33.333%;\n  display: inline-block;\n}\n\n.parasol-carousel .parasol-container.page-size-4 > * {\n  width: 25%;\n  display: inline-block;\n}\n\n.parasol-carousel .parasol-container.page-size-5 > * {\n  width: 20%;\n  display: inline-block;\n}\n\n.parasol-carousel .parasol-container.page-size-6 > * {\n  width: 16.666%;\n  display: inline-block;\n}\n\n.parasol-carousel .parasol-container.page-size-7 > * {\n  width: 14.285%;\n  display: inline-block;\n}\n\n.parasol-carousel .parasol-container.page-size-8 > * {\n  width: 12.5%;\n  display: inline-block;\n}\n\n.parasol-carousel .parasol-container.page-size-9 > * {\n  width: 11.111%;\n  display: inline-block;\n}\n\n.parasol-carousel .parasol-container.page-size-10 > * {\n  width: 10%;\n  display: inline-block;\n}\n\n.parasol-carousel .parasol-container.overflow {\n transform: translate3d(-100%, 0, 0);\n}\n\n.parasol-carousel .parasol-container.animating {\n  transition: transform 1s ease 0s;\n}\n\n.parasol-carousel .parasol-container.animating-left {\n transform: translate3d(0, 0, 0);\n}\n\n.parasol-carousel .parasol-container.animating-right {\n transform: translate3d(-200%, 0, 0);\n}";
styleInject(css);

var debounce = require('lodash.debounce');
var Parasol =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Parasol, _React$Component);

  function Parasol(props) {
    var _this;

    _classCallCheck(this, Parasol);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Parasol).call(this, props));
    _this.state = {
      animating: false,
      animationDirection: null,
      page: 1,
      pageSize: _this.computePageSize(),
      touchXStart: 0
    };
    _this.firstElement = createRef();
    _this.moveLeft = _this.moveLeft.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.moveRight = _this.moveRight.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.pages = memoize(_this.pages);
    _this.resizeHandler = debounce(_this.pageSizeHandler.bind(_assertThisInitialized(_assertThisInitialized(_this))), _this.props.resizeDebounceDelay);
    _this.splitBreakpoints = memoize(_this.splitBreakpoints);
    _this.startTouch = _this.startTouch.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.touchDrag = _this.touchDrag.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.wheelHandler = _this.wheelHandler.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(Parasol, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Once mounted, bind the window resize handler
      window.addEventListener('resize', this.resizeHandler); // Bind a handler to prevent screen shaking on mac

      document && document.body && document.body.addEventListener('wheel', Parasol.shakeHandler); // Run the resize handler a single time on mount

      this.resizeHandler();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      // On unmount, unbind the window resize handler
      window.removeEventListener('resize', this.resizeHandler); // Unbind the screen shake handler

      document && document.body && document.body.removeEventListener('wheel', Parasol.shakeHandler);
    }
  }, {
    key: "splitBreakpoints",
    value: function splitBreakpoints(breakpoints) {
      var base = {
        widths: [],
        sizes: []
      };
      return breakpoints.reduce(function (dimensions, breakpoint) {
        dimensions.widths.push(breakpoint[0]);
        dimensions.sizes.push(breakpoint[1]);
        return dimensions;
      }, base);
    }
  }, {
    key: "pages",
    value: function pages(elementsCount, pageSize) {
      return elementsCount / gcd(pageSize, elementsCount);
    }
  }, {
    key: "moveLeft",
    value: function moveLeft() {
      var _this2 = this;

      this.setState(function () {
        if (_this2.props.onScroll && typeof _this2.props.onScroll === 'function') {
          _this2.props.onScroll();
        }

        return {
          animating: true,
          animationDirection: 'left'
        };
      });
    }
  }, {
    key: "moveRight",
    value: function moveRight() {
      var _this3 = this;

      this.setState(function () {
        if (_this3.props.onScroll && typeof _this3.props.onScroll === 'function') {
          _this3.props.onScroll();
        }

        return {
          animating: true,
          animationDirection: 'right'
        };
      });
    }
  }, {
    key: "wheelHandler",
    value: function wheelHandler(event) {
      event.deltaX < -this.props.sensitivity && this.moveLeft() || event.deltaX > this.props.sensitivity && this.moveRight();
    }
  }, {
    key: "computePageSize",
    value: function computePageSize() {
      // Make sure the document is available
      if (document.documentElement) {
        // Get the window width
        var width = document.documentElement.clientWidth; // Split breakpoints into their individual parts

        var dims = this.splitBreakpoints(this.props.breakpoints); // Determine the possible window sizes

        var sKeys = dims.widths.filter(function (w) {
          return width > w;
        }); // Select the largest and get the associated page size

        return dims.sizes[dims.widths.length - sKeys.length];
      }

      return 0;
    }
  }, {
    key: "pageSizeHandler",
    value: function pageSizeHandler() {
      var newPageSize = this.computePageSize(); // If the new page size is different than the existing size then update

      if (this.state.pageSize !== newPageSize) {
        this.setState(function () {
          return {
            pageSize: newPageSize
          };
        });
      }
    }
  }, {
    key: "paginationEndHandler",
    value: function paginationEndHandler(page) {
      return function (event) {
        var _this4 = this;

        // Check to make sure that any bubbling events are ignored
        if (event.target === event.currentTarget) {
          this.setState(function () {
            setTimeout(function () {
              if (_this4.firstElement && _this4.firstElement.current && typeof _this4.firstElement.current.focus === 'function') {
                _this4.firstElement.current.focus();
              }
            }, 0);
            return {
              animating: false,
              animationDirection: null,
              page: page
            };
          });
        }
      }.bind(this);
    }
  }, {
    key: "startTouch",
    value: function startTouch(event) {
      // If there are no touch events, fail out
      if (!event.touches || event.touches.length < 1) {
        return;
      }

      var startX = event.touches.item(0).clientX;
      this.setState(function () {
        return {
          touchXStart: startX
        };
      });
    }
  }, {
    key: "touchDrag",
    value: function touchDrag(event) {
      // If there are no touch events, fail out
      if (!event.touches || event.touches.length < 1) {
        return;
      } // If there is no starting x coordinate, fail out


      if (this.state.touchXStart === null) {
        return;
      } // Listen for any point in a touch drag that should trigger the action


      if (event.touches.item(0).clientX - this.state.touchXStart > this.props.sensitivity) {
        this.moveLeft();
      } else if (event.touches.item(0).clientX - this.state.touchXStart < -this.props.sensitivity) {
        this.moveRight();
      }
    }
  }, {
    key: "containerClass",
    value: function containerClass() {
      var _this$state = this.state,
          animating = _this$state.animating,
          animationDirection = _this$state.animationDirection,
          page = _this$state.page,
          pageSize = _this$state.pageSize;
      var hasOverflow = this.props.children.length > pageSize;
      var containerClass = "parasol-container page-size-".concat(pageSize);

      if (hasOverflow) {
        containerClass += ' overflow';
      }

      if (animating && animationDirection) {
        containerClass += ' animating';
        containerClass += " animating-".concat(animationDirection);
      }

      return containerClass;
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      var _this$state2 = this.state,
          animating = _this$state2.animating,
          animationDirection = _this$state2.animationDirection,
          page = _this$state2.page,
          pageSize = _this$state2.pageSize;
      var elements = this.props.children;
      var pages = this.pages(elements.length, pageSize);
      var hasOverflow = elements.length > pageSize;
      var prevHandler = !animating ? this.moveLeft : noop;
      var nextHandler = !animating ? this.moveRight : noop;
      var touchStartHandler = !animating && hasOverflow ? this.startTouch : noop;
      var touchMoveHandler = !animating && hasOverflow ? this.touchDrag : noop;
      var wheelHandler = !animating && hasOverflow ? this.wheelHandler : noop;
      var containerHandler = noop; // If there are more elements than a page size, then pagination is needed.
      // To ensure there are enough elements for pagination, generate a list with
      // three full pages

      if (hasOverflow) {
        elements = Parasol.computeElementList(elements, page, pageSize);
      } // If the bar is in an animating state, then handle adding the animation
      // styling, and post animation updates


      if (animating && animationDirection) {
        // Compute the next page that should be shown
        var newPage = animationDirection === 'right' ? page + 1 : page - 1; // Perform bounds checks to make sure the next page is valid. If it is
        // not then the new page value should wrap

        if (newPage > pages) {
          newPage = 1;
        } else if (newPage < 1) {
          newPage = pages;
        } // Create the transition end handler based on the page that is being
        // animating to


        containerHandler = this.paginationEndHandler(newPage);
      }

      return createElement("div", {
        className: "parasol parasol-carousel",
        onMouseEnter: this.props.onMouseEnter,
        onMouseLeave: this.props.onMouseLeave,
        onMouseMove: this.props.onMouseMove,
        onMouseOut: this.props.onMouseOut,
        onMouseOver: this.props.onMouseOver
      }, createElement("button", {
        className: "parasol-cap parasol-cap-left ".concat(hasOverflow && 'parasol-control' || ''),
        onClick: prevHandler,
        tabIndex: this.props.prevTabIndex || 0,
        "aria-label": this.props.previousLabel || 'Previous Items'
      }), createElement("div", {
        className: "parasol-window"
      }, createElement("div", {
        className: this.containerClass(),
        onTouchStart: touchStartHandler,
        onTouchMove: touchMoveHandler,
        onWheel: wheelHandler,
        onTransitionEnd: containerHandler
      }, elements.map(function (el, i) {
        var viewPosition;

        if (hasOverflow) {
          viewPosition = i - pageSize >= 0 && i + pageSize < elements.length ? i - pageSize : null;
        } else {
          viewPosition = i;
        }

        var baseKey = typeof el.key === 'string' ? el.key : '';
        var elementProps = {
          key: "".concat(baseKey, "-").concat(i),
          animating: animating,
          position: i,
          viewPosition: viewPosition,
          pageSize: pageSize,
          page: page
        };

        if (viewPosition === 0) {
          elementProps.innerRef = _this5.firstElement;
        }

        return cloneElement(el, elementProps);
      }))), createElement("button", {
        className: "parasol-cap parasol-cap-right ".concat(hasOverflow && 'parasol-control' || ''),
        onClick: nextHandler,
        tabIndex: this.props.nextTabIndex || 0,
        "aria-label": this.props.nextLabel || 'Next Items'
      }));
    }
  }], [{
    key: "shakeHandler",
    value: function shakeHandler(event) {
      Math.abs(event.deltaX) >= Math.abs(event.deltaY) && event.preventDefault();
    }
  }, {
    key: "computeElementList",
    value: function computeElementList(elements, page, pageSize) {
      // Determine the start location of the focus
      var focusStart = (page - 1) * pageSize % elements.length;
      var focusEnd = focusStart + pageSize; // Compute the area of the clips that will be visible on the current page

      var focus = elements.slice(focusStart, focusStart + pageSize); // For clip lengths that do not align with the pages size, additional
      // clips may be needed to pad out the focus area

      var focusPadding = Math.max(0, pageSize - focus.length); // If the focus needs to be extended, add additional clips

      if (focusPadding > 0) {
        focus = focus.concat(elements.slice(0, focusPadding)); // If the focus area wrapped, then adjust the ending point

        focusEnd = focusPadding;
      } // Compute the list that follows the focus


      var tail = elements.slice(focusEnd, focusEnd + pageSize); // If the tail is too short, pad from the start of the list

      if (tail.length < pageSize) {
        tail = tail.concat(elements.slice(0, pageSize - tail.length));
      } // Compute the list that precedes the focus


      var head = elements.slice(Math.max(0, focusStart - pageSize), focusStart); // If the head is too short, add clips from the end of the list

      if (head.length < pageSize) {
        head = elements.slice(-1 * (pageSize - head.length)).concat(head);
      } // Finally combine the lists to create the displayable clip list


      return head.concat(focus).concat(tail);
    }
  }]);

  return Parasol;
}(Component);
Parasol.defaultProps = {
  breakpoints: [[0, 3]],
  children: [],
  resizeDebounceDelay: 250,
  sensitivity: 40,
  onScroll: noop
};

export default Parasol;
