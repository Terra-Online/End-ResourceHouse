import React from 'react';

const requireContext = require.context('../../assets/skills', true, /\.svg$/);

const svgModules = {};

requireContext.keys().forEach((key) => {
  const SvgModule = requireContext(key);
  const SvgComponent = SvgModule.default;

  // Deserialization
  const parts = key.replace('./', '').split('/');
  const [characterName, skillFileName] = parts.slice(-2);
  const skillName = skillFileName.replace('.svg', '');

  if (characterName && skillName) {
    if (!svgModules[characterName]) {
      svgModules[characterName] = {};
    }
    svgModules[characterName][skillName] = SvgComponent;
  }
});

//check: console.log('Final svgModules:', svgModules);

const Defs = () => (
  <svg className='defs'>
    <g id="skills">
      {Object.keys(svgModules).map((characterName) => (
        <g key={characterName} id={characterName}>
          {Object.keys(svgModules[characterName]).map((skillName) => {
            const SvgComponent = svgModules[characterName][skillName];
            if (!SvgComponent) {
              return null;
            }
            return (
              <symbol
                key={`${characterName}-${skillName}`}
                id={`${characterName}-${skillName}`}
              >
                <SvgComponent />
              </symbol>
            );
          })}
        </g>
      ))}
    </g>
  </svg>
);

export default Defs;