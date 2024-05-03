import express from "express";
import {rabbitMQ} from "../utils/rabbitmq";
import {OrderStatus} from "../data/entity/orderDb";
import {OrderRepository} from "../data/repositories/orderRepository";
import OrderMapper from "../data/OrderMapper";
import {PizzaController} from "../controllers/pizzaController";
import {OrderMiddleware} from "../middleware/orderMiddleware";
import {AppLogger} from "../utils/appLogger";

const appLogger: AppLogger = new AppLogger();
const orderRepository: OrderRepository = new OrderRepository(new OrderMapper())
const pizzaController: PizzaController = new PizzaController(orderRepository, appLogger);
const orderMiddleware = new OrderMiddleware(orderRepository)
const sseClients: { [orderId: string]: express.Response[] } = {};
const router = express.Router();

router.post('/', orderMiddleware.validatePizzaArray, async (req: express.Request, res: express.Response) => {
    try {
        const order = await pizzaController.addOrder(req, res);
        await rabbitMQ.sendToQueue('orders', Buffer.from(order.id))
        res.status(201).json(order);
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({error: 'Failed to place order'});
    }
});


router.get('/:orderId/updates', orderMiddleware.authorizeOrderAccess, (req: express.Request, res: express.Response) => { // Middleware
    const {orderId} = req.params;

    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();


    if (!sseClients[orderId]) {
        sseClients[orderId] = [];
    }
    sseClients[orderId].push(res);

    appLogger.log(`SSE client connected for orderId: ${orderId}`);
});

const handleRabbitMQMessages = async () => {

    await rabbitMQ.channel.assertQueue('orders', {durable: false});

    await rabbitMQ.channel.consume('orders', async (msg) => {
        if (msg != null) {

            const {orderId, status} = JSON.parse(msg.content.toString());

            const clients = sseClients[orderId];
            if (clients) {
                for (let i = 0; i < clients.length; i++) {
                    const client = clients[i];
                    client.write(`data: ${JSON.stringify({orderId, status})}\n\n`);

                    if (status === OrderStatus.Completed) {
                        clients.splice(i, 1);
                        appLogger.log(`SSE client removed for orderId: ${orderId}`);
                        i--;
                    }
                }
            }
        }
    }, {noAck: true});
};

handleRabbitMQMessages().catch(appLogger.error);
rabbitMQ.connect().catch(console.error);

export {
    router
}
