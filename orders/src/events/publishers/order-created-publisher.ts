import {
   OrderCreatedEvent,
   Publisher,
   Subjects,
} from '@yovelsapir_sgtickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
   readonly subject = Subjects.OrderCreated;
}
