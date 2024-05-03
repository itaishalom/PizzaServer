import {OrderStatus} from "../data/entity/orderDb";

class Pizza {
    orderId: string;
    id: string;
    pizzaSize: PizzaSize;

    constructor(id: string, orderId: string, pizzaSize: PizzaSize) {
        this.id = id;
        this.orderId = orderId;
        this.pizzaSize = pizzaSize;
    }
}

export enum PizzaSize {
    Small = 'small',
    Big = 'big',
}


export { Pizza };