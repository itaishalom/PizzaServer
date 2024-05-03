import {Connection, Channel, ConsumeMessage} from "amqplib";

var amqp = require('amqplib/callback_api');


class RabbitMQConnection {
    connection!: Connection;
    channel!: Channel;
    private connected!: Boolean;

    async connect() {
        if (this.connected && this.channel) return;
        else this.connected = true;

        try {
            console.log(`⌛️ Connecting to Rabbit-MQ Server`);
            await amqp.connect('amqp://localhost', (err: any, connection: Connection) => {
                this.connection = connection;
            }); //`amqp://${rmqUser}:${rmqPass}@${rmqhost}:5672`);

            console.log(`✅ Rabbit MQ Connection is ready`);

            this.channel = await this.connection.createChannel();

            console.log(`🛸 Created RabbitMQ Channel successfully`);
        } catch (error) {
            console.error(error);
            console.error(`Not connected to MQ Server`);
        }
    }

    async sendToQueue(queue: string, message: any): Promise<void> {
        try {
            if (!this.channel) {
                await this.connect();
            }

            this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

const rabbitMQ = new RabbitMQConnection();

export {rabbitMQ} ;