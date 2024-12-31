import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import './board.scss';
import { gsap } from 'gsap';

import withMouseEvents from '../../HOC/withMouseEvents';

const SkillsUnit = ({
  charName,
  params2,
  params3,
  hoveredCell,
  clickedCell,
  longPressedCell,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onMouseDown,
  onMouseUp,
}) => {
  const coefValues = [0.5, 0.86, 0.92];
  const modiIndices = [0.1, 0, 0];

  // type-skillId mapping
  const types = ['inst', 'norm', 'ult'];
  const typeToSkillsMap = {
    inst: [`${charName}-Skill1`],
    norm: [`${charName}-Skill2_btm`, `${charName}-Skill2_top`],
    ult: [`${charName}-Skill3`],
  };

  const cellRefs = useRef([]);
  const baseRRefs = useRef([]);
  const heraldRefs = useRef([]);

  const setPosition = (e, index) => {
    const { clientX, clientY } = e;
    const cell = cellRefs.current[index];
    const rect = cell.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const xOffset = (clientX - centerX) / rect.width;
    const yOffset = (clientY - centerY) / rect.height;

    const maxRotate = 15;
    const maxTranslate = 10;

    const maxShadowOffset = 8;
    const shadowOffsetX = xOffset * maxShadowOffset * -1;
    const shadowOffsetY = yOffset * maxShadowOffset * -1;
    const blurRadius = 1.5;
    const shadowColor = 'rgba(0, 0, 0, 0.4)';

    const filterValue = `drop-shadow(${shadowOffsetX}px ${shadowOffsetY}px ${blurRadius}px ${shadowColor})`;

    const heraldElement = heraldRefs.current[index];
    if (heraldElement) {
      const useElements = heraldElement.querySelectorAll('use');
      useElements.forEach((useElement) => {
        useElement.style.filter = filterValue;
      });
    }
    /**
     * @param {NodeRef} e: element to animate
     * @param {Object} vars: animation variables
     */
    const animations = [
      {
        e: cellRefs.current[index],
        vars: {
          rotateX: yOffset * maxRotate * -1,
          rotateY: xOffset * maxRotate,
          transformPerspective: 1000,
          transformStyle: 'preserve-3d',
          duration: 0.5,
          ease: 'power3.out',
        },
      },
      {
        e: baseRRefs.current[index],
        vars: {
          rotateX: yOffset * maxRotate * -1 * 1.2,
          rotateY: xOffset * maxRotate * 1.2,
          duration: 0.5,
          ease: 'power3.out',
        },
      },
      {
        e: heraldRefs.current[index],
        vars: {
          x: xOffset * maxTranslate * -1,
          y: yOffset * maxTranslate * -1,
          z: 20,
          duration: 1,
          ease: 'power3.out',
        },
      },
    ];
    animations.forEach(({ e, vars }) => {
      if (e) {
        gsap.to(e, vars);
      }
    });
  };

  const rePosition = (index) => {
    const toRepos = [
      cellRefs.current[index],
      baseRRefs.current[index],
      heraldRefs.current[index],
    ];
    toRepos.forEach(e => {
      if (e) {
        gsap.killTweensOf(e);
        gsap.to(e, {
          rotateX: 0,rotateY: 0,
          x: 0,y: 0,z: 0,
          duration: 0.6,
          ease: "power4.out",
          onComplete: () => {
            gsap.set(e, { clearProps: 'transform' });
          },
        });
        if (e === heraldRefs.current[index]) {
          const useElements = e.querySelectorAll('use');
          useElements.forEach((useElement) => {
            useElement.style.filter = '';
          });
        }
      }
    });
  };

  return (
    <div className="boarder">
      {types.map((type, index) => (
        <div
          key={type}
          className={`cell ${type} ${
            hoveredCell === index ? 'hover' : ''
          } ${clickedCell === index ? 'selected' : ''} ${
            longPressedCell === index ? 'long-pressed' : ''
          }`}
          style={{
            '--coef': coefValues[index],
            '--modi': modiIndices[index],
          }}
          onMouseEnter={() => onMouseEnter(index)}
          onMouseLeave={() => {
            onMouseLeave();
            rePosition(index);
          }}
          onClick={() => onClick(index)}
          onMouseDown={() => onMouseDown(index)}
          onMouseUp={onMouseUp}
          onMouseMove={(e) => setPosition(e, index)}
          ref={(el) => (cellRefs.current[index] = el)}
        >
          <div
            className="baseR"
            ref={(el) => (baseRRefs.current[index] = el)}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div
              className="herald"
              ref={(el) => (heraldRefs.current[index] = el)}
            >
              <svg className="icon" aria-hidden="true"
                  style={{
                    '--x2': `${params2?.x || 0}%`,
                    '--y2': `${params2?.y || 0}%`,
                    '--s2': params2?.s || 1,
                    '--x3': `${params3?.x || 0}%`,
                    '--y3': `${params3?.y || 0}%`,
                    '--s3': params3?.s || 1,
                  }}>
                {typeToSkillsMap[type].map((skillId) => (
                  <use
                    key={skillId}
                    href={`#${skillId}`}
                    xlinkHref={`#${skillId}`}
                  />
                ))}
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

SkillsUnit.propTypes = {
  charName: PropTypes.string.isRequired,
  params2: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    s: PropTypes.number,
  }),
  params3: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    s: PropTypes.number,
  }),
  hoveredCell: PropTypes.number,
  clickedCell: PropTypes.number,
  longPressedCell: PropTypes.number,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  onMouseUp: PropTypes.func.isRequired,
};

export default withMouseEvents(SkillsUnit, {
  enableHover: true,
  enableClick: true,
});