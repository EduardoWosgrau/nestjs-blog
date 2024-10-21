import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindUserByEmailProvider {
  constructor(
    // Inject users repository
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async findUserByEmail(email: string) {
    let user: User | undefined = undefined;
    try {
      user = await this.usersRepository.findOneBy({ email });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not fetch the user by email',
      });
    }
    if (!user) {
      throw new RequestTimeoutException('Could not fetch the user by email');
    }
    return user;
  }
}
