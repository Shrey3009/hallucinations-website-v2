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
        <h1 className={styles.title}>Welcome to the Creative Innovation Study</h1>

        <p className={styles.text}>
          Thank you for participating in our study on how people generate creative
          product ideas. In this experiment, you'll be asked to come up with
          innovative product concepts based on real-world technologies from actual patents.
        </p>

        <h2 className={styles.sectionTitle}>Important Instructions for This Study</h2>

        <p className={styles.text}>
          During this study, please complete all tasks using <span className={styles.boldRedText}>ONLY</span> the materials and AI tools provided within the study environment. To ensure the validity of the research results, you must <span className={styles.boldRedText}>NOT</span> use any outside assistance while participating, including but not limited to:
        </p>

        <ul className={styles.list}>
          <li>Your own ChatGPT or any other AI tools</li>
          <li>Search engines or websites</li>
          <li>Notes, external documents, or other software</li>
          <li>Help from another person</li>
        </ul>

        <p className={`${styles.text} ${styles.boldRedText}`} style={{ textAlign: "center" }}>
          ⚠️ Your course credit is contingent upon carefully following all study instructions. If the use of any outside tools or resources is detected during the study, your participation will be considered invalid and you will not receive course credit.
        </p>

        <p className={styles.text}>
          Please remain focused on the study window and complete the tasks independently from start to finish.
        </p>

        <div className={styles.leftAlign}>
          <p className={styles.text} style={{ fontWeight: "700", marginBottom: "10px" }}>By continuing, you confirm that:</p>
          <ul className={styles.list} style={{ margin: "0" }}>
            <li>You will use only the tools and information provided in this study.</li>
            <li>You will not consult any outside AI tools, websites, or other resources.</li>
            <li>You understand that failure to follow these instructions may affect credit.</li>
          </ul>
        </div>

        <button onClick={navigateToTask} className={styles.nextButton}>
          I Confirm
        </button>
      </div>
    </div>
  );
}

export default WelcomePage;
