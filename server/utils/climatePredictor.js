/**
 * Climate Risk Predictor
 * Provides rule-based + weighted scoring for flood, heatwave, and air pollution risks.
 * All functions return { risk: 'High'|'Medium'|'Low', score: 0-1, details: string }
 */

/**
 * Predict flood risk based on rainfall, humidity, and drainage capacity.
 * @param {number} rainfall    - Rainfall in mm (last 24h or forecast)
 * @param {number} humidity    - Relative humidity in %
 * @param {number} drainageFactor - 0 (poor drainage) to 1 (good drainage), default 0.5
 * @returns {{ risk: string, score: number, percentage: number, details: string }}
 */
function predictFlood(rainfall, humidity, drainageFactor = 0.5) {
  // Weighted score: rainfall is dominant, humidity adds stress, drainage mitigates
  const rainfallScore = Math.min(rainfall / 150, 1);           // normalise to 0-1
  const humidityScore = Math.max(0, (humidity - 60) / 40);     // >60% adds risk
  const drainageMitigation = 1 - drainageFactor * 0.3;         // poor drainage amplifies

  const rawScore = (rainfallScore * 0.6 + humidityScore * 0.4) * drainageMitigation;
  const score = Math.min(Math.max(rawScore, 0), 1);

  let risk, details;
  if (rainfall > 100 && humidity > 80) {
    risk = 'High';
    details = `Heavy rainfall (${rainfall}mm) combined with ${humidity}% humidity creates severe flood conditions.`;
  } else if (rainfall > 50 || (rainfall > 30 && humidity > 75)) {
    risk = 'Medium';
    details = `Moderate rainfall (${rainfall}mm) and ${humidity}% humidity may cause localised waterlogging.`;
  } else {
    risk = 'Low';
    details = `Current rainfall (${rainfall}mm) and humidity (${humidity}%) are within manageable limits.`;
  }

  return {
    risk,
    score: parseFloat(score.toFixed(3)),
    percentage: Math.round(score * 100),
    details,
    inputs: { rainfall, humidity, drainageFactor },
  };
}

/**
 * Predict heatwave risk from temperature and humidity (heat index-aware).
 * @param {number} temp     - Temperature in °C
 * @param {number} humidity - Relative humidity in %
 * @returns {{ risk: string, score: number, percentage: number, details: string }}
 */
function predictHeatwave(temp, humidity) {
  // Heat Index approximation (Steadman formula simplified)
  const heatIndex = temp + 0.33 * (humidity / 100 * 6.105 * Math.exp(17.27 * temp / (237.7 + temp))) - 4;

  const tempScore = Math.min(Math.max((temp - 28) / 22, 0), 1);       // danger starts at 28°C
  const humidityBoost = humidity > 60 ? (humidity - 60) / 80 * 0.2 : 0;
  const score = Math.min(tempScore + humidityBoost, 1);

  let risk, details;
  if (temp > 40) {
    risk = 'High';
    details = `Extreme temperature (${temp}°C) with heat index ~${Math.round(heatIndex)}°C. Dangerous for outdoor exposure.`;
  } else if (temp >= 35) {
    risk = 'Medium';
    details = `High temperature (${temp}°C). Heat stress likely, especially for vulnerable populations.`;
  } else {
    risk = 'Low';
    details = `Temperature (${temp}°C) is within normal range. Standard heat precautions advised.`;
  }

  return {
    risk,
    score: parseFloat(score.toFixed(3)),
    percentage: Math.round(score * 100),
    heatIndex: Math.round(heatIndex),
    details,
    inputs: { temp, humidity },
  };
}

/**
 * Predict air pollution risk based on AQI.
 * @param {number} aqi - Air Quality Index (US EPA scale)
 * @returns {{ risk: string, score: number, percentage: number, category: string, details: string }}
 */
function predictAirPollution(aqi) {
  const score = Math.min(aqi / 400, 1);

  let risk, category, details;
  if (aqi > 200) {
    risk = 'High';
    category = aqi > 300 ? 'Hazardous' : 'Very Unhealthy';
    details = `AQI ${aqi}: Serious health effects for all populations. Avoid outdoor activities.`;
  } else if (aqi >= 100) {
    risk = 'Medium';
    category = 'Unhealthy';
    details = `AQI ${aqi}: Sensitive groups should limit outdoor exposure.`;
  } else {
    risk = 'Low';
    category = aqi <= 50 ? 'Good' : 'Moderate';
    details = `AQI ${aqi}: Air quality is acceptable for most individuals.`;
  }

  return {
    risk,
    score: parseFloat(score.toFixed(3)),
    percentage: Math.round(score * 100),
    category,
    details,
    inputs: { aqi },
  };
}

/**
 * Derive a composite City Resilience Score (0–100) from risk levels.
 * Higher score = more resilient (lower overall risk).
 * @param {object} risks - { flood, heatwave, pollution } prediction results
 * @returns {{ score: number, grade: string, summary: string }}
 */
function computeResilienceScore(risks) {
  const weights = { flood: 0.35, heatwave: 0.35, pollution: 0.30 };
  const combinedRisk =
    risks.flood.score * weights.flood +
    risks.heatwave.score * weights.heatwave +
    risks.pollution.score * weights.pollution;

  const score = Math.round((1 - combinedRisk) * 100);

  let grade, summary;
  if (score >= 75) { grade = 'A'; summary = 'City is highly resilient with low climate stress.'; }
  else if (score >= 55) { grade = 'B'; summary = 'Moderate resilience — some climate risks present.'; }
  else if (score >= 35) { grade = 'C'; summary = 'Elevated climate risks — immediate action recommended.'; }
  else { grade = 'D'; summary = 'Critical climate vulnerability — emergency preparedness required.'; }

  return { score, grade, summary };
}

/**
 * Generate actionable recommendations based on active high risks.
 * @param {object} risks - { flood, heatwave, pollution }
 * @returns {string[]} List of recommendation strings
 */
function generateRecommendations(risks) {
  const recs = [];

  if (risks.flood.risk === 'High') {
    recs.push('🚨 Evacuate low-lying and flood-prone areas immediately.');
    recs.push('📦 Secure important documents and emergency supplies.');
    recs.push('🚗 Avoid driving through waterlogged roads.');
  } else if (risks.flood.risk === 'Medium') {
    recs.push('⚠️ Monitor water levels near rivers and drains.');
    recs.push('🏠 Clear household drainage to prevent waterlogging.');
  }

  if (risks.heatwave.risk === 'High') {
    recs.push('🌡️ Stay indoors between 11 AM – 4 PM. Risk of heat stroke is very high.');
    recs.push('💧 Drink at least 3–4 litres of water per day.');
    recs.push('🏥 Check on elderly neighbours and vulnerable individuals.');
  } else if (risks.heatwave.risk === 'Medium') {
    recs.push('☀️ Wear light, breathable clothing and use sunscreen.');
    recs.push('💧 Stay hydrated — carry water when going outdoors.');
  }

  if (risks.pollution.risk === 'High') {
    recs.push('😷 Wear N95/N99 masks when going outdoors.');
    recs.push('🏠 Keep windows closed and use air purifiers indoors.');
    recs.push('🚶 Avoid heavy outdoor exercise — limit physical exertion.');
  } else if (risks.pollution.risk === 'Medium') {
    recs.push('😷 Sensitive groups should wear masks outdoors.');
    recs.push('🌿 Avoid areas with heavy traffic and construction sites.');
  }

  if (recs.length === 0) {
    recs.push('✅ All climate indicators are within safe ranges.');
    recs.push('📊 Continue monitoring for any changes.');
  }

  return recs;
}

module.exports = {
  predictFlood,
  predictHeatwave,
  predictAirPollution,
  computeResilienceScore,
  generateRecommendations,
};
