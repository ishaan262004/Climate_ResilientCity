/**
 * climateRiskApi.js
 * Service layer for /api/climate-risk + /api/story + /api/chat endpoints.
 */
import api from './api';

/** Fetch full climate risk prediction for a city */
export const fetchClimateRisk = (city = 'Delhi') =>
  api.get(`/climate-risk?city=${encodeURIComponent(city)}`).then(r => r.data);

/** Store a manual alert in the backend */
export const sendClimateAlert = (payload) =>
  api.post('/climate-risk/alert', payload).then(r => r.data);

/** Retrieve stored alerts */
export const fetchClimateAlerts = (limit = 20) =>
  api.get(`/climate-risk/alerts?limit=${limit}`).then(r => r.data);

/** Fetch Gemini-generated climate story for a city */
export const fetchClimateStory = (city = 'Delhi') =>
  api.get(`/story?city=${encodeURIComponent(city)}`).then(r => r.data);

/** Send a message to the Gemini chatbot */
export const sendChatMessage = (message, city = 'Delhi', sessionId = null) =>
  api.post('/chat', { message, city, sessionId }).then(r => r.data);

/** Clear chatbot session */
export const clearChatSession = (sessionId) =>
  api.post('/chat/clear', { sessionId }).then(r => r.data);
