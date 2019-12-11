import { Controller, Delete, Get, Post, Put, UseGuards, Response, Body, ValidationPipe, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AUTH_TYPE, CATEGORIES_PATH } from '../consts';
import { AuthGuard } from '@nestjs/passport';
import { CreateOrAmendCategoryDto } from './dto/create-or-amend-category.dto';
import { CategoriesService } from './categories.service';
import { QueryDto } from './dto/query.dto';
import { toNumber } from 'lodash';
import { User } from '../common/decorators/user.decorator';
import { User as UserEntity } from '../users/user.entity';
import { CategoryListInterface } from './interfaces/category-list.interface';

@UseGuards(AuthGuard(AUTH_TYPE.JWT))
@Controller(CATEGORIES_PATH.ROOT)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Get()
  query(@Query() queryDto: QueryDto, @User() user: UserEntity): Promise<CategoryListInterface> {
    return this.categoriesService.getList(queryDto, user.userId);
  }

  @Post()
  create(@Body() createOrAmendCategoryDto: CreateOrAmendCategoryDto, @User() user: UserEntity): Promise<{}> {
    return this.categoriesService.createOrAmend(createOrAmendCategoryDto, user.userId);
  }

  @Delete(`:${CATEGORIES_PATH.CODE_PARAM}`)
  remove(@Param(CATEGORIES_PATH.CODE_PARAM, new ParseIntPipe()) categoryCode: string): Promise<{}> {
    return this.categoriesService.delete(toNumber(categoryCode));
  }

  @Put(`:${CATEGORIES_PATH.CODE_PARAM}`)
  amend(
    @Param(CATEGORIES_PATH.CODE_PARAM, new ParseIntPipe()) categoryCode,
    @Body() createOrAmendCategoryDto: CreateOrAmendCategoryDto,
    @User() user: UserEntity): Promise<{}> {
    return this.categoriesService.createOrAmend(createOrAmendCategoryDto, user.userId, categoryCode);
  }
}
