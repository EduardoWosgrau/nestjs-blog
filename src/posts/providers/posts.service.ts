import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsService {
  constructor(
    // Injecting Users Service
    private readonly usersService: UsersService,

    // Injecting MetaOptions Repository
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,

    // Injecting MetaOptions Repository
    @InjectRepository(MetaOption)
    private metaOptionsRepository: Repository<MetaOption>,
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

  public async create(@Body() createPostDto: CreatePostDto) {
    // Creates meta options
    const metaOptions = createPostDto?.metaOptions
      ? this.metaOptionsRepository.create(createPostDto?.metaOptions)
      : null;
    if (metaOptions) {
      await this.metaOptionsRepository.save(metaOptions);
    }

    // Creates post
    const post = this.postsRepository.create(createPostDto);
    if (metaOptions) {
      post.metaOptions = metaOptions;
    }
    return await this.postsRepository.save(post);
  }
}
