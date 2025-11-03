// src/mastra/mastra.config.ts
import { defineConfig } from '@mastra/core';
import { connectAIAgent } from '../connect-ai-agent.js';

export default defineConfig({
  agents: {
    connectAIAgent,
  },
  // You can also add tools/workflows/scorers here later if needed
});
