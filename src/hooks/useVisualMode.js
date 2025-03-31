import { useState } from 'react';

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);

  const mode = history[history.length - 1];

  const transition = (newMode, replace = false) => {
    setHistory(prev => {
      if (replace) {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = newMode;
        return newHistory;
      }
      return [...prev, newMode];
    });
  };

  const back = () => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, prev.length - 1));
    }
  };

  return { mode, transition, back };
}