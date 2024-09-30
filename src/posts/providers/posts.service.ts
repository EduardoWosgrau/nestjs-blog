import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    // Injecting Users Service
    private readonly usersService: UsersService,
  ) {}

  public findAll(userId: string) {
    const user = this.usersService.findOneById(userId);
    return [
      {
        user: user,
        title: 'test title',
        content: 'test content',
      },
      {
        user: user,
        title: 'test title 2',
        content: 'test content 2',
      },
    ];
  }

  public create(post: CreatePostDto) {
    console.log(post);
    return true;
  }
}
