// AudioPlayerContext.js
import React, { createContext, useState } from 'react';

export const AudioPlayerContext = createContext();

export const AudioPlayerProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  // Add more state variables and methods as needed

  return (
    <AudioPlayerContext.Provider value={{ isPlaying, setIsPlaying }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};
