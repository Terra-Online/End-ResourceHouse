// leftMenu.jsx
import React from 'react';
import withLoftDiv from '../../../HOC/withLoftDiv';
import './menu.scss';
const LeftMenuContent = () => {
  const leftDivs = Array.from({ length: 4 }, (_, index) => (
    <div
      key={`item-${index + 1}`}
      className={`left-menu item-${index + 1}`}
      style={{ zIndex: 8 - index }}
    >
      Menu {index + 1}
    </div>
  ));

  return <>{leftDivs}</>;
};
const svgPath =
  'M623.53,73.61c15.32,38.2,23.19,78.98,23.19,120.14,0,69.27-22.29,136.73-63.56,192.36L64.56,1.4C23.29,57.03,1,124.49,1,193.75c0,41.16,7.87,81.94,23.19,120.14L623.53,73.61Z';
const Menu = withLoftDiv(LeftMenuContent, {

  overflow: 'visible',
  area: 'parent',
  path: svgPath,
  placement: 'tight',
  alignment: 'center',
  offset: 0,
  interval: 105,
  linearOffset: 980,
    offsetsSpecy: [
        { from: 1, to: 2, offset: 6 },
        { from: 2, to: 3, offset: 31 },
        { from: 3, to: 4, offset: 70 },
    ],
    biasOffset: [
        { index: 2, x: -3, y: 0 },
        { index: 4, x: 5, y: 0 },
    ],
});

const LeftMenu = () => {
  return (
    <>
      <div className="left-menu-container" data-type={'emit'}>
      <Menu />
      </div>
    </>
  );
};

export default LeftMenu;