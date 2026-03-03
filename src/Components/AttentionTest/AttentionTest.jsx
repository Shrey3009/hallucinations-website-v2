import React, { useState, useEffect } from "react";
import styles from "./AttentionTest.module.css";
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../surveyIDContext";

function AttentionTest() {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState("");
    const [showError, setShowError] = useState(false);
    const { setCurrentTaskIndex } = useSurvey();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleOptionChange = (option) => {
        setSelectedOption(option);
        setShowError(false);
    };

    const handleContinue = () => {
        if (selectedOption === "option2") {
            setCurrentTaskIndex(1);
            navigate("/Task2Page");
        } else {
            setShowError(true);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.congratulations}>🎉 Step Complete!</div>
                <h1 className={styles.title}>
                    You've completed the task and provided some great creative ideas!
                </h1>

                <p className={styles.instruction}>
                    To verify you are paying attention, please select <strong>Option 2</strong> below to continue to the next part of the study.
                </p>

                <div className={styles.optionsContainer}>
                    <h2 className={styles.optionsTitle}>Choose one option:</h2>

                    {[1, 2, 3].map((num) => (
                        <div key={num} className={styles.optionGroup}>
                            <label className={styles.optionLabel}>
                                <input
                                    type="radio"
                                    name="attention"
                                    value={`option${num}`}
                                    checked={selectedOption === `option${num}`}
                                    onChange={() => handleOptionChange(`option${num}`)}
                                    className={styles.radioInput}
                                />
                                <span className={styles.optionText}>Option {num}</span>
                            </label>
                        </div>
                    ))}
                </div>

                {showError && (
                    <div className={styles.errorMessage}>
                        Please select Option 2 to continue to the next task.
                    </div>
                )}

                <div className={styles.buttonContainer}>
                    <button
                        onClick={handleContinue}
                        className={styles.continueButton}
                        disabled={!selectedOption}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AttentionTest;
