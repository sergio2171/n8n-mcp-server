# Setup Guide for Local MCP Server (n8n Integration)

This guide explains how to install, configure, and run the local MCP server that allows Claude Desktop to manage n8n workflows.

---

## 1. Requirements
- Node.js 18+
- npm
- n8n instance with API Key
- Claude Desktop installed (with MCP support)

---

## 2. Installation

1. Download the repository:
   - Code → Download ZIP
   - Extract to any folder

2. Install dependencies:

```bash
npm install
```

---

## 3. Configuration

Create `.env` file in the project root:

```
N8N_API_URL=https://vkusradosti2171.ru/api/v1/
N8N_API_KEY=YOUR_API_KEY_HERE
LOG_LEVEL=info
```

Do NOT commit `.env`.

---

## 4. Starting the MCP Server

```bash
npm start
```

If successful, the server will start and wait for MCP requests via STDIO.

---

## 5. Claude Desktop Configuration

Open:
Settings → Developer → Local MCP servers → Edit config

Add:

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npm",
      "args": ["start"],
      "cwd": "/path/to/n8n-mcp-server"
    }
  }
}
```

Restart Claude Desktop and the server will appear in the tools list.

---

## 6. First Tests

Ask Claude:

- `list_workflows()`
- `get_workflow(1)`
- `create_workflow({...})`

If Claude returns real data — the MCP server works.

---

## 7. Troubleshooting

- Invalid API Key → Check `.env`
- Cannot connect → Check Claude config path
- No workflows returned → Verify API URL
- Server crashes → Check console logs

---

## 8. Roadmap

- Add partial workflow updates
- Add smart node operations
- Add backup system before modifications
- Add schema validation
- Add PM2/systemd startup

---
