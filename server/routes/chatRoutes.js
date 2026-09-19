const express = require("express");

const { analyzeEnvironment } = require("../services/aiService");
const {
  retrieveRelevantKnowledge
} = require("../services/retrievalService");

const router = express.Router();


// =====================================================
// CONVERSATION MEMORY
// =====================================================

const conversations = {};


// =====================================================
// ANALYZE ECOSYSTEM
// POST /analyze
// =====================================================

router.post("/analyze", async (req, res) => {
  try {

    const environmentData = req.body.environmentData;
    let conversationId = req.body.conversationId;

    if (!environmentData) {
      return res.status(400).json({
        success: false,
        error: "environmentData is required"
      });
    }

    // Create conversation ID if one does not exist
    if (!conversationId) {
      conversationId = "conversation-" + Date.now();
    }


    // =================================================
    // RETRIEVE SCIENTIFIC EVIDENCE
    // =================================================

    let evidence = [];

    try {
      evidence = retrieveRelevantKnowledge(environmentData);
    } catch (error) {
      console.log("Retrieval error:", error.message);
      evidence = [];
    }


    // =================================================
    // RUN ENVIRONMENTAL ANALYSIS
    // =================================================

    const result = await analyzeEnvironment(environmentData);


    // =================================================
    // ADD SCIENTIFIC EVIDENCE
    // =================================================

    result.evidence = evidence.map(function (item) {
      return {
        title: item.title,
        source: item.source,
        url: item.url,
        relevance: item.relevance,
        supporting_text:
          item.content || item.supporting_text || ""
      };
    });


    // =================================================
    // SAVE CONVERSATION
    // =================================================

    conversations[conversationId] = {
      conversationId: conversationId,

      environmentData: environmentData,

      analysis: result,

      messages: [
        {
          role: "user",
          content: "Environmental analysis requested."
        },
        {
          role: "assistant",
          content: JSON.stringify(result)
        }
      ],

      createdAt: new Date().toISOString(),

      updatedAt: new Date().toISOString()
    };


    // =================================================
    // SEND RESPONSE
    // =================================================

    return res.json({
      success: true,
      conversationId: conversationId,
      result: result
    });

  } catch (error) {

    console.error("Analysis Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message
    });

  }
});


// =====================================================
// FOLLOW-UP QUESTION
// POST /follow-up
// =====================================================

router.post("/follow-up", async (req, res) => {
  try {

    const conversationId = req.body.conversationId;
    const question = req.body.question;


    // =================================================
    // VALIDATION
    // =================================================

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        error: "conversationId is required"
      });
    }

    if (!question) {
      return res.status(400).json({
        success: false,
        error: "question is required"
      });
    }


    // =================================================
    // GET PREVIOUS CONVERSATION
    // =================================================

    const conversation = conversations[conversationId];

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error:
          "Please perform an ecosystem analysis first."
      });
    }


    // =================================================
    // PREVIOUS ANALYSIS
    // =================================================

    const analysis = conversation.analysis || {};

    const lowerQuestion =
      question.toLowerCase();


    // =================================================
    // ANSWER
    // =================================================

    let answer = "";


    // =================================================
    // TEMPERATURE
    // =================================================

    if (
      lowerQuestion.includes("temperature")
    ) {

      answer =
        "Temperature is an important environmental variable. " +
        "Higher water temperatures can stress aquatic organisms. " +
        "Warm water generally holds less dissolved oxygen than cooler water. " +
        "Therefore, temperature becomes particularly important when dissolved oxygen is low.";

    }


    // =================================================
    // DISSOLVED OXYGEN
    // =================================================

    else if (
      lowerQuestion.includes("oxygen") ||
      lowerQuestion.includes("dissolved oxygen")
    ) {

      answer =
        "Dissolved oxygen is important for aquatic organisms. " +
        "Low dissolved oxygen can stress fish and other aquatic organisms. " +
        "Temperature, pollution, nutrient enrichment and decomposition can influence dissolved oxygen.";

    }


    // =================================================
    // NITROGEN / PHOSPHORUS / ALGAE
    // =================================================

    else if (
      lowerQuestion.includes("nitrogen") ||
      lowerQuestion.includes("phosphorus") ||
      lowerQuestion.includes("nutrient") ||
      lowerQuestion.includes("algae")
    ) {

      answer =
        "Excess nitrogen and phosphorus can promote excessive algal growth. " +
        "When algae die and decompose, oxygen can be consumed. " +
        "This can increase the risk of low dissolved oxygen. " +
        "Therefore, nitrogen, phosphorus and dissolved oxygen should be monitored together.";

    }


    // =================================================
    // POLLUTION
    // =================================================

    else if (
      lowerQuestion.includes("pollution")
    ) {

      answer =
        "High pollution is an important ecosystem stressor. " +
        "Pollution can contribute to poor water quality and increase ecological stress. " +
        "Reducing pollution sources can help improve ecosystem condition.";

    }


    // =================================================
    // VEGETATION
    // =================================================

    else if (
      lowerQuestion.includes("vegetation") ||
      lowerQuestion.includes("shoreline")
    ) {

      answer =
        "Shoreline vegetation can provide habitat and help reduce runoff into aquatic ecosystems. " +
        "Maintaining or restoring native shoreline vegetation can support ecosystem health.";

    }


    // =================================================
    // MONITORING
    // =================================================

    else if (
      lowerQuestion.includes("monitor") ||
      lowerQuestion.includes("monitoring") ||
      lowerQuestion.includes("track") ||
      lowerQuestion.includes("check")
    ) {

      answer =
        "The main variables to monitor are temperature, dissolved oxygen, nitrogen, phosphorus, vegetation cover and pollution indicators.";

      if (
        analysis.monitoring_plan &&
        analysis.monitoring_plan.length > 0
      ) {

        answer +=
          " Recommended monitoring actions: " +
          analysis.monitoring_plan.join(" ");

      }

    }


    // =================================================
    // RECOMMENDATIONS
    // =================================================

    else if (
      lowerQuestion.includes("recommend") ||
      lowerQuestion.includes("recommendation") ||
      lowerQuestion.includes("improve") ||
      lowerQuestion.includes("solution") ||
      lowerQuestion.includes("reduce") ||
      lowerQuestion.includes("fix")
    ) {

      if (
        analysis.recommendations &&
        analysis.recommendations.length > 0
      ) {

        answer =
          "Based on the previous ecosystem analysis, the recommended actions are: ";

        analysis.recommendations.forEach(
          function (item, index) {

            if (typeof item === "object") {

              answer +=
                (index + 1) +
                ". " +
                (item.action || "Recommended action") +
                " ";

            } else {

              answer +=
                (index + 1) +
                ". " +
                item +
                " ";

            }

          }
        );

      } else {

        answer =
          "The main approach is to reduce pollution and nutrient inputs, protect shoreline vegetation, and continue monitoring temperature and dissolved oxygen.";

      }

    }


    // =================================================
    // VARIABLE INTERACTIONS
    // =================================================

    else if (
      lowerQuestion.includes("interaction") ||
      lowerQuestion.includes("together") ||
      lowerQuestion.includes("combined") ||
      lowerQuestion.includes("variables")
    ) {

      if (
        analysis.variable_interactions &&
        analysis.variable_interactions.length > 0
      ) {

        answer =
          "The important environmental variable interactions are: " +
          analysis.variable_interactions.join(" ");

      } else {

        answer =
          "Temperature, dissolved oxygen, nutrients and pollution should be considered together because they can influence ecosystem condition.";

      }

    }


    // =================================================
    // pH
    // =================================================

    else if (
      lowerQuestion.includes("ph") ||
      lowerQuestion.includes("acid") ||
      lowerQuestion.includes("alkaline")
    ) {

      answer =
        "pH is an important water-quality variable because aquatic organisms can be sensitive to changes in acidity and alkalinity. " +
        "It should be interpreted together with the other environmental variables.";

    }


    // =================================================
    // RISK
    // =================================================

    else if (
      lowerQuestion.includes("risk")
    ) {

      answer =
        "The previous analysis classified the ecosystem as " +
        (analysis.risk_level || "elevated") +
        " risk. ";

      if (
        analysis.key_risks &&
        analysis.key_risks.length > 0
      ) {

        answer +=
          "The main contributing risks were: " +
          analysis.key_risks.join(" ");

      }

    }


    // =================================================
    // GENERAL QUESTION
    // =================================================

    else {

      answer =
        "Based on the previous ecosystem analysis, the main factors are temperature, dissolved oxygen, nitrogen, phosphorus, pollution and vegetation cover. " +
        "You can ask me about risk, interactions, monitoring or recommendations.";

    }


    // =================================================
    // SAVE FOLLOW-UP IN MEMORY
    // =================================================

    conversation.messages.push({
      role: "user",
      content: question
    });

    conversation.messages.push({
      role: "assistant",
      content: answer
    });

    conversation.updatedAt =
      new Date().toISOString();


    // =================================================
    // SEND FOLLOW-UP RESPONSE
    // =================================================

    return res.json({
      success: true,
      conversationId: conversationId,
      answer: answer,
      analysis: analysis,
      evidence: analysis.evidence || []
    });

  } catch (error) {

    console.error(
      "Follow-up Error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: error.message
    });

  }
});


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;