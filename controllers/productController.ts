import { NextFunction, Request, Response } from 'express';
import { HttpError } from '@utils/HttpError';
import { jsonAll, jsonOne } from '@utils/general';
import cloudinary from '@config/cloudinary';
import Product, { IProductModel } from '@models/Product';
import { ICategory } from '@interfaces/Category';
import { IProduct, Image } from 'interfaces/Product';
import Category from '@/models/Category';

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, price, quantity, colors, category: categoryId, miniDescription, description, isAvailable } = req.body;

        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            throw new HttpError(400, 'Product with the same name already exists');
        }

        const findCategory = await Category.findById(categoryId);
        if (!findCategory) {
            throw new HttpError(404, 'Category not found');
        }

        const images: Image[] = [];
        if (req.files) {
            const filePromises = (req.files as Express.Multer.File[]).map((file: Express.Multer.File) =>
                cloudinary.uploader.upload(file.path, { folder: 'bns' })
            );
            const results = await Promise.all(filePromises);
            images.push(...results.map(result => ({ public_id: result.public_id, url: result.secure_url })));
        }

        const newProduct: IProduct = {
            name,
            price,
            quantity,
            colors: colors as string[],
            images,
            category: findCategory,
            miniDescription,
            description,
            isAvailable,
        };

        const savedProduct = await Product.create(newProduct);
        return jsonOne<IProductModel>(res, 201, savedProduct);
    } catch (error) {
        return next(error);
    }
};

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await Product.find();

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        return jsonAll<IProductModel>(res, 200, products);
    } catch (error) {
        return next(error);
    }
};

const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            throw new HttpError(404, 'Product not found');
        }

        const relatedProducts = await Product.find({
            category: product.category,
            _id: { $ne: productId },
        }).limit(5);

        const response = {
            product,
            relatedProducts,
        };

        return jsonOne<any>(res, 200, response);
    } catch (error) {
        return next(error);
    }
};

const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            throw new HttpError(404, 'Product not found');
        }

        if (product.images && product.images.length > 0) {
            const publicIds = product.images.map((image) => image.public_id);

            for (const publicId of publicIds) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        await product.remove();
        return res.sendStatus(204);
    } catch (error) {
        return next(error);
    }
};

const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = req.params.id;
        const { name, price, quantity, colors, category, miniDescription, description, isAvailable } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            throw new HttpError(404, 'Product not found');
        }

        const newImages: Image[] = req.files ? (req.files as Express.Multer.File[]).map((file) => ({
            public_id: '',
            url: file.path,
        })) : [];

        const updatedImages: Image[] = [...product.images, ...newImages];

        product.name = name;
        product.price = price;
        product.quantity = quantity;
        product.colors = colors;
        product.category = category;
        product.miniDescription = miniDescription;
        product.description = description;
        product.isAvailable = isAvailable;
        product.images = updatedImages;

        const updatedProduct = await product.save();

        const removedImages = product.images.filter((oldImage) => !updatedImages.some((newImage) => newImage.public_id === oldImage.public_id));
        if (removedImages.length > 0) {
            const publicIds = removedImages.map((image) => image.public_id);
            for (const publicId of publicIds) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        return jsonOne<IProductModel>(res, 200, updatedProduct);
    } catch (error) {
        return next(error);
    }
};

const getCategoryProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryId = req.params.categoryId;
        const products = await Product.find({ category: categoryId });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found in this category' });
        }

        return jsonAll<IProductModel>(res, 200, products);
    } catch (error) {
        return next(error);
    }
};

const searchProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const keyword = req.query.keyword as string;

        if (!keyword) {
            throw new HttpError(400, 'Please provide a keyword for the search');
        }

        const searchRegex = new RegExp(keyword, 'i');

        const products = await Product.find({
            $or: [
                { name: { $regex: searchRegex } },
                { description: { $regex: searchRegex } },
                { miniDescription: { $regex: searchRegex } },
            ],
        });

        if (products.length === 0) {
            return jsonOne<any>(res, 404, 'No products found for Keyword');
        }

        return jsonAll<IProductModel>(res, 200, products);
    } catch (error) {
        return next(error);
    }
};

export default {
    createProduct,
    getProduct,
    getProducts,
    deleteProduct,
    updateProduct,
    getCategoryProducts,
    searchProducts,
};
