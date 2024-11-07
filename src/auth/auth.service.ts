import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma';
import { RegisterDto } from './dto/register.dto';
import { comparePasswords, hashPassword } from 'src/common/helpers/bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    const isUserExist = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (isUserExist) {
      throw new ConflictException('Email already exist');
    }

    const hashedPassword = await hashPassword(password);

    try {
      const user = await this.prismaService.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      return {
        data: user,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const isUserExist = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!isUserExist) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPaasswordFalid = await comparePasswords(
      password,
      isUserExist.password,
    );

    if (!isPaasswordFalid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      token: this.jwtService.sign({ email, id: isUserExist.id }),
    };
  }

  async getUser(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      data: user,
    };

    throw new InternalServerErrorException('Something went wrong');
  }
}
