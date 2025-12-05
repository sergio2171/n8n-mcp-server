import { z } from 'zod';
import { ensureNodeIds } from './utils.js';

const positionSchema = z.tuple([z.number(), z.number()]);

const nodeSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.string(),
  typeVersion: z.number().default(1),
  position: positionSchema,
  parameters: z.record(z.any()).default({}),
});

const connectionItemSchema = z.object({
  node: z.string(),
  type: z.string(),
  index: z.number().int().nonnegative(),
});

const connectionsSchema = z.record(
  z.string(),
  z.object({
    main: z.array(z.array(connectionItemSchema)).optional(),
  })
);

const workflowBaseSchema = z.object({
  name: z.string(),
  nodes: z.array(nodeSchema).default([]),
  connections: connectionsSchema.default({}),
  active: z.boolean().default(false),
  settings: z.record(z.any()).default({}),
});

export function validateWorkflowData(data) {
  const parsed = workflowBaseSchema.parse(data);
  return {
    ...parsed,
    nodes: ensureNodeIds(parsed.nodes),
  };
}

export function validatePartialWorkflow(data) {
  const partialSchema = workflowBaseSchema.partial();
  const parsed = partialSchema.parse(data);
  if (parsed.nodes) {
    parsed.nodes = ensureNodeIds(parsed.nodes);
  }
  return parsed;
}

export function validateWorkflowId(id) {
  return z.string().min(1, 'workflowId is required').parse(id);
}
