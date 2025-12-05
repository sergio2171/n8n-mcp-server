# Claude Desktop Configuration

Add the following MCP server entry to your `claude_desktop_config.json` to enable workflow management via this server:

```json
{
  "mcpServers": {
    "n8n-mcp-server": {
      "command": "npm",
      "args": ["start"],
      "cwd": "/path/to/n8n-mcp-server"
    }
  }
}
```

> Replace `/path/to/n8n-mcp-server` with the absolute path to this repository on your machine. Ensure you run `npm install` beforehand to install dependencies.
