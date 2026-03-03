import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./WelcomePage.module.css";
import { useSurvey } from "../../surveyIDContext";

function WelcomePage() {
  const navigate = useNavigate();
  const { taskSequence } = useSurvey();

  const nextTask = taskSequence ? taskSequence[0] : "AUT";

  const navigateToTask = async () => {
    // Navigate to the Task Instructions page
    console.log("Navigating to Task Instructions");
    navigate(`/TaskInstructions`);
  };

  return (
    <div className={styles.instructionPage}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          Welcome to the Creative Innovation Study
        </h1>
        <p className={styles.text}>
          Thank you for participating in our study on how people generate creative
          product ideas. In this experiment, you'll be asked to come up with
          innovative product concepts based on real-world technologies from actual patents.
        </p>
        <p className={styles.text}>Click Next to see the task instructions!</p>
        <button onClick={navigateToTask} className={styles.nextButton}>
          Next
        </button>
      </div>
    </div>
  );
}

export default WelcomePage;
