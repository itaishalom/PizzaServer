import {OrderRepositoryKitchen} from "./data/repositories/orderRepositoryKitchen";
import {OrderStateMachine, OrderStatus} from "./data/entity/orderDb";


class PizzaKitchenEngine {
    private orderRepositoryKitchen: OrderRepositoryKitchen;
    private orderStateMachine: OrderStateMachine

    constructor(orderRepositoryKitchen: OrderRepositoryKitchen, orderStateMachine: OrderStateMachine) {
        this.orderRepositoryKitchen = orderRepositoryKitchen;
        this.orderStateMachine = orderStateMachine;

    }

    private async update(currentStatus: OrderStatus, nextStatus: OrderStatus, orderId: string) {
        if (this.orderStateMachine.isValidTransition(currentStatus, nextStatus)) {
            await this.orderRepositoryKitchen.updateStatus(orderId, nextStatus);
        } else {
            throw new Error('Invalid state transition');
        }
    }

    async updatePrepare(orderId: string): Promise<void> {
        const currentStatus = await this.getOrderStatus(orderId);
        await this.update(currentStatus, OrderStatus.InPreparation, orderId);
    }


    private async getOrderStatus(orderId: string): Promise<OrderStatus> {
        return await this.orderRepositoryKitchen.getOrderStatus(orderId);
    }

    async updateReadyForPickup(orderId: string) {
        const currentStatus = await this.getOrderStatus(orderId);
        await this.update(currentStatus, OrderStatus.ReadyForPickup, orderId);
    }

    async updateComplete(orderId: string) {
        const currentStatus = await this.getOrderStatus(orderId);
        await this.update(currentStatus, OrderStatus.Completed, orderId);
    }
}

export {
    PizzaKitchenEngine
}