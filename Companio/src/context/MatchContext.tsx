// src/context/MatchContext.tsx

import React, { createContext, useState, useContext, ReactNode } from "react";

interface Match {
  matchedProfileId: string;
  matchedProfileName: string;
  matchedProfilePhotoUrl: string;
}

interface MatchContextType {
  allMatches: Match[];
  newMatch: Match | null;
  addMatch: (match: Match) => void;
  clearNewMatch: () => void;
}

const MatchContext = createContext<MatchContextType>({
  allMatches: [],
  newMatch: null,
  addMatch: () => {},
  clearNewMatch: () => {},
});

interface MatchProviderProps {
  children: ReactNode;
}

export const MatchProvider: React.FC<MatchProviderProps> = ({ children }) => {
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [newMatch, setNewMatch] = useState<Match | null>(null);

  const addMatch = (match: Match) => {
    setNewMatch(match);
    setAllMatches((prevMatches) => [match, ...prevMatches]);
  };

  const clearNewMatch = () => {
    setNewMatch(null);
  };

  return (
    <MatchContext.Provider
      value={{ allMatches, newMatch, addMatch, clearNewMatch }}
    >
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () => useContext(MatchContext);
