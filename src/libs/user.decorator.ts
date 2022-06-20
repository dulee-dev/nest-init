import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Token = createParamDecorator(
  (data, ctx: ExecutionContext): ParameterDecorator => {
    return ctx.switchToHttp().getRequest().user;
  },
);

export type TokenData = {
  userIdx: number;
  userId: string;
};
