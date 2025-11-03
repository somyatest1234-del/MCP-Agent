import { connectAIAgent } from './connect-ai-agent.js';

const input = process.argv.slice(2).join(' ') || 'List available data sources.';

try {
  // Pass the string directly — this matches your original approach
  const result = await connectAIAgent.generate(input);

  console.log('\n=== Agent Response ===\n');
  console.log(result);
} catch (error) {
  console.error('\n❌ Error executing agent:\n', error);
}
