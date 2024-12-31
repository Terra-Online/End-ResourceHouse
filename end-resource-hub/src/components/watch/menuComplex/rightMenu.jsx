// rightMenu.jsx
import React from 'react';
import withLoftDiv from '../../../HOC/withLoftDiv';
import './menu.scss';

/**
 * Component for rendering Right Menu items.
 * Each item is a rectangle divided into two equal square divs.
 */
const RightMenuContent = () => {
    const menuItems = Array.from({ length: 5 }, (_, index) => (
      <div
        key={`right-item-${index + 1}`}
        className={`right-menu item-${index + 1}`}
        style={{ zIndex: 10 - index }}
      >
        <div className="sub-menu sub-menu-1">menuL-{5-index}</div>
        <div className="sub-menu sub-menu-2">menuR-{5-index}</div>
      </div>
    ));

    return <>{menuItems}</>;
  };

  const svgPath =
  'M0 50A50 50 0 10-17 156 50 50 0 10-1 49';
const RightMenu = withLoftDiv(RightMenuContent, {
    position: 'relative',
  overflow: 'visible',
  area: 'parent',
  path: svgPath,
  placement: 'tight',
  alignment: 'center',
  offset: 0,
  interval: 15.5,
  linearOffset: 225,
  offsetsSpecy: [
    { from: 1, to: 2, offset: 3.5 },
    { from: 2, to: 3, offset: 5 },
    { from: 3, to: 4, offset: 6.25 },
    { from: 4, to: 5, offset: 9.5 },
    ],
    biasOffset: [
        { index: 2, x: -7, y: 0 },
        { index: 4, x: 13, y: 0 },
    ],
});
const RightMenuComponent = () => {
  return (
    <div className="right-menu-container" data-type={'emit'}>
      <RightMenu />
    </div>
  );
};

export default RightMenuComponent;