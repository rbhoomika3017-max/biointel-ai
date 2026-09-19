async function analyzeEnvironment(environmentData) {
  const temperature = Number(environmentData.temperature || 0);
  const ph = Number(environmentData.ph || 0);
  const oxygen = Number(environmentData.dissolved_oxygen || 0);
  const nitrogen = Number(environmentData.nitrogen || 0);
  const phosphorus = Number(environmentData.phosphorus || 0);
  const vegetation = Number(environmentData.vegetation_cover || 0);

  const pollution = String(
    environmentData.pollution_level || "unknown"
  ).toLowerCase();

  const ecosystem = String(
    environmentData.ecosystem || "ecosystem"
  );

  const risks = [];
  const interactions = [];
  const recommendations = [];

  if (temperature > 30) {
    risks.push(
      "High water temperature may stress aquatic organisms."
    );

    recommendations.push({
      action: "Protect shoreline vegetation and increase natural shade.",
      reason: "Shoreline vegetation can provide shade and habitat.",
      metrics: ["temperature", "vegetation_cover"],
      time_horizon: "weeks to months"
    });
  }

  if (oxygen < 5) {
    risks.push(
      "Low dissolved oxygen can stress fish and other aquatic organisms."
    );

    recommendations.push({
      action: "Investigate pollution sources and improve water circulation.",
      reason: "Reducing oxygen demand can help improve dissolved oxygen.",
      metrics: ["dissolved_oxygen", "pollution_level"],
      time_horizon: "days to weeks"
    });
  }

  if (ph > 8.5 || ph < 6.5) {
    risks.push(
      "The measured pH is outside the monitored freshwater range."
    );
  }

  if (nitrogen > 5 || phosphorus > 0.5) {
    risks.push(
      "Elevated nutrients may increase the risk of excessive algae growth."
    );

    recommendations.push({
      action: "Reduce nitrogen and phosphorus runoff into the water body.",
      reason: "Reducing nutrient inputs can lower algal growth and oxygen depletion.",
      metrics: ["nitrogen", "phosphorus", "dissolved_oxygen"],
      time_horizon: "weeks to months"
    });
  }

  if (pollution === "high") {
    risks.push(
      "High pollution represents an important ecosystem stressor."
    );

    recommendations.push({
      action: "Identify and control major pollution sources.",
      reason: "Reducing pollution inputs can improve water quality.",
      metrics: ["pollution_level", "dissolved_oxygen"],
      time_horizon: "weeks to months"
    });
  }

  if (vegetation < 40) {
    recommendations.push({
      action: "Restore native vegetation around the shoreline.",
      reason: "Shoreline vegetation can provide habitat and reduce runoff.",
      metrics: ["vegetation_cover", "pollution_level"],
      time_horizon: "months"
    });
  }

  // MULTI-VARIABLE REASONING

  if (temperature > 30 && oxygen < 5) {
    interactions.push(
      "High temperature combined with low dissolved oxygen can increase stress on aquatic organisms."
    );
  }

  if (nitrogen > 5 && phosphorus > 0.5) {
    interactions.push(
      "High nitrogen and phosphorus together can increase the risk of nutrient enrichment and algal growth."
    );
  }

  if (pollution === "high" && oxygen < 5) {
    interactions.push(
      "High pollution combined with low dissolved oxygen indicates increased ecosystem stress."
    );
  }

  if (vegetation < 40 && pollution === "high") {
    interactions.push(
      "Low shoreline vegetation combined with high pollution may increase runoff and habitat stress."
    );
  }

  // RISK LEVEL

  let riskLevel = "Low";

  if (risks.length >= 2) {
    riskLevel = "Moderate";
  }

  if (risks.length >= 4 || pollution === "high") {
    riskLevel = "High";
  }

  // ASSESSMENT

  const assessment =
    `The ${ecosystem} shows ${riskLevel.toLowerCase()} ecological risk based on the supplied environmental observations. ` +
    "The assessment considers temperature, dissolved oxygen, nutrients, vegetation and pollution together.";

  // MONITORING

  const monitoring_plan = [
    "Monitor temperature regularly.",
    "Measure dissolved oxygen at different times of day.",
    "Track nitrogen and phosphorus levels.",
    "Monitor shoreline vegetation coverage.",
    "Record changes in pollution indicators."
  ];

  return {
    assessment,
    risk_level: riskLevel,
    key_risks: risks,
    variable_interactions: interactions,
    recommendations,
    monitoring_plan,
    evidence_note:
      "Scientific evidence is retrieved from the BioIntel knowledge base."
  };
}

module.exports = {
  analyzeEnvironment
};