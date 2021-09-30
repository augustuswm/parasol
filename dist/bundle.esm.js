import { useEffect, createRef, createElement, cloneElement, Component, useRef, useReducer, useCallback, useMemo, Fragment, memo } from 'react';
import memoize from 'memoize-one';

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

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

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
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

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
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
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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

var debounce = function debounce(fn) {
  return fn;
};
var Parasol = /*#__PURE__*/function (_React$Component) {
  _inherits(Parasol, _React$Component);

  var _super = _createSuper(Parasol);

  function Parasol(props) {
    var _this;

    _classCallCheck(this, Parasol);

    _this = _super.call(this, props);
    _this.state = {
      animating: false,
      animationDirection: null,
      page: 1,
      pageSize: _this.computePageSize(),
      touchXStart: 0
    };
    _this.firstElement = /*#__PURE__*/createRef();
    _this.moveLeft = _this.moveLeft.bind(_assertThisInitialized(_this));
    _this.moveRight = _this.moveRight.bind(_assertThisInitialized(_this));
    _this.pages = memoize(_this.pages);
    _this.resizeHandler = debounce(_this.pageSizeHandler.bind(_assertThisInitialized(_this)), _this.props.resizeDebounceDelay);
    _this.splitBreakpoints = memoize(_this.splitBreakpoints);
    _this.startTouch = _this.startTouch.bind(_assertThisInitialized(_this));
    _this.touchDrag = _this.touchDrag.bind(_assertThisInitialized(_this));
    _this.wheelHandler = _this.wheelHandler.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Parasol, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // !
      // Once mounted, bind the window resize handler
      window.addEventListener('resize', this.resizeHandler); // Bind a handler to prevent screen shaking on mac. Chrome will start making
      // wheel event handlers passive by default. This defeats the purpose of trying
      // to prevent shaking from a horizontal trackpad swipe.

      document && document.body && document.body.addEventListener('wheel', Parasol.shakeHandler, {
        passive: false
      }); // Run the resize handler a single time on mount

      this.resizeHandler();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      // !
      // On unmount, unbind the window resize handler
      window.removeEventListener('resize', this.resizeHandler); // Unbind the screen shake handler

      document && document.body && document.body.removeEventListener('wheel', Parasol.shakeHandler, {
        passive: false
      });
    }
  }, {
    key: "splitBreakpoints",
    value: function splitBreakpoints(breakpoints) {
      // !
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
      // !
      return elementsCount / gcd(pageSize, elementsCount);
    }
  }, {
    key: "moveLeft",
    value: function moveLeft() {
      var _this2 = this;

      // !
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

      // !
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
      // !
      event.deltaX < -this.props.sensitivity && this.moveLeft() || event.deltaX > this.props.sensitivity && this.moveRight();
    }
  }, {
    key: "computePageSize",
    value: function computePageSize() {
      // !
      // Make sure the window is available
      if (window) {
        // Split breakpoints into their individual parts
        var dims = this.splitBreakpoints(this.props.breakpoints); // Determine the possible window sizes by testing them as media queries

        var sKeys = dims.widths.filter(function (w) {
          return window.matchMedia("(min-width: ".concat(w, "px)")).matches;
        }); // Select the largest and get the associated page size

        return dims.sizes[dims.widths.length - sKeys.length];
      }

      return 0;
    }
  }, {
    key: "pageSizeHandler",
    value: function pageSizeHandler() {
      // !
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
      // !
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

      return /*#__PURE__*/createElement("div", {
        className: "parasol parasol-carousel",
        onMouseEnter: this.props.onMouseEnter,
        onMouseLeave: this.props.onMouseLeave,
        onMouseMove: this.props.onMouseMove,
        onMouseOut: this.props.onMouseOut,
        onMouseOver: this.props.onMouseOver
      }, /*#__PURE__*/createElement("button", {
        className: "parasol-cap parasol-cap-left ".concat(hasOverflow && 'parasol-control' || ''),
        onClick: prevHandler,
        tabIndex: this.props.prevTabIndex || 0,
        "aria-label": this.props.previousLabel || 'Previous Items'
      }), /*#__PURE__*/createElement("div", {
        className: "parasol-window"
      }, /*#__PURE__*/createElement("div", {
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
          page: page,
          // DEPRECATED
          innerRef: viewPosition === 0 ? _this5.firstElement : undefined,
          getRefProp: function getRefProp(_) {
            return {
              ref: viewPosition === 0 ? _this5.firstElement : null
            };
          },
          getTabIndex: function getTabIndex(_) {
            return {
              tabIndex: viewPosition !== null ? _this5.props.itemTabIndex : -1
            };
          }
        };
        return /*#__PURE__*/cloneElement(el, elementProps);
      }))), /*#__PURE__*/createElement("button", {
        className: "parasol-cap parasol-cap-right ".concat(hasOverflow && 'parasol-control' || ''),
        onClick: nextHandler,
        tabIndex: this.props.nextTabIndex || 0,
        "aria-label": this.props.nextLabel || 'Next Items'
      }));
    }
  }], [{
    key: "shakeHandler",
    value: function shakeHandler(event) {
      // !
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

//      
function useShakeDisable() {
  function shakeHandler(event) {
    Math.abs(event.deltaX) >= Math.abs(event.deltaY) && event.preventDefault();
  }

  useEffect(function (_) {
    var canBind = typeof document !== 'undefined' && document.body && typeof document.body.addEventListener === 'function'; // Bind a handler to prevent screen shaking on mac. Chrome will start making
    // wheel event handlers passive by default. This defeats the purpose of trying
    // to prevent shaking from a horizontal trackpad swipe.

    if (canBind) {
      var body = document.body;
      body.addEventListener('wheel', shakeHandler, {
        passive: false
      });
      return function (_) {
        body.removeEventListener('wheel', shakeHandler, {
          passive: false
        });
      };
    }
  }, []);
}

//      

function CoreStyles() {
  var styles = "\n    .parasol {\n      position: relative;\n      margin: 0 -6px;\n      touch-action: pan-y;\n    }\n\n    .parasol.parasol-carousel {\n      margin: 0;\n      padding: 0 4%;\n    }\n\n    .parasol-cap {\n      position: absolute;\n      top: 0;\n      right: 0;\n      width: 4%;\n      height: 100%;\n      text-align: center;\n      font-size: 4em;\n      z-index: 2;\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      justify-content: flex-start;\n      padding-top: 25px;\n      text-transform: uppercase;\n      cursor: pointer;\n    }\n\n    .parasol-cap-left {\n      left: 0;\n    }\n\n    .parasol-cap-right {\n      right: 0;\n    }\n\n    .parasol-window {\n      overflow-x: visible;\n    }\n\n    .parasol-container {\n      white-space: nowrap;\n    }\n\n    .parasol-carousel .parasol-container.overflow {\n     transform: translate(-100%, 0);\n    }\n\n    .parasol-carousel .parasol-container.animating {\n      transition: transform 1s ease 0s;\n    }\n\n    .parasol-carousel .parasol-container.animating-left {\n     transform: translate(0, 0);\n    }\n\n    .parasol-carousel .parasol-container.animating-right {\n     transform: translate(-200%, 0);\n    }\n  ";
  return /*#__PURE__*/createElement("style", {
    dangerouslySetInnerHTML: {
      __html: styles
    }
  });
}

var CoreStyles$1 = /*#__PURE__*/memo(CoreStyles);

// containing the individual values respectively.

var splitBreakpoints = memoize(function (breakpoints) {
  var base = {
    widths: [],
    sizes: []
  };
  return breakpoints.reduce(function (dimensions, breakpoint) {
    dimensions.widths.push(breakpoint[0]);
    dimensions.sizes.push(breakpoint[1]);
    return dimensions;
  }, base);
});

function computeName(breakpoints) {
  return 'p-' + breakpoints.map(function (breakpoint) {
    return breakpoint.join('');
  }).join('');
}

function computePageSizeCSS(breakpoints) {
  var name = computeName(breakpoints);
  return breakpoints.map(function (breakpoint) {
    return "\n      @media(min-width: ".concat(breakpoint[0], "px) {\n        .").concat(name, " .parasol-container > * {\n          width: ").concat(100 / breakpoint[1], "%;\n          display: inline-block;\n        }\n      }\n    ");
  }).reverse().join('\n');
} // Given an array of breakpoints, selects the appropriate breakpoint for the
// current screen size. If the screen happens to not be available, the first
// option is selected.


function computePageSize(breakpoints) {
  // Make sure the window is available
  if (typeof window !== 'undefined') {
    // Split breakpoints into their individual parts
    var dims = splitBreakpoints(breakpoints); // Determine the possible window sizes

    var sKeys = dims.widths.filter(function (w) {
      return window.matchMedia("(min-width: ".concat(w, "px)")).matches;
    }); // Select the largest and get the associated page size

    return dims.sizes[dims.widths.length - sKeys.length];
  } // If the document is not available, then default to the largest page size


  return breakpoints.reduce(function (size, breakpoint) {
    return breakpoint[1] > size ? breakpoint[1] : size;
  }, 0);
} // Given a number of elements and a desired number of elements per page,
// computes how many elements should be on each page


function pages(elementsCount, pageSize) {
  return elementsCount / gcd(pageSize, elementsCount);
} // Takes a raw list of elements (ie. the child nodes of Parasol), a number of
// elements to display per page, and the page to display. A new list of elements
// is then computed such that the appropriate elements are shown, and enough
// elements are attached before and after the visible page so that there are
// enough elements to cover changing pages


function computeElementList(elements, page, pageSize) {
  // Determine the start location of the focus (in-view elements)
  var focusStart = (page - 1) * pageSize % elements.length;
  var focusEnd = focusStart + pageSize; // Compute the area of the elements that will be visible on the current page

  var focus = elements.slice(focusStart, focusStart + pageSize); // For element lengths that do not align with the pages size, additional
  // elements may be needed to pad out the focus area

  var focusPadding = Math.max(0, pageSize - focus.length); // If the focus needs to be extended, add additional elements

  if (focusPadding > 0) {
    focus = focus.concat(elements.slice(0, focusPadding)); // If the focus area wrapped, then adjust the ending point

    focusEnd = focusPadding;
  } // Compute the list that follows the focus


  var tail = elements.slice(focusEnd, focusEnd + pageSize); // If the tail is too short, pad from the start of the list

  if (tail.length < pageSize) {
    tail = tail.concat(elements.slice(0, pageSize - tail.length));
  } // Compute the list that precedes the focus


  var head = elements.slice(Math.max(0, focusStart - pageSize), focusStart); // If the head is too short, add elements from the end of the list

  if (head.length < pageSize) {
    head = elements.slice(-1 * (pageSize - head.length)).concat(head);
  } // Finally combine the lists to create the displayable element list


  return head.concat(focus).concat(tail);
}

var Parasol2 = function Parasol2(_ref) {
  var _ref$breakpoints = _ref.breakpoints,
      breakpoints = _ref$breakpoints === void 0 ? [[0, 3]] : _ref$breakpoints,
      _ref$children = _ref.children,
      children = _ref$children === void 0 ? [] : _ref$children,
      _ref$resizeDebounceDe = _ref.resizeDebounceDelay,
      _ref$sensitivity = _ref.sensitivity,
      sensitivity = _ref$sensitivity === void 0 ? 40 : _ref$sensitivity,
      onScroll = _ref.onScroll,
      onMouseEnter = _ref.onMouseEnter,
      onMouseLeave = _ref.onMouseLeave,
      onMouseMove = _ref.onMouseMove,
      onMouseOut = _ref.onMouseOut,
      onMouseOver = _ref.onMouseOver,
      _ref$previousLabel = _ref.previousLabel,
      previousLabel = _ref$previousLabel === void 0 ? 'Previous Items' : _ref$previousLabel,
      _ref$prevTabIndex = _ref.prevTabIndex,
      prevTabIndex = _ref$prevTabIndex === void 0 ? 0 : _ref$prevTabIndex,
      _ref$nextLabel = _ref.nextLabel,
      nextLabel = _ref$nextLabel === void 0 ? 'Next Items' : _ref$nextLabel,
      _ref$nextTabIndex = _ref.nextTabIndex,
      nextTabIndex = _ref$nextTabIndex === void 0 ? 0 : _ref$nextTabIndex,
      _ref$itemTabIndex = _ref.itemTabIndex,
      itemTabIndex = _ref$itemTabIndex === void 0 ? 0 : _ref$itemTabIndex;
  useShakeDisable();
  var firstElement = useRef(null);

  var _useReducer = useReducer(function (state, newState) {
    return _objectSpread2(_objectSpread2({}, state), newState);
  }, {
    animating: false,
    animationComplete: false,
    animationDirection: null,
    page: 1,
    pageSize: computePageSize(breakpoints),
    touchXStart: 0
  }),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      setState = _useReducer2[1];

  var animating = state.animating,
      animationComplete = state.animationComplete,
      animationDirection = state.animationDirection,
      page = state.page,
      pageSize = state.pageSize,
      touchXStart = state.touchXStart;
  var pageCount = pages(children.length, pageSize);
  var hasOverflow = children.length > pageSize;
  useEffect(function (_) {
    console.log('page size effect');

    function pageSizeHandler() {
      var newPageSize = computePageSize(breakpoints); // If the new page size is different than the existing size then update

      if (pageSize !== newPageSize) {
        console.log('Old page size', pageSize);
        console.log('New page size', newPageSize);
        setState({
          pageSize: newPageSize
        });
      }
    } // Once mounted, bind the window resize handler


    typeof window !== 'undefined' && typeof window.addEventListener === 'function' && window.addEventListener('resize', pageSizeHandler); // Run the resize handler a single time on mount

    pageSizeHandler();
    return function (_) {
      typeof window !== 'undefined' && typeof window.removeEventListener === 'function' && window.removeEventListener('resize', pageSizeHandler);
    };
  }, [pageSize, breakpoints]);
  useEffect(function (_) {
    if (animationComplete && firstElement && firstElement.current && typeof firstElement.current.focus === 'function') {
      firstElement.current.focus();
    }
  }, [animationComplete]);
  var moveLeft = useCallback(function () {
    onScroll && typeof onScroll === 'function' && onScroll();
    setState({
      animating: true,
      animationComplete: false,
      animationDirection: 'left'
    });
  }, [onScroll]);
  var moveRight = useCallback(function () {
    onScroll && typeof onScroll === 'function' && onScroll();
    setState({
      animating: true,
      animationComplete: false,
      animationDirection: 'right'
    });
  }, [onScroll]);
  var wheelHandler = useCallback(function (event) {
    if (!animating && hasOverflow) {
      event.deltaX < -sensitivity && moveLeft() || event.deltaX > sensitivity && moveRight();
    }
  }, [sensitivity, moveLeft, moveRight, animating, hasOverflow]);
  var paginationEndHandler = useCallback(function (page) {
    return function (event) {
      if (event.target === event.currentTarget) {
        setState({
          animating: false,
          animationComplete: true,
          animationDirection: null,
          page: page
        });
      }
    };
  }, []);
  var touchStartHandler = useCallback(function (event) {
    if (!animating && hasOverflow) {
      // If there are no touch events, fail out
      if (!event.touches || event.touches.length < 1) {
        return;
      }

      var startX = event.touches.item(0).clientX;
      setState({
        touchXStart: startX
      });
    }
  }, [animating, hasOverflow]);
  var touchMoveHandler = useCallback(function (event) {
    if (!animating && hasOverflow) {
      // If there are no touch events, fail out
      if (!event.touches || event.touches.length < 1) {
        return;
      } // If there is no starting x coordinate, fail out


      if (state.touchXStart === null) {
        return;
      } // Listen for any point in a touch drag that should trigger the action


      if (event.touches.item(0).clientX - state.touchXStart > sensitivity) {
        moveLeft();
      } else if (event.touches.item(0).clientX - state.touchXStart < -sensitivity) {
        moveRight();
      }
    }
  }, [animating, hasOverflow, touchXStart, sensitivity]);
  var name = useMemo(function (_) {
    return computeName(breakpoints);
  }, [breakpoints]);
  var containerCSS = useMemo(function (_) {
    return computePageSizeCSS(breakpoints);
  }, [breakpoints]);
  var containerClass = useMemo(function (_) {
    var containerClass = "parasol-container";

    if (hasOverflow) {
      containerClass += ' overflow';
    }

    if (animating && animationDirection) {
      containerClass += ' animating';
      containerClass += " animating-".concat(animationDirection);
    }

    return containerClass;
  }, [animating, animationDirection, hasOverflow]);
  var prevHandler = useCallback(function (_) {
    return !animating && moveLeft();
  }, [animating]);
  var nextHandler = useCallback(function (_) {
    return !animating && moveRight();
  }, [animating]); // If there are more elements than a page size, then pagination is needed.
  // To ensure there are enough elements for pagination, generate a list with
  // three full pages

  var elements = useMemo(function (_) {
    return hasOverflow ? computeElementList(children, page, pageSize) : children;
  }, [hasOverflow, children, page, pageSize]);
  var containerHandler = useCallback(function (e) {
    // If the bar is in an animating state, then handle adding the animation
    // styling, and post animation updates
    if (animating && animationDirection) {
      // Compute the next page that should be shown
      var newPage = animationDirection === 'right' ? page + 1 : page - 1; // Perform bounds checks to make sure the next page is valid. If it is
      // not then the new page value should wrap

      if (newPage > pageCount) {
        newPage = 1;
      } else if (newPage < 1) {
        newPage = pageCount;
      } // Create the transition end handler based on the page that is being
      // animating to


      return paginationEndHandler(newPage)(e);
    }
  }, [animating, animationDirection, pageCount]);
  return /*#__PURE__*/createElement(Fragment, null, /*#__PURE__*/createElement(CoreStyles$1, null), /*#__PURE__*/createElement("style", {
    dangerouslySetInnerHTML: {
      __html: containerCSS
    }
  }), /*#__PURE__*/createElement("div", {
    className: "parasol parasol-carousel ".concat(name),
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave,
    onMouseMove: onMouseMove,
    onMouseOut: onMouseOut,
    onMouseOver: onMouseOver
  }, /*#__PURE__*/createElement("button", {
    className: "parasol-cap parasol-cap-left ".concat(hasOverflow && 'parasol-control' || ''),
    onClick: prevHandler,
    tabIndex: prevTabIndex,
    "aria-label": previousLabel
  }), /*#__PURE__*/createElement("div", {
    className: "parasol-window"
  }, /*#__PURE__*/createElement("div", {
    className: containerClass,
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
      page: page,
      // DEPRECATED
      innerRef: viewPosition === 0 ? firstElement : undefined,
      getRefProp: function getRefProp(_) {
        return {
          ref: viewPosition === 0 ? firstElement : null
        };
      },
      getTabIndex: function getTabIndex(_) {
        return {
          tabIndex: viewPosition !== null ? itemTabIndex : -1
        };
      }
    };
    return /*#__PURE__*/cloneElement(el, elementProps);
  }))), /*#__PURE__*/createElement("button", {
    className: "parasol-cap parasol-cap-right ".concat(hasOverflow && 'parasol-control' || ''),
    onClick: nextHandler,
    tabIndex: nextTabIndex,
    "aria-label": nextLabel
  })));
};

export default Parasol;
export { Parasol2 };
