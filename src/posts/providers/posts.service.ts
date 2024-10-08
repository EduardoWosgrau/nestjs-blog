import { Body, Injectable } from '@nestjs/common';
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

  public async update(patchPostDto: PatchPostDto) {
    // Find the Tags
    const tags = await this.tagsService.findMultipleTags(patchPostDto.tags);

    // Find the Post
    const post = await this.postsRepository.findOneBy({
      id: patchPostDto.id,
    });

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
    return await this.postsRepository.save(post);
  }
}
