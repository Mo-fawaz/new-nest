import { Controller, Post, Body, Req, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt/jwt.guard';
import { GetUser } from './decorator/decorator.decorator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Req() req: any, @Body() dto: LoginDto) {
    return this.authService.login(req, dto);
  }

  @Post('register')
  register(@Req() req: any, @Body() dto: RegisterDto) {
    return this.authService.register(req, dto);
  }

  @Get('profile')
  @UseGuards(JwtGuard)
  profile(@GetUser() user: any) {
    return {
      user,
    };
  }
}
