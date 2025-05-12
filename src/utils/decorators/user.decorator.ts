import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const REQUEST_USER_KEY = 'user';
export const ReqUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request[REQUEST_USER_KEY];
  },
);
