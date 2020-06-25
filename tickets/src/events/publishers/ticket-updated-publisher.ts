import {
   Publisher,
   Subjects,
   TicketUpdatedEvent,
} from '@yovelsapir_sgtickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
   readonly subject = Subjects.TicketUpdated;
}
