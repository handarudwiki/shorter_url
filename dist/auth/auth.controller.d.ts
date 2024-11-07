import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        data: {
            email: string;
            name: string;
            id: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
    }>;
    validateToken(id: string): Promise<{
        data: {
            email: string;
            name: string;
            id: string;
        };
    }>;
}
