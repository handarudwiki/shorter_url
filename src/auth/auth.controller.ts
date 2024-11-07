import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { ResponseMessage } from 'src/common/decorators/responseMessage.decorator';
import { Token } from 'src/common/decorators/token.decorator';
import { LoginDto } from './dto/login.dto';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Token Valid')
  async validateToken(@Token('id') id: string) {
    return this.authService.getUser(id);
  }
}