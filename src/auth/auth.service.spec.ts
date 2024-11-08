import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { hashPassword, comparePasswords } from 'src/common/helpers/bcrypt';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma';
import { LoginDto } from './dto/login.dto';

jest.mock('src/common/helpers/bcrypt', () => {
  return {
    hashPassword: jest.fn(),
    comparePasswords: jest.fn(),
  };
});

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@gmail.com',
      password: 'password',
      name: 'test',
    };
    it('should register a new user', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
      (hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
      (prismaService.user.create as jest.Mock).mockResolvedValue({
        id: 'user-id',
        email: registerDto.email,
        name: registerDto.name,
      });

      const result = await authService.register(registerDto);

      expect(result).toEqual({
        data: {
          id: 'user-id',
          email: 'test@gmail.com',
          name: 'test',
        },
      });
    });

    it('should throw an error if email already exist', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(true);

      await expect(authService.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@gmail.com',
      password: 'password',
    };
    it('should return a JWT token for valid credentials', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue({
        email: loginDto.email,
        password: 'hashedPassword',
      });
      (jwtService.sign as jest.Mock).mockReturnValue('test-token');

      (comparePasswords as jest.Mock).mockResolvedValue(true);

      const result = await authService.login(loginDto);

      expect(result).toEqual({
        token: 'test-token',
      });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue({
        email: loginDto.email,
        password: 'hashedPassword',
      });
      (comparePasswords as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getUser', () => {
    it('should return user data', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-id',
        email: 'test@gmail.com',
        name: 'test',
      });

      const result = await authService.getUser('user-id');
      expect(result).toEqual({
        data: {
          id: 'user-id',
          email: 'test@gmail.com',
          name: 'test',
        },
      });
    });

    it('should throw an error if user not found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(authService.getUser('user-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
