import { Module } from '@nestjs/common';
import { Pagination } from './providers/pagination.provider';

@Module({
  providers: [Pagination],
})
export class PaginationModule {}
