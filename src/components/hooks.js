// @flow

import { useEffect } from 'react';

export function useShakeDisable() {
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
