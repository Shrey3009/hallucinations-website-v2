import React, { createContext, useContext, useState, useEffect } from "react";

// Create a Context
const SurveyContext = createContext(null);

export const SurveyProvider = ({ children }) => {
  // PreSurvey ID (needed for tasks + final PostSurvey)
  const [surveyId, setSurveyId] = useState(() => {
    return localStorage.getItem("surveyId") || null;
  });

  const [taskSequence, setTaskSequence] = useState(() => {
    const saved = localStorage.getItem("taskSequence");
    if (saved) return JSON.parse(saved);
    // Randomize tasks
    const tasks = ["AUT", "AUT_gpt"];
    return Math.random() < 0.5 ? tasks : [tasks[1], tasks[0]];
  });

  const [currentTaskIndex, setCurrentTaskIndex] = useState(() => {
    return parseInt(localStorage.getItem("currentTaskIndex") || "0", 10);
  });

  useEffect(() => {
    if (surveyId) localStorage.setItem("surveyId", surveyId);
    localStorage.setItem("taskSequence", JSON.stringify(taskSequence));
    localStorage.setItem("currentTaskIndex", currentTaskIndex.toString());
  }, [surveyId, taskSequence, currentTaskIndex]);

  return (
    <SurveyContext.Provider value={{ surveyId, setSurveyId, taskSequence, currentTaskIndex, setCurrentTaskIndex }}>
      {children}
    </SurveyContext.Provider>
  );
};

// Custom hook to use surveyId
export const useSurvey = () => useContext(SurveyContext);
