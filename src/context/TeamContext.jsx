// src/context/TeamContext.jsx
import React, { createContext, useContext, useState } from 'react';

const TeamContext = createContext();

export function TeamProvider({ children }) {
  const [team, setTeam] = useState([
    { id: 1, name: 'Stylist A' },
    { id: 2, name: 'Stylist B' },
    { id: 3, name: 'Stylist C' },
  ]);

  return (
    <TeamContext.Provider value={{ team, setTeam }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  return useContext(TeamContext);
}
