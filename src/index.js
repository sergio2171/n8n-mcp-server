import 'dotenv/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { operations } from './operations.js';
import { logger } from './utils.js';

function buildContent(result) {
  return [{ type: 'text', text: JSON.stringify(result, null, 2) }];
}

async function main() {
  const server = new McpServer({ name: 'n8n-mcp-server', version: '1.0.0' });

  server.tool('list_workflows', {
    description: 'List all workflows with basic metadata',
    inputSchema: { type: 'object', properties: {} },
    handler: async () => {
      const data = await operations.list_workflows();
      return { content: buildContent(data) };
    },
  });

  server.tool('get_workflow', {
    description: 'Retrieve a workflow by ID',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: { type: 'string' },
      },
      required: ['workflowId'],
    },
    handler: async ({ workflowId }) => {
      const data = await operations.get_workflow(workflowId);
      return { content: buildContent(data) };
    },
  });

  server.tool('create_workflow', {
    description: 'Create a new workflow',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        nodes: { type: 'array', items: { type: 'object' } },
        connections: { type: 'object' },
        settings: { type: 'object' },
        active: { type: 'boolean' },
      },
      required: ['name'],
    },
    handler: async (workflow) => {
      const data = await operations.create_workflow(workflow);
      return { content: buildContent(data) };
    },
  });

  server.tool('update_workflow', {
    description: 'Update or merge an existing workflow',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: { type: 'string' },
        workflowData: { type: 'object' },
      },
      required: ['workflowId', 'workflowData'],
    },
    handler: async ({ workflowId, workflowData }) => {
      const data = await operations.update_workflow(workflowId, workflowData);
      return { content: buildContent(data) };
    },
  });

  server.tool('delete_workflow', {
    description: 'Delete a workflow by ID',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: { type: 'string' },
      },
      required: ['workflowId'],
    },
    handler: async ({ workflowId }) => {
      const data = await operations.delete_workflow(workflowId);
      return { content: buildContent(data) };
    },
  });

  server.tool('activate_workflow', {
    description: 'Activate or deactivate a workflow',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: { type: 'string' },
        active: { type: 'boolean' },
      },
      required: ['workflowId', 'active'],
    },
    handler: async ({ workflowId, active }) => {
      const data = await operations.activate_workflow(workflowId, active);
      return { content: buildContent(data) };
    },
  });

  server.onerror = (error) => {
    logger.error(`MCP server error: ${error.message}`);
  };

  const transport = new StdioServerTransport();
  logger.info('Starting MCP server over stdio...');
  await server.connect(transport);
}

main().catch((error) => {
  logger.error(error.message, { stack: error.stack });
  process.exit(1);
});
