import { PrismaService } from 'src/providers/prisma';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly prismaService;
    private jwtService;
    constructor(prismaService: PrismaService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        data: {
            name: string;
            id: string;
            email: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
    }>;
    getUser(id: string): Promise<{
        data: {
            name: string;
            id: string;
            email: string;
        };
    }>;
}
