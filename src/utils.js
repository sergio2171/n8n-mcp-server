import { v4 as uuidv4 } from 'uuid';
import winston from 'winston';

const level = process.env.LOG_LEVEL || 'info';

export const logger = winston.createLogger({
  level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level: lvl, message, stack, ...meta }) => {
      const base = `${timestamp} [${lvl}] ${message}`;
      const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
      return stack ? `${base} - ${stack}${metaString}` : `${base}${metaString}`;
    })
  ),
  transports: [new winston.transports.Console({ stderrLevels: ['error'] })],
});

export function generateNodeId(prefix = 'node') {
  return `${prefix}-${uuidv4()}`;
}

export function ensureNodeIds(nodes = []) {
  return nodes.map((node, index) => ({
    id: node.id || generateNodeId(`node-${index + 1}`),
    ...node,
  }));
}

export function mergeWorkflows(existing, updates) {
  if (!updates) return existing;
  const mergedNodes = updates.nodes
    ? ensureNodeIds(updates.nodes)
    : existing.nodes;

  return {
    ...existing,
    ...updates,
    nodes: mergedNodes,
    connections: updates.connections !== undefined ? updates.connections : existing.connections,
    settings: updates.settings !== undefined ? updates.settings : existing.settings,
  };
}

export function formatError(error, context = 'Operation failed') {
  if (error.response) {
    const { status, statusText, data } = error.response;
    return `${context}: HTTP ${status} ${statusText} - ${JSON.stringify(data)}`;
  }
  if (error.request) {
    return `${context}: No response received from server`;
  }
  return `${context}: ${error.message}`;
}
