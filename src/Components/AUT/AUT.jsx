import React, { useState, useEffect } from "react";
import styles from "./AUT.module.css";
import orgStyles from "./organize.module.css";
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../surveyIDContext";
import { useData } from "../../dataContext";
import Instructions from "../Instructions/Instructions";

function AUT() {
  const [phase, setPhase] = useState(1);
  const [generatedIdeas, setGeneratedIdeas] = useState(Array(6).fill(""));
  const [selectedIdeaIndex, setSelectedIdeaIndex] = useState(null);
  const [refinedIdea, setRefinedIdea] = useState("");
  const [timeLeft, setTimeLeft] = useState(360); // 6 mins for Phase 1
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { surveyId, taskSequence, currentTaskIndex, setCurrentTaskIndex } = useSurvey();
  const navigate = useNavigate();
  const { data } = useData();
  const [randomString, setRandomString] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase]);

  useEffect(() => {
    if (surveyId) {
      fetchPatentForTask();
    }
  }, [surveyId]);

  const fetchPatentForTask = async () => {
    try {
      const taskNum = currentTaskIndex + 1;
      const apiUrl = `${import.meta.env.VITE_NODE_API}/api/patent-for-task/${surveyId}/${taskNum}`;
      console.log(`Attempting to fetch patent from: ${apiUrl}`);

      const response = await fetch(apiUrl);
      if (response.ok) {
        const patentData = await response.json();
        setRandomString(patentData.data);
      } else {
        console.error(`API failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to fetch patent:", error.message);
    }
  };

  useEffect(() => {
    if (timeLeft === 0) {
      handlePhaseTransition();
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const handleIdeaChange = (index, value) => {
    const newIdeas = [...generatedIdeas];
    newIdeas[index] = value;
    setGeneratedIdeas(newIdeas);
  };

  const addMoreIdeas = () => {
    setGeneratedIdeas([...generatedIdeas, ""]);
  };

  const handlePhaseTransition = () => {
    if (phase === 1) {
      // Ensure at least some ideas exist, or just transition
      setPhase(2);
      setTimeLeft(60); // 1 minute for Phase 2
    } else if (phase === 2) {
      setPhase(3);
      setTimeLeft(360); // 6 minutes for Phase 3
    } else if (phase === 3) {
      handleSubmit();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    // Phase 1->2 transition
    if (phase === 1) {
      handlePhaseTransition();
      return;
    }

    // Phase 2->3 transition
    if (phase === 2) {
      if (selectedIdeaIndex === null) {
        setErrors({ selection: "Please select one idea to proceed." });
        return;
      }
      setErrors({});
      handlePhaseTransition();
      return;
    }

    // Phase 3 Final Submission
    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_NODE_API}/api/AUT`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generatedIdeas: generatedIdeas.filter(idea => idea.trim() !== ""),
          selectedIdea: generatedIdeas[selectedIdeaIndex] || "",
          refinedIdea,
          preSurveyId: surveyId,
          object: randomString?.patentName || "",
        }),
      });

      if (response.ok) {
        if (currentTaskIndex === 0) {
          // Transition to Task 2 Instructions
          setCurrentTaskIndex(1);
          window.scrollTo(0, 0);
          navigate("/TaskInstructions");
        } else {
          // Transition to final PostSurvey
          navigate("/PostSurvey");
        }
      } else {
        alert("Failed to submit form");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit form due to an error.");
      setIsSubmitting(false);
    }
  };

  const renderPatentDetails = () => (
    <div className={styles.patentSection}>
      <h2 className={styles.patentName}>
        Patent Name: {randomString?.patentName || "Loading..."}
      </h2>
      <div className={styles.patentDescription}>
        <h3>Patent Description:</h3>
        {randomString?.patentDescription ? (
          (() => {
            const text = randomString.patentDescription || "";
            const [summaryPart, detailsPart] = text.split("Key Technical Details:");
            return (
              <>
                <p>
                  <strong>Summary:</strong>{" "}
                  {summaryPart.replace("Summary:", "").trim()}
                </p>
                {detailsPart && (
                  <>
                    <p><strong>Key Technical Details:</strong></p>
                    <div style={{ textAlign: "left", marginLeft: "1rem" }}>
                      {detailsPart
                        .trim()
                        .split("\n")
                        .map((line, index) =>
                          line.trim() ? <p key={index}>{line.trim()}</p> : null
                        )}
                    </div>
                  </>
                )}
              </>
            );
          })()
        ) : (
          "Loading patent description..."
        )}
      </div>
    </div>
  );

  return (
    <div className={orgStyles.main}>
      <Instructions round={phase} isAI={false} />
      <div className={orgStyles.bottom_container}>
        <div className={orgStyles.aut_component}>
          <div className={styles.container}>
            <div className={styles.taskHeader}>
              <h1 className={styles.taskTitle}>
                Task {currentTaskIndex + 1}: Baseline Ideation (No AI)
              </h1>
              {renderPatentDetails()}

              <h3 style={{ marginTop: "20px" }}>Phase {phase}</h3>
              <p className={styles.taskDescription}>
                {phase === 1 && "Generate as many creative product ideas as possible that could be developed using the patented technology."}
                {phase === 2 && "Select your best idea from the ones you generated."}
                {phase === 3 && "Develop the selected idea into a clear and well-defined product solution. Describe what the product is, how it works, and how it uses the patented technology to create value."}
              </p>
              <div className={styles.timer}>Time remaining: {formatTime()}</div>
            </div>

            <form onSubmit={handleSubmit} className={styles.useCaseForm}>
              {phase === 1 && (
                <>
                  {generatedIdeas.map((idea, index) => (
                    <div key={index} className={styles.inputWrapper}>
                      <input
                        type="text"
                        placeholder={`Application Idea ${index + 1}`}
                        value={idea}
                        onChange={(e) => handleIdeaChange(index, e.target.value)}
                        className={styles.inputField}
                        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addMoreIdeas}
                    style={{ padding: "10px 20px", marginTop: "10px", fontSize: "16px", cursor: "pointer", display: "block", marginBottom: "20px" }}
                  >
                    + Add Another Idea
                  </button>
                  <div className={styles.buttonContainer}>
                    <button type="submit" className={styles.submitButton}>
                      Submit Ideas
                    </button>
                  </div>
                </>
              )}

              {phase === 2 && (
                <>
                  <div style={{ padding: "20px", background: "#f9f9f9", borderRadius: "8px", border: "1px solid #ddd" }}>
                    {generatedIdeas.filter(idea => idea.trim() !== "").length === 0 ? (
                      <p>No ideas were generated in Phase 1.</p>
                    ) : (
                      generatedIdeas.map((idea, index) => {
                        if (idea.trim() === "") return null;
                        return (
                          <label key={index} style={{ display: "block", marginBottom: "15px", cursor: "pointer" }}>
                            <input
                              type="radio"
                              name="selectedIdea"
                              value={index}
                              checked={selectedIdeaIndex === index}
                              onChange={() => {
                                setSelectedIdeaIndex(index);
                                setErrors({});
                              }}
                              style={{ marginRight: "10px" }}
                            />
                            {idea}
                          </label>
                        );
                      })
                    )}
                  </div>
                  {errors.selection && <div className={styles.errorMessage} style={{ color: "red", marginTop: "10px" }}>{errors.selection}</div>}

                  <div className={styles.buttonContainer}>
                    <button
                      type="submit"
                      className={styles.submitButton}
                      disabled={selectedIdeaIndex === null && generatedIdeas.filter(i => i.trim() !== "").length > 0}
                      style={{ opacity: (selectedIdeaIndex === null && generatedIdeas.filter(i => i.trim() !== "").length > 0) ? 0.5 : 1 }}
                    >
                      Confirm Selection
                    </button>
                  </div>
                </>
              )}

              {phase === 3 && (
                <>
                  <div style={{ padding: "15px", background: "#e8f4fc", borderRadius: "8px", border: "1px solid #b6d9f5", marginBottom: "20px" }}>
                    <strong>Selected Idea:</strong>
                    <p style={{ marginTop: "10px" }}>{generatedIdeas[selectedIdeaIndex] || "No idea selected."}</p>
                  </div>

                  <textarea
                    placeholder="Elaborate and refine your idea here..."
                    value={refinedIdea}
                    onChange={(e) => setRefinedIdea(e.target.value)}
                    rows={12}
                    style={{ width: "100%", padding: "15px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px", resize: "vertical" }}
                  />

                  <div className={styles.buttonContainer} style={{ marginTop: "20px" }}>
                    <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Refinement"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AUT;
