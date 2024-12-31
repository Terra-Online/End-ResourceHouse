// watch.jsx
import React, { useRef } from 'react';
import './watch.scss';
import { gsap } from 'gsap';

import IDCard from './idcard/idcard';
import LeftMenu from './menuComplex/leftMenu';
import RightMenu from './menuComplex/rightMenu';

const Controller = () => {
  const layers = useRef([]);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const xOffset = (clientX - centerX) / rect.width;
    const yOffset = (clientY - centerY) / rect.height;
    const maxRotate = 25;

    layers.current.forEach((layer, index) => {
      if (layer) {
        const depth = index + 1;
        gsap.to(layer, {
          rotateX: yOffset * maxRotate * -1 * depth * 0.2,
          rotateY: xOffset * maxRotate * depth * 0.2,
          transformPerspective: 1000,
          transformStyle: 'preserve-3d',
          duration: 0.5,
          ease: 'power3.out',
        });
      }
    });
  };

  const handleMouseLeave = () => {
    layers.current.forEach((layer) => {
      if (layer) {
        gsap.to(layer, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'power4.out',
          onComplete: () => {
            gsap.set(layer, { clearProps: 'transform' });
          },
        });
      }
    });
  };

  return (
    <div className="watch" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className={`layer layer-${index + 1}`}
          ref={(el) => (layers.current[index] = el)}
        >
          {index === 0 ? (
            <>
              <LeftMenu />
              <RightMenu />
            </>
          ) : index === 1 ? (
            <IDCard username="管理员" id="061360258" avatar="../../assets/endministrator.png" />
          ) : (
            <div className="content">第 {index + 1} 层</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Controller;