import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    // Injecting Users Service
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public login(email: string, password: string, id: number) {
    console.log(email, password, id);
    const user = this.usersService.findOneById(id);
    console.log(user);
    return 'SAMPLE_TOKEN';
  }

  public isAuth() {
    return true;
  }
}
