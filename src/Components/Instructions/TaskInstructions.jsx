import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TaskInstructions.module.css";
import { useSurvey } from "../../surveyIDContext";

function TaskInstructions() {
    const navigate = useNavigate();
    const { currentTaskIndex, taskSequence } = useSurvey();

    const currentTaskRoute = taskSequence[currentTaskIndex];
    const isAI = currentTaskRoute === "AUT_gpt";

    const handleStartTask = () => {
        navigate(`/${currentTaskRoute}`);
    };

    return (
        <div className={styles.instructionPage}>
            <div className={styles.card}>
                <h1 className={styles.title}>
                    Task {currentTaskIndex + 1}: {isAI ? "AI-Supported Ideation" : "Baseline Ideation"}
                </h1>

                <div className={styles.disclaimerBox}>
                    <strong>There are no right or wrong answers</strong> - we're simply interested in your
                    creativity and how you think. Please aim for novel, useful, and diverse ideas in each task.
                </div>

                <p className={styles.introText}>
                    In this task, you will read a brief description of a real patented technology.
                    Your goal is to <strong>think creatively about what products could be made</strong> using this technology.
                </p>

                <div className={styles.phaseContainer}>
                    <div className={styles.phaseCard}>
                        <div className={styles.phaseNumber}>1</div>
                        <div className={styles.phaseInfo}>
                            <h3>Phase 1: Initial Ideation <span className={styles.timeTag}>6 Minutes</span></h3>
                            <p className={styles.phaseDescription}>
                                <strong>Your Task:</strong> Explore the patented technology and generate as many real-world product ideas as possible. Focus on coming up with a distinct and diverse set of ideas.
                            </p>
                        </div>
                    </div>

                    <div className={styles.phaseCard}>
                        <div className={styles.phaseNumber}>2</div>
                        <div className={styles.phaseInfo}>
                            <h3>Phase 2: Idea Selection <span className={styles.timeTag}>1 Minute</span></h3>
                            <p className={styles.phaseDescription}>
                                <strong>Your Task:</strong> Review all the product ideas you generated in Phase 1 and select the one you believe has the highest real-world potential. Once confirmed, your selected idea will carry forward to Phase 3.
                            </p>
                        </div>
                    </div>

                    <div className={styles.phaseCard}>
                        <div className={styles.phaseNumber}>3</div>
                        <div className={styles.phaseInfo}>
                            <h3>Phase 3: Refine Your Idea <span className={styles.timeTag}>6 Minutes</span></h3>
                            <p className={styles.phaseDescription}>
                                <strong>Your Task:</strong> Develop your selected idea into a clear and well-defined product concept. Describe what the product is, how it works, and how it uses the patented technology to create value.
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.exampleSection}>
                    <div className={styles.exampleTitle}>💡 Example:</div>
                    <div className={styles.exampleContent}>
                        <p><strong>Patent:</strong> "Self-heating food container technology"</p>
                        <p><strong>Phase 1 - Product ideas you might generate:</strong></p>
                        <ul>
                            <li>Portable heated lunch box for office workers</li>
                            <li>Self-warming baby bottle for parents on-the-go</li>
                            <li>Heated pet food bowl for outdoor animals</li>
                            <li>Emergency hot meal kit for camping or disasters</li>
                        </ul>
                        <p><strong>Phase 2 - You select:</strong> "Portable heated lunch box"</p>
                        <p><strong>Phase 3 - You develop it with details:</strong> Key features, target users, unique benefits, how it solves the problem of cold lunches at work, etc.</p>
                    </div>
                </div>

                <div className={`${styles.noteBox} ${isAI ? styles.aiNote : styles.noAiNote}`}>
                    <span className={styles.noteIcon}>{isAI ? "🤖" : "⚠️"}</span>
                    <p className={styles.noteText}>
                        {isAI
                            ? "Important: For this task, you will have access to an AI assistant to help you throughout the process."
                            : "Important: For this task, no AI assistant is provided. Work independently to generate your ideas."}
                    </p>
                </div>

                <button onClick={handleStartTask} className={styles.nextButton}>
                    Start Task {currentTaskIndex + 1}
                </button>
            </div>
        </div>
    );
}

export default TaskInstructions;
