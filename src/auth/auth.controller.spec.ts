import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            getUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register', async () => {
      const registerDto: RegisterDto = {
        email: 'test@gmail.com',
        password: 'password',
        name: 'test',
      };

      const expectedResult = {
        data: {
          id: 'user-id',
          email: registerDto.email,
          name: registerDto.name,
        },
      };

      (authService.register as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.register(registerDto);
      expect(result).toEqual(expectedResult);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  it('should call authService.login', async () => {
    const loginDto: LoginDto = {
      email: 'test@gmail.com',
      password: 'password',
    };

    const token = { token: 'test-token' };
    (authService.login as jest.Mock).mockResolvedValue(token);

    const result = await controller.login(loginDto);
    expect(result).toEqual(token);
    expect(authService.login).toHaveBeenCalledWith(loginDto);
  });

  it('should call authService.getUser', async () => {
    const userId = 'user-id';
    const expectedResult = {
      data: {
        id: userId,
        email: 'test@gmail.com',
        name: 'test',
      },
    };

    (authService.getUser as jest.Mock).mockResolvedValue(expectedResult);

    const result = await controller.validateToken(userId);
    expect(result).toEqual(expectedResult);
    expect(authService.getUser).toHaveBeenCalledWith(userId);
  });
});
