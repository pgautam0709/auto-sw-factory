/**
 * Azure OpenAI connection test
 * Run: node --env-file=.env.local test-azure.mjs
 */

import { AzureOpenAI } from 'openai';

const REQUIRED = ['AZURE_OPENAI_API_KEY', 'AZURE_OPENAI_ENDPOINT'];
const missing = REQUIRED.filter(k => !process.env[k]);

if (missing.length) {
  console.error('\n❌  Missing required env vars:', missing.join(', '));
  console.error('   Make sure .env.local contains these values.\n');
  process.exit(1);
}

const apiKey     = process.env.AZURE_OPENAI_API_KEY;
const endpoint   = process.env.AZURE_OPENAI_ENDPOINT;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT ?? 'gpt-4o';
const apiVersion = process.env.AZURE_OPENAI_API_VERSION ?? '2024-02-01';

console.log('\n🔧  Azure OpenAI Configuration');
console.log('   Endpoint  :', endpoint);
console.log('   Deployment:', deployment);
console.log('   API Ver   :', apiVersion);
console.log('   API Key   :', `${apiKey.slice(0, 6)}${'*'.repeat(Math.max(0, apiKey.length - 10))}${apiKey.slice(-4)}`);
console.log('\n⏳  Sending test request...\n');

const client = new AzureOpenAI({ apiKey, endpoint, deployment, apiVersion });

try {
  const start = Date.now();
  const response = await client.chat.completions.create({
    model: deployment,
    messages: [
      {
        role: 'user',
        content: 'Reply with exactly this JSON and nothing else: {"status":"ok","message":"Azure OpenAI connection successful"}',
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0,
    max_tokens: 60,
  });

  const elapsed = Date.now() - start;
  const content = response.choices[0]?.message?.content ?? '';

  console.log('✅  Connection successful!');
  console.log('   Latency  :', `${elapsed}ms`);
  console.log('   Model    :', response.model);
  console.log('   Tokens   :', `${response.usage?.prompt_tokens} prompt + ${response.usage?.completion_tokens} completion`);
  console.log('   Response :', content);
  console.log();
} catch (err) {
  console.error('❌  Connection failed!\n');

  const status = err?.status;
  const message = err?.message ?? String(err);
  const code = err?.code ?? err?.error?.code;

  console.error('   Status  :', status ?? 'unknown');
  console.error('   Message :', message);
  if (code) console.error('   Code    :', code);

  console.error('\n💡  Common fixes:');
  if (status === 401) {
    console.error('   → Check AZURE_OPENAI_API_KEY — key may be invalid or expired');
  } else if (status === 404) {
    console.error('   → Check AZURE_OPENAI_DEPLOYMENT — deployment name not found in this resource');
    console.error('   → Check AZURE_OPENAI_ENDPOINT — resource URL may be wrong');
  } else if (status === 400) {
    console.error('   → Check AZURE_OPENAI_API_VERSION — try 2025-01-01-preview or 2024-08-01-preview');
  } else if (!status) {
    console.error('   → Check AZURE_OPENAI_ENDPOINT — should be https://<name>.openai.azure.com (no trailing slash)');
  }
  console.log();
  process.exit(1);
}
