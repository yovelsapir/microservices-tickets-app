import { Message } from 'node-nats-streaming';
import {
   Listener,
   TicketUpdatedEvent,
   Subjects,
} from '@yovelsapir_sgtickets/common';
import { GueueGroupNames } from './queueGroupName';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
   readonly subject = Subjects.TicketUpdated;
   queueGroupName = GueueGroupNames.OrdersService;
   async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
      const ticket = await Ticket.findByEvent(data);

      if (!ticket) {
         throw new Error('Ticket not found');
      }

      const { title, price } = data;
      ticket.set({ title, price });
      await ticket.save();

      msg.ack();
   }
}
