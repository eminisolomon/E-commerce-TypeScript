import { NextFunction, Request, Response } from 'express';
import { HttpError } from '@utils/HttpError';
import { jsonOne, jsonAll } from '@utils/general';
import cloudinary from '@config/cloudinary';
import Category, { ICategoryModel } from '@models/Category';
import Product, { IProductModel } from '@/models/Product';

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, image } = req.body;

        const isExist = await Category.exists({ name });
        if (isExist) {
            throw new HttpError(404, "Category Already exists");
        }

        if (image) {
            const result = await cloudinary.uploader.upload(image, {
                folder: 'bns',
            });

            const imageDetails = {
                public_id: result.public_id,
                url: result.secure_url,
            };

            const newCategory = new Category({
                name,
                description,
                image: imageDetails,
            });

            const savedCategory = await newCategory.save();

            return jsonOne<ICategoryModel>(res, 201, savedCategory);
        }
    } catch (error) {
        return next(error);
    }
};

const getCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryId = req.params.categoryId;

        const category = await Category.findById(categoryId);
        if (!category) {
            throw new HttpError(404, 'Category not found');
        }

        const products = await Product.find({ category: categoryId }).populate('category');
        if (!products || products.length === 0) {
            return res.status(200).json({ message: 'No products found for this category' });
        }

        return jsonAll<IProductModel>(res, 200, products);
    } catch (error) {
        return next(error);
    }
};

const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await Category.find();

        if (categories.length === 0) {
            return jsonOne<any>(res, 404, 'There are no categories');
        }

        return jsonAll<ICategoryModel>(res, 200, categories);
    } catch (error) {
        return next(error);
    }
};

const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryId = req.params.id;
        const { name, description, image } = req.body;

        const category = await Category.findById(categoryId);
        if (!category) {
            throw new HttpError(404, 'Category not found');
        }

        category.name = name;
        category.description = description;

        if (image) {
            const result = await cloudinary.uploader.upload(image, {
                folder: 'bns',
            });

            category.image = {
                public_id: result.public_id,
                url: result.secure_url,
            };
        }

        const updatedCategory = await category.save();
        return jsonOne<ICategoryModel>(res, 200, updatedCategory);
    } catch (error) {
        return next(error);
    }
};

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryId = req.params.id;

        const category = await Category.findById(categoryId);
        if (!category) {
            throw new HttpError(404, 'Category not found');
        }

        await category.remove();
        return res.sendStatus(204);
    } catch (error) {
        return next(error);
    }
};

export default {
    createCategory,
    getCategory,
    getCategories,
    updateCategory,
    deleteCategory,
};
