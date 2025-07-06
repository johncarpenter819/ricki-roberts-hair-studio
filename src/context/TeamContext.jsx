import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

const TeamContext = createContext();

export function TeamProvider({ children }) {
  const [team, setTeamState] = useState([]);
  const [loading, setLoading] = useState(true);
  const teamDocRef = doc(db, "business", "team");

  useEffect(() => {
    const unsubscribe = onSnapshot(teamDocRef, (snapshot) => {
      if (snapshot.exists()) {
        setTeamState(snapshot.data().members || []);
      } else {
        setTeamState([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setTeam = async (updatedTeam) => {
    setTeamState(updatedTeam);
    await setDoc(teamDocRef, { members: updatedTeam });
  };

  return (
    <TeamContext.Provider value={{ team, setTeam, loading }}>
      {!loading && children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  return useContext(TeamContext);
}
