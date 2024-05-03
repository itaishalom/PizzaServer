import {Request, Response, NextFunction} from 'express';
import {OrderRepository} from "../data/repositories/orderRepository";
import {Pizza} from "../models/Pizza";

class OrderMiddleware {
    private orderRepository: OrderRepository;

    constructor(repository: OrderRepository) {
        this.orderRepository = repository;
    }

    async authorizeOrderAccess(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {orderId} = req.params
        const userIdHeaderValue = req.headers['user-id'];
        const userId = Array.isArray(userIdHeaderValue) ? userIdHeaderValue[0] : userIdHeaderValue;
        try {
            if (userId != undefined) {
                const result = await this.orderRepository.findById(orderId, userId)
                if (result != null) {
                    next();
                } else {
                    res.status(500).json({message: 'Unknown problem occurred'});
                }
            }
        } catch (e) {
            res.status(404).json({message: 'Order not found'});
        }
    }

    private isPizza(obj: any): obj is Pizza {
        return obj && typeof obj.id === 'string' && typeof obj.orderId === 'string' && typeof obj.pizzaSize === 'string';
    }

    validatePizzaArray(req: Request, res: Response, next: NextFunction) {
        if (Array.isArray(req.body) && req.body.every((pizza: any) => this.isPizza(pizza))) {
            next();
        } else {
            res.status(400).json({error: 'Invalid pizza array data'});
        }
    }

}

export {OrderMiddleware};
