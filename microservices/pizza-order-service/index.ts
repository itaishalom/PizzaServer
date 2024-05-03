
import {AppLogger} from "./utils/appLogger";

import config from "./config";

import {router} from "./routes/orderRoutes";



// @ts-ignore
import bodyParser from "body-parser";

// @ts-ignore
import express from "express";
import OrderMapper from "./data/OrderMapper";
import {rabbitMQ} from "./utils/rabbitmq";
import {PizzaController} from "./controllers/pizzaController";
import {OrderStatus} from "./data/entity/orderDb";
import {OrderMiddleware} from "./middleware/orderMiddleware";

const app = express();
const appLogger: AppLogger = new AppLogger();


app.use(bodyParser.json());

app.use("/orders", router);

// Start server
app.listen(config.PORT, () => {
    appLogger.log(`Server is running on port ${config.PORT}`);
});
