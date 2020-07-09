import {
   Publisher,
   PaymentCreatedEvent,
   Subjects,
} from '@yovelsapir_sgtickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
   readonly subject = Subjects.PaymentCreated;
}
