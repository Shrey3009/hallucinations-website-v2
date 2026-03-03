import React, { useState, useEffect } from "react";
import styles from "./TaskPostSurvey.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useSurvey } from "../../surveyIDContext";

function TaskPostSurvey() {
    const [formData, setFormData] = useState({
        accuracy: "",
        helpfulness: "",
        confidence: "",
        difficulty: "",
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const { surveyId, currentTaskIndex, taskSequence, setCurrentTaskIndex } = useSurvey();

    const currentTaskNum = currentTaskIndex + 1;
    const taskType = taskSequence ? taskSequence[currentTaskIndex] : null;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let payload = {
                preSurveyId: surveyId,
                taskNumber: currentTaskNum,
                taskType: taskType,
            };

            if (taskType === "AUT_gpt") {
                if (!formData.accuracy || !formData.helpfulness) {
                    setErrors({
                        accuracy: !formData.accuracy ? "Required" : null,
                        helpfulness: !formData.helpfulness ? "Required" : null
                    });
                    return;
                }
                payload.accuracy = formData.accuracy;
                payload.helpfulness = formData.helpfulness;
            } else {
                if (!formData.confidence || !formData.difficulty) {
                    setErrors({
                        confidence: !formData.confidence ? "Required" : null,
                        difficulty: !formData.difficulty ? "Required" : null
                    });
                    return;
                }
                payload.confidence = formData.confidence;
                payload.difficulty = formData.difficulty;
            }

            const response = await fetch(
                `${import.meta.env.VITE_NODE_API}/api/TaskPostSurvey`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to submit survey");
            }

            // Logic to move to next screen
            if (currentTaskIndex === 0) {
                navigate("/AttentionTest");
            } else {
                navigate("/PostSurvey");
            }
        } catch (error) {
            console.error("Error submitting task post-survey:", error);
            alert("Failed to submit survey. Please try again.");
        }
    };

    const isAITask = taskType === "AUT_gpt";
    const isBaselineTask = taskType === "AUT";

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Task {currentTaskNum} Feedback</h1>
            <p className={styles.subtitle}>
                {isAITask
                    ? `Please help us understand your experience with the AI assistant in Task ${currentTaskNum}.`
                    : `Please help us understand your experience with Task ${currentTaskNum}.`}
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
                {isAITask && (
                    <>
                        <div className={styles.questionGroup}>
                            <h2 className={styles.questionTitle}>
                                How accurate or reasonable did you find the AI's suggestions?
                            </h2>
                            <div className={styles.radioGroup}>
                                {[
                                    { value: "mostly-incorrect", label: "The suggestions were mostly incorrect or irrelevant" },
                                    { value: "some-made-sense", label: "Some suggestions made sense, but others seemed off" },
                                    { value: "generally-reasonable", label: "The suggestions were generally reasonable and plausible" },
                                    { value: "mostly-clear-accurate", label: "Most suggestions were clear and accurate" },
                                    { value: "highly-logical", label: "All suggestions were highly logical and well-grounded" },
                                ].map((opt) => (
                                    <label key={opt.value} className={styles.radioOption}>
                                        <input
                                            type="radio"
                                            name="accuracy"
                                            value={opt.value}
                                            checked={formData.accuracy === opt.value}
                                            onChange={handleChange}
                                            className={styles.radioInput}
                                        />
                                        <span className={styles.radioLabel}>{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.accuracy && <span className={styles.errorMessage}>{errors.accuracy}</span>}
                        </div>

                        <div className={styles.questionGroup}>
                            <h2 className={styles.questionTitle}>
                                How helpful were the AI's suggestions in supporting your creative thinking?
                            </h2>
                            <div className={styles.radioGroup}>
                                {[
                                    { value: "not-helpful", label: "Not helpful at all" },
                                    { value: "slightly-helpful", label: "Slightly helpful" },
                                    { value: "moderately-helpful", label: "Moderately helpful" },
                                    { value: "very-helpful", label: "Very helpful" },
                                    { value: "extremely-helpful", label: "Extremely helpful" },
                                ].map((opt) => (
                                    <label key={opt.value} className={styles.radioOption}>
                                        <input
                                            type="radio"
                                            name="helpfulness"
                                            value={opt.value}
                                            checked={formData.helpfulness === opt.value}
                                            onChange={handleChange}
                                            className={styles.radioInput}
                                        />
                                        <span className={styles.radioLabel}>{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.helpfulness && <span className={styles.errorMessage}>{errors.helpfulness}</span>}
                        </div>
                    </>
                )}

                {isBaselineTask && (
                    <>
                        <div className={styles.questionGroup}>
                            <h2 className={styles.questionTitle}>
                                How confident are you in the quality of your application ideas?
                            </h2>
                            <div className={styles.radioGroup}>
                                {["not-confident", "slightly-confident", "moderately-confident", "very-confident", "extremely-confident"].map((val) => (
                                    <label key={val} className={styles.radioOption}>
                                        <input
                                            type="radio"
                                            name="confidence"
                                            value={val}
                                            checked={formData.confidence === val}
                                            onChange={handleChange}
                                            className={styles.radioInput}
                                        />
                                        <span className={styles.radioLabel}>{val}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.confidence && <span className={styles.errorMessage}>{errors.confidence}</span>}
                        </div>

                        <div className={styles.questionGroup}>
                            <h2 className={styles.questionTitle}>
                                How difficult did you find this task?
                            </h2>
                            <div className={styles.radioGroup}>
                                {["very-easy", "somewhat-easy", "moderate", "somewhat-difficult", "very-difficult"].map((val) => (
                                    <label key={val} className={styles.radioOption}>
                                        <input
                                            type="radio"
                                            name="difficulty"
                                            value={val}
                                            checked={formData.difficulty === val}
                                            onChange={handleChange}
                                            className={styles.radioInput}
                                        />
                                        <span className={styles.radioLabel}>{val}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.difficulty && <span className={styles.errorMessage}>{errors.difficulty}</span>}
                        </div>
                    </>
                )}

                <button type="submit" className={styles.submitButton}>
                    Continue
                </button>
            </form>
        </div>
    );
}

export default TaskPostSurvey;
