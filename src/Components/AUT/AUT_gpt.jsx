import React, { useState, useEffect } from "react";
import Chatbot from "./chatbot"; // fixed import
import Instructions from "../Instructions/Instructions";
import { useNavigate, useLocation } from "react-router-dom";
import AUT_ from "./AUT_";
import styles from "./organize.module.css";
import { useData } from "../../dataContext";
import { useSurvey } from "../../surveyIDContext";

function AUT_gpt() {
  const { surveyId, currentTaskIndex } = useSurvey();
  const [round, setRound] = useState(1);
  const [task, setTask] = useState(currentTaskIndex + 1);
  const [temperature, setTemperature] = useState();
  const [resetToggle, setResetToggle] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { data } = useData();
  const [objectArray] = useState(data);
  const [randomString, setRandomString] = useState("");
  const [level, setLevel] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.state?.task) {
      setTask(location.state.task);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [round]);

  useEffect(() => {
    console.log("DATA in AUT_gpt when task is and surveyId: ", task, objectArray);
    if (task) {
      fetchPatentForTask();
    }
  }, [task]);

  const fetchPatentForTask = async () => {
    try {
      if (!surveyId) {
        console.error("No surveyId available for patent fetching");
        return;
      }

      const apiUrlEnv = import.meta.env.VITE_NODE_API;
      if (!apiUrlEnv) {
        console.error("VITE_NODE_API is not defined in environment variables");
        return;
      }

      const baseApi = apiUrlEnv.endsWith('/') ? apiUrlEnv.slice(0, -1) : apiUrlEnv;
      const apiUrl = `${baseApi}/api/patent-for-task/${surveyId}/${task}`;
      console.log(`Fetching patent from: ${apiUrl}`);

      const response = await fetch(apiUrl);
      if (response.ok) {
        const patentData = await response.json();
        setRandomString(patentData.data);
        console.log(`Patent fetched for Task ${task}:`, patentData.data);

        if (patentData.level) {
          const levelFromBackend = patentData.level;
          setLevel(levelFromBackend);

          const tempMap = { low: 0, medium: 1, high: 2 };
          setTemperature(tempMap[levelFromBackend]);

          console.log(
            `Hallucination level for Task ${task}: ${levelFromBackend} → temperature ${tempMap[levelFromBackend]}`
          );
        } else {
          setLevel(null);
          setTemperature(undefined);
        }
      } else {
        console.error(`API failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to fetch patent:", error.message);
    }
  };

  return (
    <div className={styles.main}>
      <Instructions round={round} isAI={true} />
      <div className={styles.bottom_container}>
        <div className={styles.aut_component}>
          <AUT_
            round={round}
            onStateChange={setRound}
            task={task}
            randomString={randomString}
            temperature={temperature}
          />
        </div>
        {round !== 2 && (
          <div className={styles.chat}>
            <Chatbot
              task={task}
              round={round}
              resetToggle={resetToggle}
              onReset={() => setResetToggle(false)}
              level={level}
              patentText={randomString}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default AUT_gpt;
