import mongoose, {Schema, Document} from 'mongoose';
import {Pizza, PizzaSize} from "../../models/Pizza";


export enum OrderStatus {
    Pending = 'pending',
    InPreparation = 'in_preparation',
    ReadyForPickup = 'ready_for_pickup',
    Completed = 'completed',
}


interface Transition {
  from: OrderStatus;
  to: OrderStatus;
}

export class OrderStateMachine {
  private transitions: Transition[] = [
    { from: OrderStatus.Pending, to: OrderStatus.InPreparation },
    { from: OrderStatus.InPreparation, to: OrderStatus.ReadyForPickup },
    { from: OrderStatus.ReadyForPickup, to: OrderStatus.Completed },
  ];

  isValidTransition(from: OrderStatus, to: OrderStatus): boolean {
    return this.transitions.some(transition => transition.from === from && transition.to === to);
  }
}


interface Order extends Document {
    orderId: string;
    status: OrderStatus;
    userId: mongoose.Schema.Types.ObjectId;
     pizzas: Pizza[];
}

const orderSchema: Schema = new Schema({
    orderId: {type: String, required: true},
    status: {type: String, enum: OrderStatus, default: OrderStatus.Pending},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
       pizzas: [{
        id: { type: String, required: true },
        orderId: { type: String, required: true },
        pizzaSize: { type: String, enum: Object.values(PizzaSize), required: true },
    }],
});

export default mongoose.model<Order>('Order', orderSchema);
