import { Document } from 'mongoose';
import {Order} from "../models/Order";
import {Pizza} from "../models/Pizza";

class OrderMapper {
     mapOrderDocumentToOrder(orderDocument: Document): Order {
        const id = orderDocument.get('_id').toString();
        const userId = orderDocument.get('userId').toString();
        const pizzas = orderDocument.get('pizzas') as Pizza[];
        return new Order(id, userId, pizzas);
    }
}

export default OrderMapper;