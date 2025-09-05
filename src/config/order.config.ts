// src/config/order.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('order', () => ({
  apiUrl: process.env.ORDER_MGMT_API_URL || 'http://localhost:4010/order/group',
}));
