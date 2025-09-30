import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AccessJwt } from '../types/jwt-payloads';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AccessJwt | null => {
    if (ctx.getType<'http'>() === 'http') {
      const request = ctx.switchToHttp().getRequest();
      return (request.user as AccessJwt) ?? null;
    }

    if (ctx.getType<'graphql'>() === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(ctx);
      return (gqlCtx.getContext().req?.user as AccessJwt) ?? null;
    }

    return null;
  }
);
