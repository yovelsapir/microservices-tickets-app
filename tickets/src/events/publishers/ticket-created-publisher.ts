import {
   Publisher,
   Subjects,
   TicketCreatedEvent,
} from '@yovelsapir_sgtickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
   readonly subject = Subjects.TicketCreated;
}
