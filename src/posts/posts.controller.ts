import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  HttpStatus,
  Patch,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';
import { GetPostsDto } from './dtos/get-posts.dto';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * Get all post of user
   * @param userId Id of the user
   * @returns Posts of the user
   */
  @ApiOperation({
    summary: 'Fetches a list of user blog posts',
  })
  @Get('/:userId?')
  public getPosts(
    @Param('userId') userId: string,
    @Query() postQuery: GetPostsDto,
  ) {
    console.log(postQuery);
    return this.postsService.findAll(userId);
  }

  /**
   * Creates a new blog post
   * @param CreatePostDto post object
   * @returns post created
   */
  @ApiOperation({
    summary: 'Creates a new blog post',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'You get a 201 response if your post is created successfully',
  })
  @ApiBody({ type: CreatePostDto })
  @Post()
  public createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  /**
   * Updates an existing blog post
   * @param patchPostDto post object
   * @returns post updated
   */
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
    return this.postsService.update(patchPostDto);
  }

  /**
   * Deletes a blog post by id
   * @param id Id of the blog post
   * @returns return status delete object
   */
  @ApiOperation({
    summary: 'Deletes a blog post by id',
  })
  @Delete()
  public deletePost(@Query('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }
}
