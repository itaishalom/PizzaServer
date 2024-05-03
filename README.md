# ✨Pizza Ordering System✨

## ⭐Objective

Design and implement a simplified pizza ordering backend system. A server application that processes orders and manages the state machine for order status (e.g., pending, in preparation, ready for pickup, completed).

## ⭐System Architecture

The Pizza Ordering System follows a microservices architecture to ensure modularity, scalability, and maintainability. It consists of the following microservices:

1. **✅API Microservice**: Responsible for routing requests and token verification.
2. **✅User Microservice**: Manages user creation and authentication.
3. **✅Order Microservice**: Handles pizza order placement and real-time order tracking using Server-Sent Events (SSE). Order processing is handled asynchronously with RabbitMQ, and a worker is responsible for processing order updates.

For a detailed overview of the system architecture, refer to the System Architecture Diagram at the bottom.

## ⭐Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Web application framework for building the API microservice.
- **MongoDB**: NoSQL database for storing user data, order information, and application state.
- **RabbitMQ**: Message broker for asynchronous communication between microservices, particularly for order processing.
- **Server-Sent Events (SSE)**: Standard for pushing updates from server to clients over HTTP connections, used for real-time order tracking.
- **TypeScript**: Superset of JavaScript for writing type-safe and maintainable code.

## ⭐Why RabbitMQ?

1. **Asynchronous Communication**: RabbitMQ enables asynchronous communication between microservices, which is crucial for handling order processing efficiently. As orders are placed, RabbitMQ allows the system to process them asynchronously without blocking the user's request.

2. **Reliable Messaging**: RabbitMQ ensures reliable messaging with message queuing and delivery acknowledgments. This reliability is essential for ensuring that orders are processed correctly and that no orders are lost or duplicated in the system.

3. **Scalability**: RabbitMQ is highly scalable, allowing the system to handle a large number of orders and scale horizontally as demand grows. Additional worker instances can be added to handle order processing, ensuring the system can handle increased load without sacrificing performance.

4. **Flexibility**: RabbitMQ supports various messaging patterns, including publish/subscribe and point-to-point, providing flexibility for implementing different communication patterns as needed.

## ⭐Why SSE (Server-Sent Events)?

1. **Simplicity**: SSE is a simple and lightweight mechanism for enabling server-to-client communication over HTTP. It leverages standard HTTP connections, making it easier to implement and deploy compared to WebSockets.

2. **Real-Time Updates**: SSE allows the server to push updates to clients in real-time without the need for continuous polling. In the Pizza Ordering System, SSE provides real-time order tracking, allowing users to see updates on their order status as soon as they occur.

3. **Compatibility**: SSE is supported by most modern web browsers and is built on standard HTTP protocols, ensuring compatibility across a wide range of devices and platforms without additional libraries or plugins.

4. **Reduced Overhead**: SSE has lower overhead compared to WebSockets, making it efficient for applications that require real-time updates but do not need bidirectional communication between server and client.

## ⭐Clean Architecture

The Pizza Ordering System implements Clean Architecture, which emphasizes separation of concerns and modularity. It separates the application into layers:

- **Domain Layer**: Contains the business logic and entities, such as orders and users.
- **Data Layer**: Contains repositories responsible for interacting with the database.
- **Controllers**: Handles incoming HTTP requests and interacts with the data layer.
- **Repositories**: Abstracts database operations from the domain layer.

## ⭐Getting Started

To get started with the Pizza Ordering System:

1. **Clone the Repository**: Clone the repository to your local machine.
2. **Install Dependencies**: Navigate to each microservice directory (API, User, Order) and run `npm install` to install dependencies.
3. **Set Up Environment Variables**: Configure environment variables for each microservice as specified in their respective README files.
4. **Start the Microservices**: Run `npm start` in each microservice directory to start the microservices.
5. **Access the API**: Access the API at the specified endpoint to interact with the system.


**Important:** You need to run all three microservices for the application to function properly. However, the User and Note services should be run with unexposed ports for security reasons.

1. **Gateway Service:**

   ```bash
   node index.ts
   ```

2. **User Microservice (Unexposed Port):**

   ```bash
   node index.ts
   ```

3. **Pizza order Microservice (Unexposed Port):**

   ```bash
   node index.ts
   ```

## ⭐State Machine defined as follows:
```
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
```
The Kitchen worker uses the Kitchen controller to update the status. The controller uses the state machine to verify that the update is possible (business logic, domain layer).

## ⭐System Architecture and flow:

![Untitled Diagram drawio](https://github.com/itaishalom/PizzaServer/assets/9066121/1bf616c5-7461-4903-a18f-0591de71c3f4)
