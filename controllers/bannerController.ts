import { NextFunction, Request, Response } from 'express';
import { HttpError } from '@utils/HttpError';
import { jsonOne, jsonAll } from '@utils/general';
import cloudinary from '@config/cloudinary';
import Banner, { IBannerModel } from '@models/Banner';

const createBanner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, image, description, isActive } = req.body;

        const result = await cloudinary.uploader.upload(image, {
            folder: 'banners',
        });

        const newBanner = new Banner({
            name,
            image: {
                public_id: result.public_id,
                url: result.secure_url,
            },
            description,
            isActive,
        });

        const savedBanner = await newBanner.save();
        return jsonOne<IBannerModel>(res, 201, savedBanner);
    } catch (error) {
        return next(error);
    }
};

const getBanner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bannerId = req.params.id;

        const banner = await Banner.findById(bannerId);
        if (!banner) {
            throw new HttpError(404, 'Banner not found');
        }

        return jsonOne<IBannerModel>(res, 200, banner);
    } catch (error) {
        return next(error);
    }
};

const getBanners = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const banners = await Banner.find();

        if (banners.length === 0) {
            return jsonOne<any>(res, 404, 'No banners found');
        }

        return jsonAll<IBannerModel>(res, 200, banners);
    } catch (error) {
        return next(error);
    }
};

const changeBannerStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bannerId = req.params.id;

        const banner = await Banner.findById(bannerId);
        if (!banner) {
            throw new HttpError(404, 'Banner not found');
        }

        banner.isActive = !banner.isActive;
        const updatedBanner = await banner.save();

        return jsonOne<IBannerModel>(res, 200, updatedBanner);
    } catch (error) {
        return next(error);
    }
};

const updateBanner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bannerId = req.params.id;
        const { name, image, description, isActive } = req.body;

        const banner = await Banner.findById(bannerId);
        if (!banner) {
            throw new HttpError(404, 'Banner not found');
        }

        if (image) {

            const result = await cloudinary.uploader.upload(image, {
                folder: 'banners',
            });


            await cloudinary.uploader.destroy(banner.image.public_id);

            banner.image.public_id = result.public_id;
            banner.image.url = result.secure_url;
        }

        banner.name = name;
        banner.description = description;
        banner.isActive = isActive;

        const updatedBanner = await banner.save();
        return jsonOne<IBannerModel>(res, 200, updatedBanner);
    } catch (error) {
        return next(error);
    }
};

const deleteBanner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bannerId = req.params.id;

        const banner = await Banner.findById(bannerId);
        if (!banner) {
            throw new HttpError(404, 'Banner not found');
        }


        await cloudinary.uploader.destroy(banner.image.public_id);

        await banner.remove();
        return res.sendStatus(204);
    } catch (error) {
        return next(error);
    }
};

export default {
    createBanner,
    getBanner,
    getBanners,
    changeBannerStatus,
    updateBanner,
    deleteBanner
};
