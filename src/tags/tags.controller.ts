import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { CreateTagDto } from './dtos/create-tag.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TagsService } from './providers/tags.service';

@Controller('tags')
@ApiTags('Tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiOperation({
    summary: 'Creates a new tag',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'You get a 201 response if your tag is created successfully',
  })
  @ApiBody({
    type: CreateTagDto,
  })
  @Post()
  public create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }
}
