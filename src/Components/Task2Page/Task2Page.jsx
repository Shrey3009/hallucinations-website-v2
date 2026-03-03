import React, { useEffect } from "react";
import styles from "./Task2Page.module.css";
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../surveyIDContext";

function Task2Page() {
  const navigate = useNavigate();
  const { taskSequence } = useSurvey();

  const nextTask = taskSequence ? taskSequence[1] : "AUT_gpt";

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleStart = () => {
    window.scrollTo(0, 0);
    navigate(`/${nextTask}`);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.header}>
          {nextTask === "AUT_gpt" ? (
            <>
              <h1 className={styles.title}>Task 2: AI-Supported Creative Ideation</h1>
              <p className={styles.description}>
                In this task, you will explore how a patent might be applied in
                creative and practical ways. You will interact with an AI assistant
                to help inspire and develop your ideas.
              </p>
            </>
          ) : (
            <>
              <h1 className={styles.title}>Task 2: Baseline Ideation (No AI Support)</h1>
              <p className={styles.description}>
                In this task, you will read a brief description of a real-world
                technology and generate creative application ideas without AI assistance.
              </p>
            </>
          )}
        </div>

        <div className={styles.content}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Task Overview</h2>
            {nextTask === "AUT_gpt" ? (
              <ul className={styles.taskList}>
                <li>Phase 1: Generate application ideas with AI support</li>
                <li>Phase 2: Select your best idea</li>
                <li>Phase 3: Refine the selected idea into a complete product concept with AI support</li>
              </ul>
            ) : (
              <ul className={styles.taskList}>
                <li>Phase 1: Generate application ideas (No AI allowed)</li>
                <li>Phase 2: Select your best idea</li>
                <li>Phase 3: Refine the selected idea into a complete product concept</li>
              </ul>
            )}
            <p className={styles.note}>
              Please follow the instructions on the next page entirely.
            </p>
          </div>

          {/* <div className={styles.card}>
            <h2 className={styles.cardTitle}>Important Notes</h2>
            <ul className={styles.notesList}>
              <li>
                In Round 1, you can only request up to 3 application ideas for
                each patent from the AI.
              </li>
              <li>
                In Round 2, your interaction must be based only on the AI's
                previous outputs. No fresh prompts about unrelated ideas are
                allowed.
              </li>
              <li>
                In Round 3, you should focus on finalizing your best three
                ideas, integrating your thoughts and any useful insights from
                the AI.
              </li>
              <li>
                You are not evaluated on writing skills. Focus on creativity,
                usefulness, and novelty.
              </li>
            </ul>
          </div> */}
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.startButton} onClick={handleStart}>
            Start Task 2
          </button>
        </div>
      </div>
    </div>
  );
}

export default Task2Page;
