#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

// Forwarder: when Render runs `node src/server.js` at repo root, this file
// spawns the actual backend server at backend/src/server.js.

const backendEntry = path.join(__dirname, '..', 'backend', 'src', 'server.js');

console.log('Starting backend server:', backendEntry);

const child = spawn(process.execPath, [backendEntry], { stdio: 'inherit' });

function forwardSignal(sig) {
  try { child.kill(sig); } catch (e) { /* ignore */ }
}

process.on('SIGINT', () => forwardSignal('SIGINT'));
process.on('SIGTERM', () => forwardSignal('SIGTERM'));

child.on('close', (code, signal) => {
  if (signal) {
    console.log('Backend process terminated with signal', signal);
    process.exit(1);
  }
  console.log('Backend process exited with code', code);
  process.exit(code);
});
