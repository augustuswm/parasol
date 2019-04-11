// @flow

import * as React from 'react';

function CoreStyles() {
  let styles = `
    .parasol {
      position: relative;
      margin: 0 -6px;
      touch-action: pan-y;
    }

    .parasol.parasol-carousel {
      margin: 0;
      padding: 0 4%;
    }

    .parasol-cap {
      position: absolute;
      top: 0;
      right: 0;
      width: 4%;
      height: 100%;
      text-align: center;
      font-size: 4em;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding-top: 25px;
      text-transform: uppercase;
      cursor: pointer;
    }

    .parasol-cap-left {
      left: 0;
    }

    .parasol-cap-right {
      right: 0;
    }

    .parasol-window {
      overflow-x: visible;
    }

    .parasol-container {
      white-space: nowrap;
    }

    .parasol-carousel .parasol-container.overflow {
     transform: translate3d(-100%, 0, 0);
    }

    .parasol-carousel .parasol-container.animating {
      transition: transform 1s ease 0s;
    }

    .parasol-carousel .parasol-container.animating-left {
     transform: translate3d(0, 0, 0);
    }

    .parasol-carousel .parasol-container.animating-right {
     transform: translate3d(-200%, 0, 0);
    }
  `;
  
  return <style dangerouslySetInnerHTML={{__html: styles}} />;
}

export default React.memo(CoreStyles)