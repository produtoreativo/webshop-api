import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
import 'tsconfig-paths/register';
import fetch from 'node-fetch';
import { ChildProcess, spawn } from 'child_process';
// import * as path from 'path';
const swaggerPath = `${__dirname}/group-buying/openapi/swagger.json`;

console.log('*******************');
console.log(`Swagger JSON está disponível em ${swaggerPath}`);
console.log(`__dirname em ${__dirname}`);
console.log('*******************');

let prismProcess: ChildProcess;

async function waitPrism(port: number, timeout = 55000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await fetch(`http://localhost:${port}/health`);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  throw new Error(`Prism mock server não respondeu na porta ${port}`);
}

beforeAll(async () => {
  // inicia o Prism como mock server na porta 4010
  prismProcess = spawn(
    'npx',
    ['prism', 'mock', swaggerPath, '-p', '4010', '--errors'],
    { stdio: 'inherit', shell: true },
  );
  await waitPrism(4010);
}, 55000);

afterAll(async () => {
  if (prismProcess && !prismProcess.killed) {
    prismProcess.kill('SIGTERM');
    await new Promise((r) => setTimeout(r, 500));
  }
});
