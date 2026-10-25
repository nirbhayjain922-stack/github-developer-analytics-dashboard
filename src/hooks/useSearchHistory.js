import { useCallback, useState } from "react";
import {
  addSearchHistoryUsername,
  clearSearchHistory,
  readSearchHistory,
} from "../utils/searchHistory";

export function useSearchHistory() {
  const [history, setHistory] = useState(() => readSearchHistory());

  const addUsername = useCallback((username) => {
    setHistory(addSearchHistoryUsername(username));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory(clearSearchHistory());
  }, []);

  return {
    history,
    addUsername,
    clearHistory,
  };
}
