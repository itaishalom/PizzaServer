import {rabbitMQ} from './utils/rabbitmq';
import {Channel, Message} from 'amqplib';
import {OrderStateMachine, OrderStatus} from "./data/entity/orderDb";
import {OrderRepositoryKitchen} from "./data/repositories/orderRepositoryKitchen";
import {PizzaKitchenEngine} from "./pizzaKitchenEngine";


const publishUpdate = async (orderId: string, status: string, channel: Channel) => {
    const update = JSON.stringify({orderId, status});
    channel.publish('updates_exchange', '', Buffer.from(update));
};

const handlePizzaPreparation = async (orderId: string, channel: Channel, msg: Message, pizzaKitchenController: PizzaKitchenEngine) => {
    try {
        console.log(`Preparing pizza for order ${orderId}`);
        await pizzaKitchenController.updatePrepare(orderId);
        await publishUpdate(orderId, OrderStatus.InPreparation, channel);

        await new Promise<void>(resolve => setTimeout(resolve, 5000)); // 5 seconds
        await pizzaKitchenController.updateReadyForPickup(orderId);
        await publishUpdate(orderId, OrderStatus.ReadyForPickup, channel);
        // TODO verify that pizzas are ready
        console.log(`Pizza prepared for order ${orderId}`);
        await new Promise<void>(resolve => setTimeout(resolve, 2000)); // 5 seconds
        await pizzaKitchenController.updateComplete(orderId);
        await publishUpdate(orderId, OrderStatus.Completed, channel);
    } catch (error) {
        console.error('Error handling pizza preparation:', error);
        // If an error occurs, reject the message
        channel.nack(msg);
    }
};

const startWorker = async (pizzaKitchenController: PizzaKitchenEngine) => {
    try {
        await rabbitMQ.channel.assertQueue('orders', {durable: false});
        await rabbitMQ.channel.consume('orders', async (msg: Message | null) => {
            if (!msg) {
                console.error(`Order arrived empty!`);
                return;
            }
            const orderId = msg.content.toString();
            console.log(`Received new order: ${orderId}`);
            await handlePizzaPreparation(orderId, rabbitMQ.channel, msg, pizzaKitchenController);
            rabbitMQ.channel.ack(msg);
        });
    } catch (error) {
        console.error('Error starting worker:', error);
    }
};

startWorker(new PizzaKitchenEngine(new OrderRepositoryKitchen(), new OrderStateMachine(),));
