// withHotkeys.jsx
import React, { useState, useEffect } from 'react';

const withHotkeys = (WrappedComponent) => {
  return (props) => {
    const [hotkeyState, setHotkeyState] = useState({});
    /**
     * @typedef {Object} KeyMap
     * @property {function} [key] - Discrete Key
     * @property {function} [comboKey] - Combined keys
     */

    /**
     * @param {KeyboardEvent} event
     * keyMap - Object containing key and combo key handlers
     * @type {KeyMap}
     */
    const keyMap = {
        ' ': () => setHotkeyState((prev) => ({ ...prev, isSpacePressed: !prev.isSpacePressed })),
        'h': () => setHotkeyState((prev) => ({ ...prev, isHPressed: !prev.isHPressed })),
        'Control+b': () => setHotkeyState((prev) => ({ ...prev, isCtrlBPressed: !prev.isCtrlBPressed })),
        // add more key handlers
        /**
         * @example 'key/Group': () => {setHotkeyState((prev) => ({ ...prev, 'iskey/GroupPressed': !prev.iskey/GroupPressed }))}
         */
      };
      /**
       * @todo :Naturalization alternate key bindings
       */
      const handleKeyDown = (event) => {
        const key = event.key;
        const comboKey = `${event.ctrlKey ? 'Control+' : ''}${event.altKey ? 'Alt+' : ''}${event.shiftKey ? 'Shift+' : ''}${key}`;
        if (keyMap[comboKey]) {
          keyMap[comboKey]();
        } else if (keyMap[key]) {
          keyMap[key]();
        }
      };
      useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, []);
      return (
        <WrappedComponent
          {...props}
          hotkeyState={hotkeyState}
        />
      );
    };
  };


export default withHotkeys;