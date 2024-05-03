import {Request, Response} from 'express';
import {OrderRepository} from '../data/repositories/orderRepository';
import {AppLogger} from "../utils/appLogger";
import {Order} from "../models/Order";
import {Pizza} from "../models/Pizza";


class PizzaController {
    private pizzaRepository: OrderRepository;
    private appLogger: AppLogger;

    constructor(pizzaRepository: OrderRepository, appLogger: AppLogger) {
        this.pizzaRepository = pizzaRepository;
        this.appLogger = appLogger;

    }

    addOrder = async (req: Request, res: Response): Promise<Order> => {
        try {
            const pizzas: Pizza[] = req.body;
            const userIdHeaderValue = req.headers['user-id'];
            const userId = Array.isArray(userIdHeaderValue) ? userIdHeaderValue[0] : userIdHeaderValue;
            if (userId != undefined) {
                const savedOrder = await this.pizzaRepository.create(new Order('', userId, pizzas));
                this.appLogger.log("Order created");
                res.status(201).json(savedOrder);
                return savedOrder;
            }
            throw new Error("no user id")
        } catch (error) {
            this.appLogger.error(error);
            res.status(500).json({message: 'Failed to add order'});
            throw error;
        }
    };
}

export {
    PizzaController
}