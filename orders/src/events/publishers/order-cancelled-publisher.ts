import {
   OrderCancelledEvent,
   Publisher,
   Subjects,
} from '@yovelsapir_sgtickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
   readonly subject = Subjects.OrderCancelled;
}
