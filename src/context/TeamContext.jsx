// /context/TeamContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const TeamContext = createContext();

const defaultTeam = [
  {
    id: 1,
    name: "Ricque Roberts",
    role: "Owner & Master Stylist",
    photo: "/assets/ricque.jpg",
    bio: "Passionate about empowering clients through beauty and style.",
  },
];

export function TeamProvider({ children }) {
  const [team, setTeam] = useState(null); // start as null to avoid SSR mismatch
  const [isClient, setIsClient] = useState(false);

  // Only run this on the client after hydration
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("teamMembers");
    if (saved) {
      setTeam(JSON.parse(saved));
    } else {
      setTeam(defaultTeam); // fallback default
    }
  }, []);

  // Only persist when running on client and team is not null
  useEffect(() => {
    if (isClient && team) {
      localStorage.setItem("teamMembers", JSON.stringify(team));
    }
  }, [team, isClient]);

  // Avoid rendering children until hydrated
  if (!isClient || team === null) return null;

  return (
    <TeamContext.Provider value={{ team, setTeam }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  return useContext(TeamContext);
}
