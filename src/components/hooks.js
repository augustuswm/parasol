// @flow

import { useEffect } from 'react';

// Suppresses left/right shaking of the browser when swiping in a browser
export function useShakeDisable() {
  function shakeHandler(event: WheelEvent) {
    Math.abs(event.deltaX) >= Math.abs(event.deltaY) && event.preventDefault();
  }

  useEffect(_ => {

    // Bind a handler to prevent screen shaking on mac. Chrome will start making
    // wheel event handlers passive by default. This defeats the purpose of trying
    // to prevent shaking from a horizontal trackpad swipe.
    if (document && document.body) {
      document.body.addEventListener('wheel', shakeHandler, { passive: false });

      return _ => {
        document && document.body && document.body.removeEventListener('wheel', shakeHandler, { passive: false });
      }
    }
  }, []);
}