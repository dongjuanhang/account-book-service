import { Injectable } from '@nestjs/common';
import { CreateOrAmendCategoryDto } from './dto/create-or-amend-category.dto';
import { Repository, FindManyOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Transaction } from '../transactions/transaction.entity';
import { QueryDto } from './dto/query.dto';
import { isEmpty, map } from 'lodash';
import { User } from '../users/user.entity';
import { ParamsError } from '../common/exceptions/params-error.exception';
import { ERROR_CODES } from '../consts';
import { CATEGORIES_TYPE } from './dto/query.dto';
import { CategoryListInterface } from './interfaces/category-list.interface';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoriesRepository: Repository<Category>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async getList(data: QueryDto, userId: string): Promise<CategoryListInterface> {
        const params: FindManyOptions = await this.getFindListParams(data, userId);
        const [categories, count] = await this.categoriesRepository.findAndCount(params);
        return {
            list: map(categories, category => {
                const { categoryCode, categoryName, isExpense } = category;
                return {
                    categoryCode,
                    categoryName,
                    isExpense,
                };
            }),
            total: count,
        };
    }

    private async getFindListParams(data: QueryDto, userId: string): Promise<FindManyOptions> {
        const user = await this.findUser(userId);
        const params: FindManyOptions = {
            order: {
                updateTime: 'DESC',
            },
            where: {
                user,
            },
        };
        if (!isEmpty(data)) {
            const keyMap = {
                name: 'categoryName',
                code: 'categoryCode',
                type: 'isExpense',
            };
            for (const key in data) {
                if (data.hasOwnProperty(key) && !!data[key]) {
                    params.where[keyMap[key]] = key === 'type' ? data[key] === CATEGORIES_TYPE.EXPENSE : data[key];
                }
            }
        }
        return params;
    }

    async createOrAmend(data: CreateOrAmendCategoryDto, userId: string, categoryCode?: number): Promise<{}> {
        const user = await this.findUser(userId);
        const category = !!categoryCode ? await this.categoriesRepository.findOneOrFail(categoryCode, { where: { user } }) : new Category();
        const { categoryName, isExpense } = data;
        // 当前创建/修改分类是否已经存在
        const findCategory = await this.categoriesRepository.findOne({ where: { categoryName, isExpense, user } });
        if (!!findCategory) {
            throw new ParamsError({
                errorCode: ERROR_CODES.CATEGORIES_TYPE_HAVE_SURVICE,
                message: '当前分类已存在',
            });
        }
        category.categoryName = categoryName;
        category.isExpense = isExpense;
        category.user = user;
        if (!!categoryCode) {
            category.categoryCode = categoryCode;
        }
        await this.categoriesRepository.save(category);
        return {};
    }

    async delete(categoryCode: number): Promise<{}> {
        const { transactions = [] } = await this.categoriesRepository.findOneOrFail(categoryCode, { relations: ['transactions'] });
        if (!isEmpty(transactions)) {
            throw new ParamsError({
                errorCode: ERROR_CODES.CATEGORIES_TYPE_DELETE_FORBIDDEN,
                message: '当前分类已有账目关联使用，不能删除',
            });
        }
        await this.categoriesRepository.delete(categoryCode);
        return {};
    }

    private async findUser(userId: string): Promise<User> {
        return this.userRepository.findOneOrFail({
            where: { userId },
        });
    }
}
