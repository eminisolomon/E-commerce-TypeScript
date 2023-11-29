import { NextFunction, Request, Response } from 'express';
import { HttpError } from '@utils/HttpError';
import { jsonOne, jsonAll } from '@utils/general';
import Order, { IOrderModel } from '@models/Order';
import { EmailService } from '@services/Email';
import User from '@/models/User';

const mail = new EmailService();
const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req['tokenPayload'];
        const userId = payload['id'];

        const user = await User.findById(userId);

        if (!user) {
            throw new HttpError(400, "User Not Found");
        }

        const { tax, shippingFee, deliveryFee, subtotal, total, isDelivered, isPaid, orderItems, status } = req.body;

        const newOrder = new Order({
            tax,
            shippingFee,
            deliveryFee,
            subtotal,
            total,
            isDelivered,
            isPaid,
            orderItems,
            status,
            user: userId,
        });

        const savedOrder = await newOrder.save();

        return jsonOne<IOrderModel>(res, 201, savedOrder);
    } catch (error) {
        return next(error);
    }
};

const getOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = req.params.id;

        const order = await Order.findById(orderId).populate('user', 'name email');
        if (!order) {
            throw new HttpError(404, 'Order not found');
        }

        return jsonOne<IOrderModel>(res, 200, order);
    } catch (error) {
        return next(error);
    }
};

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req['tokenPayload'];
        const userId = payload['id'];

        const user = await User.findById(userId);

        if (!user) {
            throw new HttpError(400, "User Not Found");
        }

        const userOrders = await Order.find({ user: userId });

        if (userOrders.length === 0) {
            return res.status(200).json({ message: 'No orders found for this user' });
        }

        return jsonAll<IOrderModel>(res, 200, userOrders);
    } catch (error) {
        return next(error);
    }
};

const adminGetOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await Order.find().populate('user', 'name email');
        const totalOrders = await Order.countDocuments();
        const completedOrders = await Order.countDocuments({ status: 'completed' });
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const deliveredOrders = await Order.countDocuments({ isDelivered: true });

        const orderSummary = {
            totalOrders,
            completedOrders,
            pendingOrders,
            deliveredOrders,
        };

        if (orders.length === 0) {
            return jsonOne<any>(res, 404, { message: 'No Orders Found', orderSummary });
        }

        return jsonAll<IOrderModel>(res, 200, orders, orderSummary);
    } catch (error) {
        return next(error);
    }
};

const changeOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            throw new HttpError(404, 'Order not found');
        }

        order.status = status;
        const updatedOrder = await order.save();

        return jsonOne<IOrderModel>(res, 200, updatedOrder);
    } catch (error) {
        return next(error);
    }
};

export default {
    createOrder,
    getOrder,
    getOrders,
    adminGetOrders,
    changeOrderStatus,
};
