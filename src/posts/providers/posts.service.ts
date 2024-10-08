import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/providers/tags.service';

@Injectable()
export class PostsService {
  constructor(
    // Injecting Users Service
    private readonly usersService: UsersService,

    // Injecting Tags Service
    private readonly tagsService: TagsService,

    // Injecting MetaOptions Repository
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  public async findAll(userId: number) {
    const user = this.usersService.findOneById(userId);
    console.log(user);
    const posts = await this.postsRepository.find({
      relations: {
        metaOptions: true,
        author: true,
      },
    });
    return posts;
  }

  public async create(@Body() createPostDto: CreatePostDto) {
    const author = await this.usersService.findOneById(createPostDto?.authorId);
    const tags = await this.tagsService.findMultipleTags(createPostDto.tags);
    const post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags,
    });
    return await this.postsRepository.save(post);
  }

  public async delete(id: number) {
    await this.postsRepository.delete(id);
    return { deleted: true, id };
  }
}
