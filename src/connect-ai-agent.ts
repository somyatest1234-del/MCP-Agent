// src/connect-ai-agent.ts
import 'dotenv/config';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { MCPClient } from '@mastra/mcp';

// ----- Auth for CData Connect AI (PAT or Basic) -----
const headers: Record<string, string> = {};
if (process.env.CDATA_CONNECT_AI_PAT) {
  headers.Authorization = `Bearer ${process.env.CDATA_CONNECT_AI_PAT}`;
} else if (process.env.CDATA_CONNECT_AI_USER && process.env.CDATA_CONNECT_AI_PASSWORD) {
  headers.Authorization = `Basic ${Buffer.from(
    `${process.env.CDATA_CONNECT_AI_USER}:${process.env.CDATA_CONNECT_AI_PASSWORD}`
  ).toString('base64')}`;
} else {
  console.error('\n❌ Missing CData creds: set CDATA_CONNECT_AI_PAT or CDATA_CONNECT_AI_USER/CDATA_CONNECT_AI_PASSWORD\n');
  process.exit(1);
}

// ----- MCP client for CData Connect AI -----
const mcpClient = new MCPClient({
  servers: {
    cdataConnectAI: {
      url: new URL('https://mcp.cloud.cdata.com/mcp/'),
      requestInit: { headers },
    },
  },
});
const tools = await mcpClient.getTools();

// ----- The Agent -----
export const connectAIAgent = new Agent({
  name: 'Connect AI Agent',
  instructions: `
    You are a data exploration and analysis assistant with access to CData Connect AI.
    - Discover available data sources and schemas
    - Help query/analyze connected sources
    - Explain relationships clearly
    - Suggest relevant queries/approaches
    Use the provided MCP tools to interact with data sources.
  `,
  model: 'openai/gpt-4o-mini',
  tools,
  memory: new Memory({
    storage: new LibSQLStore({ url: 'file:../mastra.db' }),
  }),
});

console.log('✅ Connect AI Agent initialized successfully');
