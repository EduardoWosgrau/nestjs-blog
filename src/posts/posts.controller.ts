import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('/:userId?')
  public getPosts(@Param('userId') userId: string) {
    return this.postsService.findAll(userId);
  }

  @ApiOperation({
    summary: 'Creates a new blog post',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'You get a 201 response if your post is created successfully',
  })
  @ApiBody({ type: CreatePostDto })
  @Post()
  public createPost(@Body() CreatePostDto: CreatePostDto) {
    return this.postsService.create(CreatePostDto);
  }

  @ApiOperation({
    summary: 'Updates an existing blog post',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'You get a 200 response if your post is updated successfully',
  })
  @ApiBody({ type: PatchPostDto })
  @Patch()
  public updatePost(@Body() patchPostDto: PatchPostDto) {
    console.log(patchPostDto);
    return;
  }
}
