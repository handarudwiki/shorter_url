"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
exports.Token = (0, common_1.createParamDecorator)(async (data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const authorizationHeader = request.headers?.authorization;
    if (!authorizationHeader) {
        throw new common_1.UnauthorizedException('Authorization header is missing');
    }
    const [type, token] = authorizationHeader.split(' ');
    if (type !== 'Bearer' || !token) {
        throw new common_1.UnauthorizedException('Invalid token format');
    }
    const jwtService = new jwt_1.JwtService();
    try {
        const decoded = jwtService.decode(token);
        return data ? decoded?.[data] : decoded;
    }
    catch (error) {
        throw new common_1.UnauthorizedException('Invalid token');
    }
});
//# sourceMappingURL=token.decorator.js.map