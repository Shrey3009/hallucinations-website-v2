import React, { useEffect } from "react";
import styles from "./ThankYou.module.css";

function ThankYou() {
  useEffect(() => {
    const surveyCode = sessionStorage.getItem("survey_code");

    if (surveyCode) {
      const sonaCompletionURL =
        "https://gmubus.sona-systems.com/webstudy_credit.aspx?experiment_id=139&credit_token=d23500664b804674947a1736420a7e3b&survey_code=" +
        encodeURIComponent(surveyCode);

      window.location.href = sonaCompletionURL;
    } else {
      // For NON-SONA participants
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className={styles.instructionPage}>
      <div className={styles.card}>
        <div className={styles.checkmarkContainer}>
          <div className={styles.checkmark}>✓</div>
        </div>
        <h1 className={styles.title}>Thank You!</h1>
        <p className={styles.message}>
          Your responses have been successfully submitted. We greatly
          appreciate your participation in this research study.
        </p>
      </div>
    </div>
  );
}

export default ThankYou;
