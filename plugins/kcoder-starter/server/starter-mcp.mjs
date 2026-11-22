#!/usr/bin/env node
// Minimal stdio MCP server for the kcoder-starter reference plugin.
// Messages are newline-delimited JSON-RPC 2.0. No dependencies, no network,
// no filesystem writes: every tool is read-only.
import { readFileSync } from 'node:fs';
import { createInterface } from 'node:readline';

const manifest = JSON.parse(readFileSync(new URL('../plugin.json', import.meta.url), 'utf8'));
const SUPPORTED_PROTOCOL_VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05'];
const MAX_ECHO_CHARS = 4096;

const tools = [
  {
    name: 'starter_echo',
    description: 'Return the given text unchanged. Use it to confirm the MCP connection works.',
    inputSchema: {
      type: 'object',
      properties: { text: { type: 'string', description: `Text to echo, at most ${MAX_ECHO_CHARS} characters.` } },
      required: ['text'],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: 'starter_plugin_info',
    description: 'Return the name and version of the kcoder-starter plugin.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
];

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function result(id, value) {
  send({ jsonrpc: '2.0', id, result: value });
}

function error(id, code, message) {
  send({ jsonrpc: '2.0', id, error: { code, message } });
}

function text(value, isError = false) {
  return { content: [{ type: 'text', text: value }], isError };
}

function callTool(params) {
  const args = params?.arguments ?? {};
  switch (params?.name) {
    case 'starter_echo':
      if (typeof args.text !== 'string') return text('`text` must be a string.', true);
      if (args.text.length > MAX_ECHO_CHARS) return text(`\`text\` exceeds ${MAX_ECHO_CHARS} characters.`, true);
      return text(args.text);
    case 'starter_plugin_info':
      return text(JSON.stringify({ name: manifest.name, version: manifest.version }));
    default:
      return null;
  }
}

function handle(message) {
  const { id, method, params } = message;
  const isRequest = id !== undefined && id !== null;
  switch (method) {
    case 'initialize': {
      const requested = params?.protocolVersion;
      const protocolVersion = SUPPORTED_PROTOCOL_VERSIONS.includes(requested) ? requested : SUPPORTED_PROTOCOL_VERSIONS[0];
      return result(id, {
        protocolVersion,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'kcoder-starter', version: manifest.version },
      });
    }
    case 'ping':
      return result(id, {});
    case 'tools/list':
      return result(id, { tools });
    case 'tools/call': {
      const outcome = callTool(params);
      if (!outcome) return error(id, -32602, `Unknown tool: ${params?.name}`);
      return result(id, outcome);
    }
    default:
      // Notifications (no id) such as notifications/initialized need no reply.
      if (isRequest) error(id, -32601, `Method not found: ${method}`);
  }
}

const lines = createInterface({ input: process.stdin, crlfDelay: Infinity });
lines.on('line', line => {
  if (!line.trim()) return;
  let message;
  try {
    message = JSON.parse(line);
  } catch {
    return error(null, -32700, 'Parse error');
  }
  if (!message || typeof message !== 'object' || message.jsonrpc !== '2.0') {
    return error(message?.id ?? null, -32600, 'Invalid request');
  }
  handle(message);
});
lines.on('close', () => process.exit(0));
