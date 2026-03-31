import React from "react";
import styles from "./Instructions.module.css";

function Instructions({ round: phase, isAI }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Phase {phase} Instructions</h2>

      <div className={styles.instructionCard}>
        {phase === 1 && (
          <>
            <h3 className={styles.subtitle}>Initial Ideation - 6 Minutes</h3>
            <p className={styles.text}>
              Your Task: Explore the patented technology and generate as many real-world product ideas as possible. Focus on coming up with a distinct and diverse set of ideas.
            </p>
            {isAI && (
              <p className={styles.text}>
                How to use the AI:
                • You have <span style={{ color: "red", fontWeight: "bold" }}>1 prompt</span> opportunity in this phase
                • In your prompt, ask the AI for up to <span style={{ color: "red", fontWeight: "bold" }}>3 application ideas</span>
                • Use the AI as a starting point, then keep building on your own

                ✅ Example prompt: "Give me 3 creative product ideas based on this patent xxx"
                <br />
                ❌ Not allowed: "Give me 10 ideas" / Submitting more than 1 prompt
              </p>
            )}
            <p className={styles.note}>
              Please enter your generated ideas into the list.
            </p>
          </>
        )}

        {phase === 2 && (
          <>
            <h3 className={styles.subtitle}>Idea Selection - 1 Minute</h3>
            <p className={styles.text}>
              Your Task: Review all the product ideas you generated in Phase 1 and select the one you believe has the highest real-world potential. Once confirmed, your selected idea will carry forward to Phase 3.
            </p>
          </>
        )}

        {phase === 3 && (
          <>
            <h3 className={styles.subtitle}>Refine Your Idea - 6 Minutes</h3>
            <p className={styles.text}>
              Your Task: Develop your selected idea into a clear and well-defined product concept. Describe what the product is, how it works, and how it uses the patented technology to create value.
            </p>
            {isAI && (
              <p className={styles.text}>
                How to use the AI:
                •	You have <strong>3 prompts</strong> in this phase
                •	Use the AI to help you <strong>develop and deepen</strong> your selected idea - not to generate new ones
                •	Your prompts must stay focused on your selected idea above

                ✅ You may ask the AI to:
                •	🔨 Elaborate — Define the key features, target users, or use scenarios
                "What are the key features of this product and who would use it?"
                •	✨ Refine — Improve the value proposition based on the technology's strengths
                "How does this product create value using the patented technology?"
                •	🌱 Clarify — Make specific aspects of your idea more concrete
                "How would this product work in practice?"

                ❌ Not allowed:
                "Give me a new idea" / Asking the AI to switch to a completely different direction
              </p>
            )}
            <div className={styles.options}>
              <div className={styles.option}>
                <h4>🔨 Elaborate:</h4>
                <p>Define the key features, target users, or use scenarios.</p>
                <p><i>"What are the key features of this product and who would use it?"</i></p>
              </div>
              <div className={styles.option}>
                <h4>✨ Refine:</h4>
                <p>Improve the value proposition based on the technology's strengths.</p>
                <p><i>"How does this product create value using the patented technology?"</i></p>
              </div>
              <div className={styles.option}>
                <h4>🌱 Clarify:</h4>
                <p>Make specific aspects of your idea more concrete.</p>
                <p><i>"How would this product work in practice?"</i></p>
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
