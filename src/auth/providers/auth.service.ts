import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    // Injecting Users Service
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public signIn(signInDto: SignInDto) {
    // Find the user using email ID
    console.log(signInDto);
  }

  public isAuth() {
    return true;
  }
}
