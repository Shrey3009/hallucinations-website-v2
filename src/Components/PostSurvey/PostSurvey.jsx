import React, { useState, useEffect } from "react";
import styles from "./PostSurvey.module.css";
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../surveyIDContext";

function PostSurvey() {
  const [formData, setFormData] = useState({
    accuracy: "",
    helpfulness: "",
    inspiration: "",
    expansion: "",
    recombination: "",
    problems: "",
    improvements: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { surveyId } = useSurvey();

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("PostSurvey mounted, surveyId =", surveyId);
    if (!surveyId) {
      console.warn("⚠️ surveyId is missing! The PostSurvey cannot be linked to PreSurvey.");
    }
  }, [surveyId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (!surveyId) {
        console.error("❌ No surveyId found in context, cannot submit PostSurvey");
        alert("Error: PreSurvey ID is missing. Did you complete the PreSurvey first?");
        return;
      }

      // Debug check 2: required fields
      for (const key of ["accuracy", "helpfulness", "inspiration", "expansion", "recombination"]) {
        if (!formData[key]) {
          console.error(`❌ Missing required field: ${key}`);
        }
      }

      console.log(
        "Final PostSurvey payload:",
        JSON.stringify(
          {
            ...formData,
            preSurveyId: surveyId,
          },
          null,
          2
        )
      );
      console.log("surveyId from context:", surveyId);

      const apiUrlEnv = import.meta.env.VITE_NODE_API;
      if (!apiUrlEnv) {
        console.error("VITE_NODE_API is not defined in environment variables");
        return;
      }

      const baseApi = apiUrlEnv.endsWith('/') ? apiUrlEnv.slice(0, -1) : apiUrlEnv;
      const apiUrl = `${baseApi}/api/PostSurvey`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          preSurveyId: surveyId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit form");
      }

      navigate("/ThankYou");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Failed to submit form. Please try again.");
    }
  };

  return (
    <div className={styles.instructionPage}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Post-Task Survey</h1>
          <p className={styles.description}>
            Please help us understand your experience with the AI assistant.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Q1 Accuracy */}
          <div className={styles.questionGroup}>
            <h2 className={styles.questionTitle}>1. How accurate or reasonable did you find the AI’s suggestions overall?

            </h2>

            <div className={styles.radioGroup}>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="accuracy"
                  value="mostly-incorrect"
                  checked={formData.accuracy === "mostly-incorrect"}
                  onChange={handleChange}
                  className={styles.radioInput}
                  required
                />
                <span className={styles.radioLabel}>
                  The suggestions were mostly incorrect or irrelevant
                </span>
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="accuracy"
                  value="some-made-sense"
                  checked={formData.accuracy === "some-made-sense"}
                  onChange={handleChange}
                  className={styles.radioInput}
                />
                <span className={styles.radioLabel}>
                  Some suggestions made sense, but others seemed off
                </span>
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="accuracy"
                  value="generally-reasonable"
                  checked={formData.accuracy === "generally-reasonable"}
                  onChange={handleChange}
                  className={styles.radioInput}
                />
                <span className={styles.radioLabel}>
                  The suggestions were generally reasonable and plausible
                </span>
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="accuracy"
                  value="mostly-clear-accurate"
                  checked={formData.accuracy === "mostly-clear-accurate"}
                  onChange={handleChange}
                  className={styles.radioInput}
                />
                <span className={styles.radioLabel}>
                  Most suggestions were clear and accurate
                </span>
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="accuracy"
                  value="highly-logical"
                  checked={formData.accuracy === "highly-logical"}
                  onChange={handleChange}
                  className={styles.radioInput}
                />
                <span className={styles.radioLabel}>
                  All suggestions were highly logical and well-grounded
                </span>
              </label>
            </div>
            {errors.accuracy && (
              <span className={styles.errorMessage}>{errors.accuracy}</span>
            )}
          </div>

          {/* Q2 Helpfulness */}
          <div className={styles.questionGroup}>
            <h2 className={styles.questionTitle}>2. How helpful were the AI’s suggestions in supporting your creative thinking?
            </h2>

            <div className={styles.radioGroup}>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="helpfulness"
                  value="not-helpful"
                  checked={formData.helpfulness === "not-helpful"}
                  onChange={handleChange}
                  className={styles.radioInput}
                  required
                />
                <span className={styles.radioLabel}>
                  Not helpful at all — I did not use any of the AI’s suggestions
                </span>
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="helpfulness"
                  value="slightly-helpful"
                  checked={formData.helpfulness === "slightly-helpful"}
                  onChange={handleChange}
                  className={styles.radioInput}
                />
                <span className={styles.radioLabel}>
                  Slightly helpful — One or two ideas provided a small nudge
                </span>
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="helpfulness"
                  value="moderately-helpful"
                  checked={formData.helpfulness === "moderately-helpful"}
                  onChange={handleChange}
                  className={styles.radioInput}
                />
                <span className={styles.radioLabel}>
                  Moderately helpful — The suggestions helped me brainstorm more effectively
                </span>
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="helpfulness"
                  value="very-helpful"
                  checked={formData.helpfulness === "very-helpful"}
                  onChange={handleChange}
                  className={styles.radioInput}
                />
                <span className={styles.radioLabel}>
                  Very helpful — The suggestions pushed me in new directions
                </span>
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="helpfulness"
                  value="extremely-helpful"
                  checked={formData.helpfulness === "extremely-helpful"}
                  onChange={handleChange}
                  className={styles.radioInput}
                />
                <span className={styles.radioLabel}>
                  Extremely helpful — The AI greatly enhanced my creativity
                </span>
              </label>
            </div>
            {errors.helpfulness && (
              <span className={styles.errorMessage}>{errors.helpfulness}</span>
            )}
          </div>


          {/* Q3 Inspiration (dropdown) */}
          <div className={styles.formGroup}>
            <h2 className={styles.questionTitle}>
              3. To what extent did the AI’s suggestions inspire you to think of new directions or possibilities?
            </h2>
            <select
              name="inspiration"
              value={formData.inspiration}
              onChange={handleChange}
              className={`${styles.field} ${errors.inspiration ? styles.error : ""}`}
              required
            >
              <option value="">Select an option</option>
              <option value="1">1 – Not at all inspiring — no new directions came to mind</option>
              <option value="2">2 – Slightly inspiring — a small spark of new thinking</option>
              <option value="3">3 – Moderately inspiring — some useful new directions emerged</option>
              <option value="4">4 – Very inspiring — many new directions came to mind</option>
              <option value="5">5 – Extremely inspiring — the suggestions strongly shaped my thinking in new ways</option>
            </select>
          </div>

          {/* Q4 Expansion (dropdown) */}
          <div className={styles.formGroup}>
            <h2 className={styles.questionTitle}>
              4. How much did the AI’s suggestions help you expand or elaborate on your initial ideas?
            </h2>
            <select
              name="expansion"
              value={formData.expansion}
              onChange={handleChange}
              className={`${styles.field} ${errors.expansion ? styles.error : ""}`}
              required
            >
              <option value="">Select an option</option>
              <option value="1">1 – Not at all — they did not help me expand my ideas</option>
              <option value="2">2 – Slightly — provided a small addition to my ideas</option>
              <option value="3">3 – Moderately — helped me add some details or depth</option>
              <option value="4">4 – Quite a lot — significantly expanded or developed my ideas</option>
              <option value="5">5 – A great deal — transformed my ideas into much richer versions</option>
            </select>
          </div>

          {/* Q5 Recombination (dropdown) */}
          <div className={styles.formGroup}>
            <h2 className={styles.questionTitle}>
              5. Did the AI’s suggestions help you combine or recombine ideas in new ways?
            </h2>
            <select
              name="recombination"
              value={formData.recombination}
              onChange={handleChange}
              className={`${styles.field} ${errors.recombination ? styles.error : ""}`}
              required
            >
              <option value="">Select an option</option>
              <option value="1">1 – Not at all — no new combinations emerged</option>
              <option value="2">2 – Slightly — only one or two small combinations</option>
              <option value="3">3 – Moderately — some useful recombinations occurred</option>
              <option value="4">4 – Quite a lot — I created several new combinations of ideas</option>
              <option value="5">5 – Very much so — the suggestions led to highly novel recombinations</option>
            </select>
          </div>

          {/* Q6 Problems */}
          <div className={styles.formGroup}>
            <h2 className={styles.questionTitle}>
              6. Please describe any problems or challenges you experienced when using the AI to support your idea generation.
            </h2>
            <textarea
              name="problems"
              value={formData.problems}
              onChange={handleChange}
              className={`${styles.field} ${styles.textarea}`}
              placeholder="Write your response here..."
            />
          </div>

          {/* Q7 Improvements */}
          <div className={styles.formGroup}>
            <h2 className={styles.questionTitle}>
              7.  In what ways could the AI interaction be improved to better inspire or guide your idea generation?
            </h2>
            <textarea
              name="improvements"
              value={formData.improvements}
              onChange={handleChange}
              className={`${styles.field} ${styles.textarea}`}
              placeholder="Your suggestions..."
            />
          </div>

          {/* Agree to terms */}
          <div className={styles.formGroup}>
            <label className={styles.checkboxContainer}>
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              I agree that my responses can be used for research purposes
            </label>
          </div>

          <div className={styles.submitContainer}>
            <button type="submit" className={styles.submitButton}>
              Submit Survey
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostSurvey;
