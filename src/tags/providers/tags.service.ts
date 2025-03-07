import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagDto } from 'src/tags/dtos/create-tag.dto';
import { Tag } from 'src/tags/tag.entity';
import { In, Repository } from 'typeorm';

/**
 * Class to connect to Tags table and perform business operations
 */
@Injectable()
export class TagsService {
  /**
   * Constructor for users service
   * @param usersRepository authentication service
   */
  constructor(
    // Inject Tags Repository
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  /**
   * Creates a new tag in the database
   * @param createTagDto Tag data tranfer object
   */
  public async create(createTagDto: CreateTagDto) {
    const tag = this.tagsRepository.create(createTagDto);
    return await this.tagsRepository.save(tag);
  }

  /**
   * Gets multiple tags by ID
   * @param tagsIds Array of IDs of tags
   */
  public async findMultipleTags(tagsIds: number[]) {
    const tags = await this.tagsRepository.find({
      where: {
        id: In(tagsIds),
      },
    });
    return tags;
  }

  /**
   * Delete tag by id
   * @param id Id of the tag to be deleted
   */
  public async delete(id: number) {
    await this.tagsRepository.delete(id);
    return {
      deleted: true,
      id,
    };
  }

  /**
   * Soft delete tag by id
   * @param id Id of the tag to be deleted
   */
  public async softDelete(id: number) {
    await this.tagsRepository.softDelete(id);
    return {
      deleted: true,
      id,
    };
  }
}
