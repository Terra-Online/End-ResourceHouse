import React from 'react';
import './styles/global.scss';

import ItemsList from './components/Ztest/ItemsList';

import Controller from './components/watch/watch';
import SkillsUnit from './components/board/board';
import Defs from './components/defs/defs';

function App() {
  const chars = [
    'Angelina',
    'Avywenna',
    'Chen_Qianyu',
    'Ember',
    'Endministrator',
    'Fjall',
    'Perlica',
    'Wulfguard',
    'Xaihi'
  ]
  const skillParams = {
    Angelina: {
      params2: { y: -2, s: 0.9 },
      params3: { s: 0.8 },
    },
    Avywenna: {
      params2: { y: 2 },
      params3: { y: 6, s: 0.87 },
    },
    Chen_Qianyu: {
      params2: { x: -10, y: 1 },
    },
    Ember: {
      params2: { x: -10, y: 3 },
      params3: { s: 0.9},
    },
    Endministrator: {
      params2: { y: 2 },
      params3: { y: 7, s: 0.95 },
    },
    Fjall: {
      params2: { s: 0.87 },
      params3: { y: 3, s: 0.9 },
    },
    Perlica: {
      params2: { y: 2, s: 0.8 },
      params3: { y: 0, s: 0.87 },
    },
    Wulfguard: {
      params2: { s: 0.9 },
      params3: { s: 0.87 },
    },
    Xaihi: {
      params2: { x: -4, y: -10, s: 0.8},
      params3: { s: 0.95 },
    },
  };

  return (
    <div className="App">
      <Defs />
      <Controller />
      {/*
      {chars.map((character) => (
        <SkillsUnit
          key={character}
          charName={character}
          params2={skillParams[character]?.params2 || { x: 0, y: 0, s: 1 }}
          params3={skillParams[character]?.params3 || { x: 0, y: 0, s: 1 }}
        />
      ))}
      */}
    </div>

  );
}

export default App;