import db from './local_datasource/db';
import orderDB, {OrderStatus} from '../entity/orderDb';


class OrderRepositoryKitchen {


    constructor() {
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

      async updateStatus(orderId: string, orderStatus: OrderStatus): Promise<void> {
        await orderDB.updateOne({orderId}, {status: orderStatus});
    }

    async getOrderStatus(orderId: string): Promise<OrderStatus> {
        const order = await orderDB.findOne({orderId});
        if (order == null) {
            throw Error("Not found")
        }
        return order.status;
    }


}

export {OrderRepositoryKitchen};