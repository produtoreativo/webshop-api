import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

// import { ChildProcess, spawn } from 'child_process';

// let prismProcess: ChildProcess;

// beforeAll(async () => {
//   // inicia o Prism como mock server na porta 4010
//   prismProcess = spawn(
//     'npx',
//     ['prism', 'mock', './openapi/order-mgmt-api.yaml', '-p', '4010'],
//     { stdio: 'inherit', shell: true }
//   );

//   // define a URL base do mock em variável de ambiente
//   process.env.ORDER_MGMT_API_URL = 'http://localhost:4010';

//   // espera alguns segundos para o Prism subir
//   await new Promise((resolve) => setTimeout(resolve, 2000));
// });

// afterAll(async () => {
//   if (prismProcess) {
//     prismProcess.kill();
//   }
// });
