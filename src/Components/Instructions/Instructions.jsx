import React from "react";
import styles from "./Instructions.module.css";

function Instructions({ round: phase, isAI }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Phase {phase} Instructions</h2>

      <div className={styles.instructionCard}>
        {phase === 1 && (
          <>
            <h3 className={styles.subtitle}>Initial Ideation</h3>
            <p className={styles.text}>
              In this phase, you are asked to explore the patented technology and generate as many distinct real-world applications as possible. Focus on generating a diverse set of ideas.
            </p>
            {isAI && (
              <p className={styles.text}>
                Feel free to ask the AI for inspiration, technical clarifications, or to brainstorm potential use cases.
              </p>
            )}
            <p className={styles.note}>
              Please enter your generated ideas into the list.
            </p>
          </>
        )}

        {phase === 2 && (
          <>
            <h3 className={styles.subtitle}>Selection Phase</h3>
            <p className={styles.text}>
              Review the ideas you generated. Select the one you believe has the highest potential as a real-world application.
            </p>
          </>
        )}

        {phase === 3 && (
          <>
            <h3 className={styles.subtitle}>Refinement</h3>
            <p className={styles.text}>
              Develop the selected idea into a clear and well-defined product solution. Describe what the product is, how it works, and how it uses the patented technology to create value.
            </p>
            {isAI && (
              <p className={styles.text}>
                You may use the AI assistant to help you with the details.
              </p>
            )}
            <div className={styles.options}>
              <div className={styles.option}>
                <h4>🔨 Elaborate:</h4>
                <p>Define the key features and target users.</p>
              </div>
              <div className={styles.option}>
                <h4>✨ Refine:</h4>
                <p>Improve the value proposition based on the technology's strengths.</p>
              </div>
            </div>
            <p className={styles.note}>
              Submit your final refined product concept when you are finished.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Instructions;
