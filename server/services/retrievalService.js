const fs = require("fs");
const path = require("path");

// =====================================================
// LOAD KNOWLEDGE BASE
// =====================================================

const knowledgePath = path.join(
  __dirname,
  "../knowledge/knowledge.json"
);

let knowledgeBase = [];

try {
  const fileData = fs.readFileSync(
    knowledgePath,
    "utf8"
  );

  knowledgeBase = JSON.parse(fileData);

  console.log(
    "Knowledge base loaded:",
    knowledgeBase.length,
    "documents"
  );

} catch (error) {

  console.error(
    "Could not load knowledge base:",
    error.message
  );

}


// =====================================================
// RETRIEVE RELEVANT KNOWLEDGE
// =====================================================

function retrieveRelevantKnowledge(environmentData) {

  if (!knowledgeBase || knowledgeBase.length === 0) {

    console.log(
      "Knowledge base is empty."
    );

    return [];

  }


  // Convert environmental data into searchable words

  const searchText = [

    environmentData.ecosystem,

    environmentData.question,

    environmentData.temperature > 30
      ? "temperature warm hot"
      : "temperature",

    environmentData.dissolved_oxygen < 5
      ? "dissolved oxygen low oxygen"
      : "dissolved oxygen",

    environmentData.nitrogen > 5
      ? "nitrogen nutrient"
      : "nitrogen",

    environmentData.phosphorus > 0.5
      ? "phosphorus nutrient algae"
      : "phosphorus",

    environmentData.pollution_level,

    environmentData.vegetation_cover < 40
      ? "vegetation shoreline habitat"
      : "vegetation",

    environmentData.ph < 6.5
      ? "pH acidic"
      : environmentData.ph > 8.5
        ? "pH alkaline"
        : "pH"

  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();


  console.log(
    "RAG search text:",
    searchText
  );


  // ===================================================
  // SCORE EACH DOCUMENT
  // ===================================================

  const results = knowledgeBase.map(
    function (document) {

      const documentText = (

        String(document.title || "") +
        " " +
        String(document.content || "") +
        " " +
        String(document.source || "")

      ).toLowerCase();


      let score = 0;


      // Important environmental keywords

      const keywords = [

        "temperature",
        "warm water",
        "dissolved oxygen",
        "oxygen",
        "nitrogen",
        "phosphorus",
        "nutrient",
        "algae",
        "pollution",
        "vegetation",
        "shoreline",
        "habitat",
        "aquatic",
        "water quality",
        "decomposition",
        "ecosystem",
        "pH"

      ];


      keywords.forEach(
        function (keyword) {

          if (
            searchText.includes(keyword) &&
            documentText.includes(keyword.toLowerCase())
          ) {

            score += 1;

          }

        }
      );


      return {
        ...document,
        relevance: score
      };

    }
  );


  // ===================================================
  // SORT BY RELEVANCE
  // ===================================================

  results.sort(
    function (a, b) {
      return b.relevance - a.relevance;
    }
  );


  // ===================================================
  // RETURN TOP DOCUMENTS
  // ===================================================

  const topResults = results
    .filter(function (item) {
      return item.relevance > 0;
    })
    .slice(0, 5);


  console.log(
    "Retrieved evidence:",
    topResults.length
  );


  return topResults;

}


module.exports = {
  retrieveRelevantKnowledge
};