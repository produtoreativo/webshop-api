import 'dotenv/config';
import tracer from 'dd-trace';

console.log('Initializing Datadog tracer...');
console.log('DD_ENV:', process.env.DD_ENV);
console.log('DD_VERSION:', process.env.DD_VERSION);

tracer.init({
  service: 'webshop-api',
  env: process.env.DD_ENV || 'development',
  version: process.env.DD_VERSION,
  logInjection: true,
  runtimeMetrics: true,
  plugins: true,
  tags: {
    team: 'pre',
    feature: 'group_buying',
  },
});
tracer.use('http');
tracer.use('express');

// export default tracer;

// Garantia mínima para setup interno do tracer (via plugins)
export async function readyTracer(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('✅ Datadog tracer estabilizado');
      resolve();
    }, 50); // pode ajustar para 20~100ms se necessário
  });
}
