import { Listener } from './base-lisener';
import { Message } from 'node-nats-streaming';
import { Subjects } from './subjects';
import { TicketCreatedEvent } from './ticket-created-event';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
   readonly subject = Subjects.TicketCreated;
   queueGroupName: string = 'payments-service';

   onMessage(data: TicketCreatedEvent['data'], msg: Message) {
      console.log('Event data!', data);

      msg.ack();
   }
}
