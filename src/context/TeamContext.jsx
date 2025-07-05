// /context/TeamContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const TeamContext = createContext();

export function TeamProvider({ children }) {
  const [team, setTeam] = useState([]);

  // Load team from localStorage on mount
  useEffect(() => {
    const savedTeam = localStorage.getItem('teamMembers');
    if (savedTeam) {
      setTeam(JSON.parse(savedTeam));
    }
  }, []);

  // Save team to localStorage whenever it changes
  useEffect(() => {
    if (team.length > 0) {
      localStorage.setItem('teamMembers', JSON.stringify(team));
    }
  }, [team]);

  return (
    <TeamContext.Provider value={{ team, setTeam }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  return useContext(TeamContext);
}
