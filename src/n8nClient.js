import axios from 'axios';
import { logger, formatError } from './utils.js';

function createClient() {
  const baseURL = process.env.N8N_API_URL || 'http://localhost:5678/api/v1/';
  const apiKey = process.env.N8N_API_KEY;

  if (!apiKey) {
    logger.warn('N8N_API_KEY is not set. Requests will fail until configured.');
  }

  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'X-N8N-API-KEY': apiKey,
    },
  });

  client.interceptors.request.use((config) => {
    logger.debug('HTTP Request', { method: config.method, url: config.url });
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      logger.error(formatError(error, 'HTTP Error'));
      return Promise.reject(error);
    }
  );

  return client;
}

export const n8nClient = createClient();
