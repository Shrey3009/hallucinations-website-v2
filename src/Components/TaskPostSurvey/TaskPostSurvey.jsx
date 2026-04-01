import React, { useState, useEffect } from "react";
import styles from "./TaskPostSurvey.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useSurvey } from "../../surveyIDContext";

function TaskPostSurvey() {
    const [formData, setFormData] = useState({
        familiarity: "",
        difficulty: "",
        aiPhase1Expansion: "",
        aiPhase3Refinement: "",
        aiPhaseHelpfulness: "",
        aiSuggestionsGroundedness: "",
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

    const isAITask = taskType === "AUT_gpt";

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let payload = {
                preSurveyId: surveyId,
                taskNumber: currentTaskNum,
                taskType: isAITask ? "AI" : "No-AI",
                familiarity: formData.familiarity,
                difficulty: formData.difficulty,
            };

            let currentErrors = {};

            if (!formData.familiarity) currentErrors.familiarity = "Required";
            if (!formData.difficulty) currentErrors.difficulty = "Required";

            if (isAITask) {
                if (!formData.aiPhase1Expansion) currentErrors.aiPhase1Expansion = "Required";
                if (!formData.aiPhase3Refinement) currentErrors.aiPhase3Refinement = "Required";
                if (!formData.aiPhaseHelpfulness) currentErrors.aiPhaseHelpfulness = "Required";
                if (!formData.aiSuggestionsGroundedness) currentErrors.aiSuggestionsGroundedness = "Required";

                payload.aiPhase1Expansion = formData.aiPhase1Expansion;
                payload.aiPhase3Refinement = formData.aiPhase3Refinement;
                payload.aiPhaseHelpfulness = formData.aiPhaseHelpfulness;
                payload.aiSuggestionsGroundedness = formData.aiSuggestionsGroundedness;
            }

            if (Object.keys(currentErrors).length > 0) {
                setErrors(currentErrors);
                return;
            }

            const apiUrlEnv = import.meta.env.VITE_NODE_API || "";
            const baseApi = apiUrlEnv.endsWith('/') ? apiUrlEnv.slice(0, -1) : apiUrlEnv;

            const response = await fetch(
                `${baseApi}/api/TaskPostSurvey`,
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
                setCurrentTaskIndex(1);
                navigate("/TaskInstructions");
            } else {
                navigate("/PostSurvey");
            }
        } catch (error) {
            console.error("Error submitting task post-survey:", error);
            alert("Failed to submit survey. Please try again.");
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Task {currentTaskNum} Feedback</h1>
            <p className={styles.subtitle}>
                {isAITask
                    ? `Please help us understand your experience with the AI assistant in Task ${currentTaskNum}.`
                    : `Please help us understand your experience with Task ${currentTaskNum}.`}
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
                
                {/* Common Questions */}
                <div className={styles.questionGroup}>
                    <h2 className={styles.questionTitle}>
                        1. How familiar are you with the technology described in this patent?
                    </h2>
                    <div className={styles.radioGroup}>
                        {[
                            { value: "never", label: "I have never encountered this type of technology before" },
                            { value: "heard", label: "I have heard of it but know very little about it" },
                            { value: "basic", label: "I have some basic knowledge of this technology" },
                            { value: "familiar", label: "I am fairly familiar with this technology" },
                            { value: "extensive", label: "I have extensive knowledge or experience with this technology" },
                        ].map((opt) => (
                            <label key={opt.value} className={styles.radioOption}>
                                <input
                                    type="radio"
                                    name="familiarity"
                                    value={opt.value}
                                    checked={formData.familiarity === opt.value}
                                    onChange={handleChange}
                                    className={styles.radioInput}
                                />
                                <span className={styles.radioLabel}>{opt.label}</span>
                            </label>
                        ))}
                    </div>
                    {errors.familiarity && <span className={styles.errorMessage}>{errors.familiarity}</span>}
                </div>

                <div className={styles.questionGroup}>
                    <h2 className={styles.questionTitle}>
                        2. How difficult was the patent description to understand?
                    </h2>
                    <div className={styles.radioGroup}>
                        {[
                            { value: "very-easy", label: "Very easy - I understood it immediately without any difficulty" },
                            { value: "mostly-easy", label: "Mostly easy - I understood most of it with minor confusion" },
                            { value: "moderate", label: "Moderate - I understood it after some effort" },
                            { value: "difficult", label: "Difficult - I struggled to understand key parts" },
                            { value: "very-difficult", label: "Very difficult - I found it hard to understand most of it" },
                        ].map((opt) => (
                            <label key={opt.value} className={styles.radioOption}>
                                <input
                                    type="radio"
                                    name="difficulty"
                                    value={opt.value}
                                    checked={formData.difficulty === opt.value}
                                    onChange={handleChange}
                                    className={styles.radioInput}
                                />
                                <span className={styles.radioLabel}>{opt.label}</span>
                            </label>
                        ))}
                    </div>
                    {errors.difficulty && <span className={styles.errorMessage}>{errors.difficulty}</span>}
                </div>

                {/* AI Questions */}
                {isAITask && (
                    <>
                        <div className={styles.questionGroup}>
                            <h2 className={styles.questionTitle}>
                                3. In Phase 1 (Idea Generation), how much did the AI’s suggestions expand your thinking and open up new idea directions?
                            </h2>
                            <div className={styles.radioGroup}>
                                {[
                                    { value: "not-at-all", label: "Not at all - the AI added nothing beyond what I had already considered" },
                                    { value: "slightly", label: "Slightly - one or two suggestions pointed me toward a small new direction" },
                                    { value: "moderately", label: "Moderately - the AI helped me consider a broader set of possibilities than I would have on my own" },
                                    { value: "quite-a-lot", label: "Quite a lot - the AI significantly widened my thinking and introduced directions I had not considered" },
                                    { value: "great-deal", label: "A great deal - the AI opened up entirely new categories of ideas that strongly shaped my generation process" },
                                ].map((opt) => (
                                    <label key={opt.value} className={styles.radioOption}>
                                        <input
                                            type="radio"
                                            name="aiPhase1Expansion"
                                            value={opt.value}
                                            checked={formData.aiPhase1Expansion === opt.value}
                                            onChange={handleChange}
                                            className={styles.radioInput}
                                        />
                                        <span className={styles.radioLabel}>{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.aiPhase1Expansion && <span className={styles.errorMessage}>{errors.aiPhase1Expansion}</span>}
                        </div>

                        <div className={styles.questionGroup}>
                            <h2 className={styles.questionTitle}>
                                4. In Phase 3 (Idea Refinement), how much did the AI’s suggestions help you develop your selected idea into a more concrete and well-defined concept?
                            </h2>
                            <div className={styles.radioGroup}>
                                {[
                                    { value: "not-at-all", label: "Not at all - my refinement came entirely from my own thinking; the AI added nothing useful" },
                                    { value: "slightly", label: "Slightly - the AI provided minor input but most of the development was my own" },
                                    { value: "moderately", label: "Moderately - the AI and my own thinking contributed equally to refining the idea" },
                                    { value: "quite-a-lot", label: "Quite a lot - the AI substantially helped me add depth, clarity, or feasibility to my idea" },
                                    { value: "great-deal", label: "A great deal - the AI was central to developing my idea into a well-defined concept" },
                                ].map((opt) => (
                                    <label key={opt.value} className={styles.radioOption}>
                                        <input
                                            type="radio"
                                            name="aiPhase3Refinement"
                                            value={opt.value}
                                            checked={formData.aiPhase3Refinement === opt.value}
                                            onChange={handleChange}
                                            className={styles.radioInput}
                                        />
                                        <span className={styles.radioLabel}>{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.aiPhase3Refinement && <span className={styles.errorMessage}>{errors.aiPhase3Refinement}</span>}
                        </div>

                        <div className={styles.questionGroup}>
                            <h2 className={styles.questionTitle}>
                                5. Overall, in which phase did you find the AI’s suggestions more helpful?
                            </h2>
                            <div className={styles.radioGroup}>
                                {[
                                    { value: "much-more-phase-1", label: "The AI was much more helpful in Phase 1 - it gave me new directions to explore but did not help much with refinement" },
                                    { value: "somewhat-more-phase-1", label: "The AI was somewhat more helpful in Phase 1 - it was useful for generating ideas but less so for developing them" },
                                    { value: "equally-helpful", label: "The AI was equally helpful in both phases" },
                                    { value: "somewhat-more-phase-3", label: "The AI was somewhat more helpful in Phase 3 - it was more useful for developing and refining my idea" },
                                    { value: "much-more-phase-3", label: "The AI was much more helpful in Phase 3 - it added little during idea generation but significantly helped me refine my concept" },
                                ].map((opt) => (
                                    <label key={opt.value} className={styles.radioOption}>
                                        <input
                                            type="radio"
                                            name="aiPhaseHelpfulness"
                                            value={opt.value}
                                            checked={formData.aiPhaseHelpfulness === opt.value}
                                            onChange={handleChange}
                                            className={styles.radioInput}
                                        />
                                        <span className={styles.radioLabel}>{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.aiPhaseHelpfulness && <span className={styles.errorMessage}>{errors.aiPhaseHelpfulness}</span>}
                        </div>

                        <div className={styles.questionGroup}>
                            <h2 className={styles.questionTitle}>
                                6. How would you describe the AI’s suggestions in relation to the patent?
                            </h2>
                            <div className={styles.radioGroup}>
                                {[
                                    { value: "fully-grounded", label: "Fully grounded - every suggestion was realistic and directly based on what the patent described" },
                                    { value: "mostly-grounded", label: "Mostly grounded - suggestions generally followed the patent, with occasional creative extensions" },
                                    { value: "mixed", label: "Mixed - some suggestions were grounded in the patent while others felt speculative or loosely connected" },
                                    { value: "mostly-speculative", label: "Mostly speculative - suggestions frequently went beyond the patent into imaginative or unrealistic territory" },
                                    { value: "highly-imaginative", label: "Highly imaginative - suggestions felt largely disconnected from the patent, more like creative fiction than practical applications" },
                                ].map((opt) => (
                                    <label key={opt.value} className={styles.radioOption}>
                                        <input
                                            type="radio"
                                            name="aiSuggestionsGroundedness"
                                            value={opt.value}
                                            checked={formData.aiSuggestionsGroundedness === opt.value}
                                            onChange={handleChange}
                                            className={styles.radioInput}
                                        />
                                        <span className={styles.radioLabel}>{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.aiSuggestionsGroundedness && <span className={styles.errorMessage}>{errors.aiSuggestionsGroundedness}</span>}
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
