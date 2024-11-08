import { Strategy } from 'passport-jwt';
import { PrismaService } from 'src/providers/prisma';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    validate(payload: {
        email: string;
    }): Promise<{
        id: string;
        email: string;
    }>;
}
export {};
