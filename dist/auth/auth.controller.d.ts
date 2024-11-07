import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        data: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
    }>;
    validateToken(id: string): Promise<{
        data: {
            id: string;
            email: string;
            name: string;
        };
    }>;
}
