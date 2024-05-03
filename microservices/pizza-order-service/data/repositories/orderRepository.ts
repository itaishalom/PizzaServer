import db from './local_datasource/db';
import orderDB, {OrderStateMachine, OrderStatus} from '../entity/orderDb';
import {Order,} from "../../models/Order";
import OrderMapper from "../OrderMapper";

class OrderRepository {
    private orderMapper: OrderMapper

    constructor(orderMapper: OrderMapper) {
        this.orderMapper = orderMapper;
        this.init();
    }

    private async init(): Promise<void> {
        try {
            await db();
            console.log("db ready");
        } catch (error) {
            console.error("Error initializing db:", error);
        }
    }

    async create(order: Order): Promise<Order> {
        return this.orderMapper.mapOrderDocumentToOrder(await orderDB.create(order));
    }

     async findById(orderId: string, userId: string): Promise< Order | null> {
        return orderDB.findOne({_id: orderId, userId: userId});
    }

}

export {OrderRepository};