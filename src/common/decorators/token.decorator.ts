import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
export const Token = createParamDecorator(
  async (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authorizationHeader = request.headers?.authorization;

    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [type, token] = authorizationHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }

    const jwtService = new JwtService();

    try {
      const decoded = jwtService.decode(token);
      return data ? decoded?.[data] : decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  },
);
