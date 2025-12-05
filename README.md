# n8n-mcp-server

Local MCP server (stdio) that lets Claude Desktop manage your n8n workflows over HTTPS.

## Features
- Full CRUD for n8n workflows (list, get, create, update/merge, delete, activate/deactivate)
- Zod-based validation with automatic node ID generation
- Winston logging with adjustable log level
- Environment-based configuration via `.env`

## Prerequisites
- Node.js 18+ and npm
- Access to your n8n instance and API key
- Claude Desktop installed

## Setup
1. Clone this repository.
2. Create a `.env` file (or export env vars) using `.env.example` as a template:
```bash
cp .env.example .env
# edit N8N_API_URL and N8N_API_KEY
```
3. Install dependencies:
```bash
npm install
```
4. Start the MCP server:
```bash
npm start
```

The server listens on stdio for MCP clients such as Claude Desktop.

## Claude Desktop configuration
Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "n8n-mcp-server": {
      "command": "npm",
      "args": ["start"],
      "cwd": "/absolute/path/to/n8n-mcp-server"
    }
  }
}
```

## Available operations
- **list_workflows()** – returns `id, name, active, createdAt, updatedAt` for all workflows.
- **get_workflow(workflowId)** – returns full workflow JSON.
- **create_workflow(workflowData)** – creates a workflow; node IDs are generated when missing.
- **update_workflow(workflowId, workflowData)** – merges partial data with the existing workflow, validates, then patches.
- **delete_workflow(workflowId)** – removes the workflow.
- **activate_workflow(workflowId, active)** – toggles activation status.

## Usage examples
```js
// Create a simple workflow
await tools.create_workflow({
  name: 'Test Workflow',
  nodes: [
    {
      name: 'Start',
      type: 'n8n-nodes-base.manualTrigger',
      typeVersion: 1,
      position: [250, 300],
      parameters: {}
    }
  ],
  connections: {},
  active: false
});

// Update part of a workflow
await tools.update_workflow('workflow-id', {
  name: 'Updated Name',
  active: true
});
```

## Error handling
- HTTP errors are surfaced with status code and server message.
- Validation errors explain which field is invalid.
- Logging is enabled for all requests; set `LOG_LEVEL=debug` for verbose output.

## Troubleshooting
- **401 Unauthorized**: confirm `N8N_API_KEY` is correct.
- **HTTPS certificate issues**: ensure your system trusts the n8n certificate.
- **No response**: verify `N8N_API_URL` ends with `/api/v1/` and the instance is reachable from the host running the MCP server.
