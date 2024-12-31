// withLoftDiv.jsx
import React, { useRef, useEffect, useState } from 'react';

/**
 * Higher-Order Component to layout wrapped components along a specified SVG path.
 *
 * @param {React.ComponentType} WrappedComponent - The component to be wrapped and positioned.
 * @param {Object} options - Configuration options for layout.
 * @param {string} [options.overflow='hidden'] - Overflow property for the container.
 * @param {string|Element} [options.area='viewport'] - Defines the area for layout. Can be 'viewport', 'parent', or a specific DOM element.
 * @param {string} [options.path='M0,0 L100,0'] - SVG path definition string to layout elements along.
 * @param {string} [options.placement='uniform'] - Determines the placement strategy: 'uniform', 'endpoints', or 'tight'.
 * @param {string} [options.alignment='center'] - Alignment of elements relative to the path: 'inside', 'outside', or 'center'.
 * @param {number} [options.offset=0] - Base offset applied to elements based on alignment.
 * @param {number} [options.interval] - Interval between elements. Applicable for certain placement strategies.
 * @param {number} [options.linearOffset=0] - Linear offset applied to the path length for positioning elements.
 * @param {Array} [options.offsetsSpecy=[]] - Array of objects to apply custom offsets between specific pairs of elements.
 *        Each object should have:
 *          - from: Starting element index (1-based).
 *          - to: Target element index (1-based).
 *          - offset: Offset value in pixels.
 * @param {Array} [options.scaleSpecy=[]] - Array of objects to apply custom scaling to specific elements.
 *        Each object should have:
 *          - index: Element index (1-based).
 *          - scale: Scale factor (e.g., 1.2 for 120%).
 * @param {Array} [options.rotateSpecy=[]] - Array of objects to apply custom rotation to specific elements.
 *        Each object should have:
 *          - index: Element index (1-based).
 *          - rotate: Rotation angle in degrees.
 * @param {Array} [options.biasOffset=[]] - Array of objects to apply additional XY offsets to specific elements.
 *        Each object should have:
 *          - index: Element index (1-based).
 *          - x: Additional X offset in pixels.
 *          - y: Additional Y offset in pixels.
 *
 * @returns {React.ComponentType} - Enhanced component with curve layout applied.
 */
const withCurveLayout = (WrappedComponent, options = {}) => {
  const {
    position = 'absolute',
    overflow = 'hidden', // CSS overflow property for the container.
    area = 'viewport', // Layout area: 'viewport', 'parent', or a specific DOM element.
    path = 'M0,0 L100,0', // SVG path definition for element positioning.
    placement = 'uniform', // Placement strategy: 'uniform', 'endpoints', 'tight'.
    alignment = 'center', // Alignment relative to the path: 'inside', 'outside', 'center'.
    offset = 0, // Base offset based on alignment.
    interval, // Interval between elements for certain placements.
    linearOffset = 0, // Offset from the start of the path for element placement.
    offsetsSpecy = [], // Custom offsets between specific pairs of elements.
    scaleSpecy = [], // Custom scaling factors for specific elements.
    rotateSpecy = [], // Custom rotation angles for specific elements.
    biasOffset = [], // Additional XY offsets for specific elements.
  } = options;

  const HOC = (props) => {
    const containerRef = useRef(null);
    const [windowSize, setWindowSize] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    const lastValidNormal = useRef({ x: 0, y: -1 });
    const svgRef = useRef(null);

    useEffect(() => {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const elements = Array.from(container.children);
      if (elements.length === 0) return;
      const elementSizes = elements.map((el) => el.getBoundingClientRect());

      let areaWidth = windowSize.width;
      let areaHeight = windowSize.height;

      if (area === 'parent') {
        let parent = container.parentNode;
        while (
          parent &&
          (getComputedStyle(parent).display === 'contents' ||
            parent.getAttribute('data-type') === 'emit')
        ) {
          parent = parent.parentNode;
        }
        if (parent) {
          const parentRect = parent.getBoundingClientRect();
          areaWidth = parentRect.width;
          areaHeight = parentRect.height;
          console.log(parent, parentRect)
          container.style.width = `${areaWidth}px`;
          container.style.height = `${areaHeight}px`;
        } else {
          areaWidth = window.innerWidth;
          areaHeight = window.innerHeight;
          container.style.width = `${areaWidth}px`;
          container.style.height = `${areaHeight}px`;
        }
      } else if (area instanceof Element) {
        const areaRect = area.getBoundingClientRect();
        areaWidth = areaRect.width;
        areaHeight = areaRect.height;
        container.style.width = areaWidth + 'px';
        container.style.height = areaHeight + 'px';
      } else {
        container.style.width = '100vw';
        container.style.height = '100vh';
      }

      const svgNS = 'http://www.w3.org/2000/svg';
      let svg = svgRef.current;
      let pathEl;

      if (!svg) {
        svg = document.createElementNS(svgNS, 'svg');
        svg.classList.add('_withCurveLayout_svg');

        pathEl = document.createElementNS(svgNS, 'path');
        pathEl.setAttribute('d', path);
        svg.appendChild(pathEl);

        Object.assign(svg.style, {
          position: 'absolute',
          width: '0',
          height: '0',
          opacity: '0',
          pointerEvents: 'none',
        });

        document.body.appendChild(svg);

        svgRef.current = svg;
      } else {
        pathEl = svg.querySelector('path');
        if (pathEl) {
          pathEl.setAttribute('d', path);
        }
      }

      const pathBBox = pathEl.getBBox();
      const scale = Math.min(areaWidth / pathBBox.width, areaHeight / pathBBox.height) || 1;
      console.log(areaWidth, areaHeight, pathBBox, scale);
      const translateX = (areaWidth - pathBBox.width * scale) / 2 - pathBBox.x * scale;
      const translateY = (areaHeight - pathBBox.height * scale) / 2 - pathBBox.y * scale;
      pathEl.setAttribute('transform', `translate(${translateX}, ${translateY}) scale(${scale})`);

      const pathTransform = pathEl.getCTM();
      const pathLength = pathEl.getTotalLength();
      const itemCount = elements.length;
      let positions = [];

      let effectiveInterval = interval;
      if (placement === 'tight') {
        const maxSize = Math.max(...elementSizes.map((el) => Math.max(el.width, el.height)));
        effectiveInterval = interval - maxSize;
      }

      const adjustedPathLength = pathLength - linearOffset; // Adjusted path length based on linearOffset

      switch (placement) {
        case 'endpoints':
          positions = Array.from({ length: itemCount }, (_, i) =>
            linearOffset + (i / (itemCount - 1)) * adjustedPathLength
          );
          break;
        case 'tight':
          let accumulated = linearOffset;
          positions = elementSizes.map(({ width }) => {
            const pos = accumulated;
            accumulated += width + effectiveInterval;
            return pos > pathLength ? pathLength : pos;
          });
          break;
        case 'uniform':
        default:
          positions = Array.from({ length: itemCount }, (_, i) =>
            itemCount === 1
              ? linearOffset + adjustedPathLength / 2
              : linearOffset + (i / (itemCount - 1)) * adjustedPathLength
          );
      }

      // Apply custom offsets between specific pairs of elements
      if (offsetsSpecy.length > 0) {
        offsetsSpecy.forEach(({ from, to, offset: customOffset }) => {
          if (from < to && from >= 1 && to <= itemCount) {
            const indexFrom = from - 1;
            const indexTo = to - 1;
            if (indexFrom < positions.length && indexTo < positions.length) {
              positions[indexTo] += customOffset;
            }
          }
        });
      }

      const getNormal = (dist) => {
        try {
          const p1 = pathEl.getPointAtLength(Math.max(dist - 0.01, 0));
          const p2 = pathEl.getPointAtLength(Math.min(dist + 0.01, pathLength));
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const len = Math.hypot(dx, dy);
          if (len === 0) throw new Error();
          const normal = { x: -dy / len, y: dx / len };
          lastValidNormal.current = normal;
          return normal;
        } catch {
          return lastValidNormal.current;
        }
      };

      const posData = positions.map((d, idx) => {
        const point = pathEl.getPointAtLength(d).matrixTransform(pathTransform);
        const normal = getNormal(d);
        const { width, height } = elementSizes[idx];
        const alignOffset =
          alignment === 'inside'
            ? -Math.max(width, height) / 2 - offset
            : alignment === 'outside'
            ? Math.max(width, height) / 2 + offset
            : offset;
        return {
          x: point.x + normal.x * alignOffset - width / 2,
          y: point.y + normal.y * alignOffset - height / 2,
        };
      });

      requestAnimationFrame(() => {
        elements.forEach((el, idx) => {
          const { x, y } = posData[idx];

          // Apply custom scaling
          const scaleOption = scaleSpecy.find(option => option.index === (idx + 1));
          const scale = scaleOption ? scaleOption.scale : 1;

          // Apply custom rotation
          const rotateOption = rotateSpecy.find(option => option.index === (idx + 1));
          const rotate = rotateOption ? rotateOption.rotate : 0;

          // Apply additional XY offsets
          const xyOffsetOption = biasOffset.find(option => option.index === (idx + 1));
          const additionalX = xyOffsetOption ? xyOffsetOption.x : 0;
          const additionalY = xyOffsetOption ? xyOffsetOption.y : 0;

          Object.assign(el.style, {
            position: 'absolute',
            transform: `translate(${x + additionalX}px, ${y + additionalY}px) scale(${scale}) rotate(${rotate}deg)`,
          });
        });
      });

      return () => {
        if (svgRef.current) {
          svgRef.current.remove();
          svgRef.current = null;
        }
      };
    }, [
      area,
      path,
      placement,
      alignment,
      offset,
      interval,
      linearOffset,
      windowSize,
      offsetsSpecy,
      scaleSpecy,
      rotateSpecy,
      biasOffset,
    ]);

    return (
      <div ref={containerRef} style={{ position: position, overflow: overflow }}>
        <WrappedComponent {...props} />
      </div>
    );
  };

  return HOC;
};

export default withCurveLayout;