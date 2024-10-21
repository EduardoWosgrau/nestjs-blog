import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(
    // Injecting Auth Service
    private readonly authService: AuthService,
  ) {}

  @Post('sign-in')
  public async signIn(@Body() signInDto: SignInDto) {
    console.log(signInDto);
  }
}
