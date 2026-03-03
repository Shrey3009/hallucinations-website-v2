import React, { useEffect } from "react";
import styles from "./ThankYou.module.css";

function ThankYou() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
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
