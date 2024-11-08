"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("./auth.service");
const prisma_1 = require("./src/providers/prisma");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const bcrypt_1 = require("./src/common/helpers/bcrypt");
jest.mock('src/common/helpers/bcrypt');
describe('AuthService', () => {
    let authService;
    let prismaService;
    let jwtService;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                {
                    provide: prisma_1.PrismaService,
                    useValue: {
                        user: {
                            findUnique: jest.fn(),
                            create: jest.fn(),
                        },
                    },
                },
                {
                    provide: jwt_1.JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue('test-token'),
                    },
                },
            ],
        }).compile();
        authService = module.get(auth_service_1.AuthService);
        prismaService = module.get(prisma_1.PrismaService);
        jwtService = module.get(jwt_1.JwtService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('register', () => {
        it('should register a new user', async () => {
            const registerDto = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
            };
            prismaService.user.findUnique.mockResolvedValue(null);
            bcrypt_1.hashPassword.mockResolvedValue('hashed-password');
            prismaService.user.create.mockResolvedValue({
                id: 'user-id',
                email: registerDto.email,
                name: registerDto.name,
            });
            const result = await authService.register(registerDto);
            expect(result).toEqual({
                data: {
                    id: 'user-id',
                    email: 'test@example.com',
                    name: 'Test User',
                },
            });
        });
        it('should throw ConflictException if user already exists', async () => {
            const registerDto = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
            };
            prismaService.user.findUnique.mockResolvedValue(true);
            await expect(authService.register(registerDto)).rejects.toThrow(common_1.ConflictException);
        });
    });
    describe('login', () => {
        it('should return a JWT token for valid credentials', async () => {
            const loginDto = {
                email: 'test@example.com',
                password: 'password123',
            };
            prismaService.user.findUnique.mockResolvedValue({
                id: 'user-id',
                email: loginDto.email,
                password: 'hashed-password',
            });
            bcrypt_1.comparePasswords.mockResolvedValue(true);
            const result = await authService.login(loginDto);
            expect(result).toEqual({ token: 'test-token' });
        });
        it('should throw UnauthorizedException for invalid credentials', async () => {
            const loginDto = {
                email: 'test@example.com',
                password: 'wrong-password',
            };
            prismaService.user.findUnique.mockResolvedValue({
                id: 'user-id',
                email: loginDto.email,
                password: 'hashed-password',
            });
            bcrypt_1.comparePasswords.mockResolvedValue(false);
            await expect(authService.login(loginDto)).rejects.toThrow(common_1.UnauthorizedException);
        });
    });
    describe('getUser', () => {
        it('should return user data if user exists', async () => {
            prismaService.user.findUnique.mockResolvedValue({
                id: 'user-id',
                email: 'test@example.com',
                name: 'Test User',
            });
            const result = await authService.getUser('user-id');
            expect(result).toEqual({
                data: {
                    id: 'user-id',
                    email: 'test@example.com',
                    name: 'Test User',
                },
            });
        });
        it('should throw NotFoundException if user does not exist', async () => {
            prismaService.user.findUnique.mockResolvedValue(null);
            await expect(authService.getUser('non-existent-id')).rejects.toThrow(common_1.NotFoundException);
        });
    });
});
//# sourceMappingURL=hanyacob.js.map