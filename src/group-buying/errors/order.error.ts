// order-error.ts
import { HttpException } from '@nestjs/common';

export class OrderError extends HttpException {
  title: string;
  detail?: string;
  instance?: string;

  constructor({
    status,
    title,
    detail,
    instance,
  }: {
    status: number;
    title: string;
    detail?: string;
    instance?: string;
  }) {
    // status é passado para HttpException, não precisa declarar na classe
    super({ title, detail, instance }, status);
    this.title = title;
    this.detail = detail;
    this.instance = instance;
  }
}
