import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserToken = createParamDecorator(
  (data: string, ctx: ExecutionContext): { id: number; email: string } => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers.authorization;
    return token;
  },
);
