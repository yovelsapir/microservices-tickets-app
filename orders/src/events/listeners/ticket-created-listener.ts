import { Message } from 'node-nats-streaming';
import {
   Listener,
   TicketCreatedEvent,
   Subjects,
} from '@yovelsapir_sgtickets/common';
import { queueGroupName } from './queueGroupName';
import { Ticket } from '../../models/ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
   readonly subject = Subjects.TicketCreated;
   queueGroupName = queueGroupName;
   async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
      const { title, price, id } = data;

      const ticket = Ticket.build({ id, title, price });
      await ticket.save();

      msg.ack();
   }
}
