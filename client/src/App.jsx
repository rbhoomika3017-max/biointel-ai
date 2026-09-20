import { useState, useRef } from "react";
import "./App.css";

function App() {
  // --------------------------------------------------
  // Conversation memory
  // --------------------------------------------------
  const conversationId = useRef(
    "conversation-" + Date.now()
  );

  // --------------------------------------------------
  // Environmental form
  // --------------------------------------------------
  const [form, setForm] = useState({
    ecosystem: "freshwater lake",
    temperature: 31,
    ph: 8.2,
    dissolved_oxygen: 3.5,
    nitrogen: 8.4,
    phosphorus: 1.2,
    vegetation_cover: 35,
    pollution_level: "high"
  });

  // --------------------------------------------------
  // Main analysis states
  // --------------------------------------------------
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Follow-up states
  // --------------------------------------------------
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [followUpError, setFollowUpError] = useState("");

  // --------------------------------------------------
  // Handle form changes
  // --------------------------------------------------
  function handleChange(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  }

  // --------------------------------------------------
  // Analyze ecosystem
  // --------------------------------------------------
  async function handleAnalyze() {
    setLoading(true);
    setError("");
    setResult(null);
    setFollowUpAnswer("");
    setFollowUpError("");

    try {
      const response = await fetch(
        "http://biointel-ai.onrender.com/api/chat/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            environmentData: form,
            conversationId: conversationId.current
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Analysis failed"
        );
      }

      setResult(data.result);

    } catch (err) {
      console.error("Analysis Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // Ask follow-up question
  // --------------------------------------------------
  async function handleFollowUp() {
    if (!followUpQuestion.trim()) {
      setFollowUpError(
        "Please enter a question first."
      );
      return;
    }

    setFollowUpLoading(true);
    setFollowUpError("");
    setFollowUpAnswer("");

    try {
      const response = await fetch(
        "http://biointel-ai.onrender.com/api/chat/follow-up",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            conversationId: conversationId.current,
            question: followUpQuestion
          })
        }
      );

      const data = await response.json();

      console.log("Follow-up response:", data);

      if (!response.ok) {
        throw new Error(
          data.error || "Follow-up request failed"
        );
      }

      setFollowUpAnswer(
        data.answer || "No answer was returned."
      );

      setFollowUpQuestion("");

    } catch (err) {
      console.error("Follow-up Error:", err);
      setFollowUpError(err.message);
    } finally {
      setFollowUpLoading(false);
    }
  }

  return (
    <div className="app">

      {/* ============================================
          HEADER
      ============================================ */}
      <header className="header">
        <div>
          <h1>🌿 BioIntel AI</h1>
          <p>
            AI-powered Biodiversity & Environmental
            Intelligence
          </p>
        </div>
      </header>

      {/* ============================================
          MAIN CONTAINER
      ============================================ */}
      <main className="container">

        {/* ============================================
            ENVIRONMENTAL INPUT
        ============================================ */}
        <div className="card">

          <h2>🌎 Environmental Data</h2>

          <p>
            Enter environmental observations to analyze
            ecosystem health and biodiversity risks.
          </p>

          <div className="form-grid">

            {/* Ecosystem */}
            <div className="form-group">
              <label>Ecosystem</label>

              <input
                type="text"
                name="ecosystem"
                value={form.ecosystem}
                onChange={handleChange}
                placeholder="Example: freshwater lake"
              />
            </div>

            {/* Temperature */}
            <div className="form-group">
              <label>
                Temperature (°C)
              </label>

              <input
                type="number"
                name="temperature"
                value={form.temperature}
                onChange={handleChange}
              />
            </div>

            {/* pH */}
            <div className="form-group">
              <label>pH</label>

              <input
                type="number"
                step="0.1"
                name="ph"
                value={form.ph}
                onChange={handleChange}
              />
            </div>

            {/* Dissolved Oxygen */}
            <div className="form-group">
              <label>
                Dissolved Oxygen (mg/L)
              </label>

              <input
                type="number"
                step="0.1"
                name="dissolved_oxygen"
                value={form.dissolved_oxygen}
                onChange={handleChange}
              />
            </div>

            {/* Nitrogen */}
            <div className="form-group">
              <label>
                Nitrogen
              </label>

              <input
                type="number"
                step="0.1"
                name="nitrogen"
                value={form.nitrogen}
                onChange={handleChange}
              />
            </div>

            {/* Phosphorus */}
            <div className="form-group">
              <label>
                Phosphorus
              </label>

              <input
                type="number"
                step="0.1"
                name="phosphorus"
                value={form.phosphorus}
                onChange={handleChange}
              />
            </div>

            {/* Vegetation */}
            <div className="form-group">
              <label>
                Vegetation Cover (%)
              </label>

              <input
                type="number"
                name="vegetation_cover"
                value={form.vegetation_cover}
                onChange={handleChange}
              />
            </div>

            {/* Pollution */}
            <div className="form-group">
              <label>
                Pollution Level
              </label>

              <select
                name="pollution_level"
                value={form.pollution_level}
                onChange={handleChange}
              >
                <option value="low">
                  Low
                </option>

                <option value="moderate">
                  Moderate
                </option>

                <option value="high">
                  High
                </option>
              </select>
            </div>

          </div>

          {/* Analyze button */}
          <button
            type="button"
            className="analyze-button"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading
              ? "Analyzing..."
              : "🔍 Analyze Ecosystem"}
          </button>

          {/* Error */}
          {error && (
            <div className="error">
              ❌ {error}
            </div>
          )}

        </div>

        {/* ============================================
            RESULTS
        ============================================ */}
        {result && (
          <div className="results">

            {/* Assessment */}
            <div className="card">

              <h2>📊 Assessment</h2>

              <div className="risk-box">
                <strong>
                  Risk Level: {result.risk_level}
                </strong>
              </div>

              <p>
                {result.assessment}
              </p>

            </div>

            {/* Key Risks */}
            <div className="card">

              <h2>
                ⚠️ Key Biodiversity Risks
              </h2>

              {result.key_risks &&
              result.key_risks.length > 0 ? (
                <ul>
                  {result.key_risks.map(
                    (risk, index) => (
                      <li key={index}>
                        {risk}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>
                  No major risks detected.
                </p>
              )}

            </div>

            {/* Variable Interactions */}
            <div className="card">

              <h2>
                🔗 Variable Interactions
              </h2>

              {result.variable_interactions &&
              result.variable_interactions.length > 0 ? (
                <ul>
                  {result.variable_interactions.map(
                    (interaction, index) => (
                      <li key={index}>
                        {interaction}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>
                  No major variable interactions
                  detected.
                </p>
              )}

            </div>

            {/* Recommendations */}
            <div className="card">

              <h2>
                💡 Recommendations
              </h2>

              {result.recommendations &&
              result.recommendations.length > 0 ? (

                result.recommendations.map(
                  (recommendation, index) => (

                    <div
                      className="recommendation"
                      key={index}
                    >

                      <h3>
                        {recommendation.action}
                      </h3>

                      <p>
                        <strong>
                          Reason:
                        </strong>{" "}
                        {recommendation.reason}
                      </p>

                      <p>
                        <strong>
                          Metrics:
                        </strong>{" "}
                        {recommendation.metrics?.join(
                          ", "
                        )}
                      </p>

                      <p>
                        <strong>
                          Time horizon:
                        </strong>{" "}
                        {recommendation.time_horizon}
                      </p>

                    </div>

                  )
                )

              ) : (
                <p>
                  No recommendations available.
                </p>
              )}

            </div>

            {/* Monitoring Plan */}
            <div className="card">

              <h2>
                📋 Monitoring Plan
              </h2>

              {result.monitoring_plan &&
              result.monitoring_plan.length > 0 ? (

                <ul>
                  {result.monitoring_plan.map(
                    (item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}
                </ul>

              ) : (
                <p>
                  No monitoring plan available.
                </p>
              )}

            </div>

            {/* ========================================
                FOLLOW-UP QUESTION
            ======================================== */}
            <div className="card follow-up">

              <h2>
                💬 Ask a Follow-up Question
              </h2>

              <p>
                Ask BioIntel about the ecosystem
                analysis. Previous analysis is remembered
                during this conversation.
              </p>

              <input
                type="text"
                value={followUpQuestion}
                onChange={(e) =>
                  setFollowUpQuestion(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleFollowUp();
                  }
                }}
                placeholder="Example: Why is the risk high?"
              />

              <button
                type="button"
                className="analyze-button"
                onClick={handleFollowUp}
                disabled={followUpLoading}
              >
                {followUpLoading
                  ? "Thinking..."
                  : "💬 Ask BioIntel"}
              </button>

              {followUpError && (
                <div className="error">
                  ❌ {followUpError}
                </div>
              )}

              {/* Follow-up answer */}
              {followUpAnswer && (
                <div className="follow-up-answer">

                  <h3>
                    🤖 BioIntel Answer
                  </h3>

                  <p>
                    {followUpAnswer}
                  </p>

                </div>
              )}

            </div>

            {/* ========================================
                SCIENTIFIC EVIDENCE
            ======================================== */}
            <div className="card evidence">

              <h2>
                📚 Scientific Evidence
              </h2>

              <p>
                {result.evidence_note ||
                  "This analysis is supported by scientific evidence retrieved from the BioIntel knowledge base."}
              </p>

              {result.evidence &&
              result.evidence.length > 0 ? (

                result.evidence.map(
                  (item, index) => (

                    <div
                      className="evidence-item"
                      key={index}
                    >

                      <h3>
                        {item.title}
                      </h3>

                      <p>
                        <strong>
                          Source:
                        </strong>{" "}
                        {item.source}
                      </p>

                      <p>
                        {item.supporting_text}
                      </p>

                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View scientific source →
                        </a>
                      )}

                    </div>

                  )
                )

              ) : (
                <p>
                  No matching scientific evidence
                  was retrieved.
                </p>
              )}

            </div>

          </div>
        )}

      </main>

      {/* ============================================
          FOOTER
      ============================================ */}
      <footer>
        <p>
          BioIntel AI • Biodiversity & Environmental
          Intelligence
        </p>
      </footer>

    </div>
  );
}

export default App;