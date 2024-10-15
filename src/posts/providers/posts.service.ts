import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';

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
        // tags: true,
        // author: true,
      },
    });
    return posts;
  }

  public async create(createPostDto: CreatePostDto) {
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

  public async update(patchPostDto: PatchPostDto) {
    // Find the Tags
    let tags = [];
    const countTags = patchPostDto.tags?.length ?? 0;
    if (countTags) {
      try {
        tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
      } catch {
        throw new RequestTimeoutException(
          'Unable to process your request at the moment, please try later',
          {
            description: 'Error connecting to the database',
          },
        );
      }
    }
    if (tags.length != countTags) {
      throw new BadRequestException('Some of the tags does not exist.');
    }

    // Find the Post
    let post = undefined;
    try {
      post = await this.postsRepository.findOneBy({
        id: patchPostDto.id,
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
    if (!post) {
      throw new BadRequestException('Post id does not exist.');
    }

    // Update the properties
    post.title = patchPostDto.title ?? post.title;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.status = patchPostDto.status ?? post.status;
    post.content = patchPostDto.content ?? post.content;
    post.schema = patchPostDto.schema ?? post.schema;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;

    // Assign the new tags
    post.tags = tags;

    // Save the post and return
    try {
      post = await this.postsRepository.save(post);
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
    return post;
  }
}
