import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ConsentForm.module.css";
import logo from "../../assets/Web-Logo-Costello-College-of-Business.png";

function ConsentForm() {
  const [consent, setConsent] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const surveyCode = params.get("survey_code");

    if (surveyCode) {
      sessionStorage.setItem("survey_code", surveyCode);
    }
  }, []);

  const handleConsentChange = (e) => {
    setConsent(e.target.value);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!consent) {
      setError("Please select an option");
      return;
    }
    if (consent === "yes") {
      navigate("/PreSurvey");
    } else {
      navigate("/ThankYou");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <img src={logo} alt="Web Logo" className={styles.logo} />

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Why you are being invited to take part in a research study?</h2>
            <p>
              We invite you to partake in this research study since you may be
              familiar with online video content platforms such as YouTube,
              Facebook etc.
            </p>
          </section>

          <section className={styles.section}>
            <h2>What should I know about this research?</h2>
            <p>You will be given clear instructions.</p>
            <p>
              Whether or not you take part is up to you. You can choose not to
              take part. You can agree to take part and later change your mind.
              Your decisions will not be held against you. You can ask all the
              questions you want before you decide.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Who can I talk to?</h2>
            <p>
              This research is being conducted by Siddharth Bhattacharya at the
              School of Business at George Mason University. Please reach out to
              Siddharth at 703-993-1198 for questions or to report a
              research-related problem. You may contact the George Mason
              University Institutional Review Board (IRB) Office at 703-993-4121
              (email at irb@gmu.edu) if you have questions or comments regarding
              your rights as a participant in the research. The reference number
              for this application is STUDY00000396.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Why are we doing this research?</h2>
            <p>
              The study is designed to investigate the impact of AI tools on
              human creativity.
            </p>
          </section>

          <section className={styles.section}>
            <h2>How long will the research last?</h2>
            <p>
              Your participation in this study will last for one session with a
              duration of approximately 30 minutes.
            </p>
          </section>

          <section className={styles.section}>
            <h2>What happens if I say yes, I want to be in this research?</h2>
            <p>
              If you agree to participate, you will engage in a series of
              creative thinking tasks, some with assistance from an AI tool and
              some without. The purpose of this study is to explore how AI tools
              affect your ability to generate ideas and think creatively. You
              will also be asked to complete short surveys before and after the
              tasks to share your thoughts on the experience. The entire session
              will take about 30 minutes.
            </p>
          </section>

          <section className={styles.section}>
            <h2>
              What happens if I say no, I do not want to be in this research?
            </h2>
            <p>
              You may decide not to take part in the research, and it will not
              be held against you. It will in no way affect your relationship
              with the study investigators.
            </p>
          </section>

          <section className={styles.section}>
            <h2>What happens if I say yes, but I change my mind later?</h2>
            <p>
              If you agree to take part in the research, you can stop at any
              time, and it will not be held against you. Withdrawal from study
              or failure to participate will not have any academic consequences
              to you if you are a student. Furthermore, if you are a student,
              there are no risks to your student career. However, compensation
              for the study will depend on completing the full study.
            </p>
          </section>

          <section className={styles.section}>
            <h2>What happens to the information we collect?</h2>
            <p>
              The data in this study will be confidential. Names and other
              identifiers will not be placed on surveys or other research data.
              The data will be secured behind firewall on the work computers of
              the researchers, which are up to date on security patches. The
              de-identified data could be used for future research without
              additional consent from participants. The Institutional Review
              Board (IRB) committee that monitors research on human subjects may
              inspect study records during internal auditing procedures and are
              required to keep all information confidential. While it is
              understood that no computer transmission can be perfectly secure,
              reasonable efforts will be made to protect the confidentiality of
              your transmission.
            </p>
          </section>

          <section className={styles.section}>
            <h2>INCLUSION CRITERIA</h2>
            <ul>
              <li>
                The subjects will be above 18 years of age and reside in the US.
                We do not have any other restrictions.
              </li>
              <li>
                The study needs you to use a desktop device like
                laptop/PC/Mac(book), No mobile devices are permitted in the
                study.
              </li>
              <li>
                You will also need a good quality, working webcam plugged in. No
                personal data will be asked to maintain complete anonymity.
              </li>
            </ul>
          </section>

          <form onSubmit={handleSubmit} className={styles.consentForm}>
            <div className={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  name="consent"
                  value="yes"
                  checked={consent === "yes"}
                  onChange={handleConsentChange}
                />
                Yes, I agree to participate in this research study
              </label>
              <label>
                <input
                  type="radio"
                  name="consent"
                  value="no"
                  checked={consent === "no"}
                  onChange={handleConsentChange}
                />
                No, I do not agree to participate in this research study
              </label>
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.submitButton}>
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ConsentForm;
