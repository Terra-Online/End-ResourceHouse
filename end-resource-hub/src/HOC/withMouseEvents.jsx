// withMouseEvents.jsx
import React, { useState, useEffect, useRef } from 'react';

const withMouseEvents = (WrappedComponent, options = {}) => {
  return (props) => {
    const {
      enableHover = false,
      enableClick = false,
      enableLongPress = false,
      longPressTime = 1000,
    } = options;

    const [hoveredCell, setHoveredCell] = useState(null);
    const [clickedCell, setClickedCell] = useState(null);
    const [longPressedCell, setLongPressedCell] = useState(null);
    const componentRef = useRef(null);
    let timer = null;

    // Hover handlers
    const handleMouseEnter = (index) => {
      if (enableHover) {
        setHoveredCell(index);
      }
    };
    const handleMouseLeave = () => {
      if (enableHover) {
        setHoveredCell(null);
      }
    };

    // Click handlers
    const handleClick = (index) => {
      if (enableClick) {
        setClickedCell(index);
      }
    };

    const handleOutsideClick = (event) => {
      if (
        enableClick &&
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setClickedCell(null);
      }
    };

    // Long press handlers
    const handleMouseDown = (index) => {
      if (enableLongPress) {
        timer = setTimeout(() => {
          setLongPressedCell(index);
        }, longPressTime);
      }
    };

    const handleMouseUp = () => {
      if (enableLongPress) {
        clearTimeout(timer);
      }
    };

    // Effect for outside click
    useEffect(() => {
      if (enableClick) {
        document.addEventListener('click', handleOutsideClick);
      }
      return () => {
        if (enableClick) {
          document.removeEventListener('click', handleOutsideClick);
        }
      };
    }, [enableClick]);

    // Cleanup timer on unmount
    useEffect(() => {
      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    }, []);

    // Compose event handlers and states
    const eventHandlers = {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onClick: handleClick,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
    };

    const eventStates = {
      ...(enableHover && { hoveredCell }),
      ...(enableClick && { clickedCell }),
      ...(enableLongPress && { longPressedCell }),
    };

    return (
      <div ref={componentRef}>
        <WrappedComponent {...props} {...eventStates} {...eventHandlers} />
      </div>
    );
  };
};

export default withMouseEvents;