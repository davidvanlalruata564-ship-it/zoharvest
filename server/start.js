import { spawn } from 'child_process';
import './index.js'; // Starts Express backend on port 5000

console.log('[ZOHARVEST] Starting Vite Frontend...');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

const viteProcess = spawn(npmCmd, ['run', 'dev:client'], {
  stdio: 'inherit',
  shell: true
});

viteProcess.on('close', (code) => {
  console.log(`[ZOHARVEST] Vite process exited with code ${code}`);
  process.exit(code);
});

process.on('SIGINT', () => {
  viteProcess.kill('SIGINT');
  process.exit();
});
