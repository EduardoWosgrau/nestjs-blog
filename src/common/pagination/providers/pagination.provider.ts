import { Injectable, Inject } from '@nestjs/common';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  public async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<Paginated<T>> {
    const results = await repository.find({
      skip: (paginationQuery.page - 1) * paginationQuery.limit,
      take: paginationQuery.limit,
    });

    const baseURL = `${this.request.protocol}://${this.request.headers.host}`;
    const newURL = new URL(this.request.url, baseURL);
    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / paginationQuery.limit);
    const nextPage =
      paginationQuery.page === totalPages ? null : paginationQuery.page + 1;
    const previousPage =
      paginationQuery.page === 1 ? null : paginationQuery.page - 1;

    const finalResponse: Paginated<T> = {
      data: results,
      meta: {
        itemsPerPage: paginationQuery.limit,
        totalItems: totalItems,
        totalPages: totalPages,
        currentPage: paginationQuery.page,
      },
      links: {
        first: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=1`,
        last: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${totalPages}`,
        current: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${paginationQuery.page}`,
        next: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${nextPage}`,
        previous: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${previousPage}`,
      },
    };

    return finalResponse;
  }
}
