import {Pizza} from "./Pizza";

class Order {
    id: string;
    userId: string;
    pizzas: Pizza[];
    // TODO add timestamp

    constructor(id: string, userId: string, pizzas: Pizza[]) {
        this.id = id;
        this.userId = userId;
        this.pizzas = pizzas;
    }
}

export {Order};